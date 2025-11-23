import {createRouter, createWebHistory} from 'vue-router';
import {Auth} from "@/store/Workers/Auth.js";
// admin
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
import NotificationsPage from "@/pages/Admin/Warehouses/Notifications/Notifications.vue";

// operator
import OperatorClientsPage from "@/pages/Operator/Clients/Clients.vue"
import OperatorClientsFindPage from "@/pages/Operator/Clients/Find/Find.vue"
import OperatorOrdersPage from "@/pages/Operator/Orders/Orders.vue"
import OperatorOrdersFindPage from "@/pages/Operator/Orders/Find/Find.vue"
import OperatorSalariesPage from "@/pages/Operator/Salaries/Salaries.vue"

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
            },
            {
                name: "WorkersCreatePenalty",
                path: 'penalty/:id',
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
        children: [
            {
                name: "SuppliesWarehouseCreate",
                path: 'create',
            },
            {
                name: "SuppliesWarehouseUpdate",
                path: 'update/:id',
            },
            {
                name: "SuppliesWarehouseDelete",
                path: 'delete/:id',
            },
            {
                name: "SuppliesWarehousePreview",
                path: 'preview/:id',
            },
            {
                name: "SuppliesWarehouseCollect",
                path: 'collect/:id',
            },
            {
                name: "SuppliesWarehouseAccept",
                path: 'accept/:id',
            }
        ]
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
        children: [
            {
                name: "ClientsUpdate",
                path: 'update/:client',
            },
            {
                name: "ClientsJoin",
                path: 'join/:client',
            },
            {
                name: "ClientsJoinAddress",
                path: "join-address/:client"
            },
            {
                name: "ClientsPreviewOrder",
                path: "order/:id"
            }
        ]
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
        children: [
            {
                name: "ClientsFindUpdate",
                path: 'update/:client',
            },
            {
                name: "ClientsFindJoin",
                path: 'join/:client',
            },
            {
                name: "ClientsFindJoinAddress",
                path: "join-address/:client"
            },
            {
                name: "ClientsFindPreviewOrder",
                path: "order/:id"
            },
            {
                name: "ClientsFindSetting",
                path: "setting"
            }
        ]
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
        children: [
            {
                name: "GraphicsSetting",
                path: 'setting',
            }
        ]
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
        path: '/admin/orders-find',
        component: OrdersFindPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Поиск заказов"
        },
        children: [
            {
                name: "OrdersFindDelete",
                path: 'delete/:id',
            },
            {
                name: "OrdersFindReturn",
                path: 'return/:id',
            },
            {
                name: "OrdersFindPreview",
                path: "preview/:id"
            },
            {
                name: "OrdersFindSetting",
                path: "setting"
            }
        ]
    },
    {
        name: "Salaries",
        path: '/admin/salaries',
        component: SalariesPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Зарлаты"
        },
        children: [
            {
                name: "SalariesSetting",
                path: 'setting'
            },
            {
                name: "SalariesAccept",
                path: "accept"
            },

        ]
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
        children: [
            {
                name: "SuppliesCreate",
                path: 'create',
            },
            {
                name: "SuppliesUpdate",
                path: 'update/:id',
            },
            {
                name: "SuppliesDelete",
                path: 'delete/:id',
            },
        ]
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
        children: [
            {
                name: "PromosCreate",
                path: 'create',
            },
            {
                name: "PromosUpdate",
                path: 'update/:id',
            },
            {
                name: "PromosDelete",
                path: 'delete/:id',
            },
        ]
    },
    {
        name: "Notifications",
        path: '/admin/warehouses/notifications',
        component: NotificationsPage,
        meta: {
            isAuth: true,
            isAdmin: true,
            layout: 'Sidebar',
            title: "Малое количество товаров"
        },

    },
    {
        name: "OperatorClients",
        path: '/operator/clients',
        component: OperatorClientsPage,
        meta: {
            isAuth: true,
            isOperator: true,
            layout: 'Sidebar',
            title: "Список клиентов"
        },
        children: [
            {
                name: "OperatorClientsUpdate",
                path: 'update/:client',
            },
            {
                name: "OperatorClientsJoin",
                path: 'join/:client',
            },
            {
                name: "OperatorClientsJoinAddress",
                path: "join-address/:client"
            },
            {
                name: "OperatorClientsPreviewOrder",
                path: "order/:id"
            }
        ]
    },
    {
        name: "OperatorClientsFind",
        path: '/operator/clients-find',
        component: OperatorClientsFindPage,
        meta: {
            isAuth: true,
            isOperator: true,
            layout: 'Sidebar',
            title: "Поиск клиентов"
        },
        children: [
            {
                name: "OperatorClientsFindUpdate",
                path: 'update/:client',
            },
            {
                name: "OperatorClientsFindJoin",
                path: 'join/:client',
            },
            {
                name: "OperatorClientsFindJoinAddress",
                path: "join-address/:client"
            },
            {
                name: "OperatorClientsFindPreviewOrder",
                path: "order/:id"
            },
            {
                name: "OperatorClientsFindSetting",
                path: "setting"
            }
        ]
    },
    {
        name: "OperatorOrders",
        path: '/operator/orders/:status',
        component: OperatorOrdersPage,
        meta: {
            isAuth: true,
            isOperator: true,
            layout: 'Sidebar',
            title: "Заказы"
        },
        children: [
            {
                name: "OperatorOrdersCreate",
                path: 'create',
            },
            {
                name: "OperatorOrdersUpdate",
                path: 'update/:id',
            },
            {
                name: "OperatorOrdersDelete",
                path: 'delete/:id',
            },
            {
                name: "OperatorOrdersReturn",
                path: 'return/:id',
            },
            {
                name: "OperatorOrdersAddBlank",
                path: "add-blank/:id"
            },
            {
                name: "OperatorOrdersAddTrack",
                path: "add-track/:id"
            },
            {
                name: "OperatorOrdersPreview",
                path: "preview/:id"
            },
        ]
    },
    {
        name: "OperatorOrdersFind",
        path: '/operator/orders-find',
        component: OperatorOrdersFindPage,
        meta: {
            isAuth: true,
            isOperator: true,
            layout: 'Sidebar',
            title: "Поиск заказов"
        },
        children: [
            {
                name: "OperatorOrdersFindDelete",
                path: 'delete/:id',
            },
            {
                name: "OperatorOrdersFindReturn",
                path: 'return/:id',
            },
            {
                name: "OperatorOrdersFindPreview",
                path: "preview/:id"
            },
            {
                name: "OperatorOrdersFindSetting",
                path: "setting"
            }
        ]
    },
    {
        name: "OperatorSalaries",
        path: '/operator/salaries',
        component: OperatorSalariesPage,
        meta: {
            isAuth: true,
            isOperator: true,
            layout: 'Sidebar',
            title: "Зарлаты"
        },
        children: [
            {
                name: "OperatorSalariesSetting",
                path: 'setting'
            },
        ]
    },
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

        if (getWorker.value.rule && to.name === 'Auth') {
            if (getWorker.value.rule === 'Админ') {
                next({name: 'Admin'})
            } else if (getWorker.value.rule === 'Сборщик') {
                next({name: "Assembler"})
            } else if (getWorker.value.rule === 'Оператор') {
                next({name: "Operator"})
            } else {
                localStorage.removeItem('token')
                next({name: "Auth"})
            }
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
                localStorage.removeItem('token')
                next({name: "Auth"})
            }
            next();
        }
    }
)

export default router;