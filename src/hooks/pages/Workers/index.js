import {Workers} from "@/store/Admin/Workers/Workers.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {ref} from "vue";

export const HookWorkers = () => {
    const {
        getWorkers,
        getWorkersRules,
        getWorkersWarehouses,
        createWorkers,
        updateWorkers,
        updateWorkersToken,
        deleteWorkers,
        createPenaltyWorkers
    } = Workers()

    const {data: rule} = validateInput("String", "", 1)
    const {data: name} = validateInput("String", "", 3)
    const {data: description} = validateInput("String", "", 3)
    const {data: salary} = validateInput("Number", 0, 1)
    const {data: penalty} = validateInput("String", "", 1)
    const {data: sumPenalty} = validateInput("Number", 0, 1)
    const warehouses = ref([])

    const worker = {
        rule,
        name,
        description,
        salary,
        warehouses
    }

    const router = useRouter()
    const route = useRoute()

    const addWorkerWarehouse = (startValue = "", id = Date.now()) => {
        const {data: warehouse} = validateInput("String", startValue, 1)
        worker.warehouses.value.push({id, warehouse})
    }

    const removeWorkerWarehouse = (id) => {
        worker.warehouses.value = worker.warehouses.value.filter(item => item.id !== id)
    }


    const submitCreateWorkers = async () => {
        rule.value.tacked = true
        name.value.tacked = true
        description.value.tacked = true
        salary.value.tacked = true
        worker.warehouses.value.forEach(item => {
            item.warehouse.tacked = true
        })

        if (rule.value.valid &&
            name.value.valid &&
            description.value.valid &&
            salary.value.valid &&
            !worker.warehouses.value.find(item => !item.warehouse.valid)
        ) {
            await createWorkers({
                rule: rule.value.value,
                name: name.value.value,
                description: description.value.value,
                salary: salary.value.value,
                warehouses: worker.warehouses.value.map(item => item.warehouse.value)
            })
        }
    }

    const submitUpdateWorkers = async () => {
        rule.value.tacked = true
        name.value.tacked = true
        description.value.tacked = true
        salary.value.tacked = true
        worker.warehouses.value.forEach(item => {
            item.warehouse.tacked = true
        })

        if (rule.value.valid &&
            name.value.valid &&
            description.value.valid &&
            salary.value.valid &&
            !worker.warehouses.value.find(item => !item.warehouse.valid)
        ) {
            await updateWorkers({
                id: route.params.id,
                rule: rule.value.value,
                name: name.value.value,
                description: description.value.value,
                salary: salary.value.value,
                warehouses: worker.warehouses.value.map(item => item.warehouse.value)
            })
        }
    }

    const submitUpdateTokenWorkers = async () => {
        await updateWorkersToken(route.params.id)
    }

    const submitDeleteWorkers = async () => {
        await deleteWorkers(route.params.id)
    }

    const submitCreatePenaltyWorkers = async () => {
        penalty.value.tacked = true
        sumPenalty.value.tacked = true

        if(penalty.value.valid && sumPenalty.value.valid) {
            await createPenaltyWorkers({
                description: penalty.value.value,
                worker: route.params.id,
                sum: sumPenalty.value.value,
            })
        }
    }


    return {
        router,
        route,
        worker,
        getWorkers,
        getWorkersRules,
        getWorkersWarehouses,
        addWorkerWarehouse,
        removeWorkerWarehouse,
        submitCreateWorkers,
        submitUpdateWorkers,
        submitUpdateTokenWorkers,
        submitDeleteWorkers,
        penalty,
        sumPenalty,
        submitCreatePenaltyWorkers
    }
}