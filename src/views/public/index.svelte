<script lang="ts">
    import {session} from '../../stores'


    console.log($session)

</script>
<div>
    <p>user id: {$session._user._id}</p>
    <p>session id: {$session._id}</p>
</div>
<!--<p>session id {id}</p>-->
