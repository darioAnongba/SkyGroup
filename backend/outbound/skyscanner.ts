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


        let cities: Array<string> = [];
        let promises: Array<Promise.Promise<[string, string]>> = [];
        for (let i = 0; i < users.length; i++) {
            cities[i] = users[i].departure;
            let query: string = url + '/browsequotes/v1.0/ch/chf/en-US/'+ cities[i] + '/'
                + destCountry + '/' + dayDeparture + '/' + dayReturn + '?apikey=' + apikey;
            promises.push(Skyscanner.requestSuggestionAsync(query, users[i].name));
        }

        let suggPromise: Promise.Promise<Array<Suggestion>> = Promise.Promise.all(promises).then((alldata) => {
            let dataByUser: Array<[string, any]> = _.map(alldata, (x: [string, string]) => [x[0], JSON.parse(x[1])]);
            let quotesByUser: Array<[string, Array<Quote>]> = _.map(dataByUser, (x: [string, any]) => [x[0], x[1].Quotes]);
            let places = dataByUser.flatMap((data) => _.map(data[1].Places, (place) => [place.PlaceId, place.Name]));
            let airportByUser: Array<[string,Array<number>]> = _.map(quotesByUser, (x) => [x[0], _.map(x[1], (q: Quote) => q.OutboundLeg.DestinationId)]);
            let airports = _.map(airportByUser, (x:any) => x[1])
            let validAirports = _.intersection(...airports);

            let useQuotesFlattened: Array<[string, Quote]> = quotesByUser.flatMap<[string, Quote]>(
                (uQuotes) => _.map(uQuotes[1], (quote: Quote) => [uQuotes[0], quote]));
            let destToQuote: any = _.groupBy(useQuotesFlattened, (x: [string, Quote]) => x[1].OutboundLeg.DestinationId);
            let s: any = _.pick(destToQuote, validAirports);
            let res = []
            for(let key in s) {
                let uniqUsers: any = [];
                for(let i = 0; i < places.length; i ++) {
                    if (key == places[i][0]) {
                        let filteredArray: Array<[string, Quote]> = [];
                        for (let i = 0; i < s[key].length; i++) {
                            let elem: [string, Quote] = s[key][i];
                            let user = elem[0];
                            if (uniqUsers.indexOf(user) < 0) {
                                filteredArray.push(elem);
                                uniqUsers.push(user);
                            }
                        }

                        res.push([places[i][1], filteredArray])
                        break;
                    }
                }
            }


            let rr: Array<Suggestion> = _.map(res, (r) =>{  return new Suggestion(r[0], _.map(r[1], (uq)=> {
                let l1 = uq[1].InboundLeg;
                let l2 = uq[1].OutboundLeg;
                let tmp1 = Skyscanner.transsform(Skyscanner.numtoNam(l1.OriginId, places),Skyscanner.numtoNam(l1.DestinationId, places), l1);
                let tmp2 = Skyscanner.transsform(Skyscanner.numtoNam(l2.OriginId, places),Skyscanner.numtoNam(l2.DestinationId, places), l2);
                return new UserWithSuggestion(uq[0],uq[1].MinPrice,uq[1].Direct, tmp2, tmp1)}))});
            //console.log(util.inspect(res, false, null));
            //console.log(util.inspect(rr, false, null));

            return rr;

        });

        return suggPromise;
    }

    static getFlights(users: Array<UserFromRequest>, destination: string, departureDate: Date, returnDate: Date): Promise.Promise<any> {
        
        const headers = {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        let promisesSession: Array<Promise.Promise<any>> = [];
        for (let u = 0; u < users.length; u++) {
            let userInfo = users[u];
            let country = "ch";
            let currency = "chf";
            let local = "en-US";
            let originPlace = userInfo.departure;
            let destinationPlace = destination;
            let outboundDate = departureDate.toISOString().slice(0, 10);
            let inboundDate = returnDate.toISOString().slice(0, 10);
            let adults = 1;
            let cabinClass = "economy";
            let options = {
                url: 'http://partners.api.skyscanner.net/apiservices/pricing/v1.0',
                method: 'POST',
                headers: headers,
                form: {'country': country,
                    'currency': currency,
                    'locale': local,
                    'locationSchema': 'iata',
                    'originPlace': originPlace,
                    'destinationPlace': destinationPlace,
                    'outboundDate' : outboundDate,
                    'inboundDate' : inboundDate,
                    'cabinClass': cabinClass,
                    'adults': adults,
                    'apiKey' : apikey +""
                }
            };

            console.log(options);
    
            promisesSession.push(Skyscanner.requestSessionAsync(options, users[u].name));
        }

        return Promise.Promise.all(promisesSession).then((allSessions) => {
            let promises: Array<Promise.Promise<any>> = [];
            for (let i = 0; i < allSessions.length; i++) {
                let query = allSessions[i][1] + '?apikey=' + apikey;
                promises.push(Skyscanner.requestFlightAsync(query, allSessions[i][0]));
            }

            return Promise.Promise.all(promises).then((alldata) => {
                return alldata;
            });
        });
        
    }

    static findPlace(id: any, places: any) {
        for(let i = 0; i < places.length; i ++) {
            if (id == places[i].Id) {
                return places[i].Name;
            }
        }
    }

    static getAirports(): any {
        return {"data": JSON.parse(fs.readFileSync('./data/airports.json', 'utf8'))};
    }

    static getCountries(): any {
        return {"data": JSON.parse(fs.readFileSync('./data/countries.json', 'utf8'))};
    }

    private static requestSessionAsync(options: any, username: string): Promise.Promise<any> {
        return new Promise.Promise<any>((resolve, reject) => {
            Request(options, function (error: any, response: any, body: any) {
                return resolve([username, response.headers.location]);
            });
        });
    }

    private static requestFlightAsync(query: string, username: string): Promise.Promise<any> {
        return new Promise.Promise<any>((res, rej) =>
            Request(query, (error: string, response: any, bod: any) => {
                let jsonBody = JSON.parse(bod);
                let itinerary = jsonBody.Itineraries[0];
                
                let inboundLeg = itinerary.InboundLegId;
                let outboundLeg = itinerary.OutboundLegId;
                let price = itinerary.PricingOptions[0].Price;
                let deepLink = itinerary.PricingOptions[0].DeeplinkUrl;
                let legs = jsonBody.Legs;

                console.log(1);

                let outboundDest = "";
                let outboundOrigin = "";
                let outboundDepTime = "";
                let outboundArrivalTime = "";
                let outboundDuration = "";
                let outboundStops = [];
                for (let i = 0; i < legs.length; i++) {
                    let leg = legs[i];
                    if (leg.Id == outboundLeg) {
                        outboundDest = leg.DestinationStation;
                        outboundOrigin = leg.OriginStation;
                        outboundDepTime = leg.Departure;
                        outboundArrivalTime = leg.Arrival;
                        outboundDuration = leg.Duration;
                        outboundStops = leg.Stops;
                    }
                }

                console.log(2);

                let inboundDest = "";
                let inboundOrigin = "";
                let inboundDepTime = "";
                let inboundArrivalTime = "";
                let inboundDuration = "";
                let inboundStops = [];
                for (let i = 0; i < legs.length; i++) {
                    let leg = legs[i];
                    if (leg.Id == inboundLeg) {
                        inboundDest = leg.DestinationStation;
                        inboundOrigin = leg.OriginStation;
                        inboundDepTime = leg.Departure;
                        inboundArrivalTime = leg.Arrival;
                        inboundDuration = leg.Duration;
                        inboundStops = leg.Stops;
                    }
                }

                console.log(3);

                let places = jsonBody.Places;
                let inboundVias = [];
                let outboundVias = [];
                let inboundDestPlace = "";
                let outboundDestPlace = "";
                let inboundOriginPlace = "";
                let outboundOriginPlace = "";
                for (let i = 0; i < inboundStops.length; i++) {
                    inboundVias.push(Skyscanner.findPlace(inboundStops[i], places));
                }
                console.log(4);
                for (let i = 0; i < outboundStops.length; i++) {
                    outboundVias.push(Skyscanner.findPlace(outboundStops[i], places));
                }
                inboundDestPlace = Skyscanner.findPlace(inboundDest, places);
                outboundDestPlace = Skyscanner.findPlace(outboundDest, places);
                inboundOriginPlace = Skyscanner.findPlace(inboundOrigin, places);
                outboundOriginPlace = Skyscanner.findPlace(outboundOrigin, places);

                console.log(5);

                let toReturn = {
                    "user": username,
                    "price": price,
                    "deepLink": deepLink,
                    "outbound": {
                        "departureTime": outboundDepTime,
                        "arrivalTime": outboundArrivalTime,
                        "duration": outboundDuration,
                        "vias": outboundVias,
                        "departureStation": outboundOriginPlace,
                        "arrivalStation": outboundDestPlace
                    },
                    "inbound": {
                        "departureTime": inboundDepTime,
                        "arrivalTime": inboundArrivalTime,
                        "duration": inboundDuration,
                        "vias": inboundVias,
                        "departureStation": inboundOriginPlace,
                        "arrivalStation": inboundDestPlace
                    }
                }
                            
                return res(toReturn);
            })
        );
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