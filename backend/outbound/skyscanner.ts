// Only so that the compiler does not complain when using 'require'
declare function require(name: string): any;

import '../utils/flatMap';

import Promise = require('es6-promise');
import {UserFromRequest} from '../models/user_from_request';
import {UserWithSuggestion} from '../models/user_with_suggestion';
import {Suggestion} from '../models/suggestion';
import {Quote} from '../models/skyscanner/quote';
import {Airport} from '../models/skyscanner/geo/airport';
import {Geo} from '../models/skyscanner/geo/geo';

const Request: any = require('request');
const _: any = require('lodash');
const fs = require("fs");

const apikey = fs.readFileSync('../apiKey');
const url = 'http://partners.api.skyscanner.net/apiservices/';

export class Skyscanner {

    static getSuggestions(users: Array<UserFromRequest>, destCountry: string): Promise.Promise<Array<Suggestion>> {

        let cities: Array<string> = [];
        let promises: Array<Promise.Promise<[string, string]>> = [];
        for (let i = 0; i < users.length; i++) {
            cities[i] = users[i].departure;
            let query: string = url + '/browsequotes/v1.0/ch/chf/en-US/'+ cities[i] + '/' + destCountry + '/2017-11-12/2017-11-13?apikey=' + apikey;
            promises.push(Skyscanner.requestSuggestionAsync(query, users[i].name));
        }

        let suggPromise: Promise.Promise<Array<Suggestion>> = Promise.Promise.all(promises).then((alldata) => {
            let dataByUser: Array<[string, any]> = _.map(alldata, (x: [string, string]) => [x[0], JSON.parse(x[1])]);
            let quotesByUser: Array<[string, Array<Quote>]> = _.map(dataByUser, (x: [string, any]) => [x[0], x[1].Quotes]);
            let useQuotesFlattened: Array<[string, Quote]> = quotesByUser.flatMap<[string, Quote]>(
                (uQuotes) => _.map(uQuotes[1], (quote: Quote) => [uQuotes[0], quote]));
            let destToQuote: [string, Quote] = _.groupBy(useQuotesFlattened, (x: [string, Quote]) => x[1].OutboundLeg.DestinationId);
            
            // TODO: Change that
            let suggestions: Array<Suggestion> = [];
            let usersWithSuggestion1: Array<UserWithSuggestion> = [new UserWithSuggestion("Valentin", 42.0), new UserWithSuggestion("Dario", 10.5)];
            let usersWithSuggestion2: Array<UserWithSuggestion> = [new UserWithSuggestion("Valentin", 25.0), new UserWithSuggestion("Dario", 27.0)];
            suggestions.push(new Suggestion("London", usersWithSuggestion1));
            suggestions.push(new Suggestion("Paris", usersWithSuggestion2));

            return suggestions;
        });

        return suggPromise;
    }

    /*
    static getAirports(): Promise.Promise<Array<[string, string]>> {
        let query: string = url + '/geo/v1.0?apikey=' + apikey;
        return Skyscanner.requestAsync<Geo>(query).then((geo: Geo) => {
            let airports: Array<[string, string]> = []
            geo.Continents.forEach(continent => {
                continent.Countries.forEach(country => {
                    country.Cities.forEach(city => {
                        city.Airports.forEach(airport => {
                            airports.push([city.Name, airport.Id])
                        });
                    });
                });
            });

            return airports;
        });
    }

    private static requestAsync<T>(query: string): Promise.Promise<T> {
        return new Promise.Promise<T>((resolve, reject) => {
            Request(query, (error: string, response: any, body: any) => {
                if (error) { return reject(error);}
                return resolve(body);
            });
        });
    }
    */

    private static requestSuggestionAsync(query: string, user: string): Promise.Promise<[string, string]> {
        return new Promise.Promise<[string, string]>((resolve, reject) => {
            Request(query, (error: string, response: any, body: any) => {
                if (error) { return reject(error);}
                return resolve([user, body]);
            });
        });
    }
}