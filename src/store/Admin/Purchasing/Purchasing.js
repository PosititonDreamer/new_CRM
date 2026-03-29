import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter} from "vue-router";

export const Purchasing = defineStore('Purchasing', () => {
    const purchasing = ref(null);
    const minDate = ref(null);

    const getPurchasing = computed(() => purchasing)
    const getMinDate = computed(() => minDate)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();

    const findPurchasing = async ({date_start, date_end, period}) => {
        updateLoader({method: 'findPurchasing', status: false})
        const formData = new FormData();
        formData.append('date_start', date_start);
        formData.append('date_end', date_end);
        formData.append('period', period);
        await axios.post('/admin/purchasing/list.php', formData)
            .then((res) => {
                purchasing.value = res.data.purchasing
                router.push({name: 'Purchasing'})
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })

        updateLoader({method: 'findPurchasing', status: true})
    }

    const findPurchasingMinDate = async () => {
        updateLoader({method: 'findPurchasingMinDate', status: false})
        await axios.get('/admin/purchasing/min_date.php')
            .then((res) => {
                minDate.value = res.data.min_date
                router.push({name: 'Purchasing'})
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findPurchasingMinDate', status: true})
    }

    return {
        getPurchasing,
        getMinDate,
        findPurchasing,
        findPurchasingMinDate,
    }
});