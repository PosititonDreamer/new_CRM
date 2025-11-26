import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter} from "vue-router";

export const Mailings = defineStore('Mailings', () => {

    const mailings = ref([]);

    const getMailings = computed(() => mailings)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();

    const findMailings = async () => {
        updateLoader({method: 'findMailings', status: false})
        await axios.get('/admin/mailings/list.php')
            .then(res => {
                mailings.value = res.data.mailings
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findMailings', status: true})
    }

    const createMailings = async ({title, text}) => {
        updateLoader({method: 'createMailings', status: false})
        const formData = new FormData()
        formData.append('title', title)
        formData.append('text', text)
        await axios.post('/admin/mailings/create.php', formData)
            .then(res => {
                mailings.value.push(res.data.mailing)
                router.push({name: 'Mailings'})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createMailings', status: true})
    }

    const updateMailings = async ({id, title, text}) => {
        updateLoader({method: 'updateMailings', status: false})
        const formData = new FormData()
        formData.append('id', id)
        formData.append('title', title)
        formData.append('text', text)
        await axios.post('/admin/mailings/update.php', formData)
            .then(res => {
                mailings.value = mailings.value.map(item => {
                    if (+item.id === +id) {
                        return res.data.mailing
                    }
                    return item
                })
                router.push({name: 'Mailings'})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateMailings', status: true})
    }

    const deleteMailings = async (id) => {
        updateLoader({method: 'deleteMailings', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/mailings/delete.php', formData)
            .then(res => {
                mailings.value = mailings.value.filter(item => +item.id !== +id)
                router.push({name: 'Mailings'})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteMailings', status: true})
    }

    const sendMailings = async ({id, type, test}) => {
        updateLoader({method: 'sendMailings', status: false})
        const formData = new FormData()
        formData.append('id', id)
        formData.append('type', type)
        formData.append('test', test)
        await axios.post('/admin/mailings/send.php', formData)
            .then(res => {
                router.push({name: 'Mailings'})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'sendMailings', status: true})
    }

    return {
        getMailings,
        findMailings,
        createMailings,
        updateMailings,
        deleteMailings,
        sendMailings,
    }
});
