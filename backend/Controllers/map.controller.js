const mapService = require("../services/map.service");
const fareService = require("../services/fare.service");


const getCoordinates = async (req, res) => {
    try {
        const { address } = req.query;

        const coordinates = await mapService.getAddressCoordinates(address);

        res.status(200).json({
            success: true,
            data: coordinates,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getDistanceAndTime = async (req, res) => {
    try {
        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({
                success: false,
                message: "Origin and destination are required",
            });
        }
        const result = await mapService.getDistanceAndTimeService(origin, destination);

        const fare = await fareService.calculateFare(result.distance.kilometers, result.duration.minutes);
        return res.status(200).json({
            success: true,
            data: { ...result, fare },
        });
        } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAddressSuggestions = async(req , res)=>{
    try{
        const { input } = req.query;
        if(!input || !input.trim()){
            return res.status(400).json({
                success: false,
                message: "Input parameter is required"
            });
        }        
        const suggestions = await mapService.getAddressSuggestions(input);
        return res.status(200).json({
            success: true,
            data:suggestions
        })

    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const reverseGeocode = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required",

            });
        }
        const address = await mapService.reverseGeocode(lat, lng);

        return res.status(200).json({
            success: true,
            data: address
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}



module.exports = {
    getCoordinates,
    getDistanceAndTime,
    getAddressSuggestions,
    reverseGeocode
};
