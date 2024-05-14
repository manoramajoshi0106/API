const orderModel = require("../models/Order")
class OrderController {
    static newOrder = async (req, res) => {
        try {
            console.log(req.body)
            const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
            const order = await orderModel.create({
                shippingInfo,
                orderItems,
                paymentInfo,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paidAt: Date.now(),
                user: req.data1._id

            })
            res
                .status(201)
                .json({ status: "success", message: "Order added Successfully 😃🍻", order });
        } catch (err) {
            console.log(err)
            res.status(400).json({ status: "failed ", message: err.message })

        }

    }
}
module.exports = OrderController;