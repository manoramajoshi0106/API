const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router()
const checkauth = require('../middleware/auth')



//usercontroller
router.get('/getalluser',UserController.getalluser)
router.post('/userinsert',UserController.userinsert)
router.post('/verifylogin',UserController.verifyLogin)
router.post('/updatepassword',checkauth,UserController.updatePassword)
router.post('/updateprofile',checkauth,UserController.updateProfile)
router.post('/getalluserdetails',UserController.getalluserDetails)
router.post('/getsingleuser',UserController.getsingleUser)
router.post('/deleteuser',UserController.deleteUser)










module.exports = router