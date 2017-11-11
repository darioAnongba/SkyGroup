export class UserWithSuggestion {
    
    private name: string;
    private price: number;
    private flightDetails: string; // TODO: to define

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }

    public getName(): string {
        return this.name;
    }

    public getPrice(): number {
        return this.price;
    }
}