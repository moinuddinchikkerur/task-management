import express from 'express';
//import { registerUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import { getCurrentUser, loginUser,registerUser,updatePassword,updateProfile } from '../controllers/userController.js';



const userRouter = express.Router();

// public routes
userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);



// private routes protect also
userRouter.get('/me',authMiddleware,getCurrentUser);
userRouter.put('/profile', authMiddleware,updateProfile);
userRouter.put('/password', authMiddleware,updatePassword);

export default userRouter;


