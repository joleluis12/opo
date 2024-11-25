const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de conexión a MySQL
const connection = mysql.createConnection({
  host: '62.72.50.242',
  user: 'u990150337_barbitas', 
  password: 'Barbitas1987@', 
  database: 'u990150337_BARBITAS', 
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Ruta para obtener todas las llantas
app.get('/llantas', (req, res) => {
  const query = 'SELECT * FROM llantas';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener las llantas' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron llantas' });
    }
    res.status(200).json(results);
  });
});

// Ruta para agregar una nueva llanta
app.post('/llantas', (req, res) => {
  const { medida, stock, r } = req.body;
  const query = 'INSERT INTO llantas (medida, stock, r) VALUES (?, ?, ?)';
  connection.query(query, [medida, stock, r], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al agregar la llanta' });
    }
    res.status(201).json({ message: 'Llanta agregada correctamente', id: results.insertId });
  });
});

// Ruta para actualizar una llanta existente
app.put('/llantas/:id', (req, res) => {
  const { id } = req.params;
  const { medida, stock, r } = req.body;
  const query = 'UPDATE llantas SET medida = ?, stock = ?, r = ? WHERE id = ?';
  connection.query(query, [medida, stock, r, id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al actualizar la llanta' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Llanta no encontrada' });
    }
    res.status(200).json({ message: 'Llanta actualizada correctamente' });
  });
});

// Ruta para eliminar una llanta
app.delete('/llantas/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM llantas WHERE id = ?';
  connection.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al eliminar la llanta' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Llanta no encontrada' });
    }
    res.status(200).json({ message: 'Llanta eliminada correctamente' });
  });
});

// Ruta para autenticación de usuario (inicio de sesión)
app.post('/usuarios', (req, res) => {
  const { nombre, contrasena } = req.body;
  const query = 'SELECT * FROM usuarios WHERE nombre = ? AND contrasena = ?';
  connection.query(query, [nombre, contrasena], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (results.length > 0) {
      res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado o contraseña incorrecta' });
    }
  });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
