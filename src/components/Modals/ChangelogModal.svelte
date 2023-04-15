<script lang="ts">
  import {
    Link,
    ListItem,
    Loading,
    Modal,
    OutboundLink,
    UnorderedList,
  } from "carbon-components-svelte";
  import { BreakingChange, CategoryAdd } from "carbon-icons-svelte";
  import { onMount } from "svelte";
  import { changelogTree } from "../../stores";
  let loading = true;
  export let open = false;
  onMount(() => {
    setTimeout(() => {
      loading = false;
      console.log(loading);
    }, 1000);
  });
</script>

<Loading bind:active={loading} description="Active loading indicator" />
<Modal passiveModal bind:open modalHeading="Changelog" on:open on:close>
  {#each $changelogTree.nodes as node}
    <h3>
      <a
        target="_blank"
        rel="noopener noreferrer"
        style="text-decoration-line:none;color: lightskyblue;"
        href={node.releaseUrl}
        >{node.version}
      </a>
      ({node.date})
    </h3>
    <h4><b>Release Highlights</b></h4>
    <p>
      To learn more about these highlights and our future plans please check out
      the
      <OutboundLink open href={node.releaseAnnouncementPost}
        >{node.version} release announcement</OutboundLink
      >
      }
    </p>
    <ul style="list-style:circle ;">
      {#each node.releaseHighlights as highlight}
        <li id={highlight.id}>{highlight.text}</li>
      {/each}
    </ul>
  {/each}
</Modal>
