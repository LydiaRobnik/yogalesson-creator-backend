import express from "express";

// ...rest of the initial code omitted for simplicity.
import { body, param } from "express-validator";
import validate from "../middleware/validate";
import checkUserExists from "../middleware/checkUserExists";
import verifyToken from "../middleware/verifyToken";

import controller from "../controller/user";
import service from "../service/user";
import schema from "../model/user";
import BaseRouter from "./routes-base";

const baseRouter = new BaseRouter(controller, service, schema);
const routes = baseRouter.routes;

const bodyValidations = [
  body("username").not().isEmpty().withMessage("User Name is required"),
  body("email").not().isEmpty().withMessage("Email is required"),
  body("password").not().isEmpty().withMessage("Password is required")
];

// ! bind(service) to the callback-Function, otherwise big problems with the this-reference
baseRouter.addEditDefault(
  validate(bodyValidations),
  service.checkData.bind(service)
);

routes.get("/", controller.getUsers);
routes.post("/", validate(bodyValidations), controller.createUser);

routes.post(
  "/login",
  validate([
    body("user").not().isEmpty().withMessage("User Name is required"),
    body("type").not().isEmpty().withMessage("Type is required"),
    body("password").not().isEmpty().withMessage("Password is required")
  ]),
  controller.loginUser
);

routes.get(
  "/:id/logout",
  validate([param("id").isString()]),
  checkUserExists,
  controller.logoutUser
);

routes.put(
  "/:id/change-password",
  verifyToken(),
  validate([
    param("id").isString(),
    body("password").not().isEmpty().withMessage("Password is required")
  ]),
  checkUserExists,
  controller.changePassword
);
routes.put(
  "/:id/change-username",
  verifyToken(),
  validate([
    param("id").isString(),
    body("username").not().isEmpty().withMessage("Username is required")
  ]),
  checkUserExists,
  controller.changeUsername
);

routes.put(
  "/:id/change-avatar",
  verifyToken(),
  validate([
    param("id").isString(),
    body("avatar").not().isEmpty().withMessage("Avatar is required")
  ]),
  checkUserExists,
  controller.changeAvatar
);

routes.get(
  "/:id",
  verifyToken(),
  validate([param("id").isString()]),
  checkUserExists,
  controller.getUser
);

routes.get(
  "/check-name/:name",
  validate([param("name").isString()]),
  controller.checkName
);

routes.delete(
  "/:id",
  validate([param("id").isString()]),
  checkUserExists,
  controller.deleteUser
);

export { routes as routesUser };
