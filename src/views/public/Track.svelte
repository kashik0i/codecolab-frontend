<script>
    import { accessToken } from "../../stores/globStore";
    let pathName = location.pathname.split("/");
    let id = pathName[pathName.length - 1];
    let historyItem = history.state;
    let promise = fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
            Authorization: `Bearer ${$accessToken}`
        }
    }).then(res => res.json());
</script>

<div class="container">
    {#await promise}
        <p>loading....</p>
    {:then data}
        <header class="album-header">
            <div class="row">
                <div class="col-md-4">

                    <div>
                        <img
                                class="album-thumb"

                                alt="" />
                    </div>

                </div>
                <div class="col-md-8">

                    <h4>
          <span class="spacer">
            <a class="deep-link" href="/artist/2elBjNSdBE2Y3f0j1mjrql">
              Jay Chou
            </a>
          </span>
                        <span class="spacer">
            <a class="deep-link" href="/artist/4iFznCrxI2nlVer46cgvWG">
              Gary Yang
            </a>
          </span>
                    </h4>

                    <h2>等你下課</h2>
                    <h5>
                        Album Name:
                        <a class="deep-link" href="/album/4IHCvg9UleGOf7v9VJKblR">等你下課</a>
                    </h5>
                    <a
                            href="https://open.spotify.com/track/57hYIeyizqoiFzP7x6eTHq"
                            target="_blank"
                            class="btn btn-primary">
                        View In Spotify
                    </a>
                    <figure>
                        <figcaption>Listen to the 等你下課:</figcaption>
                        <audio
                                controls=""
                                src="https://p.scdn.co/mp3-preview/225c7a6843412be232bdd20a25795fa554fd1739?cid=e11f3f56e75e45089d59eaa9826054a7">
                            Your browser does not support the
                            <code>audio</code>
                            element.
                        </audio>
                    </figure>
                </div>
            </div>
        </header>

    {:catch error}
        <p>Awww...</p>
    {/await}



</div>