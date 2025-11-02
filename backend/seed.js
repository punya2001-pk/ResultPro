const mongoose = require("mongoose");
require("dotenv").config();

const faculties = ["Applied", "Business Studies", "Technological Studies"];

faculties.forEach(async (faculty) => {
  const db = await mongoose.createConnection(
    `${process.env.MONGO_URI}faculty_${faculty}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  const Student = db.model("Student", new mongoose.Schema({
    regNumber: String,
    fullName: String,
    indexNumber: String,
    username: String,
    password: String,
    academicYear: String,
  }));

  const student = new Student({
    regNumber: "2021/ICT/001",
    fullName: "John Doe",
    indexNumber: "IT17101",
    username: "2021/ICT/001",
    password: "Test@1234",
    academicYear: "2021/2022",
  });

  await student.save();
  console.log(`Student added to faculty_${faculty}`);
});
