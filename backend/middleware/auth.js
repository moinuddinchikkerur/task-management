import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default async function authMiddleware(req, res, next) {
    //grap the token from the request headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const token = authHeader.split(' ')[1];

    // Verify and attach user object
    try{
        const playload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(playload.id).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        console.error("jwt verification fallied ",err);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
}

