import {User} from "./User";
import {v4 as uuidv4} from "uuid";

export class Session {
    get localStorageEnabled(): boolean {
        return this._localStorageEnabled;
    }

    set localStorageEnabled(value: boolean) {
        this._localStorageEnabled = value;
    }

    get notebooks(): [{ id: string; name: string }] {
        return this._notebooks;
    }

    set notebooks(value: [{ id: string; name: string }]) {
        this._notebooks = value;
    }

    set user(value: User) {
        this._user = value;
    }

    set id(value: string) {
        this._id = value;
    }

    get id(): string {
        return this._id;
    }

    get user(): User {
        return this._user;
    }

    _user: User;
    private _id: string;
    private _notebooks: [{ id: string; name: string }];
    private _localStorageEnabled: boolean;

    constructor(localStorageEnabled) {
        this._localStorageEnabled = localStorageEnabled
    }

    isGuest() {
        return this._user.guest;
    }

    public createScratchNotebook() {
        this.notebooks = [{id: uuidv4(), name: "scratch"}]
    }

    public static guest(localStorageEnabled) {
        let session = new Session(localStorageEnabled)
        session._user = new User(true);
        session._id = uuidv4()
        session.createScratchNotebook()
        return session
    }

    public static fromUserId(id,localStorageEnabled) {
        let session = new Session(localStorageEnabled)
        session._user = User.loadUser(id);
        session._id = uuidv4()
        return session

    }

    public static fromSession(id,localStorageEnabled) {
        let session = new Session(localStorageEnabled)
        session._user = User.getUserFromSession(id);
        session._id = id
        return session
    }
}