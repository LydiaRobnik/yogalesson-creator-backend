import { NotFoundError } from "../js/httpError";
import service from "../service/calendar";
import BaseController from "./controllerBase";

class CalendarController extends BaseController {
  async createCalendar(req, res, next) {
    try {
      const id = await service.createCalendar(req.body);
      if (!id) throw new Error("Error createCalendar");

      return res.status(200).json({ id: id });
    } catch (error) {
      next(error);
    }
  }
}

export default new CalendarController();
