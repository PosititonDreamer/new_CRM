import {defineStore} from 'pinia';
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import axios from "axios";

export const Warehouses = defineStore('Warehouses', () => {
    const warehouses = ref([])
    const warehousesTypes = ref([])

    const notifications = ref(false)
    const notificationsDetail = ref(null)

    const getWarehouses = computed(() => warehouses)
    const getWarehousesTypes = computed(() => warehousesTypes)

    const getNotifications = computed(() => notifications)
    const getNotificationsDetail = computed(() => notificationsDetail)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();

    const findWarehouses = async () => {
        updateLoader({method: 'findWarehouses', status: false})
        await axios.get("/admin/warehouses/list.php")
            .then(res => {
                warehouses.value = res.data.warehouses
                warehousesTypes.value = res.data.warehouses_type
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findWarehouses', status: true})
    }

    const createWarehouse = async ({title, description, type}) => {
        updateLoader({method: 'createWarehouse', status: false})
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('type', type)
        await axios.post(`/admin/warehouses/create.php`, formData)
            .then(res => {
                warehouses.value.push(res.data.warehouse)
                router.push({name: "Warehouses"})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createWarehouse', status: true})
    }

    const updateWarehouse = async ({title, description, type, id}) => {
        updateLoader({method: 'updateWarehouse', status: false})
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('type', type)
        formData.append('id', id)
        await axios.post(`/admin/warehouses/update.php`, formData)
            .then(res => {
                warehouses.value = warehouses.value.map(warehouse => {
                    if (warehouse.id === id) {
                        return res.data.warehouse
                    }
                    return warehouse
                })
                router.push({name: "Warehouses"})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateWarehouse', status: true})
    }

    const removeWarehouse = async (id) => {
        updateLoader({method: 'removeWarehouse', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post(`/admin/warehouses/delete.php`, formData)
            .then(res => {
                warehouses.value = warehouses.value.filter(warehouse => +warehouse.id !== +id)
                router.push({name: "Warehouses"})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'removeWarehouse', status: true})
    }

    const findNotifications = async () => {
        updateLoader({method: 'findNotifications', status: false})
        await axios.get(`/admin/goods/notifications.php?check`)
            .then(res => {
                console.log(res.data.check)
                notifications.value = res.data.check
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findNotifications', status: true})
    }

    const findNotificationsDetail = async () => {
        updateLoader({method: 'findNotifications', status: false})
        await axios.get(`/admin/goods/notifications.php`)
            .then(res => {
                notificationsDetail.value = {
                    products: res.data.products,
                    measure_units: res.data.measure_units,
                    warehouses: res.data.warehouses,
                }
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findNotifications', status: true})
    }

    return {
        getWarehouses,
        getWarehousesTypes,
        findWarehouses,
        createWarehouse,
        updateWarehouse,
        removeWarehouse,
        findNotifications,
        findNotificationsDetail,
        getNotifications,
        getNotificationsDetail,
    }

});
