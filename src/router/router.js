import {createRouter, createWebHistory} from 'vue-router';
import UIPage from "@/pages/UI/UI.vue";
import AuthPage from "@/pages/Auth/Auth.vue";
import AdminPage from "@/pages/Admin/Admin.vue";
import ProductsPage from "@/pages/Admin/Products/Products.vue";
import {Auth} from "@/store/workers/Auth.js";

const routes = [
    {
        name: 'UI',
        path: '/ui',
        component: UIPage,
        meta: {
            layout: 'Sidebar',
        },
    },
    {
        name: 'Auth',
        path: '/',
        component: AuthPage,
        meta: {
            layout: 'Default',
        }
    },
    {
        name: 'Admin',
        path: '/admin',
        component: AdminPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
        },
    },
    {
        name: "Products",
        path: '/admin/products',
        component: ProductsPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
        },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token')
    const {checkAuth, getWorker} = Auth();

    if(to.meta.isAuth && to.meta.isAdmin) {
        if(!getWorker.value.rule && token) {
            await checkAuth(token)
        }

        if(getWorker.value.rule && getWorker.value.rule === 'Админ') {
            next()
        } else {
            // todo: Для других ролей
            next('/')
        }
    } else {
        next()
    }
})

export default router;