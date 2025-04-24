document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // User is logged in, show app content
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('app-content').style.display = 'block';
        initializeApp();
    } else {
        // User is not logged in, show auth modal
        document.getElementById('authModal').style.display = 'flex';
        document.getElementById('app-content').style.display = 'none';
    }

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tab = this.dataset.tab;
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            document.getElementById(`${tab}-form`).classList.add('active');
        });
    });

    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        loginUser(email, password);
    });

    // Register form submission
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        registerUser(name, email, password);
    });

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.reload();
    });
});

function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save current user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Hide auth modal and show app content
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('app-content').style.display = 'block';
        
        // Initialize the app
        initializeApp();
    } else {
        alert('Invalid email or password!');
    }
}

function registerUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    const userExists = users.some(u => u.email === email);
    if (userExists) {
        alert('User with this email already exists!');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        tasks: []
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Automatically login the new user
    loginUser(email, password);
}

function initializeApp() {
    // Initialize date picker
    flatpickr("#dueDate", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today"
    });

    // Load tasks for current user
    loadTasks();

    // Form submission
    document.getElementById('addingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTask();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterTasks(this.dataset.filter);
        });
    });

    // Background selection
    document.querySelectorAll('.bg-option').forEach(option => {
        option.addEventListener('click', function() {
            const bgValue = this.dataset.bg;
            if (bgValue === 'none') {
                document.body.style.backgroundImage = '';
            } else {
                document.body.style.backgroundImage = bgValue;
            }
            
            // Save to localStorage
            localStorage.setItem('background', bgValue);
            
            // Update active state
            document.querySelectorAll('.bg-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Load saved background
    const savedBg = localStorage.getItem('background');
    if (savedBg) {
        document.body.style.backgroundImage = savedBg;
        document.querySelector(`.bg-option[data-bg="${savedBg}"]`).classList.add('active');
    }
}

function getCurrentUserTasks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return [];
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === currentUser.id);
    
    return user ? user.tasks : [];
}

function updateCurrentUserTasks(tasks) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].tasks = tasks;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    }
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const descriptionInput = document.getElementById('taskDescription');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priority');

    if (taskInput.value.trim() === '') return;

    const task = {
        id: Date.now(),
        text: taskInput.value.trim(),
        description: descriptionInput.value.trim(),
        dueDate: dueDateInput.value,
        priority: priorityInput.value,
        completed: false,
        subtasks: [],
        createdAt: new Date().toISOString()
    };

    // Get existing tasks
    let tasks = getCurrentUserTasks();

    // Add new task
    tasks.push(task);

    // Save to users
    updateCurrentUserTasks(tasks);

    // Clear form
    taskInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
    priorityInput.value = 'medium';

    // Reload tasks
    loadTasks();
}

