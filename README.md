# ResultPro 🎓

ResultPro is a comprehensive University Result Management System designed to streamline the academic grading process. It facilitates the management of student results, course details, and GPA/CGPA calculations, offering distinct, secure dashboards for Students, Staff, and Administrators.

## 🚀 Features

* **Role-Based Access Control:** Secure authentication and specific dashboards for Admin, Staff, and Students.
* **Student Dashboard:**
    * View real-time semester results.
    * Automatic calculation of **Semester GPA** and **Cumulative GPA (CGPA)** (Logic handles pending results and failed attempts correctly).
    * Download official academic records as **PDF files**.
* **Staff Dashboard:**
    * Upload and edit student grades for Assignments (ICA) and Final Exams.
    * **Dynamic Subject Types:** Toggle between "Theory Only" and "Theory + Practical" modes.
        * *Theory Only:* 30% ICA + 70% Exam.
        * *Theory + Practical:* (Theory Total + Practical Total) / 2.
* **Admin Dashboard:**
    * Review pending results submitted by staff.
    * Verify detailed breakdowns (Theory vs. Practical totals) before final approval.
    * Approve results to publish them or Reject them back to Draft status.
* **Email Notifications:** Integrated OTP-based authentication and notifications.

## 🛠️ Technologies Used

### Frontend
* **React.js:** Component-based UI library.
* **React Router:** For seamless client-side navigation.
* **Axios:** For handling HTTP requests.
* **jsPDF & jspdf-autotable:** For generating downloadable PDF result sheets.
* **CSS3:** Custom professional styling for dashboards.

### Backend
* **Node.js & Express.js:** Server-side runtime and framework.
* **MongoDB & Mongoose:** NoSQL database for flexible data modeling.
* **Nodemailer:** For sending emails (OTPs/Notifications).
* **Cors & Dotenv:** Middleware for resource sharing and configuration.

## 📂 Folder Structure

```text
ResultPro/
├── frontend/             # React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── CSS/          # Stylesheets (StudentDashboard.css, ViewResults.css, etc.)
│   │   ├── pages/        # Dashboard pages (Admin, Staff, Student)
│   │   ├── App.js        # Main application component
│   │   └── index.js      # Entry point
│   ├── package.json
│   └── README.md
│
├── backend/              # Node.js/Express Backend API
│   ├── models/           # Mongoose Models (Grade.js, Student.js, Course.js)
│   ├── routes/           # API Routes (gradesRoute.js, auth.js, etc.)
│   ├── .env              # Environment variables (Required)
│   ├── server.js         # Server entry point
│   └── package.json
│
└── README.md             # Project Documentation


⚙️ Installation & Setup
Follow these steps to set up the project locally.

1. Clone the Repository

git clone [https://github.com/punya2001-pk/ResultPro.git](https://github.com/punya2001-pk/ResultPro.git)
cd ResultPro

2. Backend Setup
Navigate to the backend folder and install dependencies:

cd backend
npm install
⚠️ Important Configuration: You must create a .env file in the backend directory with the following details before running the server:

Code snippet

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ursdb
CLIENT_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=resultprouov@gmail.com
EMAIL_PASS=Pass_Key_Of_The_Email
OTP_EXPIRE_MIN=5
FRONTEND_URL=http://localhost:3000
(Note: Replace Pass_Key_Of_The_Email with your actual App Password)

Start the backend server:

npm start
# Server runs on http://localhost:5000

3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:

npm install

Start the frontend application:

npm start
# Application runs on http://localhost:3000

📝 Usage Guide
Admin: Log in to manage course modules, verify submitted results, and publish them.

Staff: Select a course to edit grades. Use the dropdown to switch between "Theory Only" and "Theory + Practical" to reveal specific input fields.

Student: Log in using your registration number to view your grade breakdown (Credits, Grades, GPA) and download your result sheet.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

📄 License
This project is open-source and available under the MIT License.
