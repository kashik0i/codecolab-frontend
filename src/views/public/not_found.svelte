<svelte:head>
    <title>404 Not Found</title>
</svelte:head>

<div class="not_found">
    <span class="title">404 Not Found</span>
    <p>
        A wild 404-PAGE appeared!<br>
        This means that your browser was able to communicate with your given server, but the server could not find
        what was requested.<br><br>
        * Make sure the url is correct.<br>
        * Don't panic.
    </p>
    <div>Press any key to continue _</div>
</div>
<style>

    .not_found {
        overflow: hidden;
        font-family: FSEX300,serif;
        font-style: normal;
        font-stretch: normal;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        vertical-align: baseline;
        -webkit-tap-highlight-color: transparent;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        text-size-adjust: 100%;
        background: #0000cd;
        color: #fff;
        font-size: 16px
    }

    /*.container{*/
    /*    width: 100%;*/
    /*    height: 100%*/
    /*}*/

    .not_found {
        display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        align-items: center;
        -webkit-justify-content: center;
        justify-content: center
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box
    }



    p {
        margin: 30px 0;
        text-align: left
    }

    .title {
        background: #ccc;
        color: #0000cd;
        padding: 2px 6px
    }
</style>

