import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRoute, useRouter} from "vue-router";

export const SuppliesWarehouse = defineStore('SuppliesWarehouse', () => {

    const supplies = ref([])
    const suppliesTypes = ref([])
    const suppliesWarehouse = ref([])
    const suppliesDetail = ref(null)

    const getSupplies = computed(() => supplies)
    const getSuppliesTypes = computed(() => suppliesTypes)
    const getSuppliesWarehouse = computed(() => suppliesWarehouse)
    const getSuppliesDetail = computed(() => suppliesDetail)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();

    const route = useRoute()
    const router = useRouter()

    const findSuppliesWarehouse = async () => {
        updateLoader({method: 'findSuppliesWarehouse', status: false})
        await axios.get(`/supplies/list.php?warehouse=${route.params.warehouse}`)
            .then(res => {
                supplies.value = res.data.supplies
                suppliesTypes.value = res.data.types
                suppliesWarehouse.value = res.data.warehouses_supply
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findSuppliesWarehouse', status: true})
    }

    const findSuppliesWarehouseDetail = async () => {
        updateLoader({method: 'findSuppliesWarehouse', status: false})
        await axios.get(`/supplies/item.php?id=${route.params.id}`)
            .then(res => {
                suppliesDetail.value = {
                    supply: res.data.supply,
                    list: res.data.list,
                    status_list: res.data.status_list
                }
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findSuppliesWarehouse', status: true})
    }

    const createSuppliesWarehouse = async ({supply, list}, afterPage = 'SuppliesWarehouse') => {
        updateLoader({method: 'createSuppliesWarehouse', status: false})
        const formData = new FormData()
        formData.append('supply', supply)
        formData.append('list', JSON.stringify(list))
        await axios.post(`/supplies/create.php`, formData)
            .then(res => {
                supplies.value.push(res.data.supply)
                addMessages(res.data.messages, 'success')
                router.push({name: afterPage})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createSuppliesWarehouse', status: true})
    }

    const updateSuppliesWarehouse = async ({id, list}, afterPage = 'SuppliesWarehouse') => {
        updateLoader({method: 'updateSuppliesWarehouse', status: false})
        const formData = new FormData()
        formData.append('id', id)
        formData.append('list', JSON.stringify(list))
        await axios.post(`/supplies/update.php`, formData)
            .then(res => {
                supplies.value = supplies.value.map(supply => {
                    if(+supply.id === +id) {
                        supply.length = res.data.length
                    }
                    return supply
                })
                addMessages(res.data.messages, 'success')
                router.push({name: afterPage})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateSuppliesWarehouse', status: true})
    }

    const deleteSuppliesWarehouse = async (id, afterPage = 'SuppliesWarehouse') => {
        updateLoader({method: 'deleteSuppliesWarehouse', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post(`/supplies/delete.php`, formData)
            .then(res => {
                supplies.value = supplies.value.filter(supply => +supply.id !== +id)
                addMessages(res.data.messages, 'success')
                router.push({name: afterPage})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteSuppliesWarehouse', status: true})
    }

    const sendSuppliesWarehouse = async (id, afterPage = 'SuppliesWarehouse') => {
        updateLoader({method: 'sendSuppliesWarehouse', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post(`/supplies/send.php`, formData)
            .then(res => {
                supplies.value = supplies.value.map(supply => {
                    if(+supply.id === +id) {
                        supply.supply_status = res.data.supply_status
                    }
                    return supply
                })
                addMessages(res.data.messages, 'success')
                router.push({name: afterPage})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'sendSuppliesWarehouse', status: true})
    }

    const acceptSuppliesWarehouse = async (id, afterPage = 'SuppliesWarehouse') => {
        updateLoader({method: 'acceptSuppliesWarehouse', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post(`/supplies/accept.php`, formData)
            .then(res => {
                supplies.value = supplies.value.map(supply => {
                    if(+supply.id === +id) {
                        supply.supply_status = res.data.supply_status
                    }
                    return supply
                })
                addMessages(res.data.messages, 'success')
                router.push({name: afterPage})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'acceptSuppliesWarehouse', status: true})
    }

    const clearDetail = () => {
        suppliesDetail.value = null
    }

    return {
        findSuppliesWarehouse,
        findSuppliesWarehouseDetail,
        getSupplies,
        getSuppliesTypes,
        getSuppliesWarehouse,
        getSuppliesDetail,
        createSuppliesWarehouse,
        updateSuppliesWarehouse,
        deleteSuppliesWarehouse,
        sendSuppliesWarehouse,
        acceptSuppliesWarehouse,
        clearDetail
    }
})