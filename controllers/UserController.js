const UserModel = require('../models/User')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken')
cloudinary.config({
    cloud_name: 'dzhrxlbh5',
    api_key: '385567545683821',
    api_secret: 'I9X3Bd3-_KAwU9NHwTMO32RL8eI'
});


class UserController {
    static getalluser = async (req, res) => {
        try {
            const users = await UserModel.find()
            //console.log(user)
            res.status(201).json({
                status: 'success',
                message: 'successfull',
                users,
            })
            // res.send('hello user')
        } catch (error) {
            console.log(error);
        }
    }

    static userinsert = async (req, res) => {
        try {
            //console.log(req.files.image)
            const file = req.files.image
            //UPLOAD FOLDER TO IMAGE CLOUDINARY
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'profileImageapi'
            })
            console.log(imageUpload)
            //console.log(req.body)
            const { n, e, p, cp, } = req.body
            const user = await UserModel.findOne({ email: e })
            console.log(user)
            if (user) {
                res
                    .status(401)
                    .json({ status: "failed", message: "THIS EMAIL IS ALREADY EXITS" });
            } else {
                if (n && e && p && cp) {
                    if (p && cp) {
                        const hashpassword = await bcrypt.hash(p, 10)
                        const result = new UserModel({
                            name: n,
                            email: e,
                            password: hashpassword,
                            image: {
                                public_id: imageUpload.public_id,
                                url: imageUpload.secure_url,
                            },
                        })
                        await result.save()
                        res.status(201).json({
                            status: "success",
                            message: "Registeration Successfully",
                        });
                    } else {
                        res
                            .status(401)
                            .json({ status: "failed", message: "password & confirmpassword does not match" });
                    }
                } else {
                    res
                        .status(401)
                        .json({ status: "failed", message: "all field are required" });
                }
            }



        } catch (error) {
            console.log(error)
        }
    }

    static verifyLogin = async (req, res) => {
        try {
            const { e, p } = req.body
            if (e && p) {
                const user = await UserModel.findOne({ email: e })
                if (user != null) {
                    const isMatched = await bcrypt.compare(p, user.password)
                    if (isMatched) {
                        const token = jwt.sign({ ID: user._id }, 'manu@12345')
                        //console.log(token)
                        res.cookie('token', token)
                        res.status(201).json({
                            status: 'success',
                            message: 'successful',
                            token: token,
                            user,
                        })
                    } else {
                        res
                            .status(401)
                            .json({ status: "failed", message: "email or password is not valid" });
                    }
                } else {
                    res
                        .status(401)
                        .json({ status: "failed", message: "you are not register user" });
                }
            } else {
                res
                    .status(401)
                    .json({ status: "failed", message: "all field required" });
            }
        } catch (error) {
            console.log(error)
        }
    }

    // These three api updatepassword,updateprofile,getuserdetails after user logeed in run
    static updatePassword = async (req, res) => {
        try {
            //console.log('hello',req)
            const { old_password, new_password, cp } = req.body
            if (old_password && new_password && cp) {
                const user = await UserModel.findById(req.data1.id)

                const isMatched = await bcrypt.compare(old_password, user.password)

                if (!isMatched) {
                    res
                        .status(401)
                        .json({ status: "failed", message: "old password is incorrect" });
                } else {
                    if (new_password !== cp) {
                        res
                            .status(401)
                            .json({ status: "failed", message: "  Password and confirm password do not match" });
                    } else {
                        const newhashPassword = await bcrypt.hash(old_password, 10)
                        await UserModel.findByIdAndUpdate(req.data1.id, {
                            $set: { p: newhashPassword }
                        })
                        res.status(201).json({
                            status: 'success',
                            message: 'PASSWORD UPDATED SUCCESSFULLY 😃',

                        })

                    }
                }

            } else {
                return res.status(400).json({
                    status: 'failed',
                    message: 'All fields required',
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    static updateProfile = async (req, res) => {
        try {
            if (req.files) {
                const user = await UserModel.findById(req.data1.id)
                const image_id = user.image.public_id
                //console.log(image_id)
                await cloudinary.uploader.destroy(image_id)
                const file = req.files.image
                const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'profileImageapi',
                    width: 150,
                    crop: 'scale'

                })
                var data = {
                    name: req.body.n,
                    email: req.body.e,
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                }
            } else {
                var data = {
                    name: req.body.n,
                    email: req.body.e,
                }
            }
            //updateCode
            const result = await UserModel.findByIdAndUpdate(req.data1.id, data)
            res.status(200).json({
                success: true,
                message: 'Profile  updated sucessfully',
                result,
            })
        } catch (error) {

        }
    }

    static getuserDetails = async (req, res) => {
        try {
            const { id, n, e } = req.data1
            const user = await UserModel.findById(req.data1.id)
            //console.log('user')
            res.status(201).json({
                status: 'success',
                message: 'successfull',
                user,
            })
            res.send('hello user')
        } catch (error) {

        }
    }

    // adminapi
    static getsingleUser = async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.id)
            res.status(200).json({
                success: true,
                user,
            })
        } catch (error) {
            console.log(error)
        }
    }

    static deleteUser = async (req, res) => {
        try {
            const userDelete = await UserModel.findById(req.params.id)

            if (!userDelete) {
                return res
                    .status(500)
                    .json({ status: '500', message: 'user not !! found  😪  ' })
            }
            // To delete the data from database
            await UserModel.deleteOne(userDelete)

            res.status(200).json({
                status: 'deleted successfully',
                message: '  Successfully user deleted 🥂🍻',
            })
        } catch (err) {
            console.log(err)
        }
    }
    static logOut= async (req,res)=>{
        try {
            res.clearCookie('token')
            res.status(200).json({
                success: true,
                message: "Logged Out",
            });
        } catch (error) {
            console.log(error)
        }
    }


}

module.exports = UserController