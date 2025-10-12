import {validateInput} from "@/hooks/validateInput.js";
import {ref} from "vue";
import {Products} from "@/store/Admin/Products/Products.js";
import {useRouter, useRoute} from "vue-router";

export const HookProducts = () => {
    const {getProducts, createProduct, removeProduct, updateProduct} = Products()

    const {data: title} = validateInput("String", "", 3)
    const {data: showTitle} = validateInput("String", "", 0)
    const {data: sort} = validateInput("Number", 0, 0)
    const {data: measureUnit} = validateInput("Number", 0, 1)
    const deleteProductId = ref(null)
    const router = useRouter()
    const route = useRoute()

    const product = {
        title,
        showTitle,
        sort,
        measureUnit,
    }

    const submitCreateProduct = async () => {
        title.value.tacked = true
        measureUnit.value.tacked = true
        if(title.value.valid && measureUnit.value.valid){
            await createProduct({
                title: title.value.value,
                show_title: showTitle.value.value,
                measure_unit: measureUnit.value.value,
            })
        }
    }

    const submitUpdateProduct = async () => {
        title.value.tacked = true
        measureUnit.value.tacked = true
        sort.value.tacked = true
        if(title.value.valid && measureUnit.value.valid && sort.value.valid){
            await updateProduct({
                title: title.value.value,
                show_title: showTitle.value.value,
                measure_unit: measureUnit.value.value,
                sort: sort.value.value,
                id: route.params.id
            })
        }
    }

    const submitDeleteProduct = async () => {
        await removeProduct(deleteProductId.value)
        deleteProductId.value = null
    }

    return {
        product,
        deleteProductId,
        getProducts,
        router,
        route,
        submitCreateProduct,
        submitUpdateProduct,
        submitDeleteProduct,
    }
}