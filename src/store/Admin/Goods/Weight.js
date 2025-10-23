import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter, useRoute} from "vue-router";

export const GoodsWeight = defineStore('GoodsWeight', () => {
    const goodsWeight = ref([])
    const getGoodsWeight = computed(() => goodsWeight)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();
    const route = useRoute();


    const findGoodsWeight = async () => {
        updateLoader({method: 'findGoodsWeight', status: false})
        await axios.get(`/admin/goods/weight/list.php?warehouse=${route.params.warehouse}`)
            .then((res) => {
                goodsWeight.value = res.data.goods_weight
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findGoodsWeight', status: true})
    }

    const createGoodsWeight = async ({product, warehouse, balance, few, few_very, composite, composite_list}) => {
        updateLoader({method: 'createGoodsWeight', status: false})
        const formData = new FormData()
        formData.append('warehouse', warehouse)
        formData.append('product', product)
        formData.append('balance', balance)
        formData.append('few', few)
        formData.append('few_very', few_very)
        formData.append('composite', composite)
        formData.append('composite_list', JSON.stringify(composite_list))
        await axios.post(`/admin/goods/weight/create.php`, formData)
            .then((res) => {
                goodsWeight.value.push(res.data.good_weight)
                addMessages(res.data.messages, 'success')
                router.push({name: "GoodsWeight", params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createGoodsWeight', status: true})
    }

    const updateGoodsWeight = async ({id, product, warehouse, balance, few, few_very, composite, composite_list}) => {
        updateLoader({method: 'updateGoodsWeight', status: false})
        const formData = new FormData()
        formData.append('id', id)
        formData.append('warehouse', warehouse)
        formData.append('product', product)
        formData.append('balance', balance)
        formData.append('few', few)
        formData.append('few_very', few_very)
        formData.append('composite', composite)
        formData.append('composite_list', JSON.stringify(composite_list))
        await axios.post(`/admin/goods/weight/update.php`, formData)
            .then((res) => {
                goodsWeight.value = goodsWeight.value.map(good => {
                    if(good.id === id) {
                        return res.data.good_weight
                    }
                    return good
                })
                addMessages(res.data.messages, 'success')
                router.push({name: "GoodsWeight", params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateGoodsWeight', status: true})
    }

    const updateBalanceGoodsWeight = async ({id, balance, warehouse}) => {
        updateLoader({method: 'updateBalanceGoodsWeight', status: false})
        const formData = new FormData()
        formData.append('id', id)
        formData.append('balance', balance)

        await axios.post(`/admin/goods/weight/update_balance.php`, formData)
            .then((res) => {
                const findGood = goodsWeight.value.find(good => good.id === id)
                findGood.balance = res.data.balance
                addMessages(res.data.messages, 'success')
                router.push({name: "GoodsWeight", params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateBalanceGoodsWeight', status: true})
    }

    const deleteGoodsWeight = async ({id, warehouse}) => {
        updateLoader({method: 'deleteGoodsWeight', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post(`/admin/goods/weight/delete.php`, formData)
            .then((res) => {
                goodsWeight.value = goodsWeight.value.filter(good => +good.id !== +id)
                router.push({name: "GoodsWeight", params: {warehouse}})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteGoodsWeight', status: true})
    }


    return {
        getGoodsWeight,
        findGoodsWeight,
        createGoodsWeight,
        updateGoodsWeight,
        updateBalanceGoodsWeight,
        deleteGoodsWeight,
    }
});
