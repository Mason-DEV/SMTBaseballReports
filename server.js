const express = require('express');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

//const items = require('./routes/api/items');
const audits = require('./routes/api/audits');

const app = express();

//Parser Middleware
app.use(cors());
app.use(express.json());

//DB Config
const db = require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected....'))
    .catch(err => console.log(err));

//use routes
//app.use('/api/items', items);
app.use('/api/audits', audits);

// Server static assests if in prod
if(process.env.NODE_ENV === 'production') {
    //set Static folder
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
        
    })
}

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
