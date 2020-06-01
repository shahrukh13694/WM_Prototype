'use strict'

const fs = require('fs');
const models = require('../models');
const request = require('request');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const readFileData = (callback) => {
    fs.readFile('./data/full_wyndham_smartbin_filllevel.json', (err, data) => {
        if (err) {
            //throw err;
            callback(err);
        } else {
             let full_data = JSON.parse(data);
             full_data.features.forEach(element => {
                let binFillLevelObj = createBinFillLevelObjHist(element);
                toLD_binFillLevel(binFillLevelObj);
                let binFillLevelModel = new models.binFillLevelModel(binFillLevelObj);
                binFillLevelModel.save(function (err) {
                 if (err) {
                     throw err;
                     //console.log("Error while saving binFillLevelModel document");
                 }
                });
             });
             callback(null);
        }
    });
}

const fetchDataFromURL = (callback) => {
    let url = "https://data.gov.au/data/dataset/08531201-ac9f-4f5f-bb7e-ac16b1da28b4/resource/15732b49-3e50-40ce-8dfd-0efed18661f4/download/sb_fill_lvel.json";
    let options = {json: true};

    request(url, options, (error, res, body) => {
        if (error) {
            callback(error)
        };
        if (!error && res.statusCode == 200) {
            body.features.forEach(element => {
                let binFillLevelObj = createBinFillLevelObjLive(element);
                let temp = toLD_binFillLevel(binFillLevelObj);
                //console.log(temp);

                let binFillLevelModel = new models.binFillLevelModel(binFillLevelObj);
                binFillLevelModel.save(function (err) {
                 if (err) {
                     throw err;
                     //console.log("Error while saving binFillLevelModel document");
                 }
                });
             });

            callback(null, body)
        };
    });
} 

function createBinFillLevelObjHist(element) {
    var binFillLevelObj = {
        binId: element.properties.serialNumber,
        location: {
            long: element.geometry.coordinates[0],
            lat: element.geometry.coordinates[1],
            description: element.properties.description 
        },
        fill: {
            fillLevel: element.properties.latestFullness/10,
            fillThreshold: element.properties.fullnessThreshold/10
        },
        recordedDate: new Date(element.properties.timestamp)
    };
    return binFillLevelObj;
}

function createBinFillLevelObjLive(element) {
    var binFillLevelObj = {
        binId: element.properties.serial_num,
        location: {
            long: element.geometry.coordinates[0],
            lat: element.geometry.coordinates[1],
            description: element.properties.bin_detail 
        },
        fill: {
            fillLevel: element.properties.fill_lvl/10,
            fillThreshold: element.properties.fill_thres/10
        },
        recordedDate: new Date(element.properties.timestamp)
    };
    return binFillLevelObj;
}

function toLD_binFillLevel(obj) {
    var LD_obj = {
            "type": "WasteContainer",
            "serialNumber": {
                "type": "Property",
                "value": obj.binId
            },
            "location": {
                "type": "GeoProperty",
                "value": {
                    "type": "Point",
                    "coordinates": [
                        obj.location.long,
                        obj.location.lat
                    ]
                }
            },
            "fillingLevel": {
                "type": "Property",
                "value": obj.fill.fillLevel
            },
            "@context": [
                "https://schema.lab.fiware.org/ld/context",
                "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
            ]
    }
    const LDBinFillLevel = models.LDBinFillLevel(LD_obj);
    LDBinFillLevel.save(function (err) {
        if (err) {
            throw err;
            //console.log("Error while saving binFillLevelModel document");
        }
    });
    return LD_obj;
    
}

function getObj_FillLevel(min,max) {
    models.LDBinFillLevel.find( { "fillingLevel.value" : { $gte: min, $lte: max} }, function(err, result) {
        if (err) throw err;
        console.log(result);
    })
}

module.exports = {
    readFileData: readFileData,
    fetchDataFromURL: fetchDataFromURL,
    toLD_binFillLevel: toLD_binFillLevel,
    getObj_FillLevel: getObj_FillLevel
}
