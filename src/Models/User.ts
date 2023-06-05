import {v4 as uuidv4} from "uuid";
import type {User as GithubUser} from "@firebase/auth";

export class User {
    role: string;
    providerUser: GithubUser;
    _token: string;

    public static getUserFromSession(id: any): User {
        throw new Error("Method not implemented.");
    }



    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    _id: string;
    readonly _guest: boolean;

    public constructor(isGuest: boolean) {
        this._guest = isGuest
        if (isGuest) {
            this._id = uuidv4()
        }

    }

    public static loadUser(id: string) {
        const self = new User(false)
        self.id = id;
        return self;
    }
}