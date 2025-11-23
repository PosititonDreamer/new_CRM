import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter, useRoute} from "vue-router";

export const Clients = defineStore('Clients', () => {
    const clients = ref([]);
    const clientsFullNameList = ref([])
    const nextPage = ref(null)

    const getClients = computed(() => clients)
    const getClientsFullNameList = computed(() => clientsFullNameList)
    const getNextPage = computed(() => nextPage)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();

    const router = useRouter();
    const route = useRoute();

    const findClients = async ({sort}, page = 0) => {
        if(page === 0) {
            clients.value = []
        }
        updateLoader({method: 'findClients', status: false})
        await axios.get(`/clients/list.php?sort=${sort}&page=${page}`)
            .then((res) => {
                if (page) {
                    res.data.clients.forEach(client => {
                        if(!clients.value.find(item => +item.id === +client.id)) {
                            clients.value.push(client)
                        }
                    })
                } else {
                    clients.value = res.data.clients
                }
                nextPage.value = res.data.next_page
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findClients', status: true})
    }

    const findClientsList = async (text, afterPage) => {
        clients.value = []
        updateLoader({method: 'findClientsList', status: false})
        const formData = new FormData();
        formData.append('text', text)
        await axios.post('/clients/find_list.php', formData)
            .then((res) => {
                nextPage.value = null
                clients.value = res.data.clients
                addMessages(res.data.messages, 'success')
                router.push({name: afterPage})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findClientsList', status: true})
    }

    const joinClients = async ({client, clients_join}, afterPage) => {
        updateLoader({method: 'joinClients', status: false})
        const formData = new FormData()
        formData.append('client', client)
        formData.append('clients_join', JSON.stringify(clients_join))
        await axios.post('clients/join.php', formData)
            .then((res) => {
                clients.value = clients.value
                    .filter(item => +item.id !== +client)
                    .filter(item=> !clients_join.find(child => +item.id === +child))
                findClientId(client)
                router.push({name: afterPage})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'joinClients', status: true})
    }

    const joinAddress = async ({address, address_join}, afterPage) => {
        updateLoader({method: 'joinAddress', status: false})
        const formData = new FormData()
        formData.append('address', address)
        formData.append('address_join', JSON.stringify(address_join))
        await axios.post('clients/join_address.php', formData)
            .then((res) => {
                clients.value = clients.value.filter(item => +item.id !== +route.params.client)
                findClientId(route.params.client)
                router.push({name: afterPage})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'joinAddress', status: true})
    }

    const findClientsFullNameList = async (text) => {
        clientsFullNameList.value = []
        updateLoader({method: 'findClientsFullNameList', status: false})
        const formData = new FormData();
        formData.append('text', text)
        axios.post('/clients/find_full_name.php', formData)
            .then((res) => {
                clientsFullNameList.value = res.data.clients
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findClientsFullNameList', status: true})
    }

    const updateClients = async ({id, full_name, phone, email}, afterPage) => {
        updateLoader({method: 'updateClients', status: false})
        const formData = new FormData()
        formData.append('id', id)
        formData.append('full_name', full_name)
        formData.append('phone', phone)
        formData.append('email', email)
        await axios.post('clients/update.php', formData)
            .then((res) => {
                clients.value = clients.value.map(client => {
                    if (+client.id === +id) {
                        return res.data.client
                    }
                    return client
                })
                addMessages(res.data.messages, 'success')
                router.push({name: afterPage})
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateClients', status: true})
    }

    const clearClientsFullNameList = () => {
        clientsFullNameList.value = []
    }

    const clearClients = () => {
        clients.value = []
    }

    const findClientId = async (id) => {
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('clients/item.php', formData)
            .then((res) => {
                clients.value.unshift(res.data.client)
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
    }

    return {
        getClients,
        getClientsFullNameList,
        getNextPage,
        findClients,
        findClientsList,
        joinClients,
        joinAddress,
        findClientsFullNameList,
        updateClients,
        clearClientsFullNameList,
        findClientId,
        clearClients
    }

});
