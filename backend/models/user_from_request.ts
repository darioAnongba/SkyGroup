export class UserFromRequest {
    
    public name: string;
    public departure: string;

    constructor(name: string, departure: string) {
        this.name = name;
        this.departure = departure;
    }
}