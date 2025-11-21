import {defineStore} from 'pinia';
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import axios from "axios";

export const Promos = defineStore('Promos', () => {

    const promos = ref([])

    const getPromos = computed(() => promos)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();

    const findPromos = async () => {
        updateLoader({method: 'findPromos', status: false})
        await axios.get('/admin/promos/list.php')
            .then((res) => {
                promos.value = res.data.promos
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findPromos', status: true})
    }

    const createPromos = async ({date_start, date_end, title}) => {
        updateLoader({method: 'createPromos', status: false})
        const formData = new FormData()
        formData.append('date_start', date_start)
        formData.append('date_end', date_end)
        formData.append('title', title)
        await axios.post('/admin/promos/create.php', formData)
            .then((res) => {
                promos.value.push(res.data.promo)
                router.push({name: 'Promos'})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createPromos', status: true})
    }

    const updatePromos = async ({id, date_start, date_end, title}) => {
        updateLoader({method: 'createPromos', status: false})
        const formData = new FormData()
        formData.append('date_start', date_start)
        formData.append('date_end', date_end)
        formData.append('title', title)
        formData.append('id', id)
        await axios.post('/admin/promos/update.php', formData)
            .then((res) => {
                promos.value = promos.value.map((promo) => {
                    if(+promo.id === +id) {
                        return res.data.promo
                    }
                    return promo
                })
                router.push({name: 'Promos'})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createPromos', status: true})
    }

    const deletePromos = async (id) => {
        updateLoader({method: 'createPromos', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/promos/delete.php', formData)
            .then((res) => {
                promos.value = promos.value.filter(promo => +promo.id !== +id)
                router.push({name: 'Promos'})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createPromos', status: true})
    }

    return {
        getPromos,
        findPromos,
        createPromos,
        updatePromos,
        deletePromos,
    }
})