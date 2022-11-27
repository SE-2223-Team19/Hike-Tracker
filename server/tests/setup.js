'use strict';
const mongoose = require('mongoose');
const { StatusCodes } = require("http-status-codes");

async function removeAllCollections () {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        await collection.deleteMany()
    }
}

async function dropAllCollections () {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        try {
            await collection.drop()
        } catch (error) {
            if (error.message.includes('a background operation is currently running')) 
                return;
        }
    }
}

function ResponseHelper() {
    this.statusCode = StatusCodes.OK;
    this.responseBody = {};
    this.status = (code) => {
        this.statusCode = code;
        return this;
    };
    this.json = (value) => {
        this.responseBody = value;
        return this;
    };
}

module.exports = {
    setupDB (databaseName) {
        // Connect to Mongoose
        beforeAll(async () => {
            const url = `mongodb://localhost/${databaseName}`
            await mongoose.connect(url, { useNewUrlParser: true })
        })

        // Cleans up database between each test
        afterEach(async () => {
            await removeAllCollections()
        })

        // Disconnect Mongoose
        afterAll(async () => {
            await dropAllCollections()
            await mongoose.connection.close()
        })
    },
    ResponseHelper
};