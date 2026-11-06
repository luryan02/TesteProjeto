import usuarioModel from '../Models/models.js';

const usuarioController = {

    // Rota inicial da API
    rotaRaiz: async (req, res) => {
        res.status(200).json({
            mensagem: "A API está funcionando. Bem-vindo ao servidor!"
        });
    },

    // Listar todos os usuários
    listarUsuarios: async (req, res) => {
        try {
            const usuarios = await usuarioModel.listarUsuarios();

            res.status(200).json(usuarios);
        } catch (erro) {
            res.status(500).json({
                erro: "Erro ao obter a lista de usuários"
            });
        }
    },

    // Buscar usuário pelo ID
    buscarPorId: async (req, res) => {
        try {
            const usuario = await usuarioModel.buscarPorId(req.params.id);

            if (usuario.length > 0) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({
                    mensagem: "Não existe registro no banco de dados com este ID"
                });
            }
        } catch (erro) {
            res.status(500).json({
                erro: "Erro ao buscar o usuário"
            });
        }
    },

    // Cadastrar novo usuário
    cadastrarUsuario: async (req, res) => {
        const { id, nome, sobrenome, idade } = req.body;

        try {
            const usuario = await usuarioModel.buscarPorId(id);

            if (usuario.length > 0) {
                return res.status(409).json({
                    mensagem: `O ID ${id} já está cadastrado no banco de dados`
                });
            }

            await usuarioModel.cadastrarUsuario(
                id,
                nome,
                sobrenome,
                idade
            );

            res.status(201).json({
                mensagem: "Usuário cadastrado com sucesso"
            });
        } catch (erro) {
            res.status(500).json({
                erro: "Erro ao cadastrar um novo usuário"
            });
        }
    },

    // Excluir usuário
    excluirUsuario: async (req, res) => {
        try {
            const usuario = await usuarioModel.buscarPorId(req.params.id);

            console.log(usuario);

            if (usuario.length === 0) {
                return res.status(404).json({
                    mensagem: `O ID ${req.params.id} não existe no banco de dados`
                });
            }
            else {
                await usuarioModel.excluirUsuario(req.params.id);

                res.status(204).send();
            }

        } catch (erro) {
            res.status(500).json({
                erro: "Erro ao excluir o usuário"
            });
        }
    },

    // Atualizar usuário
    atualizarUsuario: async (req, res) => {
        const { nome, sobrenome, idade } = req.body;

        try {
            const usuario = await usuarioModel.buscarPorId(req.params.id);

            if (usuario.length === 0) {
                return res.status(404).json({
                    mensagem: `O ID ${req.params.id} não existe no banco de dados`
                });
            }

            await usuarioModel.atualizarUsuario(
                nome,
                sobrenome,
                idade,
                req.params.id
            );

            res.status(200).json({
                mensagem: "Dados atualizados com sucesso"
            });
        } catch (erro) {
            res.status(500).json({
                erro: "Erro ao atualizar os dados do usuário"
            });
        }
    }
};

export default usuarioController;