function loadTasks() {
    const tasks = getCurrentUserTasks();
    const taskList = document.getElementById('taskList');

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <h4>No tasks yet</h4>
                <p>Add your first task to get started</p>
            </div>
        `;
        return;
    }

    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });

    // Initialize filter
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    filterTasks(activeFilter);
}

function createTaskElement(task) {
    const now = new Date();
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const isOverdue = dueDate && dueDate < now && !task.completed;
    
    const taskElement = document.createElement('li');
    taskElement.className = `list-group-item priority-${task.priority}`;
    taskElement.dataset.id = task.id;
    taskElement.dataset.priority = task.priority;
    taskElement.dataset.completed = task.completed;

    let dueDateHtml = '';
    if (dueDate) {
        dueDateHtml = `
            <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                <i class="far fa-calendar-alt"></i>
                ${formatDate(dueDate)}
                ${isOverdue ? ' (Overdue)' : ''}
            </span>
        `;
    }

    let descriptionHtml = '';
    if (task.description) {
        descriptionHtml = `<p class="text-muted small mb-2">${task.description}</p>`;
    }

    let subtasksHtml = '';
    if (task.subtasks && task.subtasks.length > 0) {
        const completedSubtasks = task.subtasks.filter(st => st.completed).length;
        subtasksHtml = `
            <div class="subtask-progress mb-2">
                <small class="text-muted">Subtasks: ${completedSubtasks}/${task.subtasks.length}</small>
                <div class="progress" style="height: 5px;">
                    <div class="progress-bar" style="width: ${(completedSubtasks / task.subtasks.length) * 100}%"></div>
                </div>
            </div>
        `;
    }

    taskElement.innerHTML = `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-text">
                    <div class="d-flex align-items-center">
                        <span class="task-title">${task.text}</span>
                        ${dueDateHtml}
                    </div>
                    ${descriptionHtml}
                    ${subtasksHtml}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-sm btn-outline-secondary add-subtask-btn">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="btn btn-sm btn-warning edit-task-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-task-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="edit-form" id="edit-form-${task.id}">
            <form class="edit-task-form">
                <div class="mb-2">
                    <input type="text" class="form-control edit-task-input" value="${task.text}" placeholder="Task title" required>
                </div>
                <div class="mb-2">
                    <textarea class="form-control edit-description-input" placeholder="Description">${task.description || ''}</textarea>
                </div>
                <div class="row mb-2">
                    <div class="col-md-6">
                        <label>Due Date</label>
                        <input type="datetime-local" class="form-control edit-due-date" value="${task.dueDate || ''}">
                    </div>
                    <div class="col-md-6">
                        <label>Priority</label>
                        <select class="form-control edit-priority">
                            <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary cancel-edit-btn">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-sm btn-primary save-edit-btn">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
        <div class="task-details collapse" id="details-${task.id}">
            <div class="detail-item">
                <i class="fas fa-flag detail-icon"></i>
                <span class="text-capitalize">${task.priority} priority</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-calendar-plus detail-icon"></i>
                <span>Created: ${formatDate(new Date(task.createdAt))}</span>
            </div>
        </div>
        <div class="subtask-container mt-2 collapse" id="subtasks-${task.id}">
            <ul class="subtask-list">
                ${task.subtasks.map((subtask, index) => `
                    <li class="subtask-item" data-index="${index}">
                        <input type="checkbox" class="subtask-checkbox" ${subtask.completed ? 'checked' : ''}>
                        <span class="subtask-text ${subtask.completed ? 'subtask-completed' : ''}">${subtask.text}</span>
                        <button class="btn btn-sm btn-outline-danger delete-subtask-btn ml-2">
                            <i class="fas fa-times"></i>
                        </button>
                    </li>
                `).join('')}
            </ul>
            <form class="add-subtask-form mt-2">
                <input type="text" class="form-control form-control-sm subtask-input" placeholder="Add subtask">
                <button type="submit" class="btn btn-sm btn-primary">Add</button>
            </form>
        </div>
    `;

    // Add event listeners
    const checkbox = taskElement.querySelector('.task-checkbox');
    checkbox.addEventListener('change', function() {
        toggleTaskComplete(task.id, this.checked);
    });

    const deleteBtn = taskElement.querySelector('.delete-task-btn');
    deleteBtn.addEventListener('click', function() {
        deleteTask(task.id);
    });

    const editBtn = taskElement.querySelector('.edit-task-btn');
    editBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const editForm = taskElement.querySelector(`#edit-form-${task.id}`);
        editForm.classList.toggle('active');
        
        // Close other open forms
        document.querySelectorAll('.edit-form').forEach(form => {
            if (form.id !== `edit-form-${task.id}`) {
                form.classList.remove('active');
            }
        });
    });

    const cancelEditBtn = taskElement.querySelector('.cancel-edit-btn');
    cancelEditBtn.addEventListener('click', function() {
        taskElement.querySelector(`#edit-form-${task.id}`).classList.remove('active');
    });

    const editForm = taskElement.querySelector('.edit-task-form');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateTask(
            task.id,
            taskElement.querySelector('.edit-task-input').value,
            taskElement.querySelector('.edit-description-input').value,
            taskElement.querySelector('.edit-due-date').value,
            taskElement.querySelector('.edit-priority').value
        );
        taskElement.querySelector(`#edit-form-${task.id}`).classList.remove('active');
    });

    const addSubtaskBtn = taskElement.querySelector('.add-subtask-btn');
    addSubtaskBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const subtaskContainer = taskElement.querySelector(`#subtasks-${task.id}`);
        const details = taskElement.querySelector(`#details-${task.id}`);
        
        // Toggle visibility
        if (subtaskContainer.classList.contains('show')) {
            subtaskContainer.classList.remove('show');
            details.classList.add('show');
        } else {
            subtaskContainer.classList.add('show');
            details.classList.remove('show');
        }
    });

    // Toggle details on click
    taskElement.querySelector('.task-text').addEventListener('click', function() {
        const details = taskElement.querySelector(`#details-${task.id}`);
        const subtaskContainer = taskElement.querySelector(`#subtasks-${task.id}`);
        
        // Toggle visibility
        if (details.classList.contains('show')) {
            details.classList.remove('show');
        } else {
            details.classList.add('show');
            subtaskContainer.classList.remove('show');
        }
    });

    // Subtask form
    const subtaskForm = taskElement.querySelector('.add-subtask-form');
    if (subtaskForm) {
        subtaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('.subtask-input');
            if (input.value.trim() === '') return;
            
            addSubtask(task.id, input.value.trim());
            input.value = '';
        });
    }

    // Subtask checkboxes
    taskElement.querySelectorAll('.subtask-checkbox').forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            toggleSubtaskComplete(task.id, index, this.checked);
        });
    });

    // Delete subtask buttons
    taskElement.querySelectorAll('.delete-subtask-btn').forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            deleteSubtask(task.id, index);
        });
    });

    return taskElement;
}

