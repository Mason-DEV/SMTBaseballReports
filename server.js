const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
//DB Config
const db = require("./config/keys").mongoURI;
const secret = require("./config/keys").SECERT_OR_KEY;
//Logger import
const logger = require('./config/logger');
//Routes
const audits = require("./routes/api/audits");
const User = require("./routes/api/user");
const Logger = require("./routes/api/logger");
const Staff = require("./routes/api/staff");
const PFxTech = require("./routes/api/pfxTech");
//Models
const UserModel = require("./models/User");

//Authentication
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require("jsonwebtoken");
const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: secret,
	belongsTo: ExtractJwt.fromHeader()
};

var strategy = new JwtStrategy(opts, function(jwt_payload, next) {
    var user = UserModel.findOne({ id: jwt_payload.id, permission: jwt_payload.permission });
	if (user) {
		next(null, user);
	} else {
		next(null, false);
	}
});

//Apply strategy
passport.use(strategy);

const app = express();

//Middleware
app.use(passport.initialize());
app.use(cors());
app.use(express.json());

//Authentication generation API for user
app.post("/getToken", function(req, res) {
	UserModel.findOne({ username: req.body.username }, function(err, user) {
        if(!user){
            //User trys to log in with invalid username
			logger.warn("Invalid user attempt in /getToken");
			return res.status(401).json({ message: "Invalid User"});
        }
		if (!user.validPassword(req.body.password)) {
			//User password was incorrect
			logger.warn("Invalid password attempt in /getToken");
			return res.status(401).json({ message: "Invalid User"});
		} else {
			var payload = {id:user.username, permission: user.permission };
			var token = jwt.sign(payload, opts.secretOrKey);
			logger.info("Token generated " + JSON.stringify(payload) +" "+token);
			res.send({token, payload});
		}
	}).catch(err => {
		return res.status(401).send({ err: err });
	});
});

//Authentication API returns the user who created the given token
app.get('/getUser', passport.authenticate('jwt', { session: false }), (req, res) => {
	console.log(req.user);
	res.send(req.user._conditions);
  });


//Connection to MongoDB
mongoose.Promise = global.Promise;
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => logger.info("MongoDB Connected...."))
	.catch(err => logger.error("Error connecting to MongoDB " +err.stack));

//Use Routes
// app.use("/api/audits", passport.authenticate("jwt", { session: false }), audits);
app.use("/api/audits", audits);
app.use("/api/user", User);
app.use("/api/", Logger);
app.use("/api/staff", Staff);
app.use("/api/pfxTech", PFxTech);


//Server static assests if in prod
if (process.env.NODE_ENV === "production") {
	//set Static folder
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}


//Port Decleration
const port = process.env.PORT || 5000;
app.listen(port, () => logger.info(`Server started on port ${port}`));
