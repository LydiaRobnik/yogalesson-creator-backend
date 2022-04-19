import mongoose from 'mongoose';
import ServiceBase from './serviceBase';
import asanaSchema from '../model/asana';
import { BadRequestError } from '../js/httpError';

// import pokedex from '../model/pokedex.json';

class AsanaService extends ServiceBase {
  async checkData(req) {
    return await this.checkName(req.body.name, req.params.id);
  }

  async checkName(name, id) {
    const result = await asanaSchema.find({
      sanskrit_name: name,
      _id: { $ne: id },
    });
    if (result.length > 0) {
      throw new BadRequestError('Asananame already exists');
    }

    return result;
  }
}

export default new AsanaService();
