import {Promos} from "@/store/Admin/Promos/Promos.js";
import {validateInput} from "@/hooks/validateInput.js";
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";

export const HookPromos = () => {
    const {
        getPromos,
        createPromos,
        updatePromos,
        deletePromos,
    } = Promos()

    const router = useRouter()
    const route = useRoute()

    const {data: date_start} = validateInput("Date", "")
    const {data: date_end} = validateInput("Date", "")
    const {data: title} = validateInput("String", "")

    const submitCreatePromos = async () => {
        date_start.value.tacked = true
        date_end.value.tacked = true
        title.value.tacked = true

        if(date_start.value.valid && date_end.value.valid && title.value.valid) {
            await createPromos({
                date_start: date_start.value.value,
                date_end: date_end.value.value,
                title: title.value.value,
            })
        }
    }

    const submitUpdatePromos = async () => {
        date_start.value.tacked = true
        date_end.value.tacked = true
        title.value.tacked = true

        if(date_start.value.valid && date_end.value.valid && title.value.valid) {
            await updatePromos({
                id: route.params.id,
                date_start: date_start.value.value,
                date_end: date_end.value.value,
                title: title.value.value,
            })
        }
    }

    const submitDeletePromos = async () => {
        await deletePromos(route.params.id)
    }

    const actionsPromos = ref([
        {
            name: "update",
            text: "Изменить"
        },
        {
            name: "remove",
            text: "Удалить"
        }
    ])

    const clearData = () => {
        date_start.value.value = ''
        date_end.value.value = ''
        title.value.value = ''

        date_start.value.tacked = false
        date_end.value.tacked = false
        title.value.tacked = false
    }

    return {
        router,
        route,
        date_start,
        date_end,
        title,
        getPromos,
        submitCreatePromos,
        submitUpdatePromos,
        submitDeletePromos,
        actionsPromos,
        clearData
    }
}