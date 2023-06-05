<script>
    // Example.svelte
    import { useQuery } from '@sveltestack/svelte-query'
    import {fetchGists} from "./index.js";
    import {session} from "../../stores/index.js";
    $:token=$session._user.providerUser.getIdToken()
    const queryResult = useQuery(['gists',token],fetchGists)
</script>

{#if $queryResult.isLoading}
    <span>Loading...</span>
{:else if $queryResult.error}
    <span>An error has occurred: {$queryResult.error.message}</span>
{:else}
    {#each $queryResult.data as gist}
        <div>
            <h1>{gist.description}</h1>
<!--            <p>{gist.created_at}</p>-->
<!--            <p>{gist.updated_at}</p>-->
<!--            <p>{gist.comments}</p>-->
            <p>{gist.url}</p>
        </div>
    {/each}
<!--    <div>-->
<!--        <h1>{$queryResult.data.name}</h1>-->
<!--        <p>{$queryResult.data.description}</p>-->
<!--        <strong>👀 {$queryResult.data.subscribers_count}</strong>{' '}-->
<!--        <strong>✨ {$queryResult.data.stargazers_count}</strong>{' '}-->
<!--        <strong>🍴 {$queryResult.data.forks_count}</strong>-->
<!--    </div>-->
{/if}