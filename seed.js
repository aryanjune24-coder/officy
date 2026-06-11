const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://officyadmin:XRYXX9UhOOgln4YL@cluster0.b8aeu3s.mongodb.net/?appName=Cluster0";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  orders: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.findOneAndUpdate(
      { email: 'admin@officy.com' },
      { name: 'QA Admin', password: hashedPassword, role: 'admin' },
      { upsert: true, new: true }
    );
    console.log("Admin seeded successfully.");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
seed();
