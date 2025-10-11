import { defineStore } from 'pinia';
import {ref, computed} from 'vue';

export const Errors = defineStore('Errors', () => {
    const errors = ref([])

    const getErrors = computed(() => errors)

    const addErrors = (messages) => {
        messages.forEach(message => {
            const id = Date.now()
            errors.value.push({
                message,
                id
            })

            setTimeout(() => {
                removeErrors(id)
            }, 2000)
        })
    }

    const removeErrors = (id) => {
        errors.value = errors.value.filter(error => error.id !== id)
    }

    return {
        getErrors, addErrors, removeErrors
    }
});