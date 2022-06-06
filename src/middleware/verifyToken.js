import express from 'express';
import { validationResult } from 'express-validator';
import { HttpError, NotFoundError } from '../js/httpError';
import userService from '../service/user';
import userSchema from '../model/user';
import jwt from 'jsonwebtoken';

const verifyToken = () => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        next(new HttpError('No token provided', 401));
      } else {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        // const docUser = await userSchema.find({ username: decodedUser.name });
        const docUser = await userService.getById(decodedUser.id, userSchema);

        if (!docUser) {
          next(new NotFoundError('User not found'));
        }

        decodedUser.avatar = docUser.avatar;
        console.log('👤 req.avatar', req.avatar);

        req.user = decodedUser;
        next();
      }
    } catch (err) {
      next(new HttpError('Invalid token', 401));
    }
  };
};

export default verifyToken;
