import {Legend} from './legend'

export class Quote {

    public QuoteId: number;
    public MinPrice: number;
    public Direct: boolean;
    public OutboundLeg: Legend;
    public InboundLeg: Legend;
    public QuoteDateTime: string;

    constructor(QuoteId: number, MinPrice: number, Direct: boolean,
            OutboundLeg: Legend, InboundLeg: Legend, QuoteDateTime: string) {
        this.QuoteId = QuoteId;
        this.MinPrice = MinPrice;
        this.Direct = Direct;
        this.OutboundLeg = OutboundLeg;
        this.InboundLeg = InboundLeg;
        this.QuoteDateTime = QuoteDateTime;
    }
}
