const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
//DB Config
const db = require('./config/keys').mongoURI;
const secret = require('./config/keys').SECERT_OR_KEY;

//Auth 
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const app = express();

//const items = require('./routes/api/items');
const audits = require('./routes/api/audits');
const user = require('./routes/api/user');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}


const strategy = new JwtStrategy(opts, (payload, next) => {
    //TODO: Get user from db
    user.forge({id: payload.id}).fetch().then(res =>{

        next(null, res)
    });
});



//Parser Middleware
passport.use(strategy);
app.use(passport.initialize());

app.use(cors());
app.use(express.json());


//Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected....'))
    .catch(err => console.log(err));

//use routes
app.use('/api/audits', audits);
app.use('/api/user', user);

// Server static assests if in prod
if(process.env.NODE_ENV === 'production') {
    //set Static folder
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
        
    })
}


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
