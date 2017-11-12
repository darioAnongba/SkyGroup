// Only so that the compiler does not complain when using 'require'
declare function require(name: string): any;

import Promise = require('es6-promise');
import {UserFromRequest} from './models/user_from_request';
import {Suggestion} from './models/suggestion';
import {UserWithSuggestion} from './models/user_with_suggestion';
import {Skyscanner} from './outbound/skyscanner'

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

const userSchema = Joi.object({
	name: Joi.string().min(1).required(),
	departure: Joi.string().min(1).required(),
	textDeparture: Joi.string()
  }).required();

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
	method: 'GET',
	path: '/airports',
	config: {
		handler: function(request: any, reply: any) {
			reply(Skyscanner.getAirports()).header('Access-Control-Allow-Origin', '*').code(200);
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
				users: Joi.array().items(userSchema).required(),
				destination: Joi.string().required()
			}
		},
		handler: function(request: any, reply: any) {
			let users: Array<UserFromRequest> = request.payload.users;
			let destination: string = request.payload.destination;
			
			// Getting suggestions from Skyscanner
			let suggPromise: Promise.Promise<Array<Suggestion>> = Skyscanner.getSuggestions(users, destination);
			suggPromise.then((suggestions: Array<Suggestion>) => {
				reply(JSON.stringify(suggestions)).header('Access-Control-Allow-Origin', '*').code(200);
			});
		}
	}
});

// Useless for now
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