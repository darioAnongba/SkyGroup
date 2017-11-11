import {UserWithSuggestion} from './user_with_suggestion';

export class Suggestion {
    
    public destCity: string;
    public usersWithSuggestion: Array<UserWithSuggestion>;

    constructor(destCity: string, users: Array<UserWithSuggestion>) {
        this.destCity = destCity;
        this.usersWithSuggestion = users;
    }
}