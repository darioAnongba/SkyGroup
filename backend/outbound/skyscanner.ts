// Only so that the compiler does not complain when using 'require'
declare function require(name: string): any;

import '../utils/flatMap';

import Promise = require('es6-promise');
import {UserFromRequest} from '../models/user_from_request';
import {UserWithSuggestion} from '../models/user_with_suggestion';
import {Suggestion} from '../models/suggestion';
import {Quote} from '../models/skyscanner/quote';
import {Place} from '../models/skyscanner/place';
import {Airport} from '../models/skyscanner/geo/airport';
import {Geo} from '../models/skyscanner/geo/geo';

const Request: any = require('request');
const _: any = require('lodash');
const fs = require("fs");

const apikey = fs.readFileSync('../apiKey');
const url = 'http://partners.api.skyscanner.net/apiservices/';

export class Skyscanner {

    static getSuggestions(users: Array<UserFromRequest>, destCountry: string, departureDate: Date,
            returnDate: Date): Promise.Promise<Array<Suggestion>> {

        let dayDeparture: string = departureDate.toISOString().slice(0, 10);
        let dayReturn: string = returnDate.toISOString().slice(0, 10);

        let cities: Array<string> = [];
        let promises: Array<Promise.Promise<[string, string]>> = [];
        for (let i = 0; i < users.length; i++) {
            cities[i] = users[i].departure;
            let query: string = url + '/browsequotes/v1.0/ch/chf/en-US/'+ cities[i] + '/'
                + destCountry + '/' + departureDate + '/' + returnDate + '?apikey=' + apikey;
            promises.push(Skyscanner.requestSuggestionAsync(query, users[i].name));
        }

        let suggPromise: Promise.Promise<Array<Suggestion>> = Promise.Promise.all(promises).then((alldata) => {
            console.log(alldata);
            let dataByUser: Array<[string, any]> = _.map(alldata, (x: [string, string]) => [x[0], JSON.parse(x[1])]);
            let quotesByUser: Array<[string, Array<Quote>]> = _.map(dataByUser, (x: [string, any]) => [x[0], x[1].Quotes]);
            let places: any = dataByUser.flatMap((data) => _.map(data[1].Places, (place: Place) => [place.PlaceId, place.Name]));
            let airportByUser: Array<[string,Array<number>]> = _.map(quotesByUser, (x: [string,Array<number>]) => [x[0], _.map(x[1], (q: Quote) => q.OutboundLeg.DestinationId)]);
            let airports = _.map(airportByUser, (x:any) => x[1])
            let validAirports = _.intersection(...airports);

            let useQuotesFlattened: Array<[string, Quote]> = quotesByUser.flatMap<[string, Quote]>(
                (uQuotes) => _.map(uQuotes[1], (quote: Quote) => [uQuotes[0], quote]));
            let destToQuote: any = _.groupBy(useQuotesFlattened, (x: [string, Quote]) => x[1].OutboundLeg.DestinationId);
            let s: any = _.pick(destToQuote, validAirports);
            let res: Array<[string, Quote]> = [];
            for(let key in s) {
                for(let i = 0; i < places.length; i ++) {
                    if (key == places[i][0]) {
                        res.push([places[i][1], s[key]])
                        break;
                    }
                }
            }

            let rr: Array<Suggestion> = _.map(res, (r: any) => 
                new Suggestion(r[0], _.map(r[1], (uq: any) => new UserWithSuggestion(uq[0], uq[1].MinPrice))));

            return rr;
        });

        return suggPromise;
    }

    static getAirports(): string {
        return fs.readFileSync('./data/airports.json')
    }

    private static requestSuggestionAsync(query: string, user: string): Promise.Promise<[string, string]> {
        return new Promise.Promise<[string, string]>((resolve, reject) => {
            Request(query, (error: string, response: any, body: any) => {
                if (error) { return reject(error);}
                return resolve([user, body]);
            });
        });
    }
}