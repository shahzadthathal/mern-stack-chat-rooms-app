var express = require('express');
var router = express.Router();
const { check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const jwtSecret = 'define-in-constants'
const Services = require('../services');
const auth = require("../middleware/auth")
const hlpers = require("../lib/helpers")
const async  = require('async');
const models = require("../models");


/**
 * @method - GET
 * @param - /
 * @description - Join Room
 */

router.get("/messages/:roomId", async (req, res, next) => {
    try {
        const roomId = req.params.roomId;
        Services.RoomSrvc.messages(roomId)
        .then((messages) => {
            async.forEach(messages, function(message, next){
                 models.UserModel.findById(message.author_id,['_id','username','is_online','image'], (err,user)=>{
                    if(user){
                        message.author.username = user.username;
                        message.author.is_online = user.is_online;
                        message.author.image = user.image;
                        next();
                    }else{
                        next();
                    }
                })
            },function(err){
               res.send(messages);
            });            
        })
        .catch((err)=>{
            res.send([]);
        })
    } catch (error) {
        res.send([]);
    }
});


/**
 * @method - POST
 * @param - /detail
 * @description - Detail Room
 */
router.post("/detail", auth,
    [
        check('roomId', "Please select room").not().isEmpty(),
    ], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
            const roomId = req.body.roomId;
            const userId = req.user.id;
            Services.RoomSrvc.detail(roomId)
            .then((room) => {
                res.status(200).json(room);
            }).catch((err)=>{
                console.log(err)
                res.status(500).json({ error: err });
            })
        } catch (e) {
          res.status(500).send({ message: "Error in Fetching rooms.." });
        }
    });

/**
 * @method - POST
 * @param - /join
 * @description - Join Room
 */
router.post("/join", auth,
    [
        check('roomId', "Please select room").not().isEmpty(),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const roomId = req.body.roomId;
        const userId = req.user.id;
        res.status(200).json(roomId);
});

/**
 * @method - GET
 * @param - /list
 * @description - Room list
 */
router.get('/list', function(req, res, next) {
    try {
      Services.RoomSrvc.list()
        .then((rooms) => {
            res.status(200).json(rooms);
        }).catch((err)=>{
            console.log(err)
            res.status(203).json({ error: err });
        })
    } catch (e) {
      res.status(203).send({ message: "Error in Fetching rooms.." });
    }
});

/**
 * @method - POST
 * @param - /create
 * @description - Create Room
 */
router.post("/create", auth,
    [
    	check('name', "Please enter a valid name").not().isEmpty(),
        check("name", "Please enter minimum 3 characters.").isLength({
            min: 3
        })
    ], async (req, res) => {

    	const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
    	const data = {
    		name: req.body.name,
    		unique_name: hlpers.slugify(req.body.name),
    		creator_id: req.user.id,
    	}
    	Services.RoomSrvc.create(data)
	 	.then((room) => {
	 		res.status(200).json(room);
	 	}).catch((err)=>{
	 		console.log(err)
		 	res.status(500).json({ error: err });
		})
});

module.exports = router;
