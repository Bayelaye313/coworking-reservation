const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const colors = require("colors");
require('dotenv').config();
const connectDb = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Routes
const reservationRoutes = require('./routes/reservationRoutes');
app.use('/api/reservations', reservationRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue !' });
});

// Fonction principale pour démarrer le serveur
const server = async () => {
  try {
    await connectDb();

    app.listen(port, () =>
      console.log(`✅ Server started on port ${port}`.green.bold)
    );
  } catch (error) {
    console.error(`❌ Server failed: ${error.message}`.red.bold);
  }
};

server();