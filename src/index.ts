import express from 'express';
import pool from './db';
import createTables from './createTables';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
app.use(express.json());

// Inicializa tabelas
createTables().then(() => console.log('Tabelas criadas')).catch(console.error);

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Biblioteca',
            version: '1.0.0',
            description: 'Documentação da API de Livros, Clientes e Empréstimos',
        },
    },
    apis: ['./src/index.ts'], // Pode ser ajustado para outros arquivos
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Livro:
 *       type: object
 *       properties:
 *         id_livro:
 *           type: integer
 *         autor:
 *           type: string
 *         data_publicacao:
 *           type: string
 *           format: date
 *         titulo:
 *           type: string
 *     Cliente:
 *       type: object
 *       properties:
 *         id_cliente:
 *           type: integer
 *         email:
 *           type: string
 *         telefone:
 *           type: string
 *         cpf:
 *           type: string
 *     Emprestimo:
 *       type: object
 *       properties:
 *         id_emprestimo:
 *           type: integer
 *         idlivro:
 *           type: integer
 *         idcliente:
 *           type: integer
 */

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Lista todos os livros
 *     responses:
 *       200:
 *         description: Lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livro'
 *   post:
 *     summary: Cria um novo livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livro'
 *     responses:
 *       201:
 *         description: Livro criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 */

/**
 * @swagger
 * /livros/{id}:
 *   put:
 *     summary: Atualiza um livro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livro'
 *     responses:
 *       200:
 *         description: Livro atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *   delete:
 *     summary: Remove um livro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Livro removido
 */

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

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *   post:
 *     summary: Cria um novo cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 */

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *   delete:
 *     summary: Remove um cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cliente removido
 */


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

/**
 * @swagger
 * /emprestimos:
 *   get:
 *     summary: Lista todos os empréstimos
 *     responses:
 *       200:
 *         description: Lista de empréstimos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Emprestimo'
 *   post:
 *     summary: Cria um novo empréstimo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Emprestimo'
 *     responses:
 *       201:
 *         description: Empréstimo criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Emprestimo'
 */

/**
 * @swagger
 * /emprestimos/{id}:
 *   delete:
 *     summary: Remove um empréstimo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Empréstimo removido
 */

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

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Lista todos os livros
 *     responses:
 *       200:
 *         description: Lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livro'
 *   post:
 *     summary: Cria um novo livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livro'
 *     responses:
 *       201:
 *         description: Livro criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 */

/**
 * @swagger
 * /livros/{id}:
 *   put:
 *     summary: Atualiza um livro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livro'
 *     responses:
 *       200:
 *         description: Livro atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *   delete:
 *     summary: Remove um livro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Livro removido
 */

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
    console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
});
