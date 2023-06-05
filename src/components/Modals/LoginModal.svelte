<script lang="ts">
    import {
        Button,
        Modal,
    } from "carbon-components-svelte";
    import {LogoGithub} from "carbon-icons-svelte";
    import {navigateTo} from "svelte-router-spa";
    import {FirebaseClient} from "../Auth/firebase";

    export let open = false;

    const handleLogin = async (e) => {
        const firebaseClient = new FirebaseClient();
        await firebaseClient.loginWithGithub()
        open = false;
        navigateTo("/home")
    };


</script>

<Modal
        passiveModal
        bind:open
        modalHeading="Login"
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        danger={true}
        on:click:button--secondary={() => (open = false)}
        on:open
        on:close={() => (open = false)}
        on:submit={() => (open = false)}
>
    <h3>Please login with your Github account</h3>
    <Button icon={LogoGithub} iconDescription="Login with Github" on:click={handleLogin}></Button>
</Modal>
