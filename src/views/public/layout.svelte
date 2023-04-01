<script>
    import {Content} from "carbon-components-svelte";
    import Nav from "../../components/Nav.svelte";
    import Theme from "../../components/Theme.svelte";
    import {Route} from 'svelte-router-spa'
    import Session from "../../components/Session.svelte";
    // import TopHeader from './top_header.svelte'

    export let currentRoute
    const params = {}
</script>

<Theme/>
<Nav/>

<Content>
    <div class="body">
        <Session/>
        <Route {currentRoute} {params}/>
    </div>
    <div class="footer"></div>
</Content>


<style>

    .body {
        width: 100vw;
        height: 100vh;
        display: flex;
    }

    /*:global(body){*/
    /*    overflow-y: scroll;*/
    /*    margin-top: 10px;*/
    /*}*/
    /*.body {*/
    /*    display: grid;*/
    /*    grid-template-columns: auto auto;*/
    /*}*/

    /*.footer {*/
    /*}*/
</style>