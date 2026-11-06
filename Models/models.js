// Importar conexão com o banco de dados
import conexao from '../config/db.js';

const usuarioModel = {

    // Listar todos os usuários
    listarUsuarios: async () => {
        const [resultado] = await conexao.query(
            "SELECT * FROM pessoas"
        );

        return resultado;
    },

    // Buscar usuário pelo ID
    buscarPorId: async (id) => {
        const [resultado] = await conexao.query(
            "SELECT * FROM pessoas WHERE id = ?",
            [id]
        );

        return resultado;
    },

    // Cadastrar novo usuário
    cadastrarUsuario: async (id, nome, sobrenome, idade) => {
        const [resultado] = await conexao.query(
            "INSERT INTO pessoas (id, nome, sobrenome, idade) VALUES (?, ?, ?, ?)",
            [id, nome, sobrenome, idade]
        );

        return resultado;
    },

    // Excluir usuário
    excluirUsuario: async (id) => {
        const [resultado] = await conexao.query(
            "DELETE FROM pessoas WHERE id = ?",
            [id]
        );

        return resultado;
    },

    // Atualizar usuário
    atualizarUsuario: async (nome, sobrenome, idade, id) => {
        const [resultado] = await conexao.query(
            "UPDATE pessoas SET nome = ?, sobrenome = ?, idade = ? WHERE id = ?",
            [nome, sobrenome, idade, id]
        );

        return resultado;
    }
};

export default usuarioModel;
