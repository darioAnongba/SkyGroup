export class Legend {
    
        public CarrierIds: Array<number>;
        public OriginId: any;
        public DestinationId: any;
        public DepartureDate: string;
    
        constructor(CarrierIds: Array<number>, OriginId: number, DestinationId: number, DepartureDate: string) {
            this.CarrierIds = CarrierIds;
            this.OriginId = OriginId;
            this.DestinationId = DestinationId;
            this.DepartureDate = DepartureDate;
        }
    }