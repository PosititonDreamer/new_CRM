import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {Loader} from "@/store/Loader.js";
import router from "@/router/router.js";
import axios from "axios";
import {Messages} from "@/store/Messages.js";


export const Packing = defineStore('Packing', () => {
    const packing = ref([])

    const getPacking = computed(() => packing)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();

    const findPacking = async () => {
        updateLoader({method: 'findPacking', status: false})
        axios.get('/admin/products/packing/list.php')
            .then(res => {
                packing.value = res.data.packing
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findPacking', status: true})
    }

    const createPacking = async (data) => {
        updateLoader({method: 'createPacking', status: false})
        const formData = new FormData()
        formData.append('product', data.product)
        formData.append('packing', data.packing)
        axios.post('/admin/products/packing/create.php', formData)
            .then(res => {
                packing.value.push(res.data.product_packing)
                packing.value = packing.value.sort((a, b) => a.packing - b.packing)
                router.push({name: "Packing"})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createPacking', status: true})
    }

    const updatePacking = async (data) => {
        updateLoader({method: 'updatePacking', status: false})
        const formData = new FormData()
        formData.append('product', data.product)
        formData.append('packing', data.packing)
        formData.append('id', data.id)
        axios.post('/admin/products/packing/update.php', formData)
            .then(res => {
                packing.value = packing.value.map(pack => {
                    if (pack.id === data.id) {
                        return res.data.product_packing
                    }
                    return pack
                })
                packing.value = packing.value.sort((a, b) => a.packing - b.packing)
                router.push({name: "Packing"})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })

        updateLoader({method: 'updatePacking', status: true})
    }

    const removePacking = async (id) => {
        updateLoader({method: 'removePacking', status: false})
        const formData = new FormData()
        formData.append('id', id)
        axios.post('/admin/products/packing/delete.php', formData)
            .then(res => {
                packing.value = packing.value.filter(pack => +pack.id !== +id)
                router.push({name: "Packing"})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'removePacking', status: true})
    }

    return {
        getPacking, findPacking, createPacking, updatePacking, removePacking,
    }
});
