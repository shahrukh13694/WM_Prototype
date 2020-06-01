'use strict';

const Mongoose = require('mongoose');

const database = {
    Uri: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/WM_Prototype',
    port: 27017
}

// Establish db connection
try {
    Mongoose.connect(database.Uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

} catch (error) {
    console.log(`Error: ${error}`);
    process.exit(1); // No database connection. Terminate
}

module.exports = {
    db: database
}