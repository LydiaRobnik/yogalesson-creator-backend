import express from "express";
// ...rest of the initial code omitted for simplicity.
import { body, param } from "express-validator";
import validate from "../middleware/validate";

import controller from "../controller/calendar";
import service from "../service/calendar";
import schema from "../model/calendar";
import BaseRouter from "./routes-base";

const baseRouter = new BaseRouter(controller, service, schema);
const routes = baseRouter.routes;

const validateBody = validate([
  body("user").exists().withMessage("user is required"),
  body("class").exists().withMessage("class is required")
]);
// ! bind(service) to the callback-Function, otherwise big problems with the this-reference
baseRouter
  // .addCreateDefault(validateBody, service.checkData.bind(service))
  .addGetAllDefault()
  .addGetByIdDefault()
  .addEditDefault(validateBody, service.checkData.bind(service))
  .addDeleteDefault();

routes.post("/", validateBody, controller.createCalendar);

// routes.post('/', validateBody, controller.createCalendar);

// routesCalendar.put(
//   '/:id',
//   validate([
//     param('id').isString(),
//     body('price').isNumeric().withMessage('Price must be a number'),
//   ]),
//   calendarController.editCalendar
// );

export { routes as routesCalendar };
