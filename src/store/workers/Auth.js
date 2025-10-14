import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {useRoute} from "vue-router";
import router from "@/router/router.js";
import {Loader} from "@/store/Loader.js";

export const Auth = defineStore('Auth', () => {
    const worker = ref({})
    const getWorker = computed(() => worker)

    const route = useRoute();
    const {updateLoader} = Loader()
    const {addMessages} = Messages();

    const auth = async (token) => {
        updateLoader({method: 'auth', status: false})
        const formData = new FormData();
        formData.append('token', token);
        await axios.post('/workers/authorization.php', formData)
            .then(res => {
                worker.value = res.data.worker;
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `${token}`;
                addMessages(res.data.messages, 'success')
                if(route.name === 'Auth') {
                    if(worker.value.rule === 'Админ') {
                        router.push('/admin');
                    }
                }
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
                localStorage.removeItem('token');
                if(route.name !== 'Auth') {
                    router.push('/');
                }
            })
        updateLoader({method: 'auth', status: true})
    }

    const checkAuth = async (token) => {
        updateLoader({method: 'checkAuth', status: false})
        const formData = new FormData();
        formData.append('token', token);
        await axios.post('/workers/authorization.php', formData)
            .then(res => {
                worker.value = res.data.worker;
                axios.defaults.headers.common['Authorization'] = `${token}`;
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'checkAuth', status: true})
    }

    return {
        getWorker, auth, checkAuth
    }
});