const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
//DB Config
const db = require("./config/keys").mongoURI;
const db_LOCAL = require("./config/keys").mongoURI_LOCAL;
const secret = require("./config/keys").SECERT_OR_KEY;
//Logger import
const logger = require('./config/logger');
//Routes
const User = require("./routes/api/user");
const Logger = require("./routes/api/logger");
const Staff = require("./routes/api/staff");
const Venue = require("./routes/api/venue");
const Settings = require("./routes/api/settings");
const PFxTech = require("./routes/api/pfxTech");
const FFxTech = require("./routes/api/ffxTech");
const FFxAudit = require("./routes/api/ffxAudit");
const DashData = require("./routes/api/dashData");

//Docment PDF Route
const PfxDailyPdfBuilder = require("./routes/documents/pfxDailyPdfBuilder");
const FfxDailyPdfBuilder = require("./routes/documents/ffxDailyPdfBuilder");
const AuditPdfBuilder = require("./routes/documents/auditPdfBuilder");

//Emailers
const PfxDailyEmailSender = require("./routes/messages/pfxDailyEmailSender");
const AuditEmailSender = require("./routes/messages/auditEmailSender");

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
    var user = UserModel.findOne({ 
		id: jwt_payload.id,
		pfxTechPermission: jwt_payload.pfxTechPermission,
		ffxTechPermission: jwt_payload.ffxTechPermission,
		ffxAuditPermission: jwt_payload.ffxAuditPermission,
		pfxTechDataPermission: jwt_payload.pfxTechDataPermission,
		ffxTechDataPermission: jwt_payload.ffxTechDataPermission,
		ffxAuditDataPermission: jwt_payload.ffxAuditDataPermission,
		extrasPermission: jwt_payload.extrasPermission
	 });
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
			var payload = {
				id:user.username, 
				pfxTechPermission: user.pfxTechPermission,
				ffxTechPermission: user.ffxTechPermission,
				ffxAuditPermission: user.ffxAuditPermission,
				pfxTechDataPermission: user.pfxTechDataPermission,
				ffxTechDataPermission: user.ffxTechDataPermission,
				ffxAuditDataPermission: user.ffxAuditDataPermission,
				extrasPermission: user.extrasPermission
			};
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
	res.send(req.user._conditions);
  });

//Connection to MongoDB
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === "production") {
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, autoReconnect: true})
	.then(() => logger.info("MongoDB Connected...."))
	.catch(err => logger.error("Error connecting to MongoDB " +err));

}else{
	mongoose
	.connect(db_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true, autoReconnect: true})
	.then(() => logger.info("MongoDB_LOCAL Connected...."))
	.catch(err => logger.error("Error connecting to MongoDB_LOCAL " +err));
}




//Use Routes
// app.use("/api/audits", passport.authenticate("jwt", { session: false }), audits);
app.use("/api/user",  passport.authenticate("jwt", { session: false }), User);
app.use("/api/",  passport.authenticate("jwt", { session: false }), Logger);
app.use("/api/staff",  passport.authenticate("jwt", { session: false }), Staff);
app.use("/api/venue",  passport.authenticate("jwt", { session: false }), Venue);
app.use("/api/settings",  passport.authenticate("jwt", { session: false }), Settings);
app.use("/api/pfxTech",   passport.authenticate("jwt", { session: false }), PFxTech);
app.use("/api/ffxTech",  passport.authenticate("jwt", { session: false }), FFxTech);
app.use("/api/ffxAudit", passport.authenticate("jwt", { session: false }), FFxAudit);
app.use("/api/dashData",  passport.authenticate("jwt", { session: false }), DashData);
app.use("/milbAgenda", Agendash(Agenda));

//PDF Routes
app.use("/api/pfxDailyPdfBuilder",  passport.authenticate("jwt", { session: false }), PfxDailyPdfBuilder);
app.use("/api/ffxDailyPdfBuilder",  passport.authenticate("jwt", { session: false }), FfxDailyPdfBuilder);
app.use("/api/auditPdfBuilder",  passport.authenticate("jwt", { session: false }), AuditPdfBuilder);

//Email Routes
app.use("/api/PfxDailyEmailSender",  passport.authenticate("jwt", { session: false }), PfxDailyEmailSender);
app.use("/api/AuditEmailSender",  passport.authenticate("jwt", { session: false }), AuditEmailSender);



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
