<script lang="ts">
    import {session} from '../sessionStore'
    import {LocalStorage} from "carbon-components-svelte";
    import {Session} from "../Models/Session";

    // if($session.id==="" || $session.id===undefined ){
    //     session.set(Session.guest(true))
    // }
    session.set(Session.guest(true))
    // function update(e:CustomEvent<{ prevValue: any; value: any }>){
    //     $session.storage=e.detail.value
    // }
    // $:$session.storage
</script>
<!--on:update={update}-->
<LocalStorage  key="session" bind:value={$session}/>
<!--<LocalStorage  key="session-id" bind:value={$session.id}/>-->
<!--<LocalStorage  key="session-user-id" bind:value={$session.user.id}/>-->
