import express from 'express';
import usuarioController from '../../Controllers/controller';
const rotas = express.Router();

rotas.get('/', usuarioController.rotaRaiz);

rotas.get('/usuario', usuarioController.listarUsuarios);

rotas.get('/usuario/:id', usuarioController.buscarPorId);

rotas.post('/usuario', usuarioController.cadastrarUsuario);

rotas.delete('/usuario/:id', usuarioController.excluirUsuario);

rotas.put('/usuario/:id', usuarioController.atualizarUsuario);

export default rotas;
