import { defineStore } from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Errors} from "@/store/Errors.js";
import {Loader} from "@/store/Loader.js";
import {useRouter} from "vue-router";

export const MeasureUnits = defineStore('MeasureUnits', () => {
    const measureUnits = ref([])

    const getMeasureUnits = computed(() => measureUnits)

    const {updateLoader} = Loader()
    const {addErrors} = Errors();

    const router = useRouter();

    const findMeasureUnits = async () => {
        updateLoader({method: 'findMeasureUnits', status: false})
        await axios.get('/admin/products/measure_units/list.php')
            .then(res => {
                measureUnits.value = res.data.measure_units
            })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'findMeasureUnits', status: true})
    }

    const createMeasureUnits = async ({title}) => {
        updateLoader({method: 'createMeasureUnits', status: false})
        const formData = new FormData()
        formData.append('title', title)
        await axios.post('/admin/products/measure_units/create.php', formData)
        .then(res => {
            measureUnits.value.push(res.data.measure_unit)
            router.push({name: 'MeasureUnits'})
        })
        .catch(err => {
            addErrors(err.response.data.messages)
        })
        updateLoader({method: 'createMeasureUnits', status: true})

    }

    const updateMeasureUnits = async ({title, id}) => {
        updateLoader({method: 'updateMeasureUnits', status: false})
        const formData = new FormData()
        formData.append('title', title)
        formData.append('id', id)
        await axios.post('/admin/products/measure_units/update.php', formData)
            .then(res => {
                measureUnits.value = measureUnits.value.map(measureUnit => {
                    if(measureUnit.id === id) {
                        return res.data.measure_unit
                    }
                    return measureUnit
                })
                router.push({name: 'MeasureUnits'})
            })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'updateMeasureUnits', status: true})
    }

    const removeMeasureUnits = async (id) => {
        updateLoader({method: 'removeMeasureUnits', status: false})
        const formData = new FormData()
        formData.append('id', id)
        await axios.post('/admin/products/measure_units/delete.php', formData)
            .then(() => {
                measureUnits.value = measureUnits.value.filter(measureUnit => +measureUnit.id !== +id)
                router.push({name: 'MeasureUnits'})
            })
            .catch(err => {
                addErrors(err.response.data.messages)
            })
        updateLoader({method: 'removeMeasureUnits', status: true})
    }

    return {
        getMeasureUnits, findMeasureUnits, createMeasureUnits, updateMeasureUnits, removeMeasureUnits,
    }
});
