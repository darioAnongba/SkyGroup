import {UserWithSuggestion} from './user_with_suggestion';

export class Suggestion {
    
    public destCity: string;
    public fullPrice: number;
    public usersWithSuggestion: Array<UserWithSuggestion>;
    public destCode: string;

    constructor(destCity: string, users: Array<UserWithSuggestion>, fullPrice: number, destCode: string) {
        this.destCity = destCity;
        this.destCode = destCode;
        this.usersWithSuggestion = users;
        this.fullPrice = fullPrice;
    }
}