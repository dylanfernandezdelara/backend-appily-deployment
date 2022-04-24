import { Router } from "express";
import DoggoRoutes from "./doggos";
import AuthRoutes from "./auth";
import UserRoutes from "./user";
import JobRoutes from "./job";
import TodoRoutes from "./todo";
import CompanyRoutes from "./company";
import passport from "passport";

import MailerRoutes from "./sendToMe";

const router = Router();
const secure = passport.authenticate("jwt", { session: false });

router.use("/doggo", DoggoRoutes);
router.use("/", AuthRoutes);
router.use("/sendtome", MailerRoutes);
//reminder: secure secured routes after
router.use("/user", UserRoutes);
router.use("/job", JobRoutes);
router.use("/todo", TodoRoutes);
router.use("/company", CompanyRoutes);

export default router;
