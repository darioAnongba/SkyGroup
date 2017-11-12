Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};
const request = require('request');
const _ = require('lodash');
function requestAsync(query, user) {
    return new Promise(function(resolve, reject) {
                request(query, function (error, response, body) {
                    // console.log('error:', error); // Print the error if one occurred
                    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    // console.log('body:', body); // Print the HTML for the Google homepage.
                    if (error) { return reject(error);}
                    return resolve([user, body]);
                });
            });

        }
function recomendation(data) {
    var fs = require('fs');
    const apikey = fs.readFileSync('../apiKey');
    const url = 'http://partners.api.skyscanner.net/apiservices/';
    var destCountry = data.DestCountry;
    var users = data.users;

    var cities = [];
    var resp = [];
    for (var i = 0; i < users.length; i++) {
        cities[i] = users[i].depCity;
        var query = url + '/browsequotes/v1.0/ch/chf/en-US/'+ cities[i] + '/' + destCountry + '/2017-12/2017-12?apikey=' + apikey;
        console.log(query);
        resp.push(requestAsync(query, users[i].name));
    }
    Promise.all(resp).then(function(alldata) {
        var DataByUser = _.map(alldata, function(x){return [x[0],JSON.parse(x[1])];});
        var quotesByUser = _.map(DataByUser, function(x) {return [x[0], x[1].Quotes]}); // List[User, List[Quotes]]
        var useQuotesFlattened = quotesByUser.flatMap( //List[User, Quotes]
            function(uQuotes) {
                return _.map(uQuotes[1],
                function(quote) {return [uQuotes[0], quote];}
            )});
        var destToQuote = _.groupBy(useQuotesFlattened, function (x) {return x[1].OutboundLeg.DestinationId});
        // console.log(destToQuote);
        // console.log((destToQuote));
        var foo = _.keys(_.omitBy(_.mapValues(destToQuote, function(values, key) {return _.uniq(values[0]).length;}), function(x){return x === users.length}));
        var res = _.omit(destToQuote, foo);
        // console.log(foo);
        console.log("test")
        console.log(res);
    });
}
console.log("salut");
recomendation({"DestCountry": "CH", "users": [{"name": "fo", "depCity": "uk"}, {"name": "u2", "depCity": "fr"}]});
