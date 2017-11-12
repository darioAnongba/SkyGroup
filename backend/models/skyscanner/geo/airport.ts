export class Airport {
    
    public CityId: number;
    public CountryId: number;
    public Location: string;
    public Id: string;
    public Name: string;
    
    constructor(CityId: number, CountryId: number, Location: string, Id: string, Name: string) {
        this.CityId = CityId;
        this.CountryId = CountryId;
        this.Location = Location;
        this.Id = Id;
        this.Name = Name;
    }
}