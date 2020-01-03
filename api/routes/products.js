const express = require('express');
const router = express.Router();
const Product = require('./../models/product');
const mongoose = require('mongoose');
const multer =  require('multer');
const checkAuth= require('../middleware/check-auth');
const ProductController= require('../controllers/product');


const storage= multer.diskStorage({
    destination: function(req, file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter= (req,file,cb)=>{
    if(file.mimetype=='image/jpeg'|| file.mimetype==='image/png'||file.mimetype==='image/jpg'){
       cb(null,true)     
    }
    else{
        cb(null,false);
    }
}

const upload= multer({storage: storage, limits:{
    fileSize: 1024*1024*5
},
fileFilter: fileFilter
});

router.get('/',ProductController.products_get_all);

router.post('/',checkAuth,upload.single('productImage'),ProductController.product_create_product);

router.get('/:productId', ProductController.product_get_product);

router.delete('/:productId',checkAuth,ProductController.product_delete);

router.patch('/:productId',ProductController.products_update_product)


module.exports = router;