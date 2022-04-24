import express from 'express';
// ...rest of the initial code omitted for simplicity.
import { body, param } from 'express-validator';
import validate from '../middleware/validate';

import controller from '../controller/auth';
import service from '../service/auth';
import schema from '../model/asana';
import BaseRouter from './routes-base';
import verifyToken from '../middleware/verifyToken';

const baseRouter = new BaseRouter(controller, service, schema);
const routes = baseRouter.routes;

routes.post('/login', controller.loginUser);
// routes.post('/signup', signup); // todo

routes.get('/verify', verifyToken(), async (req, res) => {
  // res.json({ success: 'valid token' });
  res.json(req.user);
});

export { routes as routesAuth };
