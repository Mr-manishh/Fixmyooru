const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const parseAdmins = () => {
  const raw = process.env.ADMIN_SEED_LIST;
  if (!raw) {
    throw new Error(
      "Missing ADMIN_SEED_LIST in .env. Provide JSON array with up to 5 admins."
    );
  }

  const list = JSON.parse(raw);
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("ADMIN_SEED_LIST must be a non-empty array.");
  }

  if (list.length > 5) {
    throw new Error("ADMIN_SEED_LIST supports maximum 5 admins.");
  }

  return list;
};

const run = async () => {
  try {
    await connectDB();
    const admins = parseAdmins();

    const existingCount = await Admin.countDocuments();
    if (existingCount + admins.length > 5) {
      throw new Error("Seeding would exceed max admin count (5).");
    }

    for (const admin of admins) {
      const exists = await Admin.findOne({ email: admin.email.toLowerCase() });
      if (exists) {
        console.log(`Skipping existing admin: ${admin.email}`);
        continue;
      }
      await Admin.create({
        name: admin.name,
        email: admin.email,
        password: admin.password,
      });
      console.log(`Seeded admin: ${admin.email}`);
    }

    console.log("Admin seed completed.");
    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exit(1);
  }
};

run();