function toggleTaskComplete(id, completed) {
    let tasks = getCurrentUserTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
        updateCurrentUserTasks(tasks);
        loadTasks();
    }
}

function deleteTask(id) {
    let tasks = getCurrentUserTasks();
    tasks = tasks.filter(task => task.id !== id);
    updateCurrentUserTasks(tasks);
    loadTasks();
}

function updateTask(id, newText, newDescription, newDueDate, newPriority) {
    let tasks = getCurrentUserTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        tasks[taskIndex].description = newDescription;
        tasks[taskIndex].dueDate = newDueDate;
        tasks[taskIndex].priority = newPriority;
        updateCurrentUserTasks(tasks);
        loadTasks();
    }
}

function addSubtask(taskId, text) {
    let tasks = getCurrentUserTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        if (!tasks[taskIndex].subtasks) {
            tasks[taskIndex].subtasks = [];
        }
        
        tasks[taskIndex].subtasks.push({
            text: text,
            completed: false
        });
        
        updateCurrentUserTasks(tasks);
        loadTasks();
    }
}

function toggleSubtaskComplete(taskId, subtaskIndex, completed) {
    let tasks = getCurrentUserTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1 && tasks[taskIndex].subtasks && tasks[taskIndex].subtasks[subtaskIndex]) {
        tasks[taskIndex].subtasks[subtaskIndex].completed = completed;
        updateCurrentUserTasks(tasks);
        loadTasks();
    }
}

function deleteSubtask(taskId, subtaskIndex) {
    let tasks = getCurrentUserTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1 && tasks[taskIndex].subtasks && tasks[taskIndex].subtasks[subtaskIndex]) {
        tasks[taskIndex].subtasks.splice(subtaskIndex, 1);
        updateCurrentUserTasks(tasks);
        loadTasks();
    }
}

function filterTasks(filter) {
    const taskElements = document.querySelectorAll('#taskList li');
    
    taskElements.forEach(element => {
        const isCompleted = element.dataset.completed === 'true';
        const priority = element.dataset.priority;
        
        let shouldShow = true;
        
        switch(filter) {
            case 'active':
                shouldShow = !isCompleted;
                break;
            case 'completed':
                shouldShow = isCompleted;
                break;
            case 'high':
                shouldShow = priority === 'high';
                break;
            // 'all' shows everything
        }
        
        element.style.display = shouldShow ? '' : 'none';
    });
}

function formatDate(date) {
    if (!date) return '';
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}