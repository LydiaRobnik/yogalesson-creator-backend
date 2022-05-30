import { NotFoundError } from "../js/httpError";
import service from "../service/class";
import schema from "../model/class";
import BaseController from "./controllerBase";
import fs from "fs";
import path from "path";
import googleStorage from "../js/googleStorage";

class ClassController extends BaseController {
  async uploadPreview(req, res, next) {
    console.log("🤡 ", req.params.id, req.file);
    // return;

    try {
      const classId = req.params.id;
      const img = req.file;

      console.log("img", img);

      const destinationPath = `previews/preview_${classId}.png`;

      // await googleStorage.uploadFile(img, img.mimetype, destinationPath, {
      //   cacheControl: "public, max-age=60"
      // });
      await googleStorage.bucket.file(destinationPath).save(img.buffer, {
        metadata: {
          contentType: img.mimetype,
          cacheControl: "public, max-age=60"
        }
      });

      // save to db
      const result = await service.editDocumentById(
        classId,
        schema,
        async (doc) => {
          // todo bad practice
          doc.preview = `${process.env.GCS_BUCKET_URL}/${destinationPath}`;
          return doc;
        }
      );

      return res.status(200).json("image saved");
    } catch (error) {
      next(error);
    }
  }
}

export default new ClassController();
