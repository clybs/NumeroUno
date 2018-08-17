const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');

const NUMBERS_TABLE = process.env.NUMBERS_TABLE;
const LIST_LIMIT = 2;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// List via available index
function listAvailableIndex(filters) {
    const { res, limit, number, block, available } = filters;
    const params = {
        TableName: NUMBERS_TABLE,
        Limit: limit,
        IndexName: "AvailableIndex",
        KeyConditionExpression: "#a = :a",
        ExpressionAttributeNames: {
            '#a':'available'
        },
        ExpressionAttributeValues: {
            ":a":available
        }
    };

    // Check if we need to select from next page
    if (number !== "" && available !== "") {
        params.ExclusiveStartKey = {
            number: number,
            available: available
        }
    }

    dynamoDb.query(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get list of numbers' });
        }
        if (result.Items.length) {
            // Check if LastEvaluatedKey exists
            if (result.LastEvaluatedKey) {
                // Create the next page
                const { number, available } = result.LastEvaluatedKey;
                result.nextPage = `?limit=${limit}&number=${number}&available=${available}`;
            }

            // Delete the not needed values
            delete result.ScannedCount;
            delete result.LastEvaluatedKey;

            res.json(result);
        } else {
            res.status(404).json({ error: "numbers not found" });
        }
    });
}

// List via block index
function listBlockIndex(filters) {
    const { res, limit, number, block } = filters;
    const params = {
        TableName: NUMBERS_TABLE,
        Limit: limit,
        IndexName: "BlockIndex",
        KeyConditionExpression: "#b = :b",
        ExpressionAttributeNames: {
            '#b':'block'
        },
        ExpressionAttributeValues: {
            ":b":block
        }
    };

    // Check if we need to select from next page
    if (number !== "" && block !== "") {
        params.ExclusiveStartKey = {
            number: number,
            block: block
        }
    }

    dynamoDb.query(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get list of numbers' });
        }
        if (result.Items.length) {
            // Check if LastEvaluatedKey exists
            if (result.LastEvaluatedKey) {
                // Create the next page
                const { number, block } = result.LastEvaluatedKey;
                result.nextPage = `?limit=${limit}&number=${number}&block=${block}`;
            }

            // Delete the not needed values
            delete result.ScannedCount;
            delete result.LastEvaluatedKey;

            res.json(result);
        } else {
            res.status(404).json({ error: "numbers not found" });
        }
    });
}

// List normally
function listNormal(filters) {
    const { res, limit, number } = filters;
    const params = {
        TableName: NUMBERS_TABLE,
        Limit: limit
    };

    // Check if we need to select from next page
    if (number !== "") {
        params.ExclusiveStartKey = {
            number: number
        }
    }

    dynamoDb.scan(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get list of numbers' });
        }
        if (result.Items.length) {
            // Check if LastEvaluatedKey exists
            if (result.LastEvaluatedKey) {
                // Create the next page
                const { number } = result.LastEvaluatedKey;
                result.nextPage = `?limit=${limit}&number=${number}`;
            }

            // Delete the not needed values
            delete result.ScannedCount;
            delete result.LastEvaluatedKey;

            res.json(result);
        } else {
            res.status(404).json({ error: "numbers not found" });
        }
    });
}

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
    res.send('Nothing here')
});

// Create a number
app.post('/numbers', function (req, res) {
    const { number, block, country } = req.body;
    if (typeof number !== 'string') {
        res.status(400).json({ error: '"number" must be a string' });
    }
    if (typeof block !== 'string') {
        res.status(400).json({ error: '"block" must be a string' });
    }
    if (typeof country !== 'string') {
        res.status(400).json({ error: '"area" must be a string' });
    }

    const params = {
        TableName: NUMBERS_TABLE,
        Item: {
            number: number,
            block: block,
            country: country,
            available: "true"
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not create number' });
        }
        res.json({ number, block, country, available: "true" });
    });
});

// Read a number
app.get('/numbers/:number', function (req, res) {
    const params = {
        TableName: NUMBERS_TABLE,
        Key: {
            number: req.params.number,
        },
    };

    dynamoDb.get(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get number' });
        }
        if (result.Item) {
            const {number, block, country, available} = result.Item;
            res.json({ number, block, country, available });
        } else {
            res.status(404).json({ error: "number not found" });
        }
    });
});

// List numbers
app.get('/numbers', function (req, res) {
    const limit = req.query.limit || LIST_LIMIT;
    const number = req.query.number || "";
    const block = req.query.block || "";
    const available = req.query.available || "";
    const filters = { res, limit, number, block, available };

    if (block !== "") {
        listBlockIndex(filters);
    } else if (available !== "") {
        listAvailableIndex(filters);
    } else {
        listNormal(filters);
    }
});

// Update a number
app.put('/numbers/:number', function (req, res) {
    // Check first if it exists
    const params = {
        TableName: NUMBERS_TABLE,
        Key: {
            number: req.params.number,
        },
    };

    dynamoDb.get(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get number' });
        }
        if (result.Item) {
            // Start the update
            const { block, country, available } = req.body;
            if (typeof block !== 'string') {
                res.status(400).json({ error: '"block" must be a string' });
            }
            if (typeof country !== 'string') {
                res.status(400).json({ error: '"area" must be a string' });
            }
            if (typeof available !== 'string') {
                res.status(400).json({ error: '"available" must be a string' });
            }

            const params = {
                TableName: NUMBERS_TABLE,
                Key: {
                    number: req.params.number,
                },
                UpdateExpression: "set #a=:a, #b=:b, #c=:c",
                ExpressionAttributeNames: {
                    '#a':'available',
                    '#b':'block',
                    '#c':'country'
                },
                ExpressionAttributeValues:{
                    ":a":available,
                    ":b":block,
                    ":c":country
                },
                ReturnValues:"UPDATED_NEW"
            };

            console.log(params);

            dynamoDb.update(params, (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(400).json({ error: 'Could not update number' });
                }
                if (result.Attributes) {
                    const {block, country, available} = result.Attributes;
                    const number = params.Key.number;
                    res.json({ number, block, country, available });
                } else {
                    res.status(404).json({ error: "number not found" });
                }
            });
        } else {
            res.status(404).json({ error: "number not found" });
        }
    });
});

// Delete a number
app.delete('/numbers/:number', function (req, res) {
    const params = {
        TableName: NUMBERS_TABLE,
        Key: {
            number: req.params.number,
        },
        ReturnValues: "ALL_OLD"
    };

    dynamoDb.delete(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Error deleting item' });
        }
        if (result) {
            res.json({ message: `Number deleted: ${params.Key.number}` });
        } else {
            res.status(404).json({ error: "number not found" });
        }
    });
});

module.exports.handler = serverless(app);