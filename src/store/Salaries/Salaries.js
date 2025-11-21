import {defineStore} from 'pinia';
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import axios from "axios";

export const Salaries = defineStore('Salaries', () => {
    const salaries = ref(null)

    const getSalaries = computed(() => salaries)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();

    const findSalaries = async ({worker, date_start, date_end}, afterPage = 'Salaries') => {
        updateLoader({method: 'findSalaries', status: false})
        const formData = new FormData();
        formData.append('worker', worker);
        formData.append('date_start', date_start);
        formData.append('date_end', date_end);
        await axios.post('/salaries/list.php', formData)
            .then((res) => {
                salaries.value = {
                    salaries: res.data.salaries,
                    penalties: res.data.penalties,
                    salaries_length: res.data.salaries_length,
                    penalties_length: res.data.penalties_length,
                    rule: res.data.rule,
                    date_end: res.data.date_end,
                    date_start: res.data.date_start,
                    worker: res.data.worker,
                }
                router.push({name: afterPage})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findSalaries', status: true})
    }

    const acceptSalariesAssembler = async (data, afterPage = 'Salaries') => {
        updateLoader({method: 'acceptSalariesAssembler', status: false})
        const formData = new FormData();
        formData.append('worker', data.worker);
        formData.append('penalties', JSON.stringify(data.penalties));
        formData.append('salaries', JSON.stringify(data.salaries));
        await axios.post('/admin/salaries/accept.php', formData)
            .then((res) => {
                salaries.value.salaries.forEach(salary => {
                    if(data.salaries.find(item => +item === +salary.id)) {
                        salary.ready = true
                    }
                })
                salaries.value.penalties.forEach((penalty) => {
                    if(data.penalties.find(item => +item === +penalty.id)) {
                        penalty.ready = true
                    }
                })
                router.push({name: afterPage})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'acceptSalariesAssembler', status: true})
    }

    const acceptSalariesOperator = async (data, afterPage = 'Salaries') => {
        updateLoader({method: 'acceptSalariesOperator', status: false})
        const formData = new FormData();
        formData.append('worker', data.worker);
        formData.append('date_start', data.date_start);
        formData.append('date_end', data.date_end);
        formData.append('description', data.description);
        formData.append('sum', data.sum);
        formData.append('penalties', JSON.stringify(data.penalties));
        await axios.post('/admin/salaries/accept.php', formData)
            .then((res) => {
                salaries.value.salaries.push(res.data.salary)
                salaries.value.penalties.forEach((penalty) => {
                    if(data.penalties.find(item => +item === +penalty.id)) {
                       penalty.ready = true
                    }
                })
                router.push({name: afterPage})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'acceptSalariesOperator', status: true})
    }

    return {
        getSalaries,
        findSalaries,
        acceptSalariesOperator,
        acceptSalariesAssembler,
    }
})
