import mongoose from "mongoose";
import ServiceBase from "./serviceBase";
import asanaSchema from "../model/asana";
import { BadRequestError } from "../js/httpError";

// import pokedex from '../model/pokedex.json';

class AsanaService extends ServiceBase {
  async checkData(req) {
    return await this.checkName(req.body.asana.sanskrit, req.params.id);
  }

  async checkName(name, id) {
    const result = await asanaSchema.find({
      "asana.sanskrit": name,
      _id: { $ne: id }
    });
    if (result.length > 0) {
      throw new BadRequestError("Asananame already exists");
    }

    return result;
  }

  async customAdminFunction() {
    console.log("customAdminFunction");
    const res = await asanaSchema.updateMany({}, { $unset: { id: 1 } });
    console.log("res", res);
    // const all = await this.getAll(asanaSchema);

    // for (let asana of all) {
    //   await this.editDocumentById(asana._id, asanaSchema, (doc) => {
    //     doc.default = true;
    //     doc.id = undefined;
    //     // delete doc.user_id;
    //     console.log("doc", doc);
    //     return doc;
    //   });
    // }

    return true;
  }
}

export default new AsanaService();
