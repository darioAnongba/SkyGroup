export class UserWithSuggestion {
    
    public name: string;
    public price: number;
    public flightDetails: string; // TODO: to define

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }
}