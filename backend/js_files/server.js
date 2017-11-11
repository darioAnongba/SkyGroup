var Hapi = require('hapi');
var Joi = require('joi');
var http = require('http');
var server = new Hapi.Server();
server.connection({ port: 8080 });
server.start(function (err) {
    if (err) {
        throw err;
    }
    console.log("The server is ready!");
    console.log();
});
server.route({
    method: 'GET',
    path: '/',
    config: {
        handler: function (request, reply) {
            var toReturn = new Object();
            toReturn['message'] = "Welcome!";
            reply(toReturn).header('Access-Control-Allow-Origin', '*');
        }
    }
});
server.route({
    method: 'POST',
    path: '/suggestion',
    config: {
        cors: {
            origin: ['*']
        },
        validate: {
            payload: {
                name: Joi.string().required(),
                destCity: Joi.string().required()
            }
        },
        handler: function (request, reply) {
            var name = request.payload.name;
            var destCity = request.payload.destCity;
            reply(JSON.stringify({ "name": name, "destCity": destCity })).header('Access-Control-Allow-Origin', '*').code(200);
        }
    }
});
server.route({
    method: 'GET',
    path: '/suggestion/{id}',
    config: {
        validate: {
            params: {
                id: Joi.number().required()
            }
        },
        handler: function (request, reply) {
            var id = request.params.id;
            var toReturn = new Object();
            toReturn['id'] = id;
            reply(toReturn).header('Access-Control-Allow-Origin', '*');
        }
    }
});
