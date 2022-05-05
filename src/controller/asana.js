import { NotFoundError } from "../js/httpError";
import service from "../service/asana";
import BaseController from "./controllerBase";

class AsanaController extends BaseController {
  async createAsana(req, res, next) {
    try {
      const id = await service.createAsana(req.body);
      if (!id) throw new Error("Error createAsana");

      return res.status(200).json(id);
    } catch (error) {
      next(error);
    }
  }
}

export default new AsanaController();
