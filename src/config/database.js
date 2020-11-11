// Configuração do sequelize para o dialect postgres
module.exports = {
  dialect: 'postgres', // Olhar documentação
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true,
    undercored: true, // Caixa baixa separada em under line
    undercoredAll: true,
  },
};
