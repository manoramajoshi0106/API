const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router()
const checkauth = require('../middleware/auth')
const CategoryController = require('../controllers/CategoryController')
const ProductController = require('../controllers/ProductController')
const PaymentController = require('../controllers/PaymentController')
const OrderController = require('../controllers/OrderController')



//usercontroller
router.get('/getalluser',UserController.getalluser)
router.post('/userinsert',UserController.userinsert)
router.post('/verifylogin',UserController.verifyLogin)
router.post('/updatepassword',checkauth,UserController.updatePassword)
router.post('/updateprofile',checkauth,UserController.updateProfile)
router.get('/me',checkauth,UserController.getuserDetails)
router.post('/getsingleuser',UserController.getsingleUser)
router.post('/deleteuser',UserController.deleteUser)
router.get('/logout', UserController.logOut)

//categorycontroller
router.post('/categoryinsert',CategoryController.categoryinsert)
router.get('/categorydisplay',CategoryController.categorydisplay)
router.get('/categoryview/:id',CategoryController.categoryview)
router.post('/categoryupdate/:id',CategoryController.categoryupdate)
router.post('/categorydelete/:id',CategoryController.categorydelete)

//productcontroller
router.get('/getallproduct',ProductController.getallproduct)
router.post('/createproduct', ProductController.createproduct)
router.get('/getallproductdetail/:id',ProductController.getallproductdetail)
router.post('/updateproduct/:id',ProductController.updateproduct)
router.post('/productdelete/:id',ProductController.productdelete)

// paymentController
router.post('/payment/process', PaymentController.processPayment)
router.get('/stripeapiKey', PaymentController.sendStripeApiKey)

// ordercontroller
router.post('/order/create',checkauth, OrderController.newOrder)












module.exports = router