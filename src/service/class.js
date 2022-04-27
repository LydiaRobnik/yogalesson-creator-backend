import mongoose from "mongoose";
import ServiceBase from "./serviceBase";
import classSchema from "../model/class";
import { BadRequestError } from "../js/httpError";

// import pokedex from '../model/pokedex.json';

class ClassService extends ServiceBase {
  async checkData(req) {
    return await this.checkName(req.body.title, req.params.id);
  }

  async checkName(name, id) {
    const result = await classSchema.find({
      title: name,
      _id: { $ne: id }
    });
    if (result.length > 0) {
      throw new BadRequestError("Classname already exists");
    }

    return result;
  }
}

export default new ClassService();
