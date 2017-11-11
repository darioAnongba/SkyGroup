import {UserWithSuggestion} from './user_with_suggestion';

export class Suggestion {
    
    private destCity: string;
    private usersWithSuggestion: Array<UserWithSuggestion>;

    constructor(destCity: string, users: Array<UserWithSuggestion>) {
        this.destCity = destCity;
        this.usersWithSuggestion = users;
    }

    public getDestCity(): string {
        return this.destCity;
    }

    public getUsersWithSuggestions(): Array<UserWithSuggestion> {
        return this.usersWithSuggestion;
    }
}