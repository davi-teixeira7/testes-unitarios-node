import request from 'supertest';
import { App } from '../../../src/app';
import { IUser } from '../../../src/interfaces/IUser';
import { IUserResponse } from '../../../src/interfaces/IUserResponse';
import { UserRepository } from '../../../src/endpoints/users/userRepository';

// ENTRADA: GET /users com repositório retornando três usuários (idades 10, 18, 50).
// SAÍDA ESPERADA: HTTP 200, success true e usuários enriquecidos com isOfAge.
describe('GET /users - listar usuários', () => {
  const app = new App().server;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('retorna a lista de usuários com o campo isOfAge calculado', async () => {
    const usuariosMock: IUser[] = [
      { id: 1, name: 'Naruto', age: 10 },
      { id: 2, name: 'Sasuke', age: 18 },
      { id: 3, name: 'Kakashi', age: 50 },
    ];

    const respostaEsperada: IUserResponse[] = [
      { id: 1, name: 'Naruto', age: 10, isOfAge: false },
      { id: 2, name: 'Sasuke', age: 18, isOfAge: true },
      { id: 3, name: 'Kakashi', age: 50, isOfAge: true },
    ];

    jest.spyOn(UserRepository.prototype, 'list').mockReturnValueOnce(usuariosMock);

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(respostaEsperada);
  });
});
