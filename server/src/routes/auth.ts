import express from "express";
import loginController from "../controllers/auth/loginController";
import logoutController from "../controllers/auth/logoutController";
import refreshController from "../controllers/auth/refreshController";
import registerController from "../controllers/auth/registerController";

const router = express.Router();

router.post('/register', registerController.createUser);
router.post('/login', loginController.login);
router.get('/refresh', refreshController.refresh);
router.get('/logout', logoutController.logout);

export = router;