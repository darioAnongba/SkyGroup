export class UserFromRequest {
    
    private name: string;
    private departure: string;

    constructor(name: string, departure: string) {
        this.name = name;
        this.departure = departure;
    }

    public getName(): string {
        return this.name;
    }

    public getDeparture(): string {
        return this.departure;
    }
}