import { defineStore } from 'pinia';
import {ref, computed} from 'vue';

export const Messages = defineStore('Messages', () => {
    const messages = ref([])

    const getMessages = computed(() => messages)

    const addMessages = (texts, type) => {
        texts.forEach(message => {
            const id = Date.now()
            messages.value.push({
                message,
                id,
                type
            })

            setTimeout(() => {
                removeMessages(id)
            }, 2000)
        })
    }

    const removeMessages = (id) => {
        messages.value = messages.value.filter(error => error.id !== id)
    }

    return {
        getMessages, addMessages, removeMessages
    }
});