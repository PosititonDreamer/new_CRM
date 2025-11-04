import {computed, ref} from "vue";

export const validateInput = (type, startValue, min = null) => {
    const data = ref({
        value: startValue,
        tacked: false,
        error: computed(() =>{
            if(type === "Number") {
                if(min === null) {
                    return ""
                }

                if(data.value.tacked && data.value.value <= min) {
                    return "Обязательное поле для заполнения"
                }

                return ""
            }

            if(type === "String") {
                if(data.value.tacked && data.value.value?.trim().length === 0) {
                    return "Обязательно поле для заполнения"
                }

                if(data.value.tacked && data.value.value?.trim().length < min) {
                    return `Минимальное количество символов ${min}`
                }

                return  ""
            }

            if(type === 'File') {
                if(!data.value.value && data.value.tacked) {
                    return "Обязтельное поле для заполнения"
                }
                return ""
            }
        }),
        valid: computed(() =>{
            return data.value.error.trim().length === 0
        })
    })


    return {
        data
    }
}