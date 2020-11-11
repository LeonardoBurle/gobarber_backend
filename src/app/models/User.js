import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    // Método init vai ser chamado automaticamente pelo sequelize
    super.init(
      // Tem o objeto com todos os valores que meu usuário pode receber
      {
        // super para pegar a classe pai Model
        // Aqui vamos colocar só as colunas que o usuário vai de fato inserir
        // Quando ele der um user.create(), por exemplo.
        // Não precisa ser um reflexo da nossa base de dados
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Campo que nunca vai existir na db
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize, // Precisa ser passado como segundo par da super.init
      }
    );
    // Funcionalidade do sequelize de hooks
    // Hooks são basicamente trecho de códigos que são executados de forma
    // automática baseado em ações que acontecem no nosso model
    // O evento no caso é o beforesafe, logo antes de salvar vai executar
    // esse trecho de código
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        // Deu uma merda com o user aqui, desabilitei o eslint para essa linha
        // eslint-disable-next-line no-param-reassign
        user.password_hash = await bcrypt.hash(user.password, 8);
        // o 8 é a força da senha, digamos assim (entender melhor depois)
      }
    });

    return this;
  }

  // Se a senha bater, retorna true
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
