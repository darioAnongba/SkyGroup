import {City} from './city';

export class Country {
    
    public CurrencyId: string;
    //public Regions: Array<Region>;
    public Cities: Array<City>;
    
    constructor(CurrencyId: string, Cities: Array<City>) {
        this.CurrencyId = CurrencyId;
        this.Cities = Cities;
    }
}