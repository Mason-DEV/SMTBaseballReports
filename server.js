const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
//DB Config
const db = require("./config/keys").mongoURI;
const secret = require("./config/keys").SECERT_OR_KEY;

//Auth
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require("jsonwebtoken");

//const items = require('./routes/api/items');
const audits = require("./routes/api/audits");
const User = require("./routes/api/user");

//User Model
const UserModel = require("./models/User");

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: secret
};

var strategy = new JwtStrategy(opts, function(jwt_payload, next) {
    var user = UserModel.findOne({ id: jwt_payload.id });
	if (user) {
		next(null, user);
	} else {
		next(null, false);
	}
});

passport.use(strategy);

const app = express();

//Parser Middleware
app.use(passport.initialize());

app.use(cors());
app.use(express.json());

app.post("/getToken", function(req, res) {
    console.log(req.body.username);
	UserModel.findOne({ username: req.body.username }, function(err, user) {
        if(!user){
            //User trys to log in with invalid username
            return res.status(401).json({ message: "no user" });
        }
		if (!user.validPassword(req.body.password)) {
			return res.status(401).json({ message: "passwords did not match" });
		} else {
			var payload = { id: user.id };
			var token = jwt.sign(payload, opts.secretOrKey);
			res.send(token);
		}
	}).catch(err => {
		return res.status(401).send({ err: err });
	});
});

app.get('/getUser', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.body.username);
  });


app.get("/protected", passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res.send("Protected!");
	}
);

//Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("MongoDB Connected...."))
	.catch(err => console.log(err));

//use routes
// app.use("/api/audits", passport.authenticate("jwt", { session: false }), audits);
app.use("/api/audits", audits);
app.use("/api/user", User);

// Server static assests if in prod
if (process.env.NODE_ENV === "production") {
	//set Static folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
