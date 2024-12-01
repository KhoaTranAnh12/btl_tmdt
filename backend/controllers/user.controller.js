import User from "../models/user.model.js";



export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({}); // find all users
		res.json({ users });
	} catch (error) {
		console.log("Error in getAllUsers controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteUsers = async (req, res) => {
    try{
        const users = await User.findById(req.params.id);
        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    }
    catch (error){
        console.log("Error in deleteUsers controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
    }
}

