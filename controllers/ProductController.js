const ProductModel = require('../models/Product')

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dzhrxlbh5',
    api_key: '385567545683821',
    api_secret: 'I9X3Bd3-_KAwU9NHwTMO32RL8eI'
});

class ProductController {

    static getallproduct = async (req, res) => {
        try {
            const product = await ProductModel.find()
            //console.log(category);
            res.status(201).json({
                status: "success",
                message: "successfull",
                product,
            });
        } catch (error) {
            console.log(error)
        }
    }

    static createproduct = async (req, res) => {
        try {
            const { name, description, price, image, category, stock } = req.body
            const file = req.files.image
            
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'productimageApi'
            })
            const result = new ProductModel({
                name: name,
                description: description,
                price: price,
                category: category,
                stock: stock,
                image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url
                }
            })
            await result.save()
            res.status(201).json({
                status: "success",
                message: "Product Inserted Successfully 😃🍻",
            });

        } catch (error) {
            console.log(error);
        }
    }

    static getallproductdetail = async (req, res) => {
        try {
            //    console.log(req.params.id);
            const product = await ProductModel.findById(req.params.id)
            res.status(201).json({
                status: 'success',
                message: 'successfull',
                product,
            })
        } catch (error) {
            console.log(error);
        }
    }

    static updateproduct = async (req, res) => {
        try {
            // console.log(req.params.id);
            const { name, description, price, image, category, stock } = req.body
            if (req.files) {
                // console.log(req.params.id);
                const product = await ProductModel.findById(req.params.id)
                // console.log(product);
                const imageid = product.image.public_id
                // console.log(imageid);
                await cloudinary.uploader.destroy(imageid)
                const file = req.files.image
                const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'productimageApi'
                })
                var data = {
                    name: name,
                    description: description,
                    price: price,
                    category: category,
                    stock: stock,
                    image: {
                        public_id: imageUpload.public_id,
                        url: imageUpload.secure_url

                    }

                }

            } else {
                var data = {
                    name: name,
                    description: description,
                    price: price,
                    category: category,
                    stock: stock
                }
            }
            const update = await ProductModel.findByIdAndUpdate(req.params.id, data)
            res.status(201).json({
                status: 'success',
                message: 'successfull',
                update,
            })
        } catch (error) {
            console.log(error);
        }
    }

    static productdelete = async (req, res) => {
        try {
            await ProductModel.findByIdAndDelete(req.params.id)
            res.status(201).json({
                status: 'success',
                message: 'Delete Successfully',
            })
        } catch (error) {
            console.log(error);
        }
    }
}



module.exports = ProductController