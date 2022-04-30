import express from "express";
// ...rest of the initial code omitted for simplicity.
import { body, param } from "express-validator";
import validate from "../middleware/validate";

import controller from "../controller/class";
import service from "../service/class";
import schema from "../model/class";
import BaseRouter from "./routes-base";

const baseRouter = new BaseRouter(controller, service, schema);
const routes = baseRouter.routes;

const validateBody = validate([
  body("title").exists().withMessage("body data invalid")
]);
// ! bind(service) to the callback-Function, otherwise big problems with the this-reference
baseRouter
  .addCreateDefault(validateBody, service.checkData.bind(service))
  .addGetAllDefault()
  .addGetByIdDefault()
  .addEditDefault(validateBody, service.checkData.bind(service))
  .addDeleteDefault();

// routes.post('/', validateBody, controller.createClass);

// routesClass.put(
//   '/:id',
//   validate([
//     param('id').isString(),
//     body('price').isNumeric().withMessage('Price must be a number'),
//   ]),
//   classController.editClass
// );

export { routes as routesClass };
