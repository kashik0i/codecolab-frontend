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
    import {ChangeCatalog} from "carbon-icons-svelte";
    import ChangelogModal from "./Modals/ChangelogModal.svelte";
    import {navigateTo} from "svelte-router-spa";

    let openSettingsModal = false;
    let openChangelogModal = false;
    let isSideNavOpen = false;
    let isOpen1 = false;
    let isOpen2 = false;
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
                aria-label="Changelong"
                icon={ChangeCatalog}
                on:click={() => (openChangelogModal = !openChangelogModal)}
        />
        <AppSettingsModal bind:open={openSettingsModal}/>
        <!-- () => import("./Modals/ChangelogModal.svelte") -->
        <ChangelogModal bind:open={openChangelogModal}/>
        <HeaderAction
                bind:isOpen={isOpen1}
                icon={UserAvatarFilledAlt}
                closeIcon={UserAvatarFilledAlt}
        >
            <HeaderPanelLinks>
                <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
                <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
                <HeaderPanelDivider>Switcher subject 3</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
            </HeaderPanelLinks>
        </HeaderAction>
        <HeaderAction bind:isOpen={isOpen2}>
            <HeaderPanelLinks>
                <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 5</HeaderPanelLink>
            </HeaderPanelLinks>
        </HeaderAction>
    </HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
    <SideNavItems>
        <SideNavLink text="Home" on:click={()=>navigateTo('/')} />
        <SideNavLink text="About" on:click={()=>navigateTo('about')}/>
        <SideNavLink text="Pricing" on:click={()=>navigateTo('pricing')}/>
        <SideNavLink text="Login" on:click={()=>navigateTo('login')}/>


            <SideNavMenu text="Notebooks">
                <SideNavMenuItem on:click={()=>navigateTo("scratch")} text="scratch"/>
                {#if !$session.isGuest && $session?.notebooks}
                    {#each $session.notebooks as notebook}
                        <SideNavMenuItem on:click={()=>navigateTo(`notebook/${notebook.id}`)} bind:text={notebook.name}/>
                    {/each}
                {/if}
            </SideNavMenu>

    </SideNavItems>
</SideNav>
