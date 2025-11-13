import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import router from "@/router/router.js";

export const Supplies = defineStore('Supplies', () => {
    const supplies = ref([]);
    const goods = ref([]);

    const getSupplies = computed(() => supplies)
    const getGoods =  computed(() => goods)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();

    const findSupplies = async () => {
        updateLoader({method: 'findSupplies', status: false})
        await axios.get('/admin/supplies/list.php')
            .then(res => {
                supplies.value = res.data.supplies;
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findSupplies', status: true})
    }

    const findGoods = async () => {
        updateLoader({method: 'findGoods', status: false})
        await axios.get('/admin/supplies/goods.php')
            .then(res => {
                goods.value = res.data.goods
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findGoods', status: true})
    }

    const createSupplies = async ({warehouse_receive, warehouse_give, list}) => {
        updateLoader({method: 'createSupplies', status: false})
        const formData = new FormData()
        formData.append('warehouse_receive', warehouse_receive)
        formData.append('warehouse_give', warehouse_give)
        formData.append('list', JSON.stringify(list))
        await axios.post('/admin/supplies/create.php', formData)
            .then(res => {
                supplies.value.push(res.data.supply)
                addMessages(res.data.messages, 'success')
                router.push({name: "Supplies"})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createSupplies', status: true})
    }

    const updateSupplies = async ({id, list}) => {
        updateLoader({method: 'updateSupplies', status: false})
        const formData = new FormData()
        formData.append('id', id)
        formData.append('list', JSON.stringify(list))
        await axios.post('/admin/supplies/update.php', formData)
            .then(res => {
                supplies.value = supplies.value.map(item => {
                    if (+item.id === +id) {
                        return {
                            id: item.id,
                            warehouse_receive: item.warehouse_receive,
                            warehouse_give: item.warehouse_give,
                            list: res.data.supply.list
                        }
                    }
                    return item
                })
                addMessages(res.data.messages, 'success')
                router.push({name: "Supplies"})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateSupplies', status: true})
    }

    const deleteSupplies = async (id) => {
        updateLoader({method: 'deleteSupplies', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/supplies/delete.php', formData)
            .then(res => {
                supplies.value = supplies.value.filter(item => +item.id !== +id)
                addMessages(res.data.messages, 'success')
                router.push({name: "Supplies"})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteSupplies', status: true})
    }

    return {
        getSupplies,
        getGoods,
        findSupplies,
        findGoods,
        createSupplies,
        updateSupplies,
        deleteSupplies,
    }

});
