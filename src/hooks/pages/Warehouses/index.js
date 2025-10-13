import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {Warehouses} from "@/store/Admin/Warehouses/Warehouses.js";

export const HookWarehouses = () => {
    const {createWarehouse, updateWarehouse, removeWarehouse} = Warehouses();
    const {data: title} = validateInput("String", "", 3)
    const {data: description} = validateInput("String", "", 3)
    const {data: type} = validateInput("String", "", 1)

    const router = useRouter()
    const route = useRoute()

    const submitCreateWarehouses = async () => {
        title.value.tacked = true
        description.value.tacked = true
        type.value.tacked = true

        if(title.value.valid && description.value.valid && type.value.valid) {
            await createWarehouse({
                title: title.value.value,
                description: description.value.value,
                type: type.value.value,
            })
        }
    }

    const submitUpdateWarehouses = async () => {
        title.value.tacked = true
        description.value.tacked = true
        type.value.tacked = true

        if(title.value.valid && description.value.valid && type.value.valid) {
            await updateWarehouse({
                title: title.value.value,
                description: description.value.value,
                type: type.value.value,
                id: route.params.id,
            })
        }
    }

    const submitDeleteWarehouses = async () => {
        await removeWarehouse(route.params.id)
    }

    return {
        title,
        description,
        type,
        router,
        route,
        submitCreateWarehouses,
        submitUpdateWarehouses,
        submitDeleteWarehouses,
    }
}