import {defineStore} from 'pinia';
import {Errors} from "@/store/Errors.js";
import {Loader} from "@/store/Loader.js";
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import axios from "axios";

export const Workers = defineStore('Workers', () => {
    const workers = ref([])
    const workersRules = ref([])
    const workersWarehouses = ref([])

    const getWorkers = computed(() => workers)
    const getWorkersRules = computed(() => workersRules)
    const getWorkersWarehouses = computed(() => workersWarehouses)

    const {updateLoader} = Loader()
    const {addErrors} = Errors();
    const router = useRouter();

    const findWorkers = async () => {
        updateLoader({method: 'findWorkers', status: false})
        await axios.get('/admin/workers/list.php')
            .then(res => {
                workers.value = res.data.workers
                workersRules.value = res.data.rules
                workersWarehouses.value = res.data.warehouses
            })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'findWorkers', status: true})
    }

    const createWorkers = async ({rule, name, description, salary, warehouses}) => {
        updateLoader({method: 'createWorkers', status: false})
        const formData = new FormData()
        formData.append('name', name)
        formData.append('rule', rule)
        formData.append('description', description)
        formData.append('salary', salary)
        formData.append('warehouses', JSON.stringify(warehouses))

        await axios.post('/admin/workers/create.php',formData)
            .then(res => {
                workers.value.push(res.data.worker)
                workersWarehouses.value = [...workersWarehouses.value, ...res.data.warehouses]
                router.push({name: 'Workers'})
            })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'createWorkers', status: true})
    }

    const updateWorkers = async ({id, rule, name, description, salary, warehouses}) => {
        updateLoader({method: 'updateWorkers', status: false})
        const formData = new FormData()
        formData.append('name', name)
        formData.append('rule', rule)
        formData.append('description', description)
        formData.append('salary', salary)
        formData.append('id', id)
        formData.append('warehouses', JSON.stringify(warehouses))
        await axios.post('/admin/workers/update.php',formData)
            .then(res => {
                workers.value = workers.value.map(worker => {
                    if(worker.id === id) {
                        return res.data.worker
                    }
                    return worker
                })
                workersWarehouses.value = [...workersWarehouses.value.filter(warehouse => +warehouse.worker !== +id), ...res.data.warehouses]
                router.push({name: 'Workers'})
            })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'updateWorkers', status: true})
    }

    const updateWorkersToken = async (id) => {
        updateLoader({method: 'updateWorkers', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/workers/update_token.php',formData)
            .then(res => {
                workers.value = workers.value.map(worker => {
                    if(worker.id === id) {
                        worker.token = res.data.token
                    }
                    return worker
                })
                router.push({name: 'Workers'})
            })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'updateWorkers', status: true})
    }

    const deleteWorkers = async (id) => {
        updateLoader({method: 'deleteWorkers', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/workers/delete.php',formData)
            .then(() => {
                workers.value = workers.value.filter(worker => +worker.id !== +id)
                workersWarehouses.value = workersWarehouses.value.filter(warehouse => +warehouse.worker !== +id)
                router.push({name: 'Workers'})
            })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'deleteWorkers', status: true})
    }

    return {
        getWorkers,
        getWorkersRules,
        getWorkersWarehouses,
        findWorkers,
        createWorkers,
        updateWorkers,
        updateWorkersToken,
        deleteWorkers,
    }
})
