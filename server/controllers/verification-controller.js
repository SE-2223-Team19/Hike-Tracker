const userDAL = require("../data/user-dal");
const { StatusCodes } = require("http-status-codes");

async function verifyUser(req, res) {
    const uniqueString = req.params.uniqueString;
    const user = await userDAL.getUsers({ uniqueString: uniqueString });
    if (user) {
        user.isValid = true;
        await user.save();
        return res.status(StatusCodes.OK).json({ message: "User verified" });
    } else {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
}

module.exports = {
    verifyUser
};
