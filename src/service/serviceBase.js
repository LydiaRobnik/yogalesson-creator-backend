import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../js/httpError";

export default class ServiceBase {
  async create(dto, schema) {
    dto._id = new mongoose.Types.ObjectId();

    // todo general
    dto.modifiedAt = new Date();

    const doc = await schema.create(dto);
    const _id = doc._id;

    console.log("mongo-id", _id);

    return await this.getById(_id, schema);
  }

  async getAll(schema, req) {
    console.log("req query", req?.query);

    const collection = await schema.find(req?.query);
    // const itemsDB = pokedex;

    return collection;
  }

  async getById(id, schema) {
    const doc = await schema.findById(id);
    return doc;
  }

  async getByCondition(condition, schema) {
    const [doc] = await schema.find(condition);

    if (!doc) {
      throw new NotFoundError();
    }
    return doc;
  }

  async deleteById(id, schema) {
    const result = await schema.deleteOne({ _id: id });
    // const itemDB = pokedex.find((item) => item.id === +id);

    console.log("result", result);

    return result;
  }

  async editDocumentById(id, schema, cbEditDocument) {
    const doc = await schema.findById(id);
    return await this.editDocument(doc, schema, cbEditDocument);
  }

  // async editDocumentByCondition(condition, schema, cbEditDocument) {
  //   const [doc] = await schema.find(condition);
  //   return await this.editDocument(doc, schema, cbEditDocument);
  // }

  async editDocument(doc, schema, cbEditDocument) {
    // console.log('doc', doc);

    let result;

    const docEdited = await cbEditDocument(doc);
    if (docEdited) {
      // console.log('docEdited', docEdited);
      result = await schema.updateOne({ _id: doc._id }, docEdited);
    } else {
      result = await doc.save();
    }

    if (!result) {
      throw new Error("Error edit document");
    }

    return await this.getById(doc._id, schema);
  }

  async customAdminFunction(schema, cb) {
    const result = await cb(schema);
    return result;
  }
}
