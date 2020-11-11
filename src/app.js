import express from 'express';
import routes from './routes';

import './database';

class App {
  // Só é chamada apenas uma vez
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes(); // Chama aqui, se não nunca seriam chamados
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}
export default new App().server; // Única coisa que faz sentido exportar
