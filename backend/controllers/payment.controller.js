import Order from "../models/order.model.js";
import moment from 'moment';
import dotenv from "dotenv";
import querystring from 'qs';
import crypto from "crypto";  
import mongoose from "mongoose";
import User from "../models/user.model.js";
dotenv.config();



export const createPaymentURL = async (req, res) => {
	try{
		process.env.TZ = 'Asia/Ho_Chi_Minh';
    
		let date = new Date();
		let createDate = moment(date).format('YYYYMMDDHHmmss');
		
		let ipAddr = "127.0.0.1";

		let tmnCode = process.env.VNP_TMN_CODE;//"AO1BPVDX";
		let secretKey = process.env.VNP_SECRET; //"DGSXDF0E9ZYSEU6NZLIMM8U071J0ZKI2";
		let vnpUrl = process.env.VNP_URL;//"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
		let returnUrl = "http://localhost:5000/api/payments/return";
		let orderId = moment(date).format('DDHHmmss');
		let amount = req.body["amount"];
		let bankCode = "";

		let locale = 'vn';
		let currCode = 'VND';
		let vnp_Params = {};
		vnp_Params['vnp_Version'] = '2.1.0';
		vnp_Params['vnp_Command'] = 'pay';
		vnp_Params['vnp_TmnCode'] = tmnCode;
		vnp_Params['vnp_Locale'] = locale;
		vnp_Params['vnp_CurrCode'] = currCode;
		vnp_Params['vnp_TxnRef'] = orderId;
		vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho User: ' + req.body["userID"] + ' ' + createDate;
		vnp_Params['vnp_OrderType'] = 'other';
		vnp_Params['vnp_Amount'] = amount * 100;
		vnp_Params['vnp_ReturnUrl'] = returnUrl;
		vnp_Params['vnp_IpAddr'] = ipAddr;
		vnp_Params['vnp_CreateDate'] = createDate;
		if(bankCode !== null && bankCode !== ''){
			vnp_Params['vnp_BankCode'] = bankCode;
		}
		vnp_Params = sortObject(vnp_Params);
		
		let signData = querystring.stringify(vnp_Params, { encode: false });   
		let hmac = crypto.createHmac("sha512", secretKey);
		let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
		vnp_Params['vnp_SecureHash'] = signed;
		vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

		res.send(vnpUrl)
	}
	catch (error){
        console.log("Error in createPaymentURL controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
    }
	

}

export const returnURL = async(req,res) =>{
	try{
		let vnp_Params = req.query;
		let secureHash = vnp_Params['vnp_SecureHash'];
		delete vnp_Params['vnp_SecureHash'];
		delete vnp_Params['vnp_SecureHashType'];
		vnp_Params = sortObject(vnp_Params);


		let tmnCode = process.env.VNP_TMN_CODE;//"AO1BPVDX";
		let secretKey = process.env.VNP_SECRET; //"DGSXDF0E9ZYSEU6NZLIMM8U071J0ZKI2";

		let signData = querystring.stringify(vnp_Params, { encode: false });   
		let hmac = crypto.createHmac("sha512", secretKey);
		let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
		if(secureHash === signed){
			if (req.query['vnp_TransactionStatus'] == '00')
			{
				let userID = vnp_Params['vnp_OrderInfo'].substring(23,47)
				const user = await User.findById(userID);
				let cart = user.cartItems;
				user.cartItems = [];
				const newOrder = new Order({
					user: new mongoose.Types.ObjectId("6743e88aa06cb7b352a7d4aa"),
					products: cart,
					totalAmount: vnp_Params['vnp_Amount'] / 100,
					orderInfo: vnp_Params['vnp_OrderInfo'] 
				});
				await newOrder.save();
				await user.save();
				res.send({"message": "Payment Successful"})
				//FE bỏ dòng send Redirect lên trang payment Successful giùm
			}
			else
				res.send({"message": "Payment Failed"})
				//FE bỏ dòng send Redirect lên trang payment Failed giùm
		}
		else{
			res.send({"message": "Invalid Signature"})
		}
	}
	catch (error){
        console.log("Error in returnURL controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
    }

}
// THÔNG TIN KHÁCH HÀNG MẪU
// NCB, 9704198526191432198, NGUYEN VAN A, 07/15, OTP: 123456


function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

