// Nesse arquivo vamos realizar a conecção com o db e carregar os nossos models
import Sequelize from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';

// Array com todos os models da minha aplicação
const models = [User];

class Database {
  constructor() {
    this.init();
  }

  // Esse método init que vai fazer a concção com o db e carregar os models
  init() {
    // instancia a variável connecton para estabelecer connecção com db
    // Essa variável connection é a que esta sendo experada no nossos
    // models (user.js) dentro do método init
    this.connection = new Sequelize(databaseConfig);
    // Após fazer a connecção com o db, vou percorrer o array de models
    // chama o método init passando a connecção
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
