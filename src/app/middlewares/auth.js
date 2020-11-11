// Para fazer a verificação se o usuário esta logado.
// Vamos usar o token
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
// authConfig onde esta o segredo do token
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  // quando faz a desestruturação só com a virgula, ignora a prima posição
  // que nesse caso é o bearer
  // Divide a partir do espaço
  const [, token] = authHeader.split(' ');

  try {
    // o método jwt.verify usa o método antigo de callback, onde tem que se tratar
    // um erro ou um resultado. Para poder usar async e await, importamos o método
    // promisify do proprio node.
    // promisify(jwt.verify) retorna outra função, pro isso o () depois para
    // Chamar a função retornada.
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // Agora podemos incluir o id dentro do nosso req
    // Vamos usar lá dentro do contrller para alterar esse usuário especifico
    req.userId = decoded.id;

    return next(); // Se ta autenticado, pode acessar o controller normalmente
  } catch (err) {
    return res.status(401).json({ erro: 'Token invalid' });
  }
};
