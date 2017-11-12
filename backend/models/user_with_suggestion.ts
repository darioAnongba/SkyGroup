export class UserWithSuggestion {
    
    public name: string;
    public price: number;
    direct: boolean;
    outboundLeg:any;
    inboundLeg: any;
    public flightDetails: string; // TODO: to define

    constructor(name: string, price: number, direct: boolean, outboundLeg:any, inboundLeg: any) {
        this.name = name;
        this.price = price;
        this.direct = direct;
        this.outboundLeg = outboundLeg;
        this.inboundLeg = inboundLeg;
    }
}