<script lang="ts">
    import AppSettingsModal from "./Modals/AppSettingsModal.svelte";
    import {session} from '../stores'
    import {
        Header,
        HeaderUtilities,
        HeaderAction,
        HeaderGlobalAction,
        HeaderPanelLinks,
        HeaderPanelDivider,
        HeaderPanelLink,
        SideNav,
        SideNavItems,
        SideNavMenu,
        SideNavMenuItem,
        SideNavLink,
        SkipToContent,
    } from "carbon-components-svelte";
    import SettingsAdjust from "carbon-icons-svelte/lib/SettingsAdjust.svelte";
    import UserAvatarFilledAlt from "carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte";
    import {ChangeCatalog, Login, LogoGithub, Logout} from "carbon-icons-svelte";
    import ChangelogModal from "./Modals/ChangelogModal.svelte";
    import {navigateTo} from "svelte-router-spa";
    import LogoutModal from "./Modals/LogoutModal.svelte";
    import LoginModal from "./Modals/LoginModal.svelte";
    // import Login from "./Auth/Login.svelte";
    // import Logout from "./Auth/Logout.svelte";

    let openSettingsModal = false;
    let openAuthModal = false;
    let openChangelogModal = false;
    let isSideNavOpen = false;
    let isOpen1 = false;
    let isOpen2 = false;
    $: loggedIn = $session && $session._user && !$session._user._guest;
</script>

<Header
        persistentHamburgerMenu={true}
        platformName="CodeColab"
        bind:isSideNavOpen
>
    <svelte:fragment slot="skip-to-content">
        <SkipToContent/>
    </svelte:fragment>
    <HeaderUtilities>
        <HeaderGlobalAction
                aria-label="Settings"
                icon={SettingsAdjust}
                on:click={() => (openSettingsModal = !openSettingsModal)}
        />
        <HeaderGlobalAction
                aria-label="Changelog"
                icon={ChangeCatalog}
                on:click={() => (openChangelogModal = !openChangelogModal)}
        />
        <AppSettingsModal bind:open={openSettingsModal}/>
        <ChangelogModal bind:open={openChangelogModal}/>
        <HeaderAction
                bind:isOpen={isOpen1}
                icon={UserAvatarFilledAlt}
                closeIcon={UserAvatarFilledAlt}
        >
            <HeaderPanelLinks>
                {#if (loggedIn)}
                    <HeaderPanelLink>Profile</HeaderPanelLink>
                    <HeaderPanelLink>Account</HeaderPanelLink>
                    <HeaderPanelLink>Support</HeaderPanelLink>
                    <HeaderPanelDivider/>
                {:else}
                    <HeaderPanelLink>Register</HeaderPanelLink>
                    <HeaderPanelDivider/>
                {/if}
            </HeaderPanelLinks>
        </HeaderAction>
        {#if (loggedIn)}
            <HeaderGlobalAction
                    aria-label="Logout"
                    icon={Logout}
                    on:click={() => (openAuthModal = !openAuthModal)}
            />
            <LogoutModal bind:open={openAuthModal}/>
        {:else}
            <HeaderGlobalAction
                    aria-label="Login"
                    icon={Login}
                    on:click={() => (openAuthModal = !openAuthModal)}
            />
            <LoginModal bind:open={openAuthModal}/>
        {/if}


        <!--        <HeaderAction bind:isOpen={isOpen2}>-->
        <!--            <HeaderPanelLinks>-->
        <!--                <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>-->
        <!--                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>-->
        <!--                <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>-->
        <!--                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>-->
        <!--                <HeaderPanelLink>Switcher item 2</HeaderPanelLink>-->
        <!--                <HeaderPanelLink>Switcher item 3</HeaderPanelLink>-->
        <!--                <HeaderPanelLink>Switcher item 4</HeaderPanelLink>-->
        <!--                <HeaderPanelLink>Switcher item 5</HeaderPanelLink>-->
        <!--            </HeaderPanelLinks>-->
        <!--        </HeaderAction>-->
    </HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
    <SideNavItems>
        <SideNavLink text="Home" on:click={()=>navigateTo(loggedIn?'home':'/')}/>
        <SideNavLink text="About" on:click={()=>navigateTo('about')}/>
        <SideNavLink text="Pricing" on:click={()=>navigateTo('pricing')}/>
        <!--{#if (loggedIn)}-->
        <!--    <SideNavLink text="Logout" on:click={()=>navigateTo('logout')}/>-->
        <!--{:else}-->
        <!--    <SideNavLink text="Login" on:click={()=>navigateTo('login')}/>-->
        <!--{/if}-->


        <SideNavMenu text="Notebooks">
            <SideNavMenuItem on:click={()=>navigateTo("scratch")} text="scratch"/>
            {#if $session && !$session.isGuest && $session?.notebooks}
                {#each $session.notebooks as notebook}
                    <SideNavMenuItem on:click={()=>navigateTo(`notebook/${notebook.id}`)} bind:text={notebook.name}/>
                {/each}
            {/if}
        </SideNavMenu>

    </SideNavItems>
</SideNav>
