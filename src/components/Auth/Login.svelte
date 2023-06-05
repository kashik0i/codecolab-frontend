<script lang="ts">
    import {LogoGithub} from 'carbon-icons-svelte'

    import {FirebaseClient} from "./firebase";

    let firebaseClient = new FirebaseClient();
</script>
<LogoGithub iconDescription="Login with Github" on:click={firebaseClient.loginWithGithub}>
    <title>Login with Github</title>
</LogoGithub>
