import mongoose from "mongoose";
import ServiceBase from "./serviceBase";
import sequenceSchema from "../model/sequence";
import { BadRequestError } from "../js/httpError";

// import pokedex from '../model/pokedex.json';

class SequenceService extends ServiceBase {
  async checkData(req) {
    return await this.checkName(req.body.title, req.params.id);
  }

  async checkName(name, id) {
    const result = await sequenceSchema.find({
      title: name,
      _id: { $ne: id }
    });
    if (result.length > 0) {
      throw new BadRequestError("Sequencename already exists");
    }

    return result;
  }
}

export default new SequenceService();
