import {Salaries} from "@/store/Salaries/Salaries.js";
import {validateInput} from "@/hooks/validateInput.js";
import {Auth} from "@/store/Workers/Auth.js";
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";

export const HookSalaries = () => {
    const {
        getSalaries,
        findSalaries,
        acceptSalariesOperator,
        acceptSalariesAssembler,
    } = Salaries()
    const {getWorker} = Auth()

    const route = useRoute()
    const router = useRouter()

    const {data: worker} = validateInput("String", "")
    const {data: date_start} = validateInput("Date", "")
    const {data: date_end} = validateInput("Date", "")

    const salariesList = ref([])
    const penaltiesList = ref([])

    const salaryAssembler = {
        salariesList,
        penaltiesList
    }

    const {data: dateStart} = validateInput("Date", "")
    const {data: dateEnd} = validateInput("Date", "")
    const {data: description} = validateInput("String", "")
    const {data: sum} = validateInput("Number", 0)

    const salaryOperator = {
        dateStart,
        dateEnd,
        description,
        sum,
        penaltiesList,
    }

    const submitFindSalaries = async (afterPage = 'Salaries') => {
        if(getWorker.value.rule === 'Админ') {
            worker.value.tacked = true
            date_start.value.tacked = true
            date_end.value.tacked = true

            if(worker.value.valid && date_start.value.valid && date_end.value.valid) {
                await findSalaries(
                    {
                        worker: worker.value.value,
                        date_start: date_start.value.value,
                        date_end: date_end.value.value,
                    }, afterPage
                )
            }
        } else {
            date_start.value.tacked = true
            date_end.value.tacked = true

            if(date_start.value.valid && date_end.value.valid) {
                await findSalaries(
                    {
                        worker: getWorker.value.id,
                        date_start: date_start.value.value,
                        date_end: date_end.value.value,
                    },
                    afterPage
                )
            }
        }
    }

    const submitAcceptSalariesAssembler = async () => {
        if(salariesList.value.length) {
            await acceptSalariesAssembler({
                worker: getSalaries.value.worker,
                penalties: penaltiesList.value,
                salaries: salariesList.value,
            })
        }
    }
    const submitAcceptSalariesOperator = async () => {
        dateStart.value.tacked = true
        dateEnd.value.tacked = true
        description.value.tacked = true
        sum.value.tacked = true

        if(dateStart.value.valid && dateEnd.value.valid && description.value.valid && sum.value.valid) {
            await acceptSalariesOperator({
                worker: getSalaries.value.worker,
                date_start: dateStart.value.value,
                date_end: dateEnd.value.value,
                description: description.value.value,
                sum: sum.value.value,
                penalties: penaltiesList.value,
            })
        }
    }

    const clearData = () => {
        worker.value.tacked = false
        date_start.value.tacked = false
        date_end.value.tacked = false
        dateStart.value.tacked = false
        dateEnd.value.tacked = false
        description.value.tacked = false
        sum.value.tacked = false

        worker.value.value = ''
        date_start.value.value = ''
        date_end.value.value = ''
        dateStart.value.value = ''
        dateEnd.value.value = ''
        description.value.value = ''
        sum.value.value = 0

        salariesList.value = []
        penaltiesList.value = []
    }

    return {
        worker,
        date_start,
        date_end,
        getSalaries,
        route,
        router,
        salaryAssembler,
        salaryOperator,
        submitFindSalaries,
        submitAcceptSalariesOperator,
        submitAcceptSalariesAssembler,
        clearData
    }
}