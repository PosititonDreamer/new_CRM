import {defineStore} from 'pinia';
import {Errors} from "@/store/Errors.js";
import {Loader} from "@/store/Loader.js";
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import axios from "axios";

export const Warehouses = defineStore('Warehouses', () => {
    const warehouses = ref()
    const warehousesTypes = ref([])

    const getWarehouses = computed(() => warehouses)
    const getWarehousesTypes = computed(() => warehousesTypes)

    const {updateLoader} = Loader()
    const {addErrors} = Errors();
    const router = useRouter();

    const findWarehouses = async () => {
        updateLoader({method: 'findWarehouses', status: false})
        await axios.get("/admin/warehouses/list.php")
            .then(res => {
                warehouses.value = res.data.warehouses
                warehousesTypes.value = res.data.warehouses_type
            })
            .catch((err) => {
                addErrors(err.response.data.messages)
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
            })
            .catch((err) => {
                addErrors(err.response.data.messages)
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
                    if(warehouse.id === id) {
                        return res.data.warehouse
                    }
                    return warehouse
                })
                router.push({name: "Warehouses"})
            })
            .catch((err) => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'updateWarehouse', status: true})
    }

    const removeWarehouse = async (id) => {
        updateLoader({method: 'removeWarehouse', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post(`/admin/warehouses/delete.php`, formData)
            .then(() => {
                warehouses.value = warehouses.value.filter(warehouse => +warehouse.id !== +id)
                router.push({name: "Warehouses"})
            })
            .catch((err) => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'removeWarehouse', status: true})
    }

    return {
        getWarehouses,
        getWarehousesTypes,
        findWarehouses,
        createWarehouse,
        updateWarehouse,
        removeWarehouse,
    }

});
