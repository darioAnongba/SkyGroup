export class Place {
    
    public PlaceId: number;
    public Name: string;
    public Type: string;
    public SkyscannerCode: string;
    
    constructor(PlaceId: number, Name: string, Type: string, SkyscannerCode: string) {
        this.PlaceId = PlaceId;
        this.Name = Name;
        this.Type = Type;
        this.SkyscannerCode = SkyscannerCode;
    }
}