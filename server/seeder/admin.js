import Admin from "../models/Admin.js";
import { username, password } from "../config/const.config.js";
import bcrypt from "bcryptjs";
const admin = async () => {
  try {
    let admin = await Admin.findOne({ username });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ username, password: hashedPassword });
      newAdmin.save();
    }
  } catch (error) {}
};

export default admin;
