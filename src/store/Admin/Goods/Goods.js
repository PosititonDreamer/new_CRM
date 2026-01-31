import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter, useRoute} from "vue-router";

export const Goods = defineStore('Goods', () => {
    const goods = ref([]);

    const getGoods = computed(() => goods)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();
    const route = useRoute();

    const findGoods = async () => {
        updateLoader({method: 'findGoods', status: false})
        await axios.get(`/admin/goods/list.php?warehouse=${route.params.warehouse ?? 1}`)
            .then((res) => {
                goods.value = res.data.goods
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findGoods', status: true})
    }

    const createGoods = async ({product, quantity, price, balance, few, few_very, article, warehouse}) => {
        updateLoader({method: 'createGoods', status: false})
        const formData = new FormData()
        formData.append('product', product)
        formData.append('quantity', quantity)
        formData.append('balance', balance)
        formData.append('few', few)
        formData.append('few_very', few_very)
        formData.append('article', article)
        formData.append('price', price)
        formData.append('warehouse', warehouse)
        await axios.post('/admin/goods/create.php', formData)
            .then((res) => {
                goods.value.push(res.data.good)
                router.push({name: "Goods", params: {warehouse}})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createGoods', status: true})
    }

    const updateGoods = async ({id, product, price, quantity, balance, few, few_very, article, warehouse}) => {
        updateLoader({method: 'updateGoods', status: false})
        const formData = new FormData()
        formData.append('id', id)
        formData.append('product', product)
        formData.append('quantity', quantity)
        formData.append('balance', balance)
        formData.append('few', few)
        formData.append('few_very', few_very)
        formData.append('article', article)
        formData.append('warehouse', warehouse)
        formData.append('price', price)
        await axios.post('/admin/goods/update.php', formData)
            .then((res) => {
                goods.value = goods.value.map(good => {
                    if(good.id === id) {
                        return res.data.good
                    }
                    return good
                })
                router.push({name: "Goods", params: {warehouse}})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateGoods', status: true})
    }

    const updateBalanceGoods = async ({id, balance, warehouse}) => {
        updateLoader({method: 'updateBalanceGoods', status: false})
        const formData = new FormData()
        formData.append('id', id)
        formData.append('balance', balance)
        await axios.post('/admin/goods/update_balance.php', formData)
            .then((res) => {
                const findGood = goods.value.find(good => good.id === id)
                findGood.balance = res.data.balance
                router.push({name: "Goods", params: {warehouse}})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateBalanceGoods', status: true})
    }

    const deleteGoods = async ({id, warehouse}) => {
        updateLoader({method: 'deleteGoods', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/goods/delete.php', formData)
            .then((res) => {
                goods.value = goods.value.filter(good => +good.id !== +id)
                router.push({name: "Goods", params: {warehouse}})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteGoods', status: true})
    }

    return {
        getGoods,
        findGoods,
        createGoods,
        updateGoods,
        updateBalanceGoods,
        deleteGoods,
    }
});
