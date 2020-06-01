
'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const binFillLevelSchema = new Schema({
    binId: { type: String, required: true },
    location: {
        long: { type: String, required: true },
        lat: { type: String, required: true },
        description: { type: String, required: true }
    },
    fill: {
        fillLevel: { type: Number, required: true },
        fillThreshold : { type: Number, required: true }
    },
    recordedDate : {type: Date, required: true}
});

const binFillLevelModel = Mongoose.model('binFillLevel', binFillLevelSchema, 'processBinFillLevel');

module.exports = binFillLevelModel;