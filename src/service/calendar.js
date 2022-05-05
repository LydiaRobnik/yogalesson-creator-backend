import mongoose from "mongoose";
import ServiceBase from "./serviceBase";
import calendarSchema from "../model/calendar";
import { BadRequestError } from "../js/httpError";
import { DateTime } from "luxon";
import { range } from "../js/util";

// import pokedex from '../model/pokedex.json';

class CalendarService extends ServiceBase {
  async createCalendar(calendarDto) {
    // const { username, email, password, validated } = userDto;

    await this.checkName(calendarDto.title);

    const id = await this.create(calendarDto, calendarSchema);

    if (calendarDto.event?.regular && calendarDto.event?.regular !== "once") {
      console.log("createCalendar: regular", calendarDto.event?.regular);

      const createRegulars = async (cb) =>
        await Promise.all(
          range({ from: 1, to: +calendarDto.event.regularCount }).map(
            async (num) => {
              console.log("createCalendar: daily", num);

              calendarDto.event.regularLink = id._id;

              calendarDto.event.date = cb(
                DateTime.fromISO(calendarDto.event.date)
              )
                // .plus({ "days": 1 })
                .toISODate();
              await this.create(calendarDto, calendarSchema);
            }
          )
        );

      switch (calendarDto.event?.regular) {
        case "daily":
          await createRegulars((date) => date.plus({ days: 1 }));
          break;
        case "weekly":
          await createRegulars((date) => date.plus({ weeks: 1 }));
          break;
        case "monthly":
          await createRegulars((date) => date.plus({ months: 1 }));
          break;
      }
    }

    return await this.getById(id, calendarSchema);
  }

  async checkData(req) {
    return true;
    // return await this.checkName(req.body.title, req.params.id);
  }

  async checkName(name, id) {
    const result = await calendarSchema.find({
      title: name,
      _id: { $ne: id }
    });
    if (result.length > 0) {
      // throw new BadRequestError("Calendarname already exists");
    }

    return result;
  }
}

export default new CalendarService();
