const CategoryModel = require('../models/Category');
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')


const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dzhrxlbh5',
    api_key: '385567545683821',
    api_secret: 'I9X3Bd3-_KAwU9NHwTMO32RL8eI'
});

class CategoryController {
    static categoryinsert = async (req, res) => {
        try {
            const { cname, image } = req.body
            const file = req.files.image
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'categoryImageapi'
            })
            const result = new CategoryModel({
                cname: cname,
                image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url,
                }
            })
            await result.save()
            res.status(201).json({
                status: "success",
                message: "Category Inserted Successfully",
            });
        } catch (error) {
            console.log(error)
        }
    }

    static categorydisplay = async (req, res) => {
        try {
            const category = await CategoryModel.find()
            //console.log(category);
            res.status(201).json({
                status: 'success',
                message: 'successful',
                category,
            })
        } catch (error) {
            console.log(error);
        }
    }

    static categoryview = async (req, res) => {
        try {
            console.log(req.params.id);
            const category = await CategoryModel.findById(req.params.id)
            res.status(201).json({
                status: 'success',
                message: 'successful',
                category,
            })
        } catch (error) {
            console.log(error);
        }
    }

    static categoryupdate = async (req, res) => {
        try {
            if (req.files) {
                //console.log(req.params.id);
                const { cname, image } = req.body
                const category = await CategoryModel.findById(req.params.id)
                const imageid = category.image.public_id
                //console.log(imageid);
                await cloudinary.uploader.destroy(imageid)
                const file = req.files.image
                const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'categoryImageapi'
                })
                //updateCode
                const update = await CategoryModel.findByIdAndUpdate(req.params.id, {
                    cname: req.body.cname,
                    image: {
                        public_id: imageUpload.public_id,
                        url: imageUpload.secure_url,
                    },
                })
                await update.save()
                res.status(201).json({
                    status: "success",
                    message: "Category Update Successfully",
                });
            } else {

            }

        } catch (error) {
            console.log(error);
        }
    }

    static categorydelete = async (req, res) => {
        try {
            await CategoryModel.findByIdAndDelete(req.params.id)
            res.status(201).json({
                status: 'success',
                message: 'Category Delete sucessfully',
            })
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = CategoryController