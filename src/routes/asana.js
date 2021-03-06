import express from "express";
// ...rest of the initial code omitted for simplicity.
import { body, param } from "express-validator";
import validate from "../middleware/validate";

import controller from "../controller/asana";
import service from "../service/asana";
import schema from "../model/asana";
import BaseRouter from "./routes-base";
import verifyToken from "../middleware/verifyToken";

const baseRouter = new BaseRouter(controller, service, schema);
const routes = baseRouter.routes;

const validateBody = validate([
  body("asana.sanskrit").exists().withMessage("body data invalid")
]);
// ! bind(service) to the callback-Function, otherwise big problems with the this-reference
baseRouter
  // .addCreateDefault(validateBody, service.checkData.bind(service))
  .addGetAllDefault()
  .addGetByIdDefault()
  // .addEditDefault(validateBody, service.checkData.bind(service))
  .addDeleteDefault()
  .addCustomAdminFunction(service.customAdminFunction.bind(service));

routes.post("/", verifyToken(), validateBody, controller.createAsana);
routes.put("/:id", verifyToken(), validateBody, controller.updateAsana);

// routes.post('/', validateBody, controller.createAsana);

// routesAsana.put(
//   '/:id',
//   validate([
//     param('id').isString(),
//     body('price').isNumeric().withMessage('Price must be a number'),
//   ]),
//   asanaController.editAsana
// );

export { routes as routesAsana };
