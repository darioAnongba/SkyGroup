import {UserWithSuggestion} from './user_with_suggestion';

export class Suggestion {
    
    public destCity: string;
    public fullPrice: number;
    public usersWithSuggestion: Array<UserWithSuggestion>;

    constructor(destCity: string, users: Array<UserWithSuggestion>, fullPrice) {
        this.destCity = destCity;
        this.usersWithSuggestion = users;
        this.fullPrice = fullPrice;
    }
}