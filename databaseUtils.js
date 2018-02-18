const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = "mongodb://localhost:27017/";
const dbName = "fyp";

var utils = {
    
    client: undefined,

    addValues: async function (CollectionName, values) {
        try {
            if (this.client == undefined)
                this.client = await MongoClient.connect(url);

            const db = this.client.db(dbName);
            let r = await db.collection(CollectionName).insertOne(values);
            assert.equal(1, r.insertedCount);
            //return done
        }
        catch (err) {
            console.log(err.stack);
            //return error
        }
    },

    getDocs: async function (CollectionName, filter, columns) {
        try {
            if (this.client == undefined)
                this.client = await MongoClient.connect(url);
            const db = this.client.db(dbName);
            const col = db.collection(CollectionName);
            var coloumnSelected = {}
            for (let i = 0;i < columns.length; i++) {
                coloumnSelected[columns[i]] = 1;
            }
            data = await col.find(filter).project(coloumnSelected).toArray();
            // console.log(data);
            return data

        }
        catch (err) {
            console.log(err.stack);
        }
    },

    getAllData: async function(CollectionName) {
        try {
            if(this.client == undefined)
                this.client = await MongoClient.connect(url);
            const db = this.client.db(dbName);
            const col = db.collection(CollectionName);
            data = await col.find().toArray();
            return data;
        }
        catch (err) {
            console.log(err.stack);
        }
    },

    getAllColumns: async function(CollectionName, filter) {
        try {
            if (this.client == undefined)
                this.client = await MongoClient.connect(url);
            const db = this.client.db(dbName);
            const col = db.collection(CollectionName);
            var coloumnSelected = {}
            data = await col.findOne(filter);
            delete data['_id'];
            results = [];
            for(attr in data) {
                results.push(attr);
            }
            // console.log(data);
            return results;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    },

    updateValues: async function (CollectionName, values, filter) {
        try {
            if (this.client == undefined)
                this.client = await MongoClient.connect(url);
            const db = this.client.db(dbName);
            const col = db.collection(CollectionName);
            data = await col.findOneAndUpdate(filter, { $set: values });

        }
        catch (err) {
            console.log(err.stack);
        }
    },

    deleteValues: async function (CollectionName, values, filter) {
        try {
            if (this.client == undefined)
                this.client = await MongoClient.connect(url);
            const db = this.client.db(dbName);
            const col = db.collection(CollectionName);
            data = await col.findOneAndDelete(values);
        }
        catch (err) {
            console.log(err.stack);
        }
    }
}

module.exports = utils;