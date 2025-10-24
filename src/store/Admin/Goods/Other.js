import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter, useRoute} from "vue-router";

export const GoodsOther = defineStore('GoodsOther', () => {
    const goodsOther = ref([]);
    const goodsOtherType = ref([])

    const getGoodsOther = computed(() => goodsOther)
    const getGoodsOtherType = computed(() => goodsOtherType)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();
    const route = useRoute();

    const findGoodsOther = async () => {
        updateLoader({method: 'findGoodsOther', status: true})
        await axios.get(`/admin/goods/other/list.php?warehouse=${route.params.warehouse}`)
            .then((res) => {
                goodsOther.value = res.data.goods_other
                goodsOtherType.value = res.data.goods_other_type
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findGoodsOther', status: true})
    }

    const createGoodsOther = async ({warehouse, type, title, balance, few, few_very}) => {
        updateLoader({method: 'createGoodsOther', status: true})
        const formData = new FormData()
        formData.append('warehouse', warehouse)
        formData.append('type', type)
        formData.append('title', title)
        formData.append('balance', balance)
        formData.append('few', few)
        formData.append('few_very', few_very)
        await axios.post('/admin/goods/other/create.php', formData)
            .then(res => {
                goodsOther.value.push(res.data.good_other)
                addMessages(res.data.messages, 'success')
                router.push({name: 'GoodsOther', params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createGoodsOther', status: true})
    }

    const updateGoodsOther = async ({warehouse, type, title, balance, few, few_very, id, sort}) => {
        updateLoader({method: 'updateGoodsOther', status: true})
        const formData = new FormData()
        formData.append('warehouse', warehouse)
        formData.append('type', type)
        formData.append('title', title)
        formData.append('balance', balance)
        formData.append('few', few)
        formData.append('few_very', few_very)
        formData.append('id', id)
        formData.append('sort', sort)
        await axios.post('/admin/goods/other/update.php', formData)
            .then(res => {
                goodsOther.value = goodsOther.value.map(other => {
                    if(other.id === id) {
                        return res.data.good_other
                    }
                    return  other
                })
                goodsOther.value = goodsOther.value.sort((a, b) => a.sort - b.sort)
                addMessages(res.data.messages, 'success')
                router.push({name: 'GoodsOther', params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateGoodsOther', status: true})

    }

    const updateBalanceGoodsOther = async ({id, balance, warehouse}) => {
        updateLoader({method: 'updateBalanceGoodsOther', status: true})
        const formData = new FormData()
        formData.append('balance', balance)
        formData.append('id', id)
        await axios.post('/admin/goods/other/update_balance.php', formData)
            .then(res => {
                const findOther = goodsOther.value.find(other => other.id === id)
                findOther.balance = res.data.balance
                addMessages(res.data.messages, 'success')
                router.push({name: 'GoodsOther', params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateBalanceGoodsOther', status: true})
    }

    const deleteGoodsOther = async ({id, warehouse}) => {
        updateLoader({method: 'deleteGoodsOther', status: true})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/goods/other/delete.php', formData)
            .then(res => {
                goodsOther.value = goodsOther.value.filter(other => +other.id !== +id)
                addMessages(res.data.messages, 'success')
                router.push({name: 'GoodsOther', params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteGoodsOther', status: true})
    }

    return {
        getGoodsOther,
        getGoodsOtherType,
        findGoodsOther,
        createGoodsOther,
        updateGoodsOther,
        updateBalanceGoodsOther,
        deleteGoodsOther,
    }
});
