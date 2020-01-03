const express= require('express');
const router=  express.Router();
const checkAuth= require('../middleware/check-auth');

const User= require('../models/user');



const UserController= require('../controllers/user');

router.post('/signup',UserController.signup);

router.post('/login',UserController.login);





router.delete('/:userId',checkAuth,UserController.user_delete);




module.exports = router;