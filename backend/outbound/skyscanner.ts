// Only so that the compiler does not complain when using 'require'
import {Legend} from "../models/skyscanner/legend";

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
const util = require('util');

const apikey = fs.readFileSync('../apiKey');
const url = 'http://partners.api.skyscanner.net/apiservices/';

export class Skyscanner {

    static transsform(inn:string, out: string, sug:Legend):any {
        sug.DestinationId = out;
        sug.OriginId = inn;
        return sug;
    }

    static numtoNam(id:number, places) :any{
        for(let i = 0; i < places.length; i ++) {
            if (id == places[i][0]) {
                return places[i][1];
            }
        }
    }

    static getSuggestions(users: Array<UserFromRequest>, destCountry: string, departureDate: Date,
        returnDate: Date): Promise.Promise<Array<Suggestion>> {

        let dayDeparture: string = departureDate.toISOString().slice(0, 10);
        let dayReturn: string = returnDate.toISOString().slice(0, 10);

        console.log(dayDeparture);

        let cities: Array<string> = [];
        let promises: Array<Promise.Promise<[string, string]>> = [];
        for (let i = 0; i < users.length; i++) {
            cities[i] = users[i].departure;
            let query: string = url + '/browsequotes/v1.0/ch/chf/en-US/'+ cities[i] + '/'
                + destCountry + '/' + dayDeparture + '/' + dayReturn + '?apikey=' + apikey;
            console.log(query);
            promises.push(Skyscanner.requestSuggestionAsync(query, users[i].name));
        }

        let suggPromise: Promise.Promise<Array<Suggestion>> = Promise.Promise.all(promises).then((alldata) => {
            let dataByUser: Array<[string, any]> = _.map(alldata, (x: [string, string]) => [x[0], JSON.parse(x[1])]);
            console.log("tesss");
            let quotesByUser: Array<[string, Array<Quote>]> = _.map(dataByUser, (x: [string, any]) => [x[0], x[1].Quotes]);
            let places = dataByUser.flatMap((data) => _.map(data[1].Places, (place) => [place.PlaceId, place.Name]));
            // console.log(Skyscanner.uniq(places));
            let airportByUser: Array<[string,Array<number>]> = _.map(quotesByUser, (x) => [x[0], _.map(x[1], (q: Quote) => q.OutboundLeg.DestinationId)]);
            let airports = _.map(airportByUser, (x:any) => x[1])
            let validAirports = _.intersection(...airports);

            let useQuotesFlattened: Array<[string, Quote]> = quotesByUser.flatMap<[string, Quote]>(
                (uQuotes) => _.map(uQuotes[1], (quote: Quote) => [uQuotes[0], quote]));
            let destToQuote: any = _.groupBy(useQuotesFlattened, (x: [string, Quote]) => x[1].OutboundLeg.DestinationId);
            let s = _.pick(destToQuote, validAirports);
            let res = []
            for(let key in s) {
                for(let i = 0; i < places.length; i ++) {
                    if (key == places[i][0]) {
                        res.push([places[i][1], s[key]])
                        break;
                    }
                }
            }

            let rr: Array<Suggestion> = _.map(res, (r) =>{  return new Suggestion(r[0], _.map(r[1], (uq)=> {
                let l1 = uq[1].InboundLeg;
                let l2 = uq[1].OutboundLeg;
                console.log(l2);
                let tmp1 = Skyscanner.transsform(Skyscanner.numtoNam(l1.OriginId, places),Skyscanner.numtoNam(l1.DestinationId, places), l1);
                let tmp2 = Skyscanner.transsform(Skyscanner.numtoNam(l2.OriginId, places),Skyscanner.numtoNam(l2.DestinationId, places), l2);
                console.log(tmp2);
                return new UserWithSuggestion(uq[0],uq[1].MinPrice,uq[1].Direct, tmp2, tmp1)}))});
            // console.log(util.inspect(res, false, null));
            // console.log(util.inspect(rr, false, null));
            console.log("foobar");

            return rr;

        });

        return suggPromise;
    }

    static getAirports(): any {
        return {"data": JSON.parse(fs.readFileSync('./data/airports.json', 'utf8'))};
    }

    static getCountries(): any {
        return {"data": JSON.parse(fs.readFileSync('./data/countries.json', 'utf8'))};
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