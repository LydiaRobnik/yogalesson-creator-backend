import { NotFoundError } from '../js/httpError';
import service from '../service/auth';
import userService from '../service/user';
import BaseController from './controllerBase';
import jwt from 'jsonwebtoken';

class AuthController extends BaseController {
  async loginUser(req, res, next) {
    try {
      const user = await userService.loginUser(req.body);

      const token = jwt.sign(
        { id: user._id, name: user.username, role: 'user' }, // todo role
        process.env.JWT_SECRET
      );

      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
