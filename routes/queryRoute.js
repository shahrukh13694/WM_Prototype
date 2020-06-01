var express = require('express');
var router = express.Router();
const controller = require('../controller')

router.get('/fillLevel', (req, res) => {
    let obj = controller.binFillLevelController.getObj_FillLevel(req.query.min,req.query.max);
    console.log(req.query.min,req.query.max);
    res.send("Executing query");
});

module.exports = router;