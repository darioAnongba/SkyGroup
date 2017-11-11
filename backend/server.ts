// Only so that the compiler does not complain when using 'require'
declare function require(name: string): any;

const Hapi = require('hapi');
const Joi = require('joi');

let http = require('http');

const server = new Hapi.Server();
server.connection({port: 8080});

server.start((err: any) => {
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
		handler: function(request: any, reply: any) {
			let toReturn: any = new Object();
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
		handler: function(request: any, reply: any) {
			let name: string = request.payload.name;
			let destCity: string = request.payload.destCity;
			
			reply(JSON.stringify({"name": name, "destCity": destCity})).header('Access-Control-Allow-Origin', '*').code(200);
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
		handler: function(request: any, reply: any) {
			let id: number = request.params.id;

			let toReturn: any = new Object();
			toReturn['id'] = id;
			reply(toReturn).header('Access-Control-Allow-Origin', '*');

		}
	}
});