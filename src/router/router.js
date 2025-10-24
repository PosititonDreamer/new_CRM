import {createRouter, createWebHistory} from 'vue-router';
import {Auth} from "@/store/workers/Auth.js";

import UIPage from "@/pages/UI/UI.vue";
import AuthPage from "@/pages/Auth/Auth.vue";
import AdminPage from "@/pages/Admin/Admin.vue";
import ProductsPage from "@/pages/Admin/Products/Products.vue";
import MeasureUnitsPage from "@/pages/Admin/Products/MeasureUnits/MeasureUnits.vue";
import OtherPage from "@/pages/Admin/Products/Other/Other.vue";
import PackingPage from "@/pages/Admin/Products/Packing/Packing.vue";
import WarehousesPage from "@/pages/Admin/Warehouses/Warehouses.vue";
import WorkersPage from "@/pages/Admin/Workers/Workers.vue";
import GoodsPage from "@/pages/Admin/Warehouses/Goods/Goods.vue";
import GoodsWeightPage from "@/pages/Admin/Warehouses/Goods/Weight/Weight.vue";
import GoodsConsumablePage from "@/pages/Admin/Warehouses/Goods/Consumable/Consumable.vue";
import GoodsOtherPage from "@/pages/Admin/Warehouses/Goods/Other/Other.vue";
import GoodsKitPage from "@/pages/Admin/Warehouses/Goods/Kit/Kit.vue";

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
            },
            {
                name: "ProductsDelete",
                path: 'delete/:id',
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
            },
            {
                name: "MeasureUnitsDelete",
                path: 'delete/:id',
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
            title: "Кривые продукты"
        },
        children: [
            {
                name: "OtherUpdate",
                path: 'update/:id',
            }
        ]
    },
    {
        name: "Packing",
        path: '/admin/products/packing',
        component: PackingPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
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
            },
            {
                name: "PackingDelete",
                path: 'delete/:id',
            }
        ]
    },
    {
        name: "Warehouses",
        path: '/admin/warehouses',
        component: WarehousesPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Склады"
        },
        children: [
            {
                name: "WarehousesCreate",
                path: 'create',
            },
            {
                name: "WarehousesUpdate",
                path: 'update/:id',
            },
            {
                name: "WarehousesDelete",
                path: 'delete/:id',
            }
        ]
    },
    {
        name: "Workers",
        path: '/admin/workers',
        component: WorkersPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Работники"
        },
        children: [
            {
                name: "WorkersCreate",
                path: 'create',
            },
            {
                name: "WorkersUpdate",
                path: 'update/:id',
            },
            {
                name: "WorkersUpdateToken",
                path: 'update-token/:id',
            },
            {
                name: "WorkersDelete",
                path: 'delete/:id',
            }
        ]
    },
    {
        name: "Goods",
        path: '/admin/warehouses/:warehouse/goods',
        component: GoodsPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Фасованные товары"
        },
        children: [
            {
                name: "GoodsCreate",
                path: 'create',
            },
            {
                name: "GoodsUpdate",
                path: 'update/:id',
            },
            {
                name: "GoodsUpdateBalance",
                path: 'update-balance/:id',
            },
            {
                name: "GoodsDelete",
                path: 'delete/:id',
            }
        ]
    },
    {
        name: "GoodsWeight",
        path: '/admin/warehouses/:warehouse/goods-weight',
        component: GoodsWeightPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Весовые товары"
        },
        children: [
            {
                name: "GoodsWeightCreate",
                path: 'create',
            },
            {
                name: "GoodsWeightUpdate",
                path: 'update/:id',
            },
            {
                name: "GoodsWeightUpdateBalance",
                path: 'update-balance/:id',
            },
            {
                name: "GoodsWeightDelete",
                path: 'delete/:id',
            }
        ]
    },
    {
        name: "GoodsConsumable",
        path: '/admin/warehouses/:warehouse/goods-consumable',
        component: GoodsConsumablePage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Расходники"
        },
        children: [
            {
                name: "GoodsConsumableCreate",
                path: 'create',
            },
            {
                name: "GoodsConsumableUpdate",
                path: 'update/:id',
            },
            {
                name: "GoodsConsumableUpdateBalance",
                path: 'update-balance/:id',
            },
            {
                name: "GoodsConsumableDelete",
                path: 'delete/:id',
            }
        ]
    },
    {
        name: "GoodsOther",
        path: '/admin/warehouses/:warehouse/goods-other',
        component: GoodsOtherPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Коробки и магниты"
        },
        children: [
            {
                name: "GoodsOtherCreate",
                path: 'create',
            },
            {
                name: "GoodsOtherUpdate",
                path: 'update/:id',
            },
            {
                name: "GoodsOtherUpdateBalance",
                path: 'update-balance/:id',
            },
            {
                name: "GoodsOtherDelete",
                path: 'delete/:id',
            }
        ]
    },
    {
        name: "GoodsKit",
        path: '/admin/warehouses/:warehouse/goods-kit',
        component: GoodsKitPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Наборы товаров"
        },
        children: [
            {
                name: "GoodsKitCreate",
                path: 'create',
            },
            {
                name: "GoodsKitUpdate",
                path: 'update/:id',
            },
            {
                name: "GoodsKitUpdateBalance",
                path: 'update-balance/:id',
            },
            {
                name: "GoodsKitDelete",
                path: 'delete/:id',
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