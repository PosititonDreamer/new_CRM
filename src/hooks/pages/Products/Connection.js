import {ProductsConnection} from "@/store/Admin/Products/Connection.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {computed, ref} from "vue";

export const HookProductsConnection = () => {
    const {
        getProductsConnections,
        createProductsConnections,
        updateProductsConnections,
        deleteProductsConnections,
    } = ProductsConnection()

    const route = useRoute()
    const router = useRouter()

    const {data: title} = validateInput("String", "", 3)
    const list = ref([])

    const productConnection = {
        title,
        list
    }

    const submitCreateProductConnections = async () => {
        title.value.tacked = true

        if(title.value.valid && list.value.length) {
            await createProductsConnections({
                title: title.value.value,
                list: list.value
            })
        }
    }

    const submitUpdateProductConnections = async () => {
        title.value.tacked = true

        if(title.value.valid && list.value.length) {
            await updateProductsConnections({
                id: route.params.id,
                title: title.value.value,
                list: list.value
            })
        }
    }

    const submitDeleteProductConnections = async () => {
        await deleteProductsConnections(route.params.id)
    }

    const clearData = () => {
        title.value.tacked = false

        title.value.value = ''
        list.value = []
    }

    const usedProducts = computed(() => {
        const activeProducts = []

        getProductsConnections.value.forEach(item => {
            item.list.forEach((child) => {
                activeProducts.push(+child.product)
            })
        })

        return activeProducts
    })

    return {
        route,
        router,
        productConnection,
        getProductsConnections,
        submitCreateProductConnections,
        submitUpdateProductConnections,
        submitDeleteProductConnections,
        clearData,
        usedProducts,
    }
}