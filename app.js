const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./src/routes/auth');
const postsRoute = require('./src/routes/posts');

dotenv.config();

const DB = process.env.DB;
const PORT = process.env.PORT || 3000;

const app = express();

mongoose.connect(DB, { useNewUrlParser: true }, () => console.log('database connected'));



app.use(express.json());

app.use('/api/user', authRoute);

app.use('/api/posts', postsRoute);

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
