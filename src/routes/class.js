import express from "express";
// ...rest of the initial code omitted for simplicity.
import { body, param } from "express-validator";
import validate from "../middleware/validate";

import controller from "../controller/class";
import service from "../service/class";
import schema from "../model/class";
import BaseRouter from "./routes-base";
import path from "path";
import multer from "multer";
// import multerGcloudStorage from "multer-google-storage";

// const upload = multer({ dest: path.resolve("public/uploads/") });
// todo multer config -> gcloud https://www.npmjs.com/package/multer-cloud-storage

const uploadHandler = multer({
  storage: multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Maximum file size is 10MB
  }
});

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

routes.post(
  "/:id/upload-preview",
  express.raw({ type: "image/*" }),
  uploadHandler.single("preview_pic"),
  // checkImage,
  controller.uploadPreview
);

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
