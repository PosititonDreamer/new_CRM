import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {PlanPacking} from "@/store/Admin/PlanPacking/PlanPacking.js";
import {computed, ref, watch} from "vue";

export const HookPlanPacking = () => {
    const {
        getPacking,
        getMinDate,
        findPacking,
    } = PlanPacking()

    const router = useRouter();
    const route = useRoute()

    const {data: date_start} = validateInput("Date", "")
    const {data: date_end} = validateInput("Date", "")
    const {data: period} = validateInput("Number", 0, 1)

    const submitFindPacking = async () => {
        date_start.value.tacked = true
        date_end.value.tacked = true
        period.value.tacked = true

        if (date_start.value.valid && date_end.value.valid && period.value.valid) {
            await findPacking({
                date_start: date_start.value.value,
                date_end: date_end.value.value,
                period: period.value.value,
            })
        }
    }

    const columnsDays = computed(() => {
        return [30, 60, 90, 120, 150, 180, +getPacking.value.period].sort((a, b) => a - b)
    })

    const computedPackings = ref([])

    watch(() => getPacking.value,() => {
        const newArray = []

        if(getPacking.value) {
            Object.values(getPacking.value.products).forEach(item => {
                item.list = Object.values(item.list).map(quantity => {
                    quantity.sum_day = (+quantity.expense / +getPacking.value.period).toFixed(5)
                    quantity.quantity = +quantity.quantity
                    quantity.current_balance = +quantity.current_balance
                    return quantity
                }).sort((a, b) => +a.quantity - +b.quantity)

                newArray.push(item)
            })
        }

        computedPackings.value = newArray
    })

    return {
        getPacking,
        getMinDate,
        router,
        route,
        date_start,
        date_end,
        period,
        submitFindPacking,
        columnsDays,
        computedPackings
    }
}