import {UserFromRequest} from '../models/user_from_request';
import {UserWithSuggestion} from '../models/user_with_suggestion';
import {Suggestion} from '../models/suggestion';

export class Skyscanner {

    static getSuggestions(users: Array<UserFromRequest>, destCountry: string): Array<Suggestion> {
        // SAMPLE SUGGESTIONS
        let suggestions: Array<Suggestion> = [];
        let usersWithSuggestion1: Array<UserWithSuggestion> = [new UserWithSuggestion("Valentin", 42.0), new UserWithSuggestion("Dario", 10.5)];
        let usersWithSuggestion2: Array<UserWithSuggestion> = [new UserWithSuggestion("Valentin", 25.0), new UserWithSuggestion("Dario", 28.0)];
        suggestions.push(new Suggestion("London", usersWithSuggestion1));
        suggestions.push(new Suggestion("Paris", usersWithSuggestion2));

        return suggestions;
    }
}