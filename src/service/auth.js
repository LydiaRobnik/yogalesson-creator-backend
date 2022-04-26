import mongoose from 'mongoose';
import ServiceBase from './serviceBase';
import userSchema from '../model/user';
import { BadRequestError } from '../js/httpError';

// import pokedex from '../model/pokedex.json';

class AuthService extends ServiceBase {
  async checkData(req) {
    return await this.checkName(req.body.name, req.params.id);
  }

  async checkName(name, id) {
    const result = await userSchema.find({
      sanskrit_name: name,
      _id: { $ne: id },
    });
    if (result.length > 0) {
      throw new BadRequestError('Authname already exists');
    }

    return result;
  }
}

export default new AuthService();
