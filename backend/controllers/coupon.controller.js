import { now } from "mongoose";
import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
	try {
		const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
		res.json(coupon || null);
	} catch (error) {
		console.log("Error in getCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(404).json({ message: "Coupon expired" });
		}

		res.json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.log("Error in validateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
// Phần thêm vào
export const getAllCoupons = async (req, res) => {
	try {
		const coupons = await Coupon.find({}); // find all coupons
		res.json({ coupons });
	} catch (error) {
		console.log("Error in getAllcoupons controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteCoupons = async (req, res) => {
    try{
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: "Coupon deleted successfully" });
    }
    catch (error){
        console.log("Error in deleteCoupons controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
    }
}
// Sửa phần này nha DuyAnh
export const createCoupon = async (req, res) => {
	try {
		const { code, discountPercentage, activeDays, userId } = req.body;
		let expirationDate = new Date();
		expirationDate = expirationDate.setDate(expirationDate.getDate()+activeDays);
		const coupon = await Coupon.create({
			code, 
			discountPercentage, 
			expirationDate,
			userId
		});
		res.status(201).json(coupon);
	} catch (error) {
		console.log("Error in createCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};