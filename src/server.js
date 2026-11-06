// Importar bibliotecas e módulos
import express from 'express';
import cors from 'cors';
import rotas from './routers.js';
import conexao from '../config/db.js';

const app = express();
const PORTA = 3001;

app.use(cors());
app.use(express.json());
app.use(rotas);

const conectarComTentativas = async () => {
    console.log('Tentando conectar ao banco de dados...');

    try {
        await conexao.query('SELECT 1');

        console.log('Conexão com o banco de dados estabelecida.');

        app.listen(PORTA, () => {
            console.log(
                `Servidor executando em: http://localhost:${PORTA}`
            );
        });
    } catch (erro) {
        console.error(
            'Falha na conexão com o banco de dados. Nova tentativa em 5 segundos.',
            erro.message
        );

        setTimeout(conectarComTentativas, 5000);
    }
};

conectarComTentativas();