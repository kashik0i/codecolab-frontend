<script lang="ts">
    import {session} from '../../stores'
    import {LocalStorage} from "carbon-components-svelte";
    import {SessionManager} from "./SessionManager";
    import {onMount} from "svelte";

    // if($session.id==="" || $session.id===undefined ){
    //     session.set(Session.guest(true))
    // }

    let localStorage;
    onMount(() => {
            console.log("session mounted")
            session.subscribe(value => {
                console.log("session updated", value)
            })
            if (!$session) {
                $session = SessionManager.guest(true)
                console.log("session created")
            } else {
                console.log("session loaded")
            }
        }
    )


    // function update(e:CustomEvent<{ prevValue: any; value: any }>){
    //     $session.storage=e.detail.value
    // }
    // $:$session.storage
</script>
<!--on:update={update}-->
<!--<LocalStorage key="session" bind:value={localStorage}/>-->
<!--<LocalStorage  key="session-id" bind:value={$session.id}/>-->
<!--<LocalStorage  key="session-user-id" bind:value={$session.user.id}/>-->
<!--<p>user id {$session?.user?.id}</p>-->
<!--<p>session id {$session?.id}</p>-->