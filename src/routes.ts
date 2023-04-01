import Login from './views/public/login.svelte'
import Scratch from './views/public/scratch.svelte'
import PublicIndex from './views/public/index.svelte'
import NotFoundPage from './views/public/not_found.svelte'
import PublicLayout from './views/public/layout.svelte'

function userIsAdmin() {
    //check if user is admin and returns true or false
}

const routes = [
    {
        name: '/',
        component: PublicIndex,
        layout: PublicLayout,
    },
    {name: 'login', component: Login, layout: PublicLayout},
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
        name: '404',
        path: '404',
        layout: PublicLayout,
        component: NotFoundPage,
    }
]

export {routes}