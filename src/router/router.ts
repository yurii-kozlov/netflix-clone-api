import { Router } from "express";
import userController from "../controllers/user-controller";
import { body} from 'express-validator';
import authMiddleware from '../middlewares/auth-middleware';

const router = Router();

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 32}),
  userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.patch('/setPlan', userController.setPlan);
router.patch('/addMovieToWatchLaterList', userController.addMovieToWatchLaterList);
router.patch('/addMovieToLikedList', userController.addMovieToLikedList);

export default router;
