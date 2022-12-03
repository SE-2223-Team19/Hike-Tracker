import { LocationType } from "../models/enums";
import locationDAL from "../data/location-dal";
const Location = require("../models/location-model");


async function checkAndUpdateDescriptionHut(id, hutUpdate) {

    try {

        let res
        const hutCheck = await Location.find({_id: id, locationType: LocationType.HUT})
        if(hutUpdate.description)
            res = await locationDAL.updateLocationDescription(id, hutUpdate.description)
        return hutCheck

    } catch(err) {
        return err
    }
}

module.exports = {
    checkAndUpdateDescriptionHut
}