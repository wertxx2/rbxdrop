const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect('mongodb://wertx:pp0g6msiM3aqgCmw@ac-wtueeni-shard-00-00.kfbx1sk.mongodb.net:27017,ac-wtueeni-shard-00-01.kfbx1sk.mongodb.net:27017,ac-wtueeni-shard-00-02.kfbx1sk.mongodb.net:27017/?ssl=true&replicaSet=atlas-mf0byu-shard-0&authSource=admin&appName=rbxdrop')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const OrderSchema = new mongoose.Schema({
    username: String,
    robux: Number,
    price: Number,
    status: { type: String, default: 'pending' }
});

const Order = mongoose.model('Order', OrderSchema);

// СОЗДАТЬ ЗАКАЗ
app.post('/api/order', async (req, res) => {
    console.log('ORDER:', req.body);

    const order = new Order(req.body);
    await order.save();

    res.json({ success: true });
});

// ПОЛУЧИТЬ ЗАКАЗЫ (АДМИНКА)
app.get('/api/orders', async (req, res) => {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(orders);
});

app.listen(3000, () => {
    console.log('SERVER STARTED');
});











// pp0g6msiM3aqgCmw