const { StatusCodes } = require("http-status-codes");

async function getThumbnail(req, res) {
	const { id } = req.params;

	try {
		const thumbnail = await imageDAL.getThumbnail(id);
		return res.status(StatusCodes.OK).json(thumbnail);
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
	}
}
