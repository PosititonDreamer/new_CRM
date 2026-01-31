import {Sales} from "@/store/Admin/Sales/Sales.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {ref} from "vue";

export const SalesHook = () => {
    const {
        getSales,
        createSales,
        updateSales,
        deleteSales,
    } = Sales()

    const route = useRoute()
    const router = useRouter()

    const {data: title} = validateInput("String", "", 3)
    const {data: keywords} = validateInput("String", "")
    const {data: sum} = validateInput("Number", 0)
    const {data: date} = validateInput("Date", "")
    const list = ref([])

    const sale = {
        title,
        keywords,
        sum,
        date,
        list,
    }

    const addItem = (item = {quantity: 0, product: "", good: ""}, id = Date.now()) => {
        const {data: quantity} = validateInput("Number", item.quantity, 0)
        const {data: product} = validateInput("String", item.product, 1)
        const {data: good} = validateInput("String", item.good, 1)
        list.value.push({
            id,
            quantity,
            product,
            good
        })

    }

    const removeItem = (id) => {
        list.value = list.value.filter(item => item.id !== id)
    }

    const submitCreateSales = async () => {
        title.value.tacked = true
        date.value.tacked = true

        list.value.forEach(item => {
            item.quantity.tacked = true
            item.product.tacked = true
            item.good.tacked = true
        })

        if(title.value.valid && date.value.valid && !list.value.find(item => !item.product.valid || !item.quantity.valid || !item.good.valid)) {
            await createSales({
                title: title.value.value,
                keywords: keywords.value.value,
                sum: sum.value.value,
                date: date.value.value,
                list: list.value.map(item => {
                    return {
                        quantity: item.quantity.value,
                        good: item.good.value,
                    }
                })
            })
        }
    }

    const submitUpdateSales = async () => {
        title.value.tacked = true
        date.value.tacked = true

        list.value.forEach(item => {
            item.quantity.tacked = true
            item.product.tacked = true
            item.good.tacked = true
        })

        if(title.value.valid && date.value.valid && !list.value.find(item => !item.product.valid || !item.quantity.valid || !item.good.valid)) {
            await updateSales({
                id: route.params.id,
                title: title.value.value,
                keywords: keywords.value.value,
                sum: sum.value.value,
                date: date.value.value,
                list: list.value.map(item => {
                    return {
                        quantity: item.quantity.value,
                        good: item.good.value,
                    }
                })
            })
        }
    }

    const submitDeleteSales = async () => {
        await deleteSales({
            id: route.params.id,
        })
    }

    const clearData = () => {
        title.value.tacked = false
        keywords.value.tacked = false
        sum.value.tacked = false
        date.value.tacked = false

        title.value.value = ""
        keywords.value.value = ""
        sum.value.value = 0
        date.value.value = ""
        list.value = []
    }

    return {
        getSales,
        route,
        router,
        sale,
        addItem,
        removeItem,
        submitCreateSales,
        submitUpdateSales,
        submitDeleteSales,
        clearData,
    }
}