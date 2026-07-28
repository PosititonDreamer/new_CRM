import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {Loader} from "@/store/Loader.js";
import {Messages} from "@/store/Messages.js";
import {useRouter} from "vue-router";
import axios from "axios";

export const Presents = defineStore('Presents', () => {
    const presents = ref([])

    const getPresents = computed(() => presents)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();

    const findPresents = async () => {
        updateLoader({method: 'findPresents', status: false})
        axios.get('/admin/presents/list.php')
            .then(res => {
                presents.value = res.data.presents
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findPresents', status: true})
    }

    const createPresents = async ({packing}) => {
        updateLoader({method: 'createPresents', status: false})
        const formData = new FormData();
        formData.append("packing", packing)
        axios.post('/admin/presents/create.php', formData)
            .then(res => {
                presents.value.push(res.data.present)
                router.push({name: "Presents"})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createPresents', status: true})
    }

    const updatePresents =  async ({id, packing}) => {
        updateLoader({method: 'updatePresents', status: false})
        const formData = new FormData();
        formData.append("packing", packing)
        formData.append("id", id)
        axios.post('/admin/presents/update.php', formData)
            .then(res => {
                presents.value = presents.value.map(present => {
                    if(+present.id === +id) {
                        return res.data.present
                    }
                    return present
                })
                router.push({name: "Presents"})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updatePresents', status: true})
    }

    const deletePresents = async (id) => {
        updateLoader({method: 'deletePresents', status: false})
        const formData = new FormData();
        formData.append("id", id)
        axios.post('/admin/presents/delete.php', formData)
            .then(res => {
                presents.value = presents.value.filter(present => +present.id !== +id)
                router.push({name: "Presents"})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deletePresents', status: true})
    }

    return {
        getPresents,
        findPresents,
        createPresents,
        updatePresents,
        deletePresents,
    }
});
