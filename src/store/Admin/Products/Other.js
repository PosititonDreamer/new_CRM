import {defineStore} from "pinia";
import {Loader} from "@/store/Loader.js";
import router from "@/router/router.js";
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {computed, ref} from "vue";

export const Other = defineStore('Other', () => {
    const others = ref([])

    const getOthers = computed(() => others)

    const {updateLoader} = Loader()
    const {addMessages} = Messages()

    const findOthers = async () => {
        updateLoader({method: 'findOther', status: false})
        await axios.get("/admin/products/other/list.php")
            .then(res => {
                others.value = res.data.products_other
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findOther', status: true})
    }

    const updateOthers = async ({id, packing}) => {
        updateLoader({method: 'updateOther', status: false})
        const formData = new FormData()
        formData.append('packing', packing)
        formData.append('id', id)
        axios.post('/admin/products/other/update.php', formData)
            .then(res => {
                others.value = others.value.map(other => {
                    if(other.id === id) {
                        return res.data.product_other
                    }
                    return other
                })
                router.push('/admin/products/other')
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateOther', status: true})
    }

    return {
        getOthers,
        findOthers,
        updateOthers,
    }
});
