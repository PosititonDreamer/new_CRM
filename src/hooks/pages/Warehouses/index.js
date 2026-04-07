import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {Warehouses} from "@/store/Admin/Warehouses/Warehouses.js";

export const HookWarehouses = () => {
    const {createWarehouse, updateWarehouse, removeWarehouse, findWarehouses} = Warehouses();
    const {data: title} = validateInput("String", "", 3)
    const {data: description} = validateInput("String", "", 3)
    const {data: type} = validateInput("String", "", 1)
    const {data: few} = validateInput("Number", 0, 1)
    const {data: few_very} = validateInput("Number", 0, 1)
    const {data: few_other} = validateInput("Number", 0, 1)
    const {data: few_very_other} = validateInput("Number", 0, 1)

    const router = useRouter()
    const route = useRoute()

    const submitCreateWarehouses = async () => {
        title.value.tacked = true
        description.value.tacked = true
        type.value.tacked = true
        few.value.tacked = true
        few_very.value.tacked = true
        few_other.value.tacked = true
        few_very_other.value.tacked = true

        if(title.value.valid && description.value.valid && type.value.valid && few.value.valid && few_very.value.valid && few_other.value.valid && few_very_other.value.valid) {
            await createWarehouse({
                title: title.value.value,
                description: description.value.value,
                type: type.value.value,
                few: few.value.value,
                few_very: few_very.value.value,
                few_other: few_other.value.value,
                few_very_other: few_very_other.value.value,
            })
            await findWarehouses()
        }
    }

    const submitUpdateWarehouses = async () => {
        title.value.tacked = true
        description.value.tacked = true
        type.value.tacked = true
        few.value.tacked = true
        few_very.value.tacked = true
        few_other.value.tacked = true
        few_very_other.value.tacked = true

        if(title.value.valid && description.value.valid && type.value.valid  && few.value.valid && few_very.value.valid && few_other.value.valid && few_very_other.value.valid) {
            await updateWarehouse({
                title: title.value.value,
                description: description.value.value,
                type: type.value.value,
                id: route.params.id,
                few: few.value.value,
                few_very: few_very.value.value,
                few_other: few_other.value.value,
                few_very_other: few_very_other.value.value,
            })
            await findWarehouses()
        }
    }

    const submitDeleteWarehouses = async () => {
        await removeWarehouse(route.params.id)
        await findWarehouses()
    }

    return {
        title,
        description,
        type,
        few,
        few_very,
        few_other,
        few_very_other,
        router,
        route,
        submitCreateWarehouses,
        submitUpdateWarehouses,
        submitDeleteWarehouses,
    }
}