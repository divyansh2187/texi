const mapService = require("../services/map.service");

const getCoordinates = async (req, res) => {
    try {
        const { address } = req.query;

        const coordinates =
            await mapService.getAddressCoordinates(address);

        res.status(200).json({
            success: true,
            data: coordinates
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCoordinates
};