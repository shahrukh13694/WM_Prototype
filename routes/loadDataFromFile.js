var express = require('express');
var router = express.Router();
const controller = require('../controller')

router.get('/', (req, res) => {
    
  controller.binFillLevelController.readFileData((err) => {
    if (err) {
      console.log("Error in reading file");
    } else {
      res.send("Data from file loaded successfully in MongoDB");
    }
  });
});


module.exports = router;
