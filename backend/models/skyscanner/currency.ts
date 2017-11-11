export class Currency {
    
    public Code: string;
    public Symbol: string;
    public ThousandsSeparator: string;
    public DecimalSeparator: string;
    public SymbolOnLeft: boolean;
    public SpaceBetweenAmountAndSymbol: boolean;
    public RoundingCoefficient: string;
    public DecimalDigits: number;
    
    constructor(Code: string, Symbol: string, ThousandsSeparator: string, DecimalSeparator: string,
            SymbolOnLeft: boolean, SpaceBetweenAmountAndSymbol: boolean, RoundingCoefficient: string,
            DecimalDigits: number) {
        this.Code = Code;
        this.Symbol = Symbol;
        this.ThousandsSeparator = ThousandsSeparator;
        this.DecimalSeparator = DecimalSeparator;
        this.SymbolOnLeft = SymbolOnLeft;
        this.SpaceBetweenAmountAndSymbol = SpaceBetweenAmountAndSymbol;
        this.RoundingCoefficient = RoundingCoefficient;
        this.DecimalDigits = DecimalDigits;
    }
}