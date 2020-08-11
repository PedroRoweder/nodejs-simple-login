const express = require("express");
const router = express.Router();
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));
router.get("/register", forwardAuthenticated, (req, res) =>
	res.render("register")
);

router.post("/register", (req, res) => {
	const { name, email, password, confirmPassword } = req.body;
	let errors = [];

	if (!name || !email || !password || !confirmPassword) {
		errors.push({ msg: "Please fill all fields" });
	}

	if (password !== confirmPassword) {
		errors.push({ msg: "Passwords dont match" });
	}

	if (password.length < 8) {
		errors.push({ msg: "Your password must be at least 8 characters long" });
	}

	if (errors.length > 0) {
		res.render("register", {
			errors,
			name,
			email,
			password,
			confirmPassword,
		});
	} else {
		User.findOne({ email }).then((user) => {
			if (user) {
				errors.push({ msg: "This email already exists" });
				res.render("register", {
					errors,
					name,
					email,
					password,
					confirmPassword,
				});
			} else {
				const newUser = User({ name, email, password });
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then(() => {
								req.flash("success_msg", "Your account has been created.");
								res.redirect("/user/login");
							})
							.catch((err) => console.log(err));
					});
				});
			}
		});
	}
});

// Login using Passport
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/user/login",
		failureFlash: true,
	})(req, res, next);
});

// Logout using Passport
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "You are logged out");
	res.redirect("/user/login");
});

module.exports = router;
