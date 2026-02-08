import {Other} from "@/store/Admin/Products/Other.js";
import {validateInput} from "@/hooks/validateInput.js";
import {useRouter, useRoute} from "vue-router";

export const HookOther = () => {
    const {getOthers, updateOthers, deleteOthers} = Other()

    const {data: packing} = validateInput("String", "", 1)
    const {data: product} = validateInput("String", "", 1)
    const router = useRouter()
    const route = useRoute()

    const submitUpdate = async () => {
        packing.value.tacked = true
        product.value.tacked = true

        if (packing.value.valid && product.value.valid) {
            await updateOthers({
                id: route.params.id,
                packing: packing.value.value
            })
        }
    }

    const submitDelete = async () => {
        await deleteOthers({
            id: route.params.id,
        })
    }

    return {
        route,
        router,
        packing,
        product,
        getOthers,
        submitUpdate,
        submitDelete
    }
}