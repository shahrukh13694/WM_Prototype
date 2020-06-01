
'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const LDBinFillLevelSchema = new Schema({}, { strict: false });

const LDBinFillLevel = Mongoose.model('LDBinFillLevel', LDBinFillLevelSchema, 'LDBinFillLevel');

module.exports = LDBinFillLevel;
