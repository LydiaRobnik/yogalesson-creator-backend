import express from "express";
// ...rest of the initial code omitted for simplicity.
import { body, param } from "express-validator";
import validate from "../middleware/validate";

import controller from "../controller/auth";
import service from "../service/auth";
import schema from "../model/asana";
import BaseRouter from "./routes-base";
import verifyToken from "../middleware/verifyToken";
import checkUserExists from "../middleware/checkUserExists";

const baseRouter = new BaseRouter(controller, service, schema);
const routes = baseRouter.routes;

routes.post("/login", controller.loginUser);
routes.post("/signup", controller.signupUser);

routes.get("/verify", verifyToken(), async (req, res) => {
  // res.json({ success: 'valid token' });
  res.json(req.user);
});

routes.get("/revalidate", controller.revalidateUser);
routes.get("/validate/:token", controller.validateUser);

routes.put(
  "/:id/change-email",
  verifyToken(),
  validate([
    param("id").isString(),
    body("email").not().isEmpty().withMessage("Email is required")
  ]),
  checkUserExists,
  controller.changeEmail
);

routes.get("/custom-admin-function", controller.testHtmlMail);

export { routes as routesAuth };
