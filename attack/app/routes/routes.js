// Install/import necessary packages/files.
const { response } = require('express');
const { request } = require('express');
const path = require('path');
const AWS = require('aws-sdk');

// Set region.
AWS.config.update({ region: 'us-west-2' });

// Get AWS credentials.
const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });

// Set AWS credentials.
AWS.config.credentials = credentials;

// Create DynamoDB service object.
const dynamodb = new AWS.DynamoDB.DocumentClient();

const router = (app) => {
    // Display welcome message.
    app.get('/', (request, response) => {
        response.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // Display all items in the database.
    app.get('/getItems', (request, response) => {
        const params = {
            TableName: 'ase-employees'
        };

        dynamodb.scan(params, (error, data) => {
            if (error) {
                response.send(error);
            } else {

                // Send DB response to client-side.
                response.send(data.Items);
            }
        });
    });

    // Fetch form data.
    app.post('/add', (request, response) => {
        try {

            var params = {
                TableName: 'ase-employees',
                Item: {
                    pk: `${request.body.email}`,
                    name: `${request.body.name}`,
                    email: `${request.body.email}`,
                    address: `${request.body.address}`,
                    phone: `${request.body.phone}`,
                }
            };
            dynamodb.put(params, function (err, data) {
                if (err) console.log(err);
                else console.log(data);
            });

            console.log(request.body);

        } catch (error) {
            console.log(error);
        }

    });

    // Edit item.
    app.post('/edit', (request, response) => {
        try {
            const params = {
                TableName: 'ase-employees',
                Key: {
                    // Set pk to email with specified attribute type.
                    email: `${request.body.email}`
                },
                UpdateExpression: 'set #name = :name, #address = :address, #phone = :phone',
                ExpressionAttributeNames: {
                    '#name': 'name',
                    '#address': 'address',
                    '#phone': 'phone'
                },
                ExpressionAttributeValues: {
                    ':name': `${request.body.name}`,
                    ':address': `${request.body.address}`,
                    ':phone': `${request.body.phone}`
                }

            };

            console.log(request.body);

            dynamodb.update(params, (error, data) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    });

    // Delete item.
    app.post('/delete', (request, response) => {
        try {
            const params = {
                TableName: 'ase-employees',
                Key: {
                    email: `${request.body.email}`
                }
            };

            dynamodb.delete(params, (error, data) => {
                if (error) {
                    response.send(error);
                } else {
                    response.send(data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    });


};

// Export routes.
module.exports = router;
