// Incluir biblioteca de conexão
import mysql from "mysql2/promise";

const conexao = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "admin",
    database: "projeto_testes"
});

export default conexao;
