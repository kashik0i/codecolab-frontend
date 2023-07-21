<script lang="ts">
    import {session} from '../../stores'
    import {ImageLoader} from "carbon-components-svelte";
    import GithubGist from "../../components/Github/GithubGist.svelte";

    $: user = $session._user.providerUser

</script>
<div>
    <!--{JSON.stringify($session)}-->
    {#if (user)}
        <h2>Welcome {user.displayName}</h2>
        <ImageLoader src={user.photoURL} ratio="16x9" style="width: 300px"/>
        <p>email: {user.email}</p>
        <p>provider: {user.providerId}</p>
<!--        <GithubGist/>-->
    {/if}
    <!--    <button on:click={() => $session.signOut()}>Sign Out</button>-->

</div>
<!--<p>session id {id}</p>-->
