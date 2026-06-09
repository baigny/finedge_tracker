import userModel from "../models/user.model";
import jwt from "jsonwebtoken";

async function RegisterUser(req: any, res: any) {
    const { name, password, email, age, gender } = req.body;

    const newUser = new userModel({
        name, password, email, age, gender
    });

    try {
        const responsefromDB = await newUser.save();

        res.status(201).json({
            success: "true",
            message: "User Registered Successfully",
            data: responsefromDB
        });
    } catch (error: any) {
        res.status(500).json({
            success: "false",
            message: "Error Registering User",
            error: error.message
        });
    }
}

async function loginUser(req: any, res: any) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        res.status(401).json({
            success: "false",
            message: "Invalid User Credentials"
        });
    } else {
        if (user.password === password) {
            const jwtSecret = process.env.JWT_SECRET as string;
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                jwtSecret,
                { expiresIn: "1h" }
            );

            res.status(200).json({
                success: "true",
                message: "login successful",
                data: user,
                token: token
            });
        } else {
            res.status(401).json({
                success: "false",
                message: "Invalid User Credentials",
            });
        }
    }
}

export { loginUser, RegisterUser };
