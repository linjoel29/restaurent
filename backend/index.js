const dns = require('dns');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

app.use(cors());
app.use(express.json());

const menuRoutes = require('./routes/menu');
app.use('/api/menu', menuRoutes);

const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log('MongoDB connected!');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB error:', err);
    process.exit(1);
  });