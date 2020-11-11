import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  // Store tem a mesma face de middleware dentro do node
  // Essa função vai receber os dados, que por enquanto vamos enviar pelo
  // insomina e posteriormente por react, reactnative
  async store(req, res) {
    // Validação via Yup
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    // Teste se ta no formato certo, passando o req.body
    // Se bater o isValid retorna true
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User alredy exists' });
    }
    const { id, name, email, provider } = await User.create(req.body);
    // Pega logo o body todo, apensar de poder pegar dado por dado
    // Nosso model de usuário ja define quais são os campos possíveis que
    // podemos informar. Se enviar qualquer outro dado atravsé do body,
    // ele não vai utilizar esse dado lá
    // Enviar somente oque for necessário para o front-end, porem os dados
    // continuam existindo na base de dados.
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // Método para usuário fazer alteração dos dados cadastrais
  // Não faz sentido para usuários que não estão logados
  // Então vamos interceptar a requisição via um middleware de autenticação
  async update(req, res) {
    // Validação via Yup
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        // when é um condição. Queremos ver se o oldPassword foi informado
        // caso tenha sido, retorna true e o field que se refere a password
        // vai ser obrigatório. Caso contrário, não vai ser obrigatório.
        .when('oldPassword', (oldpassword, field) =>
          oldpassword ? field.required() : field
        ),
      // Aqui, além de ver se esta preenchido, temos que validar que ele é
      // igual ao password. Ref para se referir a outro campo, no caso password
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // Teste se ta no formato certo, passando o req.body
    // Se bater o isValid retorna true
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Tendo o user Id aqui, podemos buscalo dentro da nossa db para altera-lo
    const { email, oldPassword } = req.body;
    // Encontra o usuáruio filtrando pela primary key
    const user = await User.findByPk(req.userId);
    // Se o e-mail for diferente, ele procura se já existe um email igual ao novo
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User alredy exists FFFFF' });
      }
    }
    // So vejo se a senha antiga bate, caso ele informar a senha antiga
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    // Caso chegue aqui, vou atualizar o usuário
    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
