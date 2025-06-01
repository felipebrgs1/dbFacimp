import express from 'express';
import pool from './db';
import createTables from './createTables';

const app = express();
app.use(express.json());

// Inicializa tabelas
createTables().then(() => console.log('Tabelas criadas')).catch(console.error);

// CRUD Livro
app.get('/livros', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM livro');
    res.json(rows);
});

app.post('/livros', async (req, res) => {
    const { autor, data_publicacao, titulo } = req.body;
    const { rows } = await pool.query(
        'INSERT INTO livro (autor, data_publicacao, titulo) VALUES ($1, $2, $3) RETURNING *',
        [autor, data_publicacao, titulo]
    );
    res.status(201).json(rows[0]);
});

app.put('/livros/:id', async (req, res) => {
    const { id } = req.params;
    const { autor, data_publicacao, titulo } = req.body;
    const { rows } = await pool.query(
        'UPDATE livro SET autor=$1, data_publicacao=$2, titulo=$3 WHERE id_livro=$4 RETURNING *',
        [autor, data_publicacao, titulo, id]
    );
    res.json(rows[0]);
});

app.delete('/livros/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM livro WHERE id_livro=$1', [id]);
    res.sendStatus(204);
});

// CRUD Cliente
app.get('/clientes', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM cliente');
    res.json(rows);
});

app.post('/clientes', async (req, res) => {
    const { email, telefone, cpf } = req.body;
    const { rows } = await pool.query(
        'INSERT INTO cliente (email, telefone, cpf) VALUES ($1, $2, $3) RETURNING *',
        [email, telefone, cpf]
    );
    res.status(201).json(rows[0]);
});

app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { email, telefone, cpf } = req.body;
    const { rows } = await pool.query(
        'UPDATE cliente SET email=$1, telefone=$2, cpf=$3 WHERE id_cliente=$4 RETURNING *',
        [email, telefone, cpf, id]
    );
    res.json(rows[0]);
});

app.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM cliente WHERE id_cliente=$1', [id]);
    res.sendStatus(204);
});

// CRUD Emprestimo
app.get('/emprestimos', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM emprestimo');
    res.json(rows);
});

app.post('/emprestimos', async (req, res) => {
    const { idlivro, idcliente } = req.body;
    const { rows } = await pool.query(
        'INSERT INTO emprestimo (idlivro, idcliente) VALUES ($1, $2) RETURNING *',
        [idlivro, idcliente]
    );
    res.status(201).json(rows[0]);
});

app.delete('/emprestimos/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM emprestimo WHERE id_emprestimo=$1', [id]);
    res.sendStatus(204);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
