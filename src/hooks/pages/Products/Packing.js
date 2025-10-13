import {Packing} from "@/store/Admin/Products/Packing.js";
import {useRouter, useRoute} from "vue-router";
import {ref} from "vue";
import {validateInput} from "@/hooks/validateInput.js";


export const HookPacking = () => {
    const {getPacking, updatePacking, removePacking, createPacking} = Packing()
    const router = useRouter()
    const route = useRoute()

    const {data: product} = validateInput("String", "")
    const {data: packing} = validateInput("Number", 0, 0)


    const submitCreatePacking = async () => {
        product.value.tacked = true
        packing.value.tacked = true

        if (product.value.valid && packing.value.valid) {
            await createPacking({
                product: product.value.value,
                packing: packing.value.value
            })
        }
    }

    const submitUpdatePacking = async () => {
        product.value.tacked = true
        packing.value.tacked = true
        if (product.value.valid && packing.value.valid) {
            await updatePacking({
                product: product.value.value,
                packing: packing.value.value,
                id: route.params.id
            })
        }
    }

    const submitDeletePacking = async () => {
        await removePacking(route.params.id)
    }


    return {
        route,
        router,
        getPacking,
        product,
        packing,
        submitCreatePacking,
        submitUpdatePacking,
        submitDeletePacking,
    }
}