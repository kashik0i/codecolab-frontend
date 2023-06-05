<script lang="ts">
    import Theme from "./components/Theme.svelte";
    import Nav from "./components/Nav.svelte";
    import {Content, Grid, Row, Column} from "carbon-components-svelte";
    import {v4 as uuidv4} from "uuid";
    import {navigateTo, Router} from 'svelte-router-spa'
    import {routes} from './routes'
    import {onMount} from "svelte";
    import {session} from "./stores";

    let page_id: string = uuidv4()
    onMount(() => {
        if($session?._user?.providerUser){
            navigateTo('home')
        }else   {
            navigateTo('login')
        }

    });
</script>

<Router {routes}/>

