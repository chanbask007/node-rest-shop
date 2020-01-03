const Order= require('../models/order');
const Product= require('../models/product');
const mongoose= require('mongoose');

exports.orders_get_all = (req,res,next)=>{
    Order.find().select('_id product quantity')
    .populate('product')
    .exec()
    .then(docs=>{
        const resp={
            count: docs.length,
            orders: docs.map(doc=>{
             return {
                 _id: doc._id,
                 product: doc.product,
                 quantity: doc.quantity,
                 request: {
                     type:'GET',
                     url: 'http://localhost:3001/orders/'+ doc._id
                 }
                }

            })
        }
        res.status(200).json(resp);
    })
    .catch(err=>{
        res.status(500).json({
            error: {
                message: err
            }
        })
    })
}

exports.orders_create_order = (req,res,next)=>{

   
    Product.findById(req.body.productId)
    .then(product=>{

        if(!product){
            return res.status(404).json({
                message: 'product not found.!'
            })
        }

        const order= new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
       return order.save();
    })
        .then(result=>{
            
            console.log(result);
            res.status(200).json({
                message: 'response stored',
                order: {
                    _id: result._id,
                    productId: result.product,
                    quantity: result.quantity
                    
                },
                request:{
                    type:'GET',
                    url:'http://localhost:3001/orders/'+result._id
                }
            })
            
        })
        .catch(err=>{
            res.status(500).json({
                error: err
            })
        })
        
        
    }
    
    exports.orders_get_order= (req,res,next)=>{
        const id= req.params.orderId
        Order.findById(id).select('_id product quantity request')
        .exec()
        .then(order=>{
    
            if(order){
            response= {
                orderDetails:{
                    order: order
                },
                    request: {
                        type:'GET',
                        url:'http://localhost:3001/orders'
                    }           
                }
            
    
            console.log(response);
            res.status(200).json(response);
        
        }
        else{
            res.status(404).json(
                {
                    error: "no data found.!"
                }
            )
        }
        })
    
        .catch(err=>{
            res.status(500).json(
                error = {
                    message: err
                }
            )
        })
    
    }


    exports.orders_delete_order= (req,res,next)=>{
        Order.remove({_id:req.params.orderId})
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'order deleted',
                request:{
                    type: 'POST',
                    url:'http://localhost:3001/orders',
                    body:{
                        product: 'Product Id',
                        quantity:'Number'
                    }
                }
            })
        }
    
        )
        .catch(err=>{
            res.status(500).json(
                error = {
                    message: err
                }
            )
        })
    }