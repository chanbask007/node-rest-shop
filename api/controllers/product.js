const Product= require('../models/product');
const mongoose= require('mongoose'); 

exports.products_get_all= (req, res, next) => {
    Product.find()
    .select('__id name price productImage')
    .exec()
    .then(docs=>{
        const response={
             const: docs.length,
             products: docs.map(doc=>{
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3001/products/'+doc._id
                    }

                }
             })        
        }
        console.log(response);
        res.status(200).json(response);
    })
    .catch(error=>{
        console.log(error);
        res.status(500).json(error);
    })
}

exports.product_create_product= (req, res, next) => {

    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save()
        
        .then(result =>
            {
                console.log(result);
                if(result){
                    
                    res.status(201).json({
                        message: 'product created successfully..!!',
                        createdProduct: {
                            name: result.name,
                            price: result.price,
                            _id:result._id,
                            request: {
                                type:'GET',
                                url: 'http://localhost:3001/products/'+result._id
                            }
                        }
                    });
                }
                else{
                    res.status(500).json({
                        message: result
                    })
                }
            }
        )
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errror: error
            })
        })


}

exports.product_get_product= (req, res, next) => {
    id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            // console.log(doc);
            // res.status(200).json(doc);

            if (doc) {
                console.log(doc);
                res.status(200).json({
                    product: doc,
                    request:{
                        type : 'GET',
                        url:'http://localhost:3001/products'
                    }
                });
            }
            else {
                res.status(404).json({
                    message: "No data found..!!"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: error })
            //res.status(500).json({error: error});
        })
}

exports.products_update_product=(req,res,next)=>{
    const id=req.params.productId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }

    Product.update({_id:id},{$set:updateOps})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message: 'product updated',
            request:{
                type: 'GET',
                url: 'http://localhost:3001/products/'+id
            }
        });
    })
    .catch(error=>{
        console.log(error);
        res.status(500).json(error);
    })
}

exports.product_delete= (req,res,next)=>{
    const id= req.params.productId;
   Product.remove({_id:id})
   .exec()
   .then(result=>{
       console.log(result);
       res.status(200).json({
           message: 'product deleted successfully..!!',
           request:{
               type:'POST',
               url:'http://localhost:3001/products',
               body:{
                   name: 'String',
                   price: 'Number'
               }
           }
       });
   })
   .catch(error=>{
       console.log(error);
       res.status(500).json(error);
   })
    
}