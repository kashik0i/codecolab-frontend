import {v4 as uuidv4} from "uuid";

export class User {
    public static getUserFromSession(id: any): User {
        throw new Error("Method not implemented.");
    }

    get guest(): boolean {
        return this._guest;
    }

    get id(): string {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    private _id: string;
    private _guest: boolean;

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