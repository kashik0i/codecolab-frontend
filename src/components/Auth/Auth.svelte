<script lang="ts">
    import {LogoGithub,Logout} from 'carbon-icons-svelte'
    import {Button} from 'carbon-components-svelte'

    import {FirebaseClient} from "./firebase";
    import {session} from "../../stores";
    let firebaseClient = new FirebaseClient();

    $: user = $session?._user?.providerUser;
</script>

{#if (user)}
    <Button icon={Logout} iconDescription="Logout"  on:click={firebaseClient.logout}></Button>
{:else}
    <Button icon={LogoGithub} iconDescription="Login with Github"  on:click={firebaseClient.loginWithGithub}></Button>
{/if}