import {createRouter, createWebHistory} from 'vue-router';
import {Auth} from "@/store/workers/Auth.js";

import UIPage from "@/pages/UI/UI.vue";
import AuthPage from "@/pages/Auth/Auth.vue";
import AdminPage from "@/pages/Admin/Admin.vue";
import ProductsPage from "@/pages/Admin/Products/Products.vue";
import MeasureUnitsPage from "@/pages/Admin/Products/MeasureUnits/MeasureUnits.vue";
import OtherPage from "@/pages/Admin/Products/Other/Other.vue";
import PackingPage from "@/pages/Admin/Products/Packing/Packing.vue";

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
            title: "Админка"
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
            page: 'products',
            title: "Продукты"
        },
        children: [
            {
                name: "ProductsCreate",
                path: 'create',
            },
            {
                name: "ProductsUpdate",
                path: 'update/:id',
            }
        ]
    },
    {
        name: "MeasureUnits",
        path: '/admin/products/measure-units',
        component: MeasureUnitsPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            page: 'products',
            title: "Единицы измерения"
        },
        children: [
            {
                name: "MeasureUnitsCreate",
                path: 'create',
            },
            {
                name: "MeasureUnitsUpdate",
                path: 'update/:id',
            }
        ]
    },
    {
        name: "Other",
        path: '/admin/products/other',
        component: OtherPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            page: 'products',
            title: "Кривые продукты"
        },
    },
    {
        name: "Packing",
        path: '/admin/products/packing',
        component: PackingPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            page: 'products',
            title: "Упаковки"
        },
        children: [
            {
                name: "PackingCreate",
                path: 'create',
            },
            {
                name: "PackingUpdate",
                path: 'update/:id',
            }
        ]
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