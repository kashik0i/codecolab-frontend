import {firebaseConfig} from "./firebaseConfig";
import {type Auth, getAuth, signInWithPopup, GithubAuthProvider} from "firebase/auth";
import {initializeApp, type FirebaseApp} from 'firebase/app';
import {session} from '../../stores'
import {SessionManager} from "../Session/SessionManager";
import {navigateTo} from "svelte-router-spa";

export class FirebaseClient {
    private app: FirebaseApp;
    private auth: Auth;

    constructor() {
        this.app = initializeApp(firebaseConfig);
        // this.auth = getAuth(this.app);
    }

    async loginWithGithub() {
        this.auth = getAuth(this.app);
        const provider = new GithubAuthProvider();
        try {
            const result = await signInWithPopup(this.auth, provider)
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            const credential = GithubAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            // The signed-in user info.
            const user = result.user;
            session.set(SessionManager.fromGithubUser(user,token))
            console.log(user);
            // IdP data available using getAdditionalUserInfo(result)
            navigateTo('home')

        } catch (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
            // The email of the user's account used.
            // const email = error.customData.email;
            // // The AuthCredential type that was used.
            // const credential = GithubAuthProvider.credentialFromError(error);
        }

    }

    async logout() {
        const auth = getAuth();
        try {
            await auth.signOut();
            session.set(SessionManager.guest(true))
        }catch (e) {
            console.log(e)
        }

    }
}


