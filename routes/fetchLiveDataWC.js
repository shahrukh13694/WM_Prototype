var express = require('express');
var router = express.Router();
const controller = require('../controller')

router.get('/', (req, res) => {
    controller.binFillLevelController.fetchDataFromURL((err, data) => {
        if (err) {
            console.log("Couldn't read data from the URL");
        } else {
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(data));
        }
    });
});

module.exports = router;