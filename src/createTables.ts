import pool from './db';

async function createTables() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS livro (
      id_livro SERIAL PRIMARY KEY,
      autor VARCHAR(255),
      data_publicacao DATE,
      titulo VARCHAR(255)
    );
    CREATE TABLE IF NOT EXISTS cliente (
      id_cliente SERIAL PRIMARY KEY,
      email VARCHAR(255),
      telefone VARCHAR(20),
      cpf VARCHAR(20) UNIQUE
    );
    CREATE TABLE IF NOT EXISTS emprestimo (
      id_emprestimo SERIAL PRIMARY KEY,
      idlivro INT,
      idcliente INT,
      FOREIGN KEY (idlivro) REFERENCES livro(id_livro),
      FOREIGN KEY (idcliente) REFERENCES cliente(id_cliente)
    );
  `);
}

export default createTables;
