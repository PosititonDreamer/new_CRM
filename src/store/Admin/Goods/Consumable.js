import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter, useRoute} from "vue-router";

export const GoodsConsumable = defineStore('GoodsConsumable', () => {
    const goodsConsumable = ref([])

    const getGoodsConsumable = computed(() => goodsConsumable)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();
    const route = useRoute();

    const findGoodsConsumable = async () => {
        updateLoader({method: 'findGoodsConsumable', status: false})
        await axios.get(`/admin/goods/consumable/list.php?warehouse=${route.params.warehouse}`)
            .then((res) => {
                goodsConsumable.value = res.data.goods_consumable
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findGoodsConsumable', status: true})
    }

    const createGoodsConsumable = async ({warehouse, title, balance, few, few_very, binding}) => {
        updateLoader({method: 'createGoodsConsumable', status: false})
        const formData = new FormData()
        formData.append('warehouse', warehouse)
        formData.append('title', title)
        formData.append('balance', balance)
        formData.append('few', few)
        formData.append('few_very', few_very)
        formData.append('binding', JSON.stringify(binding))
        await axios.post(`/admin/goods/consumable/create.php`, formData)
        .then((res) => {
            goodsConsumable.value.push(res.data.goods_consumable)
            addMessages(res.data.messages, 'success')
            router.push({name: "GoodsConsumable", params: {warehouse}})
        })
        .catch(err => {
            addMessages(err.response.data.messages, 'error')
        })
        updateLoader({method: 'createGoodsConsumable', status: true})
    }

    const updateGoodsConsumable = async ({id, warehouse, title, balance, few, few_very, sort, binding}) => {
        updateLoader({method: 'updateGoodsConsumable', status: false})
        const formData = new FormData()
        formData.append('warehouse', warehouse)
        formData.append('title', title)
        formData.append('balance', balance)
        formData.append('few', few)
        formData.append('few_very', few_very)
        formData.append('sort', sort)
        formData.append('id', id)
        formData.append('binding', JSON.stringify(binding))
        await axios.post(`/admin/goods/consumable/update.php`, formData)
            .then((res) => {
                goodsConsumable.value = goodsConsumable.value.map(consumable => {
                    if(consumable.id === id) {
                        return res.data.good_consumable
                    }
                    return consumable
                })
                goodsConsumable.value = goodsConsumable.value.sort((a, b) => a.sort - b.sort)
                addMessages(res.data.messages, 'success')
                router.push({name: "GoodsConsumable", params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateGoodsConsumable', status: true})
    }

    const updateBalanceGoodsConsumable = async ({id, balance, warehouse}) => {
        updateLoader({method: 'updateBalanceGoodsConsumable', status: false})
        const formData = new FormData()
        formData.append('balance', balance)
        formData.append('id', id)
        await axios.post(`/admin/goods/consumable/update_balance.php`, formData)
            .then((res) => {
                const findConsumable = goodsConsumable.value.find(consumable => consumable.id === id)
                findConsumable.balance = res.data.balance
                addMessages(res.data.messages, 'success')
                router.push({name: "GoodsConsumable", params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateBalanceGoodsConsumable', status: true})
    }

    const deleteGoodsConsumable = async ({id, warehouse}) => {
        updateLoader({method: 'deleteGoodsConsumable', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post(`/admin/goods/consumable/delete.php`, formData)
            .then((res) => {
                goodsConsumable.value = goodsConsumable.value.filter(consumable => +consumable.id !== +id)
                addMessages(res.data.messages, 'success')
                router.push({name: "GoodsConsumable", params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteGoodsConsumable', status: true})
    }

    return {
        getGoodsConsumable,
        findGoodsConsumable,
        createGoodsConsumable,
        updateGoodsConsumable,
        updateBalanceGoodsConsumable,
        deleteGoodsConsumable,
    }
});
