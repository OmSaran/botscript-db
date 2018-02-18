var express = require('express');
var app = express();
var db = require('./Template/databaseUtils.js');
var async = require('async');

PORT = 27015
SEP = '-'

app.get('/api/db', function(req, res) {
    let collectionName = 'metadata';
    // var userId = req.body.userId;

    // Mock
    var userId = 'user1'
    //

    var results = db.getDocs(collectionName, { 'username': userId }, 
        ['bot', 'collections']);
    results
    .then(function(obj) {
        console.log('Successfull results');
        res.json(obj).send();            
    })
    .catch(function(err) {
        console.log(err)
        res.sendStatus(500);
    })   
})

app.get('/api/db/:botName', function(req, res) {
    let metadataCollection = 'metadata'
    let collectionName = 'data';

    // Mock
    var userId = 'user1'
    //

    var botName = req.params.botName;

    var collections = db.getColumns(metadataCollection, { 'username': userId, 
        'bot': botName }, ['collections']);
    collections
    .then(function(coll) {
        async.map(coll[0].collections, function(element, cb) {
            var collName = userId + SEP + botName + SEP + element;
            var columns = db.getAllColumns(collName, {});
            columns.then(function(results) {
                // For every collection return an array of columns
                collName = userId + SEP + botName + SEP + element;
                cb(null, { collection: collName, columns: results });
            });
            columns.catch(function(err) {
                console.log('catching in async too!!!')
                cb(err, null);
            });
        }, function(error, results) {
            if(error)
                return res.status(400).json(error);
            res.status(200).json(results);
        })
    });
    collections.catch(function(err) {
        console.log(err);
        res.status(400).json(err);
    })
})

app.get('/api/db/:botName/:collection', function(req, res) {
    // Mock
    var userId = 'user1'
    //
    let collectionName = userId + SEP + req.params.botName +
        SEP + req.params.collection;
    var results = db.getAllData(collectionName)
    .then(function(results) {
        res.json(results).status(200);
    })
    .catch(function(err) {
        console.log(err);
        res.sendStatus(400);
    });
})

app.listen(PORT, function() {
    console.log("Listening at " + PORT)
})