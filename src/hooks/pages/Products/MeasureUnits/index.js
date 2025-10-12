import {validateInput} from "@/hooks/validateInput.js";
import {ref} from "vue";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";

export const HookMeasureUnits = () => {
    const {getMeasureUnits, createMeasureUnits, removeMeasureUnits, updateMeasureUnits} = MeasureUnits()

    const {data: title} = validateInput("String", "", 3)
    const deleteMeasureUnitsId = ref(null)

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
    const deleteMeasureUnits = async () => {
        await removeMeasureUnits(deleteMeasureUnitsId.value)
        deleteMeasureUnitsId.value = null
    }

    return {
        title,
        getMeasureUnits,
        deleteMeasureUnitsId,
        submitCreateMeasureUnit,
        submitUpdateMeasureUnit,
        deleteMeasureUnits,
    }
}