const CategoryModel = require('../models/Category');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dzhrxlbh5',
    api_key: '385567545683821',
    api_secret: 'I9X3Bd3-_KAwU9NHwTMO32RL8eI'
});

class CategoryController {
    static categoryinsert = async (req, res) => {
        try {
            const { cgname, image } = req.body
            const file = req.files.image
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'categoryImageapi'
            })
            const result = new CategoryModel({
                cgname: cgname,
                image:{
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
}

module.exports = CategoryController