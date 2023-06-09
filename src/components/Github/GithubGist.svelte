<script lang="ts">
    import {useSWR} from 'sswr';

    // import { useQuery } from '@sveltestack/svelte-query'
    import {fetchGists, type Gist} from "./index";
    import {session} from "../../stores";
    import {onMount} from "svelte";
    import {Loading} from "carbon-components-svelte";
    import {UrlParser} from "svelte-router-spa/types/router/url_parser";

    $:token = $session?._user?._token
    const gistContentFetcher = async (url: string) => {
        const baseUrl = `https://raw.githack.com`;
        const u=new URL(url);
        const response = await fetch(url, {
            headers: {
                Authorization: `bearer ${token}`,
                'User-Agent': 'fetch-gists',
            },
        })
        return await response.text();
    }
    const gistInfoFetcher = async (url: string) => {
        const response = await fetch(url, {
            headers: {
                Authorization: `bearer ${token}`,
                'User-Agent': 'fetch-gists',
            },
        })
        return await response.json();
    }
    onMount(() => {
        // data = fetcher('https://api.github.com/gists');
    })
    const {data: gists, error} = useSWR('https://api.github.com/gists', {fetcher: gistInfoFetcher});
    // const queryResult = useQuery(['gists',token],fetchGists)
    const g:Gist;
</script>
{#if $gists}
    {#await $gists}
        <Loading/>
    {:then gists}
        <ul>
            {#each gists as gist}
                <li><a href={gist.html_url}>{gist.description || 'No description'}</a></li>
                <pre>
                    {#each Object.keys(gist.files) as file}
                        <p>{JSON.stringify(gist)}</p>
                        <h1>{file.filename}</h1>
                        <p>{file.language}</p>
                        {#await  gistContentFetcher(file.raw_url)}
                            <Loading/>
                        {:then content}
                            <p>{content}</p>
                        {:catch error}
                            <p>An error has occurred: {error.message}</p>
                        {/await}
                    {/each}
                </pre>
            {/each}
        </ul>
    {:catch error}
        <p>An error has occurred: {error.message}</p>
    {/await}
{/if}

<!--{#if error}-->
<!--    {$error}-->
<!--{:else if $gists}-->
<!--    <ul>-->
<!--        {#each $gists as gist}-->
<!--            <li><a href={gist.html_url}>{gist.description || 'No description'}</a></li>-->
<!--        {/each}-->
<!--    </ul>-->
<!--{:else}-->
<!--    <p>Loading...</p>-->
<!--{/if}-->

<!--{#if $queryResult.isLoading}-->
<!--    <span>Loading...</span>-->
<!--{:else if $queryResult.error}-->
<!--    <span>An error has occurred: {$queryResult.error.message}</span>-->
<!--{:else}-->
<!--    {#each $queryResult.data as gist}-->
<!--        <div>-->
<!--            <h1>{gist.description}</h1>-->
<!--&lt;!&ndash;            <p>{gist.created_at}</p>&ndash;&gt;-->
<!--&lt;!&ndash;            <p>{gist.updated_at}</p>&ndash;&gt;-->
<!--&lt;!&ndash;            <p>{gist.comments}</p>&ndash;&gt;-->
<!--            <p>{gist.url}</p>-->
<!--        </div>-->
<!--    {/each}-->
<!--&lt;!&ndash;    <div>&ndash;&gt;-->
<!--&lt;!&ndash;        <h1>{$queryResult.data.name}</h1>&ndash;&gt;-->
<!--&lt;!&ndash;        <p>{$queryResult.data.description}</p>&ndash;&gt;-->
<!--&lt;!&ndash;        <strong>👀 {$queryResult.data.subscribers_count}</strong>{' '}&ndash;&gt;-->
<!--&lt;!&ndash;        <strong>✨ {$queryResult.data.stargazers_count}</strong>{' '}&ndash;&gt;-->
<!--&lt;!&ndash;        <strong>🍴 {$queryResult.data.forks_count}</strong>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--{/if}-->