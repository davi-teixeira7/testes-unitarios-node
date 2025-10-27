import request from 'supertest';
import { App } from '../../../src/app';
import { IUser } from '../../../src/interfaces/IUser';
import { UserRepository } from '../../../src/endpoints/users/userRepository';

describe('POST /users - criar usuário', () => {
  const app = new App().server;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ENTRADA: POST /users com corpo { id: 7, name: 'Shikamaru', age: 19 } e repositório retornando true em save.
  // SAÍDA ESPERADA: HTTP 201 com success true e mensagem "Usuário criado com sucesso".
  it('cria um usuário quando o repositório salva com sucesso', async () => {
    const novoUsuario: IUser = { id: 7, name: 'Shikamaru', age: 19 };

    jest.spyOn(UserRepository.prototype, 'save').mockReturnValueOnce(true);

    const response = await request(app).post('/users').send(novoUsuario);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBe('Usuário criado com sucesso');
  });

  // ENTRADA: POST /users com corpo { id: 1, name: 'Duplicate', age: 20 } e repositório retornando false em save.
  // SAÍDA ESPERADA: HTTP 500 com success false e mensagem "Falha ao criar o usuário".
  it('retorna 500 quando o repositório não consegue salvar', async () => {
    const usuarioDuplicado: IUser = { id: 1, name: 'Duplicate', age: 20 };

    jest.spyOn(UserRepository.prototype, 'save').mockReturnValueOnce(false);

    const response = await request(app).post('/users').send(usuarioDuplicado);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe('Falha ao criar o usuário');
  });
});
