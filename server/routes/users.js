var express = require('express');
var router = express.Router();
const { check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
let constants = require('../config/constants');
const Services = require('../services');
const auth = require("../middleware/auth")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * @method - POST
 * @param - /update
 * @description - Update User
 */
router.post(
    "/update", auth,
    [
      check('full_name', "Please Enter a Valid Name").not().isEmpty(),
    ],
    async (req, res) => {
        try {
            const userId = req.user.id;
            const data = {
                full_name: req.body.full_name,
            }
            Services.UserSrvc.update(userId, data)
            .then((user) => {
                res.status(200).json(user);
            }).catch((err)=>{
                res.status(500).json({ error: err });
            })
        } catch (e) {
          res.status(500).send({ message: "Error in Fetching user" });
        }   
    })

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /user/me
 */
router.get("/me", auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      Services.UserSrvc.getUser(req.user.id)
	 	.then((user) => {
	 		res.status(200).json(user);
	 	}).catch((err)=>{
		 	res.status(500).json({ error: err });
		})
    } catch (e) {
      res.status(500).send({ message: "Error in Fetching user" });
    }
  });


/**
 * @method - POST
 * @param - /login
 * @description - User Login
 */
router.post(
    "/login",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 6
      })
    ],
    async (req, res) => {
    	const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
			  errors: errors.array()
			});
		}
    	const data = {
            email: req.body.email,
            password: req.body.password
    	}
    	Services.UserSrvc.login(data)
	 	.then((user) => {
	 		const payload = {
                user: {
                    id: user.id
                }
            };
	 		jwt.sign(
                payload,
                constants.JWT_SECRET, {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token,
                        userId:user.id
                    });
                }
            );
	 	}).catch((err)=>{
	 		res.status(500).json({ error: err });
		})

    }
  );
/**
 * @method - POST
 * @param - /register
 * @description - User SignUp
 */
router.post("/register", 
    [
    	check('username', "Please Enter a Valid username").not().isEmpty(),
        check('full_name', "Please Enter a Valid Name").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ], async (req, res) => {
    	const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(203).json({
                errors: errors.array()
            });
        }
    	const data = {
    		username: req.body.username,
    		full_name: req.body.full_name,
            email: req.body.email,
            password: req.body.password
    	}
    	Services.UserSrvc.create(data)
	 	.then((user) => {
	 		const payload = {
                 user: {
                    id: user.id
                }
            };
	 		jwt.sign(
                payload,
                constants.JWT_SECRET, {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );

	 	}).catch((err)=>{
		 	res.status(203).json({ error: err });
		})
});

module.exports = router;
