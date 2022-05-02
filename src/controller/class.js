import { NotFoundError } from "../js/httpError";
import service from "../service/class";
import BaseController from "./controllerBase";
import fs from "fs";
import path from "path";

class ClassController extends BaseController {
  async uploadPreview(req, res, next) {
    try {
      const classId = req.params.id;
      const img = req.file;

      console.log("img", img);

      const destinationPath = `previews/${classId}.png`;
      fs.rename(
        img.path,
        path.resolve(`public/${destinationPath}`),
        function (err) {
          if (err) throw err;
          console.log("File moved and renamed.");
        }
      );

      return res.status(200).json("ok");
    } catch (error) {
      next(error);
    }
  }
}

export default new ClassController();
