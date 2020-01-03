const User= require('../models/user');
const mongoose= require('mongoose')
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');

exports.login=(req,res,next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(404).json({
                message: 'Auth Failed.!'
            })
        }

        bcrypt.compare(req.body.password,user[0].password,(err, result)=>{
            if(err){
                return res.status(404).json({
                    message: 'Auth Failed'
                })
            }

            if(result){
                const token= jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                )
                res.status(200).json({
                    message: 'Auth Successfull.!',
                    token: token
                })
            }

            else{
                res.status(404).json({
                message: "Auth Failed.!"
            })}
        })
    })
    .catch(err=>{
        res.status(404).json({
            error: err
        })
    })
}

exports.signup=(req,res,next)=>{

    User.find({email: req.body.email})
    .exec()
    .then(user=>{
        if(user.length>=1){ 
            return res.status(409).json({
                message: 'mail already exists'
            })
        }

        else{

            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    res.status(500).json({
                        error: err
                    })
                }
                else{
    
                    const user= new User({
                        _id: new mongoose.Types.ObjectId,
                        email: req.body.email,
                        password: hash
                    });
    
                    user.save()
                    .then(result=>{
                        console.log(result);
                        res.status(201).json({
                            message:'user created'
                        })
                    })
                    .catch(err=>{
                        res.status(500).json({
                            error: err
                        })
                    })
    
                }
            })

        }
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        })
    })
}

exports.user_delete=(req,res,next)=>{
    User.remove({_id: req.params.userId})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message: 'User Deleted'
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
        error: err
        })
    })
}