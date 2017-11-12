import {Airport} from './airport';

export class City {
    
    public SingleAirportCity: boolean;
    public Airports: Array<Airport>;
    public CountryId: string;
    public Location: string;
    public IataCode: string;
    public Id: string;
    public Name: string;
    
    constructor(SingleAirportCity: boolean, Airports: Array<Airport>, CountryId: string,
            Location: string, IataCode: string, Id: string, Name: string) {
        this.SingleAirportCity = SingleAirportCity;
        this.Airports = Airports;
        this.CountryId = CountryId;
        this.Location = Location;
        this.IataCode = IataCode;
        this.Id = Id;
        this.Name = Name;
    }
}