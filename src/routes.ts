import Login from './views/public/login.svelte'
import Scratch from './views/public/scratch.svelte'
import NotFoundPage from './views/public/not_found.svelte'
import PublicIndex from './views/public/index.svelte'
import PublicLayout from './views/public/layout.svelte'
// import {index as LoggedInHome, layout as LoggedInLayout} from './views/user/index'
import LoggedInHome from './views/user/index.svelte'
import LoggedInLayout from './views/user/layout.svelte'
import {session} from "./stores";
import {get_store_value} from "svelte/internal";

function userIsAdmin() {
    //check if user is admin and returns true or false
}

function userIsLoggedIn() {
    //check if user is logged in and returns true or false
    return get_store_value(session)?._user?.providerUser != null
}

const routes = [
    {
        name: '/',
        component: PublicIndex,
        layout: PublicLayout,
    },
    {name: 'login', component: Login, layout: PublicLayout},
    {name: 'logout', component: Login, layout: PublicLayout},
    {name: 'scratch', component: Scratch, layout: PublicLayout},
    // {
    //     name: 'admin',
    //     component: AdminLayout,
    //     onlyIf: { guard: userIsAdmin, redirect: '/login' },
    //     nestedRoutes: [
    //         { name: 'index', component: AdminIndex },
    //         {
    //             name: 'employees',
    //             component: '',
    //             nestedRoutes: [
    //                 { name: 'index', component: EmployeesIndex },
    //                 // { name: 'show/:id', component: EmployeesShow },
    //             ],
    //         },
    //     ],
    // },
    {
        name: 'home',
        onlyIf: {guard: userIsLoggedIn, redirect: '/login'},
        layout: LoggedInLayout, component: LoggedInHome
    },
    {
        name: '404',
        path: '404',
        layout: PublicLayout,
        component: NotFoundPage,
    }
]

export {routes}