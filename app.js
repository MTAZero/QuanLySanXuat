var express = require('express');
var app = express();
var db = require('./db');

global.__root   = __dirname + '/'; 

var UserController = require('./entity/user/UserController');
app.use('/users', UserController);

var AuthController = require('./auth/AuthController');
app.use('/auth', AuthController);

var MaterialController = require('./entity/material/materialController');
app.use('/material', MaterialController);

var ProductController = require('./entity/product/productController');
app.use("/product",ProductController);

var ProductMaterialController = require('./entity/product_masterial/product_materialController');
app.use("/product_material", ProductMaterialController);

var EnterCouponController = require("./entity/enter_coupon/enter_couponController");
app.use("/enter_coupon", EnterCouponController);

var  EnterCouponDetailController = require("./entity/enter_coupon_detail/enter_coupon_detailController");
app.use("/enter_coupon_detail", EnterCouponDetailController);

var OrderController = require("./entity/order/orderController");
app.use("/order", OrderController);

var WorkProgressController = require("./entity/work_progress/work_progressController");
app.use("/work_progress", WorkProgressController);

module.exports = app;