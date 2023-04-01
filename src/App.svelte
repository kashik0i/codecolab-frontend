<script lang="ts">
    import Theme from "./components/Theme.svelte";
    import Nav from "./components/Nav.svelte";
    import {Content, Grid, Row, Column} from "carbon-components-svelte";
    import {v4 as uuidv4} from "uuid";
    import {Router} from 'svelte-router-spa'
    import {routes} from './routes'

    let page_id: string = uuidv4()
</script>

<Router {routes}/>

