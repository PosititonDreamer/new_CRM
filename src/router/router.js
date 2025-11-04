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
import OperatorPage from "@/pages/Operator/Operator.vue";
import AssemblerPage from "@/pages/Assembler/Assembler.vue";
import GraphicsPage from "@/pages/Admin/Graphics/Graphics.vue";
import OrdersPage from "@/pages/Admin/Orders/Orders.vue";
import SalariesPage from "@/pages/Admin/Salaries/Salaries.vue";
import SuppliesPage from "@/pages/Admin/Supplies/Supplies.vue";
import SuppliesWarehousePage from "@/pages/Admin/Warehouses/Supplies/Supplies.vue";
import ClientsPage from "@/pages/Admin/Clients/Clients.vue";
import PromosPage from "@/pages/Admin/Promos/Promos.vue";
import OrdersFindPage from "@/pages/Admin/Orders/Find/Find.vue";
import ClientsFindPage from "@/pages/Admin/Clients/Find/Find.vue";

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
        name: 'Operator',
        path: '/operator',
        component: OperatorPage,
        meta: {
            isAuth: true,
            isOperator: true,
            layout: 'Sidebar',
            title: "Оператор"
        },
    },
    {
        name: 'Assembler',
        path: '/assembler',
        component: AssemblerPage,
        meta: {
            isAuth: true,
            isAssembler: true,
            layout: 'Sidebar',
            title: "Сборщик"
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
                name: "GoodsKitDelete",
                path: 'delete/:id',
            }
        ]
    },
    {
        name: "SuppliesWarehouse",
        path: '/admin/warehouses/:warehouse/supplies',
        component: SuppliesWarehousePage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Поставки"
        },
        children: []
    },
    {
        name: "Clients",
        path: '/admin/clients',
        component: ClientsPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Список клиентов"
        },
        children: []
    },
    {
        name: "ClientsFind",
        path: '/admin/clients-find',
        component: ClientsFindPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Поиск клиентов"
        },
        children: []
    },
    {
        name: "Graphics",
        path: '/admin/graphics',
        component: GraphicsPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Грфики"
        },
        children: []
    },
    {
        name: "Orders",
        path: '/admin/orders/:status',
        component: OrdersPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Заказы"
        },
        children: [
            {
                name: "OrdersCreate",
                path: 'create',
            },
            {
                name: "OrdersUpdate",
                path: 'update/:id',
            },
            {
                name: "OrdersDelete",
                path: 'delete/:id',
            },
            {
                name: "OrdersReturn",
                path: 'return/:id',
            },
            {
                name: "OrdersAddBlank",
                path: "add-blank/:id"
            },
            {
                name: "OrdersAddTrack",
                path: "add-track/:id"
            },
            {
                name: "OrdersPreview",
                path: "preview/:id"
            },
            {
                name: "OrdersCollect",
                path: "collect/:id"
            },
            {
                name: "OrdersSend",
                path: "send/:id"
            },
            {
                name: "OrdersSendSeveral",
                path: "send-several"
            }
        ]
    },
    {
        name: "OrdersFind",
        path: '/admin/orders/find',
        component: OrdersFindPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Поиск заказов"
        },
        children: []
    },
    {
        name: "Salaries",
        path: '/admin/salaries',
        component: SalariesPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Заплаты"
        },
        children: []
    },
    {
        name: "Supplies",
        path: '/admin/supplies',
        component: SuppliesPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Связь складов"
        },
        children: []
    },
    {
        name: "Promos",
        path: '/admin/promos',
        component: PromosPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Промокоды"
        },
        children: []
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
        const token = localStorage.getItem('token')
        const {checkAuth, getWorker} = Auth();

        if (!getWorker.value.rule && token) {
            await checkAuth(token)
        }

        if (to.meta.isAuth && to.meta.isAdmin) {
            if (getWorker.value.rule && getWorker.value.rule === 'Админ') {
                next()
            } else if (getWorker.value.rule && getWorker.value.rule === 'Сборщик') {
                next({name: "Assembler"})
            } else if (getWorker.value.rule && getWorker.value.rule === 'Оператор') {
                next({name: "Operator"})
            } else {
                localStorage.removeItem('token')
                next({name: "Auth"})
            }
        } else if (to.meta.isAuth && to.meta.isOperator) {
            if (getWorker.value.rule && getWorker.value.rule === 'Оператор') {
                next()
            } else if (getWorker.value.rule && getWorker.value.rule === 'Сборщик') {
                next({name: "Assembler"})
            } else if (getWorker.value.rule && getWorker.value.rule === 'Админ') {
                next({name: "Admin"})
            } else {
                localStorage.removeItem('token')
                next({name: "Auth"})
            }
        } else if (to.meta.isAuth && to.meta.isAssembler) {
            if (getWorker.value.rule && getWorker.value.rule === 'Сборщик') {
                next()
            } else if (getWorker.value.rule && getWorker.value.rule === 'Оператор') {
                next({name: "Operator"})
            } else if (getWorker.value.rule && getWorker.value.rule === 'Админ') {
                next({name: "Admin"})
            } else {
                localStorage.removeItem('token')
                next({name: "Auth"})
            }
        } else {
            if (to.name !== 'Auth') {
                next({name: "Auth"})
            }
            next();
        }
    }
)

export default router;