import {validateInput} from "@/hooks/validateInput.js";
import {ref} from "vue";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import {useRouter, useRoute} from "vue-router";

export const HookMeasureUnits = () => {
    const {getMeasureUnits, createMeasureUnits, removeMeasureUnits, updateMeasureUnits} = MeasureUnits()

    const {data: title} = validateInput("String", "", 1)
    const router = useRouter()
    const route = useRoute()

    const submitCreateMeasureUnit = async () => {
        title.value.tacked = true
        if (title.value.valid) {
            await createMeasureUnits({title: title.value.value})
            title.value.tacked = false
            title.value.value = ""
        }
    }

    const submitUpdateMeasureUnit = async () => {
        title.value.tacked = true
        if (title.value.valid) {
            await updateMeasureUnits({title: title.value.value, id: route.params.id})
            title.value.tacked = false
            title.value.value = ""
        }
    }
    const submitDeleteMeasureUnits = async () => {
        await removeMeasureUnits(route.params.id)
    }

    return {
        title,
        getMeasureUnits,
        submitCreateMeasureUnit,
        submitUpdateMeasureUnit,
        submitDeleteMeasureUnits,
        router,
        route
    }
}