const orderService = require("../services/order.service");

exports.createOrder = async(req,res)=>{

try{

const order = await orderService.createOrder(
req.user.id,
req.body
);

res.json(order);

}catch(err){

res.status(500).json({message:err.message});

}

};

exports.getMyOrders = async(req,res)=>{

try{

const orders = await orderService.getMyOrders(req.user.id);

res.json(orders);

}catch(err){

res.status(500).json({message:err.message});

}

};

exports.getOrderDetail = async(req,res)=>{

try{

const order = await orderService.getOrderDetail(req.params.code);

res.json(order);

}catch(err){

res.status(500).json({message:err.message});

}

};

exports.updateOrderStatus = async(req,res)=>{

try{

const result = await orderService.updateOrderStatus(
req.params.code,
req.body.status,
req.user.id
);

res.json(result);

}catch(err){

res.status(500).json({message:err.message});

}

};

exports.getAllOrders = async(req,res)=>{

try{

const orders = await orderService.getAllOrders()

res.json(orders)

}catch(err){

res.status(500).json({message:err.message})

}

}