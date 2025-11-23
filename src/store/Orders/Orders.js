import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter, useRoute} from "vue-router";

export const Orders = defineStore('Orders', () => {
    const orders = ref([]);
    const nextPage = ref(null);
    const orderDetail = ref(null);
    const clientsList = ref([]);

    const productsList = ref([]);
    const goodsList = ref([]);
    const kitsList = ref([]);
    const presentsList = ref([]);
    const boxesList = ref([]);

    const getOrders = computed(() => orders)
    const getNextPage = computed(() => nextPage)
    const getOrderDetail = computed(() => orderDetail)
    const getClientsList = computed(() => clientsList)

    const getGoodsList = computed(() => goodsList)
    const getProductsList = computed(() => productsList)
    const getKitsList = computed(() => kitsList)
    const getPresentsList = computed(() => presentsList)
    const getBoxesList = computed(() => boxesList)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();

    const router = useRouter();
    const route = useRoute();

    const findOrders = async ({date_start, date_end, delivery, sort}, page = 0) => {
        updateLoader({method: 'findOrders', status: false})
        let params = '';
        if(date_start) {
            params += `&date_start=${date_start}`;
        }
        if(date_end) {
            params += `&date_end=${date_end}`;
        }
        if(delivery) {
            params += `&delivery=${delivery}`;
        }
        if(sort) {
            params += `&sort=${sort}`;
        }
        params += '&page=' + page;
        await axios.get(`/orders/list.php?status=${route.params.status}${params}`)
            .then((res) => {
                if(page === 0) {
                    orders.value = res.data.orders
                } else {
                    orders.value = [...orders.value, ...res.data.orders]
                }
                nextPage.value = res.data.next_page
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findOrders', status: true})
    }

    const findGoodsList = async (warehouse = 1) => {
        updateLoader({method: 'findGoods', status: false})
        await axios.get(`/orders/goods.php?warehouse=${warehouse}`)
            .then((res) => {
                goodsList.value = res.data.goods_list
                productsList.value = res.data.products_list
                presentsList.value = res.data.presents_list
                kitsList.value = res.data.kits_list
                boxesList.value = res.data.boxes_list
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findGoods', status: true})
    }

    const findOrdersDetail = async () => {
        updateLoader({method: 'findOrdersDetail', status: false})
        await axios.get(`/orders/item.php?id=${route.params.id}`)
            .then((res) => {
                orderDetail.value = res.data.order
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })

        updateLoader({method: 'findOrdersDetail', status: true})
    }

    const createOrders = async ({client, address, track, comment, phone, delivery, email, composition, payed, blank, worker}, afterPage, warehouse = 1) => {
        updateLoader({method: 'createOrders', status: false})
        const formData = new FormData();
        formData.append('client', client)
        formData.append('address', address)
        formData.append('track', track)
        formData.append('comment', comment)
        formData.append('phone', phone)
        formData.append('delivery', delivery)
        formData.append('email', email)
        formData.append('warehouse', warehouse)
        formData.append('worker', worker)
        formData.append('payed', payed)
        formData.append('composition', JSON.stringify(composition))
        await axios.post('/orders/create.php', formData)
            .then((res) => {
                orders.value.push(res.data.order)
                addMessages(res.data.messages, 'success')
                if(blank && delivery !== 'CDEK') {
                    addBlank({
                        id: res.data.order.id,
                        blank
                    }, afterPage)
                } else {
                    router.push({name: afterPage, params: {status: route.params.status}});
                }
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createOrders', status: true})
    }

    const updateOrders = async ({id, client, address, track, comment, phone, delivery, email, composition, blank},afterPage, warehouse = 1) => {
        updateLoader({method: 'updateOrders', status: false})
        const formData = new FormData();
        formData.append('id', id)
        formData.append('client', client)
        formData.append('address', address)
        formData.append('track', track)
        formData.append('comment', comment)
        formData.append('phone', phone)
        formData.append('delivery', delivery)
        formData.append('email', email)
        formData.append('warehouse', warehouse)
        formData.append('composition', JSON.stringify(composition))
        await axios.post('/orders/update.php', formData)
            .then((res) => {
                if(res.data.change_status) {
                    orders.value = orders.value.filter(order => +order.id !== +id)
                } else {
                    orders.value = orders.value.map(order => {
                        if(+order.id === +id) {
                            return res.data.order
                        }
                        return order
                    })
                }
                addMessages(res.data.messages, 'success')
                if(blank && delivery !== 'CDEK') {
                    addBlank({
                        id: res.data.order.id,
                        blank
                    }, afterPage)
                } else {
                    router.push({name: afterPage, params: {status: route.params.status}});
                }
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateOrders', status: true})
    }

    const deleteOrders = async (id, afterPage) => {
        updateLoader({method: 'deleteOrders', status: false})
        const formData = new FormData();
        formData.append('id', id)
        await axios.post('/orders/delete.php', formData)
            .then((res) => {
                orders.value = orders.value.filter(order => +order.id !== +id)
                router.push({name: afterPage, params: {status: route.params.status}});
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteOrders', status: true})
    }

    const returnOrders = async (id, afterPage) => {
        updateLoader({method: 'returnOrders', status: false})
        const formData = new FormData();
        formData.append('id', id)
        await axios.post('/orders/return.php', formData)
            .then((res) => {
                orders.value = orders.value.filter(order => +order.id !== +id)
                router.push({name: afterPage, params: {status: route.params.status}});
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'returnOrders', status: true})
    }

    const collectOrders = async ({id, worker, boxes}, afterPage) => {
        updateLoader({method: 'collectOrders', status: false})
        const formData = new FormData();
        formData.append('id', id)
        formData.append('worker', worker)
        formData.append('boxes', JSON.stringify(boxes))

        await axios.post('/orders/collect.php', formData)
            .then((res) => {
                orders.value = orders.value.filter(order => +order.id !== +id)
                router.push({name: afterPage, params: {status: route.params.status}});
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'collectOrders', status: true})
    }

    const sendOrders = async (id_list, afterPage) => {
        updateLoader({method: 'sendOrders', status: false})
        const formData = new FormData();
        formData.append('orders', JSON.stringify(id_list))
        await axios.post('/orders/send.php', formData)
            .then((res) => {
                orders.value = orders.value.filter(order => !id_list.find(id_item => +id_item === +order.id))
                router.push({name: afterPage, params: {status: route.params.status}});
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'sendOrders', status: true})
    }

    const addTrack = async ({id, track, blank}, afterPage) => {
        updateLoader({method: 'addTrack', status: false})
        const formData = new FormData();
        formData.append('id', id);
        formData.append('track', track)
        await axios.post('/orders/add_track.php', formData)
            .then((res) => {
                orders.value = orders.value.filter(order => +order.id !== +id)
                addMessages(res.data.messages, 'success')
                if(blank) {
                    addBlank({
                        id,
                        blank
                    }, afterPage)
                } else {
                    router.push({name: afterPage, params: {status: route.params.status}});
                }
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'addTrack', status: true})
    }

    const addBlank = async ({id, blank}, afterPage) => {
        updateLoader({method: 'addBlank', status: false})
        const formData = new FormData();
        formData.append('id', id);
        formData.append('blank', blank)
        await axios.post('/orders/add_blank.php', formData)
            .then((res) => {
                orders.value.forEach(order => {
                    if(+order.id === +id) {
                        order.blank = true
                    }
                })
                addMessages(res.data.messages, 'success')
                router.push({name: afterPage, params: {status: route.params.status}});
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'addBlank', status: true})
    }

    const sendTelegramMessage = async (id) => {
        updateLoader({method: 'sendTelegramMessage', status: false})
        const formData = new FormData();
        formData.append('id', id);
        await axios.post('/orders/telegram_message.php', formData)
            .then((res) => {
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'sendTelegramMessage', status: true})
    }

    const findTrack = async () => {
        updateLoader({method: 'findTrack', status: false})
        await axios.get('/orders/find_track.php')
        updateLoader({method: 'findTrack', status: true})
    }

    const checkOld = async () => {
        updateLoader({method: 'checkOld', status: false})
        await axios.get('/tilda_api.php?check_old')
        updateLoader({method: 'checkOld', status: true})
    }

    const findClientsList = async (text) => {
        updateLoader({method: 'findClientsList', status: false})
        const formData = new FormData();
        formData.append('text', text)
        axios.post('/clients/find_full_name.php', formData)
            .then((res) => {
                clientsList.value = res.data.clients
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findClientsList', status: true})
    }

    const clearClientsList = () => {
        clientsList.value = []
    }

    return {
        getOrders,
        getNextPage,
        getOrderDetail,
        getGoodsList,
        getProductsList,
        getKitsList,
        getPresentsList,
        getClientsList,
        getBoxesList,
        findOrders,
        findOrdersDetail,
        findGoodsList,
        createOrders,
        updateOrders,
        deleteOrders,
        returnOrders,
        collectOrders,
        sendOrders,
        addTrack,
        addBlank,
        sendTelegramMessage,
        findTrack,
        checkOld,
        findClientsList,
        clearClientsList
    }
});