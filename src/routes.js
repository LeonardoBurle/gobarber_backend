import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas
// Chama o controller atraves do callback
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
// Middleware global, so vale para as rotas na sequencia
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
