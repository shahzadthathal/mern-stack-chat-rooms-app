
const Services = require('../services');
const jwt 	= require('jsonwebtoken');
const secret 	= 'define-in-constants';

class UserController {

	async register(req, res){
		Services.user.create(req.body)
	 	.then((user) => {
		 	let payload = {
					_id: user._id,
					email: user.email,
					fname: user.fname,
					lname: user.lname,
					role: 1
			};
	        jwt.sign(
	            payload,
	            secret, {
	                expiresIn: 10000
	            },
	            (err, token) => {
	                if (err) throw err;
	                res.status(200).json({
	                    token
	                });
	            }
	        );
		 })
		 .catch((err)=>{
		 	res.status(500).json({ error: error.message });
		 })
	}
}

module.exports = UserController;
