import pool from './db';

async function seed() {
    // Insere livros
    await pool.query(`
    INSERT INTO livro (autor, data_publicacao, titulo) VALUES
      ('Machado de Assis', '1899-01-01', 'Dom Casmurro'),
      ('J.K. Rowling', '1997-06-26', 'Harry Potter e a Pedra Filosofal'),
      ('George Orwell', '1949-06-08', '1984')
    ON CONFLICT DO NOTHING;
  `);

    // Insere clientes
    await pool.query(`
    INSERT INTO cliente (email, telefone, cpf) VALUES
      ('joao@email.com', '11999999999', '12345678901'),
      ('maria@email.com', '21988888888', '98765432100')
    ON CONFLICT DO NOTHING;
  `);

    // Insere empréstimos
    await pool.query(`
    INSERT INTO emprestimo (idlivro, idcliente) VALUES
      (1, 1),
      (2, 2)
    ON CONFLICT DO NOTHING;
  `);

    console.log('Seeds inseridos com sucesso!');
    process.exit();
}

seed().catch(e => {
    console.error(e);
    process.exit(1);
});
