require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Faculty = require("./models/Faculty");
const Admin = require("./models/admin");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  // faculties seed
  const faculties = [
    { name: "Faculty of Applied Science", departments: ["Department of Physical", "Department of Biological"] },
    { name: "Faculty of Business Studies", departments: ["Department of Management", "Department of Finance"] },
    { name: "Faculty of Technological Studies", departments: ["Department of Engineering", "Department of IT"] }
  ];

  for (const f of faculties) {
    await Faculty.updateOne({ name: f.name }, { $set: f }, { upsert: true });
  }

  // admin seed (username: admin, password: admin123) — hashed
  const existing = await Admin.findOne({ username: "admin" });
  if (!existing) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS || 10));
    const hash = await bcrypt.hash("admin123", salt);
    const admin = new Admin({ username: "admin", password: hash, name: "System Administrator" });
    await admin.save();
    console.log("Created admin account (admin / admin123)");
  } else {
    console.log("Admin already exists");
  }

  console.log("Seed done");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
