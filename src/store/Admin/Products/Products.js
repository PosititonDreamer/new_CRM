import { defineStore } from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Errors} from "@/store/Errors.js";
import {Loader} from "@/store/Loader.js";
import router from "@/router/router.js";

export const Products = defineStore('Products', () => {
    const products = ref([])

    const getProducts = computed(() => products)

    const {updateLoader} = Loader()
    const {addErrors} = Errors();

    const findProducts = async () => {
        updateLoader({method: 'findProducts', status: false})
        await axios.get('/admin/products/list.php')
        .then(res => {
            products.value = res.data.products
        })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'findProducts', status: true})
    }

    const createProduct = async ({title, show_title, measure_unit}) => {
        updateLoader({method: 'createProduct', status: false})
        const formData = new FormData()
        formData.append('title', title)
        formData.append('show_title', show_title)
        formData.append('measure_unit', measure_unit)
        await axios.post('/admin/products/create.php', formData)
            .then(res => {
                products.value.push(res.data.product)
                router.push({name: "Products"})
            })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'createProduct', status: true})
    }

    const updateProduct = async ({title, show_title, measure_unit, sort, id}) => {
        updateLoader({method: 'updateProduct', status: false})
        const formData = new FormData()
        formData.append('title', title)
        formData.append('show_title', show_title)
        formData.append('measure_unit', measure_unit)
        formData.append('sort', sort)
        formData.append('id', id)
        await axios.post('/admin/products/update.php', formData)
            .then(res => {
                products.value = products.value.map(product => {
                    if(product.id === id) {
                        return res.data.product
                    }
                    return product
                })
                products.value = products.value.sort((a, b) => a.sort-b.sort)
                router.push({name: "Products"})
            })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'updateProduct', status: true})
    }

    const removeProduct = async (id) => {
        updateLoader({method: 'removeProduct', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/products/delete.php', formData)
            .then(() => {
                products.value = products.value.filter(product => product.id !== id)
            })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'removeProduct', status: true})
    }

    return {
        getProducts, findProducts, createProduct, removeProduct, updateProduct,
    }
});
