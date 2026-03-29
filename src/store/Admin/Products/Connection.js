import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {Loader} from "@/store/Loader.js";
import {Messages} from "@/store/Messages.js";
import {useRouter} from "vue-router";
import axios from "axios";

export const ProductsConnection = defineStore('ProductsConnection', () => {
    const productsConnections = ref([])

    const getProductsConnections = computed(() => productsConnections)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter()

    const findProductsConnections = async () => {
        updateLoader({method: 'findProductsConnections', status: false})
        await axios.get('/admin/products/connection/list.php')
            .then(res => {
                productsConnections.value = res.data.products_connections
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findProductsConnections', status: true})
    }

    const createProductsConnections = async ({title, list}) => {
        updateLoader({method: 'createProductsConnections', status: false})
        const formData = new FormData()
        formData.append('title', title)
        formData.append('list', JSON.stringify(list))
        await axios.post('/admin/products/connection/create.php', formData)
            .then(res => {
                productsConnections.value.push(res.data.products_connection)
                addMessages(res.data.messages, 'success')
                router.push({name: 'ProductsConnections'})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createProductsConnections', status: true})
    }

    const updateProductsConnections = async ({id, title, list}) => {
        updateLoader({method: 'updateProductsConnections', status: false})
        const formData = new FormData()
        formData.append('id', id)
        formData.append('title', title)
        formData.append('list', JSON.stringify(list))
        await axios.post('/admin/products/connection/update.php', formData)
            .then(res => {
                productsConnections.value = productsConnections.value.map(item => {
                    if(+item.id === +id) {
                        return res.data.products_connection
                    }

                    return item
                })
                addMessages(res.data.messages, 'success')
                router.push({name: 'ProductsConnections'})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateProductsConnections', status: true})
    }

    const deleteProductsConnections = async (id) => {
        updateLoader({method: 'deleteProductsConnections', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/products/connection/delete.php', formData)
            .then(res => {
                productsConnections.value = productsConnections.value.filter(item => +item.id !== +id)
                addMessages(res.data.messages, 'success')
                router.push({name: 'ProductsConnections'})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteProductsConnections', status: true})
    }


    return {
        getProductsConnections,
        findProductsConnections,
        createProductsConnections,
        updateProductsConnections,
        deleteProductsConnections,
    }
})