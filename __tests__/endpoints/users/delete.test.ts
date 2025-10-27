import request from 'supertest';
import { App } from '../../../src/app';
import { UserRepository } from '../../../src/endpoints/users/userRepository';

describe('DELETE /users/:id - remover usuário', () => {
  const app = new App().server;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ENTRADA: DELETE /users/5 com repositório retornando true em delete.
  // SAÍDA ESPERADA: HTTP 200 com success true e mensagem "Usuário excluído com sucesso".
  it('remove um usuário existente quando o repositório exclui com sucesso', async () => {
    jest.spyOn(UserRepository.prototype, 'delete').mockReturnValueOnce(true);

    const response = await request(app).delete('/users/5');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBe('Usuário excluído com sucesso');
  });

  // ENTRADA: DELETE /users/999 com repositório retornando false em delete.
  // SAÍDA ESPERADA: HTTP 500 com success false e mensagem "Falha ao remover o usuário".
  it('retorna 500 quando o repositório falha ao excluir', async () => {
    jest.spyOn(UserRepository.prototype, 'delete').mockReturnValueOnce(false);

    const response = await request(app).delete('/users/999');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe('Falha ao remover o usuário');
  });
});
