import {Continent} from './continent';

export class Geo {
    
    public Continents: Array<Continent>;
    
    constructor(Continents: Array<Continent>) {
        this.Continents = Continents;
    }
}