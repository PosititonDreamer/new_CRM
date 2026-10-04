import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {Messages} from "@/store/Messages.js";
import axios from "axios";
import {Loader} from "@/store/Loader.js";
import router from "@/router/router.js";

export const Mails = defineStore('Mails', () => {
    const mails = ref([])

    const getMails = computed(() => mails)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();

    const findMails = async () => {
        updateLoader({method: 'findMails', status: false})
        await axios.get('/admin/mails/list.php')
            .then(res => {
                mails.value = res.data.mails
            })

            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findMails', status: true})
    }

    const createMail = async ({text, order_type, mail_type, min_orders, max_orders}) => {
        updateLoader({method: 'createMail', status: false})
        const formData = new FormData()
        formData.append('text', text)
        formData.append('order_type', order_type)
        formData.append('mail_type', mail_type)
        formData.append('min_orders', min_orders)
        formData.append('max_orders', max_orders)
        await axios.post('/admin/mails/create.php', formData)
            .then(res => {
                mails.value.push(res.data.mail)
                router.push({name: "Mails"})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createMail', status: true})
    }

    const updateMail = async ({id, text, order_type, mail_type, min_orders, max_orders}) => {
        updateLoader({method: 'updateMail', status: false})
        const formData = new FormData()
        formData.append('id', id)
        formData.append('text', text)
        formData.append('order_type', order_type)
        formData.append('mail_type', mail_type)
        formData.append('min_orders', min_orders)
        formData.append('max_orders', max_orders)
        await axios.post('/admin/mails/update.php', formData)
            .then(res => {
                mails.value = mails.value.map(mail => {
                    if (mail.id === id) {
                        return res.data.mail
                    }
                    return mail
                })
                router.push({name: "Mails"})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateMail', status: true})
    }

    const deleteMail = async (id) => {
        updateLoader({method: 'deleteMail', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/mails/delete.php', formData)
            .then(res => {
                mails.value = mails.value.filter(mail => +mail.id !== +id)
                router.push({name: "Mails"})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteMail', status: true})
    }

    const sendTestMail = async (id) => {
        updateLoader({method: 'sendTestMail', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/mails/send.php', formData)
            .then(res => {
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'sendTestMail', status: true})
    }

    return {
        getMails,
        findMails,
        createMail,
        updateMail,
        deleteMail,
        sendTestMail,
    }
});
