import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {Loader} from "@/store/Loader.js";
import {Messages} from "@/store/Messages.js";
import {useRouter} from "vue-router";
import axios from "axios";

export const Sales = defineStore('Sales', () => {
    const sales = ref([])

    const getSales = computed(() => sales)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();

    const findSales = async () => {
        updateLoader({method: 'findSales', status: false})
        await axios.get('/admin/sales/list.php')
            .then((res) => {
                sales.value = res.data.sales_list
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findSales', status: true})
    }

    const createSales = async ({title, keywords, sum, date, date_start, sum_max, list}) => {
        updateLoader({method: 'createSales', status: false})
        const formData = new FormData()
        formData.append("title", title)
        formData.append("keywords", keywords)
        formData.append("sum", sum)
        formData.append("date", date)
        formData.append("date_start", date_start)
        formData.append("sum_max", sum_max)
        formData.append('list', JSON.stringify(list))
        await axios.post('/admin/sales/create.php', formData)
            .then(res => {
                sales.value.push(res.data.sale)
                addMessages(res.data.messages, 'success')
                router.push({name: 'Sales'})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'createSales', status: true})
    }

    const updateSales = async ({id, title, keywords, sum, date, date_start, sum_max, list}) => {
        updateLoader({method: 'updateSales', status: false})
        const formData = new FormData()
        formData.append("id", id)
        formData.append("title", title)
        formData.append("keywords", keywords)
        formData.append("sum", sum)
        formData.append("date", date)
        formData.append("date_start", date_start)
        formData.append("sum_max", sum_max)
        formData.append('list', JSON.stringify(list))
        await axios.post('/admin/sales/update.php', formData)
            .then(res => {
                sales.value = sales.value.map(sale => {
                    if(+sale.id === +id) {
                        return res.data.sale
                    }
                    return sale
                })
                addMessages(res.data.messages, 'success')
                router.push({name: 'Sales'})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'updateSales', status: true})
    }

    const deleteSales = async ({id}) => {
        updateLoader({method: 'deleteSales', status: false})
        const formData = new FormData()
        formData.append("id", id)
        await axios.post('/admin/sales/delete.php', formData)
            .then(res => {
                sales.value = sales.value.filter(sale => +sale.id !== +id)
                addMessages(res.data.messages, 'success')
                router.push({name: 'Sales'})
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'deleteSales', status: true})
    }

    return {
        getSales,
        findSales,
        createSales,
        updateSales,
        deleteSales,
    }
});
