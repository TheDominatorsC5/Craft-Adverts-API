import { Router } from "express";
import {  deleteAccount, resetPassword, signin, signout, signup, verifyUser } from "../controllers/auth_controller.js";
import { identifier } from "../middlewares/identification.js";

export const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/signout', identifier, signout);
authRouter.post('/verifyuser', verifyUser);
authRouter.post('/reset/password', resetPassword);
authRouter.delete('/account/delete', identifier, deleteAccount);