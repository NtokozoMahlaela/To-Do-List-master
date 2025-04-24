# ✅ To-Do List App

A simple and responsive To-Do List application that helps users efficiently manage their daily tasks. This app allows users to add, edit, delete, and organize tasks, with support for both local storage and Firebase integration for persistence.

---

## 🚀 Features

✔️ **Add, Edit, Delete Tasks** – Manage your daily tasks with ease.  
✔️ **Mark Tasks as Completed** – Keep track of completed work.  
✔️ **Task Categories** – Categorize tasks as Personal or Business.  
✔️ **Firebase Integration** – Store tasks in Firebase Realtime Database for persistence.  
✔️ **Local Storage Support** – Automatically saves tasks in the browser for offline use.  
✔️ **Reminders & Calendar** – Set due dates for tasks (future feature).  
✔️ **Responsive Design** – Works seamlessly on all devices.  

---

## 🛠️ Technologies Used

### Frontend:
- **HTML** – Structure of the application.  
- **CSS** – Styling for a responsive and user-friendly interface.  
- **JavaScript** – Core functionality for task management and Firebase integration.

### Backend (Optional):
- **Node.js** – Backend runtime for server-side logic (if needed).  
- **Express.js** – Lightweight framework for backend API (optional).  

### Database:
- **Firebase Realtime Database** – For storing tasks persistently in the cloud.

### Version Control:
- **Git & GitHub** – For version control and collaboration.

---

## 🏁 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/NtokozoMahlaela/To-Do-List-master.git
cd To-Do-List-master

2️⃣ Install Dependencies
Frontend Only:
No dependencies are required for the static version.

Backend Setup (Optional):
If using the backend, install Node.js dependencies:
npm install

3️⃣ Run the Application
Frontend (Static Version):
Simply open index.html in your browser.

Backend (Optional):
Set the environment variable for the port:
PORT=5000

Start the server:
node server.js

Live Server:
If using Live Server in VS Code, start it directly from the editor.

🔗 Firebase Integration
This project supports Firebase Realtime Database for task persistence. To enable Firebase:


Go to the Firebase Console.
Create a new project and enable Realtime Database.
Update the firebaseConfig object in firebase.js with your Firebase project credentials:
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

Ensure your Firebase Realtime Database rules allow read/write access for testing:
{
    "rules": {
        ".read": "true",
        ".write": "true"
    }
}
📂 Project Structure
To-Do-List-master/
│
├── [index.html](http://_vscodecontentref_/1)          # Main HTML file
├── [style.css](http://_vscodecontentref_/2)           # CSS for styling
├── [script.js](http://_vscodecontentref_/3)           # JavaScript for app functionality
├── firebase.js         # Firebase configuration and initialization
├── server.js           # Backend server (optional)
├── [README.md](http://_vscodecontentref_/4)           # Project documentation
└── [package.json](http://_vscodecontentref_/5)        # Node.js dependencies (if backend is used)
🤝 Contributing
Contributions are welcome! If you'd like to contribute:

Fork the repository.
Create a new branch (git checkout -b feature-name).
Commit your changes (git commit -m "Add feature").
Push to the branch (git push origin feature-name).
Open a pull request.
📜 License
This project is licensed under the MIT License. See the LICENSE file for details.

📧 Contact
For any questions or feedback, feel free to reach out:

GitHub: NtokozoMahlaela
Email: Ntokozomokoena07@gmail.com
