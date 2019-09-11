const express = require('express');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');

const items = require('./routes/api/items');
const audits = require('./routes/api/audits');

const app = express();

//Parser Middleware
app.use(express.json());

//DB Config
const db = require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected....'))
    .catch(err => console.log(err));

//use routes
app.use('/api/items', items);
app.use('/api/audits', audits);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
