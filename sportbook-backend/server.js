const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const authRoutes = require('./routes/auth');
const terrainsRoutes = require('./routes/terrains');
const reservationsRoutes = require('./routes/reservations');
const paiementsRoutes = require('./routes/paiements');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/terrains', terrainsRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/paiements', paiementsRoutes);

app.get('/', (req, res) => {
  res.send('API SportBook en ligne');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Connexion à PostgreSQL réussie',
      time: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur de connexion à PostgreSQL',
      error: error.message
    });
  }
});

app.get('/tables', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/utilisateurs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nom, email, role FROM utilisateurs ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/terrains-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM terrains ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/creneaux-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM creneaux ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/auth', authRoutes);

app.get('/profil', authMiddleware, (req, res) => {
  res.json({
    message: 'Accès autorisé',
    user: req.user
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});