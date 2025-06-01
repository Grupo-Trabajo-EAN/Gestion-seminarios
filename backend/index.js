
const db = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // admin login
  if (username === 'admin' && password === '123456') {
    return res.json({ success: true, role: 'admin' });
  }

  // estudiantes login
  const query = 'SELECT * FROM estudiantes WHERE username = ? AND password = ?';
  console.log('Username:', username);
  console.log('Password:', password);
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error during estudiante login:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (results.length === 1) {
      const client = results[0];
      return res.json({
        success: true,
        role: 'estudiante',
        clientId: client.cliente_id,
        nombre: client.nombre,
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});


const estudianteRoutes = require('./routes/estudiantes');
app.use('/api/estudiantes', estudianteRoutes);


const profesoresRoutes = require('./routes/profesores');
app.use('/api/profesores', profesoresRoutes);

const metodologiasRoutes = require('./routes/metodologias');
app.use('/api/metodologias', metodologiasRoutes);


const gruposInvestigacionRoutes = require('./routes/gruposInvestigacion');
app.use('/api/grupos-investigacion', gruposInvestigacionRoutes);

const semillerosRoutes = require('./routes/semilleros');
app.use('/api/semilleros', semillerosRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
