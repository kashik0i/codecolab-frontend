<script lang="ts">
    import {Logout} from 'carbon-icons-svelte'

    import {FirebaseClient} from "./firebase";
    import {session} from "../../stores";

    let firebaseClient = new FirebaseClient();

    $: user = $session?._user?.providerUser;
</script>
<!--on:click={firebaseClient.logout}-->
<Logout iconDescription="Logout" on:click={()=>console.log("Hello")}>
    <title>Login with Github</title>
</Logout>
