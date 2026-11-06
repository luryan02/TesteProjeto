import modelUsuario from "../Models/usuarioModel.js"

const controllerUsuario = {
    cadastrar: async (req, res) => {

        const { nome, email, senha } = req.body

        try {

            const [consulta] = await modelUsuario.buscarEmail(email)

            if (consulta.length > 0) {
                return res.status(404).json({ msg: "Email já existe!" });
            }
            else {
                const [cadastro] = await modelUsuario.cadastrarUsuario(nome, email, senha);
                if (cadastro.affectedRows > 0) {
                    return res.status(201).json({ msg: "Cadastro realizado com sucesso" });
                }
                else {
                    return res.status(400).json({ mds: "Falha ao cadastrar" })
                }
            }
        }
        catch (erro) {
            console.log(erro)
            return res.status(500).json({ msg: "Erro no servidor" });
        }
    },
    login: async (req, res) => {
        const { email, senha } = req.body;

        try {
            const validar = await modelUsuario.validarLogin(email, senha);
            console.log(validar)
         
            if (!validar) {
                return res.status(404).json({ msg: "Falha ao realizar o login" });
            }
            else {
                return res.status(200).json({ msg: "Sucesso ", email, senha });
            }

        }
        catch (erro) {
            console.log(erro)
            return res.status(500).json({ msg: "Erro no servidor" });
        }
    },
    atualizar: async (req, res) => {
        const { id } = req.params
        const { nome, email } = req.body

        console.log(req.params);
        console.log(id, nome, email);

        try {
            const [atualizar] = await modelUsuario.atualizar(id, nome, email);

            if (atualizar.affectedRows > 0) {
                return res.status(201).json({ msg: "Atualizado com sucesso" })
            }
            else {
                return res.status(400).json({ msg: "Erro ao atualizar" })
            }
        }
        catch (erro) {
            console.log(erro)
            return res.status(500).json({ msg: "Erro no servidor" });
        }
    },
    deletarusuario: async (req, res) => {
        const { id } = req.params;
        try {
            const [deletar] = await modelUsuario.deletarusuario(id);

            if (deletar.affectedRows > 0) {
                return res.status(200).json({
                    msg: `Usuário com o id ${id} deletado com sucesso!`
                });
            }
            else {
                return res.status(404).json({ msg: "Cliente com o id " + req.params.id + " não existe" })
            }
        }
        catch (erro) {
            console.log(erro)
            return res.status(500).json({ msg: "Erro no servidor" });
        }
    },
    esqueceuSenha: async (req, res) => {
        const { email } = req.body;

        try {
            const { codigo } = await modelUsuario.resetarSenha(email);

            await sendResetEmail(email, codigo);

            return res.status(200).json({ message: 'Código de redefinição enviado por email.' });

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    validarCodigo: async (req, res) => {
        const { email, codigo } = req.body;

        try {
            const valido = await modelUsuario.validarCodigo(email, codigo);

            if (!valido) {
                return res.status(400).json({ error: 'Código inválido ou expirado.' });
            }

            return res.status(200).json({ message: 'Código válido. Você pode redefinir a senha.' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao validar o código.' });
        }
    },
    resetarSenha: async (req, res) => {
        const { email, codigo, novaSenha } = req.body;

        try {
            await modelUsuario.redefinirSenha(email, codigo, novaSenha);
            return res.status(200).json({ message: 'Senha redefinida com sucesso!' });
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: err.message });
        }
    },
}
export default controllerUsuario;