import Order from "../models/order.model.js";
export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find({}); // find all orders
		res.json({ orders });
	} catch (error) {
		console.log("Error in getAllOrders controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteOrders = async (req, res) => {
    try{
        const orders = await Order.findById(req.params.id);
        if (!orders) {
            return res.status(404).json({ message: "Order not found" });
        }
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted successfully" });
    }
    catch (error){
        console.log("Error in deleteOrders controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
    }
}