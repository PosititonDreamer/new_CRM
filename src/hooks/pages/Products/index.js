import {validateInput} from "@/hooks/validateInput.js";
import {ref} from "vue";
import {Products} from "@/store/Admin/Products/Products.js";
import {useRouter, useRoute} from "vue-router";

export const HookProducts = () => {
    const {getProducts, createProduct, removeProduct, updateProduct} = Products()

    const {data: title} = validateInput("String", "", 3)
    const {data: showTitle} = validateInput("String", "", 0)
    const {data: sort} = validateInput("Number", 0, 0)
    const {data: measureUnit} = validateInput("String", "", 0)
    const {data: clientTitle} = validateInput("String", "", 0)
    const router = useRouter()
    const route = useRoute()

    const product = {
        title,
        showTitle,
        sort,
        measureUnit,
        clientTitle
    }

    const submitCreateProduct = async () => {
        title.value.tacked = true
        measureUnit.value.tacked = true
        clientTitle.value.tacked = true
        if(title.value.valid && measureUnit.value.valid && clientTitle.value.valid){
            await createProduct({
                title: title.value.value,
                show_title: showTitle.value.value,
                measure_unit: measureUnit.value.value,
                client_title: clientTitle.value.value,
            })
        }
    }

    const submitUpdateProduct = async () => {
        title.value.tacked = true
        measureUnit.value.tacked = true
        sort.value.tacked = true
        clientTitle.value.tacked = true
        if(title.value.valid && measureUnit.value.valid && sort.value.valid && clientTitle.value.valid){
            await updateProduct({
                title: title.value.value,
                show_title: showTitle.value.value,
                measure_unit: measureUnit.value.value,
                sort: sort.value.value,
                client_title: clientTitle.value.value,
                id: route.params.id
            })
        }
    }

    const submitDeleteProduct = async () => {
        await removeProduct(route.params.id)
    }

    return {
        product,
        getProducts,
        router,
        route,
        submitCreateProduct,
        submitUpdateProduct,
        submitDeleteProduct,
    }
}