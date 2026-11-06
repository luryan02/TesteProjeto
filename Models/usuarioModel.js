import conexao from '../config/db.js'
import bcrypt from 'bcrypt'

const usuarioModel = {

    cadastrarUsuario: async (nome, email, senha) => {

        const senhaHash = await bcrypt.hash(senha, 10);
        try {
            const resultado = await conexao.query("INSERT INTO usuarios (nome, email, senha) VALUES (?,?,?)",
                [nome, email, senhaHash]);
            return resultado;
        }
        catch (erro) {
            throw erro;
        }
    },
    validarLogin: async (email, senha) => {
        try {
            console.log(email, senha)
            const [[consulta]] = await usuarioModel.buscarEmail(email);
            console.log('consulta:')
            console.log(consulta)
            if (!consulta) {
                return null;
            }

            const validar = await bcrypt.compare(senha, consulta.senha)
            if (validar) {
                return consulta;
            }
            else {
                return null;
            }

        }
        catch (erro) {
            throw erro;
            return null
        }
    },
    buscarEmail: async (email) => {
        try {
            const resultado = await conexao.query("SELECT  id, nome, email, senha FROM usuarios WHERE email = ?", [email]);
            return resultado;
        }
        catch (erro) {
            throw erro;
        }
    },
    atualizar: async (id, nome, email) => {
        try {
            const result = await conexao.query("UPDATE usuarios SET nome = ?, email = ? WHERE id = ?", [nome, email, id])
            return result;
        }
        catch (erro) {
            throw erro;
        }
    },
    deletarusuario: async (id) => {
        try {
            const resultado = await conexao.query("DELETE FROM usuarios WHERE id = ?", [id])
            return resultado;
        }
        catch (erro) {
            throw erro;
        }
    },
    resetarSenha: async (email) => {
        try {
            const [usuario] = await conexao.query('SELECT email FROM usuarios WHERE email = ?', [email]);

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            const codigo = Math.floor(100000 + Math.random() * 900000).toString();

            const expira = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos à frente

            await conexao.query(
                'UPDATE usuarios SET codigo_redefinicao = ?, codigo_redefinicao_expira_em = ? WHERE email = ?',
                [codigo, expira, email]
            );

            return { email, codigo };

        } catch (erro) {
            console.error('Erro ao gerar código de reset:', erro);
            throw erro;
        }
    },
    validarCodigo: async (email, codigo) => {
        try {
            const [usuario] = await conexao.query(
                'SELECT * FROM usuarios WHERE email = ? AND codigo_redefinicao = ? AND codigo_redefinicao_expira_em > NOW()',
                [email, codigo]
            );

            if (!usuario) {
                return false;
            }

            return true;
        } catch (erro) {
            console.error('Erro ao validar código:', erro);
            throw erro;
        }
    },
    redefinirSenha: async (email, codigo, novaSenha) => {
        try {
            const valido = await usuarioModel.validarCodigo(email, codigo);

            if (!valido) throw new Error('Código inválido ou expirado');

            const senhaHash = await bcrypt.hash(novaSenha, 10);

            await conexao.query(
                'UPDATE usuarios SET senha = ?, codigo_redefinicao = NULL, codigo_redefinicao_expira_em = NULL WHERE email = ?',
                [senhaHash, email]
            );

            return true;
        } catch (erro) {
            console.error('Erro ao redefinir senha:', erro);
            throw erro;
        }
    },
}
export default usuarioModel;