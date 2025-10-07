import { defineStore } from 'pinia';
import {ref, computed, reactive} from 'vue';
export const loader = defineStore('loader', () => {
    const loader = ref([])

    const getLoader = computed(() => {
        return loader
    })

    const updateLoader = ({method, status}) => {
        if(loader.value.find(load => load.method === method)) {
            loader.value = loader.value.map(load => {
                if(load.method === method) {
                    load.status = status
                }
                return load
            })
        } else {
            loader.value.push({method, status})
        }
    }

    return {
        getLoader, updateLoader
    }
});