import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter, useRoute} from "vue-router";

export const GoodsKit = defineStore('GoodsKit', () => {
    const goodsKit = ref([])

    const getGoodsKit = computed(() => goodsKit)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();
    const route = useRoute();

    const findGoodsKit = async () => {
        updateLoader({method: 'findGoodsKit', status: false})
        await axios.get(`/admin/goods/kit/list.php?warehouse=${route.params.warehouse}`)
            .then((res) => {
                goodsKit.value = res.data.goods_kits
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findGoodsKit', status: true})
    }

    const createGoodsKit = async ({title, number, list, warehouse}) => {
        updateLoader({method: 'createGoodsKit', status: false})
        const formData = new FormData()
        formData.append('warehouse', warehouse)
        formData.append('title', title)
        formData.append('number', number)
        formData.append('list', JSON.stringify(list))
        await axios.post('/admin/goods/kit/create.php', formData)
            .then(res => {
                goodsKit.value.push(res.data.good_kit)
                addMessages(res.data.messages, 'success')
                router.push({name: 'GoodsKit', params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createGoodsKit', status: true})
    }

    const updateGoodsKit = async ({id, title, number, list, warehouse}) => {
        updateLoader({method: 'updateGoodsKit', status: false})
        const formData = new FormData()
        formData.append('warehouse', warehouse)
        formData.append('title', title)
        formData.append('number', number)
        formData.append('id', id)
        formData.append('list', JSON.stringify(list))
        await axios.post('/admin/goods/kit/update.php', formData)
            .then(res => {
                goodsKit.value = goodsKit.value.map(kit => {
                    if(kit.id === id) {
                        return res.data.good_kit
                    }
                    return kit
                })
                addMessages(res.data.messages, 'success')
                router.push({name: 'GoodsKit', params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateGoodsKit', status: true})
    }

    const deleteGoodsKit = async ({id, warehouse}) => {
        updateLoader({method: 'deleteGoodsKit', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/goods/kit/delete.php', formData)
            .then(res => {
                goodsKit.value = goodsKit.value.filter(kit => +kit.id !== +id)
                addMessages(res.data.messages, 'success')
                router.push({name: 'GoodsKit', params: {warehouse}})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteGoodsKit', status: true})
    }

    return {
        getGoodsKit,
        findGoodsKit,
        createGoodsKit,
        updateGoodsKit,
        deleteGoodsKit,
    }
});
