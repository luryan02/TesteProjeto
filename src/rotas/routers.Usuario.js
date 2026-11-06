import express from 'express';
import controllerUsuario from '../../Controllers/usuarioController.js';


const routerUsuario = express.Router();

routerUsuario.post('/usuario', controllerUsuario.cadastrar);
routerUsuario.post('/login', controllerUsuario.login);
routerUsuario.put('/usuarios/:id',controllerUsuario.atualizar );
routerUsuario.delete('/usuario/:id',controllerUsuario.deletarusuario );
routerUsuario.post('/esqueceu-senha', controllerUsuario.esqueceuSenha);
routerUsuario.post('/validar-codigo', controllerUsuario.validarCodigo);
routerUsuario.post('/resetar-senha', controllerUsuario.resetarSenha);

export default routerUsuario;