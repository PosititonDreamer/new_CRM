import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter} from "vue-router";

export const OrdersFind = defineStore('OrdersFind', () => {
    const orders = ref([]);

    const getOrders = computed(() => orders)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();

    const findOrders = async ({type, text}) => {
        clearOrders()
        updateLoader({method: 'findOrders', status: false})
        const formData = new FormData();
        formData.append('type', type);
        formData.append('text', text);
        await axios.post('/orders/find_list.php', formData)
            .then(res => {
                orders.value = res.data.orders
                addMessages(res.data.messages, 'success')
                router.push({name: 'OrdersFind'})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findOrders', status: true})
    }

    const deleteOrders = async (id) => {
        updateLoader({method: 'deleteOrders', status: false})
        const formData = new FormData();
        formData.append('id', id)
        await axios.post('/orders/delete.php', formData)
            .then((res) => {
                orders.value = orders.value.filter(order => +order.id !== +id)
                addMessages(res.data.messages, 'success')
                router.push({name: 'OrdersFind'})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteOrders', status: true})
    }

    const returnOrders = async (id) => {
        updateLoader({method: 'returnOrders', status: false})
        const formData = new FormData();
        formData.append('id', id)
        await axios.post('/orders/return.php', formData)
            .then((res) => {
                orders.value.forEach((order) => {
                    if(+order.id === +id) {
                        order.status = 5
                    }
                })
                router.push({name: 'OrdersFind'})
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'returnOrders', status: true})
    }

    const clearOrders = () => {
        orders.value = []
    }

    return {
        getOrders,
        findOrders,
        deleteOrders,
        returnOrders,
        clearOrders,
    }
});
