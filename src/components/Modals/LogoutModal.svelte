<script lang="ts">
    import {
        Modal,
    } from "carbon-components-svelte";
    import {session} from "../../stores";
    import {navigateTo} from "svelte-router-spa";
    import {FirebaseClient} from "../Auth/firebase";

    export let open = false;

    const handleLogout = async (e) => {
        const firebaseClient = new FirebaseClient();
        await firebaseClient.logout()
        open = false;
        navigateTo("/")
    };


</script>

<Modal
        bind:open
        modalHeading="Logout"
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        danger={true}
        on:click:button--secondary={() => (open = false)}
        on:open
        on:close={() => (open = false)}
        on:submit={handleLogout}
>
    Unsaved files exist, are you sure you want to logout?
</Modal>
