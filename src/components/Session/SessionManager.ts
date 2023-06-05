import {User} from "../../Models/User";
import {v4 as uuidv4} from "uuid";
// import {SocketClient} from "../../lib/socket";
import type {User as GithubUser} from "@firebase/auth";
import type {SocketClient} from "../../lib/socket";
import {FirebaseClient} from "../Auth/firebase";

export class SessionManager {
    public _firebaseClient: FirebaseClient;
    static fromGithubUser(user: GithubUser,token:string): SessionManager {
        let session = new this(true)
        session._user = new User(false);
        session._user.providerUser = user
        session._id = user.uid
        session._user._token = token
        // session.getUserNotebooks()
        return session
    }

    private socket: SocketClient;

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
        // this.socket=new SocketClient();
    }

    get isGuest() {
        return this._user._guest;
    }

    public createScratchNotebook() {
        this.notebooks = [{id: uuidv4(), name: "scratch"}]
    }

    public static guest(localStorageEnabled) {
        console.log("new guest")
        let session = new this(localStorageEnabled)
        session._user = new User(true);
        session._id = uuidv4()
        session.createScratchNotebook()
        return session
    }

    public static fromUserId(id, localStorageEnabled) {
        let session = new this(localStorageEnabled)
        session._user = User.loadUser(id);
        session._id = uuidv4()
        return session

    }

    public static fromSession(id, localStorageEnabled) {
        let session = new this(localStorageEnabled)
        session._user = User.getUserFromSession(id);
        session._id = id
        return session
    }

    public async login() {
        if (this._firebaseClient === undefined) {
            this._firebaseClient = new FirebaseClient();
        }
        return await this._firebaseClient.loginWithGithub()
    }

    public async logout() {
        if (this._firebaseClient === undefined) {
            this._firebaseClient = new FirebaseClient();
        }
        return await this._firebaseClient.logout()
    }
}