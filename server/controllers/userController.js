import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// ================= SIGNUP =================
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        // ✅ Validate input
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Account already exists" });
        }

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        });

        // ✅ Generate token
        const token = generateToken(newUser._id);

        // ✅ Send correct response
        res.json({
            success: true,
            user: newUser,
            token,
            message: "Account Created Successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// ================= LOGIN =================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Check if user exists
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        // ✅ Compare password
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // ✅ Generate token
        const token = generateToken(userData._id);

        // ✅ Send consistent response
        res.json({
            success: true,
            user: userData,
            token,
            message: "Login successful"
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// ================= CHECK AUTH =================
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};


// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;

        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullName },
                { new: true }
            );
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    profilePic: upload.secure_url,
                    bio,
                    fullName
                },
                { new: true }
            );
        }

        res.json({ success: true, user: updatedUser });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};