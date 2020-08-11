const flash = require("connect-flash");
const session = require("express-session");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/keys").mongoConnection;

const app = express();
require("./config/passport")(passport);

app.use(express.urlencoded({ extended: true }));
// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("MongoDB connection established..."))
	.catch((err) => console.log(err));

// Session
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
// Flash
app.use(flash());
// Messages
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});
const PORT = process.env.PORT || 5000;

app.use("/", require("./routes/index.js"));
app.use("/user", require("./routes/user.js"));

app.listen(PORT, console.log(`App running at port ${PORT}...`));
