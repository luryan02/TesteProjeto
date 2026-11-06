// Importar bibliotecas e módulos
import request from "supertest";
import express from 'express';
import routerUsuario from "./src/rotas/routers.Usuario.js"; 
import conexao from './config/db.js';  

// Criar aplicação para os testes
const app = express();

app.use(express.json());
app.use(routerUsuario); 

const numeroAleatorio = 100000 + Math.floor(Math.random() * 900000);

// Dados do usuário utilizado nos testes
const usuarioTeste = {
    nome: 'Marcos Teste',
    email: `marcos.${numeroAleatorio}@email.com`,
    senha: 'senhaSegura123'
};

// Variável para armazenar o ID gerado pelo banco para usar no PUT e DELETE
let idTeste;

beforeAll(async () => {
    // Garante que a conexão com o banco de testes está ativa
    await conexao.query('SELECT 1');
    // Limpeza preventiva: remove o usuário caso ele já exista de um teste anterior
    await conexao.query('DELETE FROM usuarios WHERE email = ?', [usuarioTeste.email]);
});

afterAll(async () => {
    // Fecha o pool de conexões para o Jest conseguir finalizar o terminal no fim
    await conexao.end();
});

describe('Testes de integração da API', () => {

    // 1. Testar o cadastro do SEU usuário
    it('POST /usuario deve cadastrar um novo usuário', async () => {
        const resposta = await request(app)
            .post('/usuario')
            .send(usuarioTeste);

        expect(resposta.statusCode).toBe(201);
        expect(resposta.body).toHaveProperty(
            'msg',
            'Cadastro realizado com sucesso'
        );
    });

    // 2. Testar o login com os dados reais do SEU usuário
    it('POST /login deve realizar o login do usuário cadastrado', async () => {
        const resposta = await request(app)
            .post('/login')
            .send({
                email: usuarioTeste.email,
                senha: usuarioTeste.senha
            });

        expect(resposta.statusCode).toBe(200);
        expect(resposta.body).toHaveProperty(
            'msg',
            'Sucesso '
        );

        // Busca o ID real que o MySQL gerou automaticamente para esse e-mail
        const [rows] = await conexao.query("SELECT id FROM usuarios WHERE email = ?", [usuarioTeste.email]);
        if (rows.length > 0) {
            idTeste = rows[0].id;
        }
    });

    // 3. Testar a atualização do SEU usuário usando o ID real dele
    it('PUT /usuarios/:id deve atualizar os dados do usuário', async () => {
        const dadosAtualizados = {
            nome: 'Marcos Silva Alterado',
            email: usuarioTeste.email // Mantém o mesmo e-mail para o fluxo continuar correto
        };

        const resposta = await request(app)
            .put(`/usuarios/${idTeste}`)
            .send(dadosAtualizados);

        expect(resposta.statusCode).toBe(201);
        expect(resposta.body).toHaveProperty(
            'msg',
            'Atualizado com sucesso'
        );
    });

    // 4. Testar a exclusão do SEU usuário limpando o ID do banco de testes
    it('DELETE /usuario/:id deve excluir o usuário', async () => {
        console.log('ID utilizado do seu usuário:', idTeste);

        const resposta = await request(app)
            .delete(`/usuario/${idTeste}`);

        console.log(resposta.statusCode);

        expect(resposta.statusCode).toBe(200);
        expect(resposta.body).toHaveProperty(
            'msg',
            `Usuário com o id ${idTeste} deletado com sucesso!`
        );
    });
});
