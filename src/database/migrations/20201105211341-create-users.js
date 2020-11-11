module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criamos as colunas
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  },
};

// Aqui só funcionou colocando Users com U maiusculo e mudando o nome de
// para  updatedAt e createdAt
// Me parece que o config databes.js não pegou as paradas lá de
// undercored e undercoredAll
// Além disso, qaundo criei a migrtion ela já veio com async e await
// e não como return, feito o vídeo.
