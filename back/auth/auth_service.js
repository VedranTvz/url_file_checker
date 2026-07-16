import dotenv from "dotenv";
dotenv.config();
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import db from "../SQLConnection.js";


export const registerUser= async (req, res)=>{

    const {email, phone_number, password} = req.body;

    console.log("Registering user with email:", email, "and phone number:", phone_number);

    if (!email || !phone_number || !password){

        return res.status(400).json({error: "Email, phone number, and password are required"});
    }

    const hashedPassword = await argon2.hash(password);
    const userId = uuidv4();

    const [result] = await db.query("INSERT INTO users (uuid, email, phone_number, password_hash) VALUES (?, ?, ?, ?)", [userId, email, phone_number, hashedPassword]);

    
    res.json({message: "User registered successfully"});
}


export const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    return res.json({ message: "Logged out successfully" });
};

export const loginUser = async (req, res) =>{

    const {email, password} = req.body;

    if (!email || !password){

        return res.status(400).json({error: "Email and password are required"});
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    const user = rows[0];

    if(!user){

        return res.status(401).json({error: "Invalid email or password"});
    }

    const match= await argon2.verify(user.password_hash, password);

    if (!match){

        return res.status(401).json({error: "Invalid email or password"});
    }

    const token =jwt.sign({ userId: user.uuid }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true u produkciji s HTTPS-om
        sameSite: "lax",
        maxAge: 2 * 60 * 60 * 1000 // 2h
    });

    res.json({message: "Login succesfull"});

}
