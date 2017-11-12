import {Country} from './country';

export class Continent {
    
    public Countries: Array<Country>;
    
    constructor(Countries: Array<Country>) {
        this.Countries = Countries;
    }
}