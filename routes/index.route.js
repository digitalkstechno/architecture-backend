
// routes/index.routes.js
import express from "express";

const router = express.Router();

// ------------------ Authentication Routes Import ------------------------------------
import permissionRouter from "./permission.routes.js";
import roleRouter from "./role.routes.js";
import userRouter from "./user.route.js";
import tenantRouter from "./tenant.routes.js";
import subscriptionPlanRoutes from "./subscriptionplan.routes.js";
import { LoginUser } from "../controller/auth.controller.js";

// ------------------ Modules & Sections Routes Import ---------------------------------
import paymentledgerRouter from "./paymentledger.routes.js";
import bankbriefRouter from "./bankbrief.routes.js";
import clientRouter from "./client.routes.js";
import projectRouter from "./project.routes.js";
import projectstageRouter from "./projectstage.routes.js";
import taskRouter from "./task.routes.js";

// ------------------ Authentication Routes Used ------------------------------------
router.use("/permission", permissionRouter);
router.use("/role", roleRouter);
router.use("/user", userRouter);
router.use("/tenant", tenantRouter);
router.use("/subscription-plans", subscriptionPlanRoutes);
router.use("/login", LoginUser);

// ------------------ Modules & Sections Routes Used ---------------------------------
router.use("/paymentledger", paymentledgerRouter);
router.use("/bankbrief", bankbriefRouter);
router.use("/client", clientRouter);
router.use("/project", projectRouter);
router.use("/projectstage", projectstageRouter);
router.use("/task", taskRouter);



export default router;


