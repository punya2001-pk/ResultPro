# University Result Management System (URMS)

This is a React + Node.js + MongoDB application for managing university results.
It includes Student, Staff, and Admin dashboards, with login and signup functionality.

---

## Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) (v14+ recommended)
* [npm](https://www.npmjs.com/) (comes with Node.js)
* [MongoDB](https://www.mongodb.com/) (running locally or via MongoDB Atlas)

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/punya2001-pk/ResultPro.git
cd ResultPro
```

2. **Install Node modules**

```bash
npm install
```

This will install all the dependencies listed in `package.json`.

---

## Running the App

1. **Start the backend server**

```bash
node server.js
```

Server will run on: `http://localhost:5000`

2. **Start the React frontend**

```bash
npm start
```

Frontend will run on: `http://localhost:3000`

---

## Default Admin Login

To access the Admin Dashboard without signing up:

```
Username: admin
Password: admin123
```

---

## Project Structure

```
/components     - React components (Login, Dashboard, etc.)
/models         - Mongoose schemas (Student, Staff, Admin)
/CSS            - Styles
server.js       - Node.js Express backend
App.js          - React main app with routing
```

---

## Notes

* Students and Staff must signup first before logging in.
* Admin uses the default credentials provided above.
* Make sure MongoDB is running before starting the server.
