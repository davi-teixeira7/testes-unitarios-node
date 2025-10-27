import request from 'supertest';
import { App } from '../../../src/app';
import { IUser } from '../../../src/interfaces/IUser';
import { IUserResponse } from '../../../src/interfaces/IUserResponse';
import { UserRepository } from '../../../src/endpoints/users/userRepository';

describe('GET /users/:id - detalhar usuário', () => {
  const app = new App().server;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ENTRADA: GET /users/10 com repositório retornando { id: 10, name: 'Hinata', age: 25 }.
  // SAÍDA ESPERADA: HTTP 200 com success true e usuário retornado acrescido de isOfAge true.
  it('retorna o usuário solicitado com o campo isOfAge quando ele existe', async () => {
    const usuarioMock: IUser = { id: 10, name: 'Hinata', age: 25 };
    const respostaEsperada: IUserResponse = { ...usuarioMock, isOfAge: true };

    jest.spyOn(UserRepository.prototype, 'findOne').mockReturnValueOnce(usuarioMock);

    const response = await request(app).get('/users/10');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(respostaEsperada);
  });

  // ENTRADA: GET /users/999 com repositório retornando undefined.
  // SAÍDA ESPERADA: HTTP 404 com success false e mensagem "Usuário não encontrado".
  it('retorna 404 quando o usuário não existe', async () => {
    jest.spyOn(UserRepository.prototype, 'findOne').mockReturnValueOnce(undefined);

    const response = await request(app).get('/users/999');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe('Usuário não encontrado');
  });
});
