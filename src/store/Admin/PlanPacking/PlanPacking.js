import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter} from "vue-router";

export const PlanPacking = defineStore('PlanPacking', () => {
    const packing = ref(null);
    const minDate = ref(null);

    const getPacking = computed(() => packing)
    const getMinDate = computed(() => minDate)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();

    const findPacking = async ({date_start, date_end, period}) => {
        updateLoader({method: 'findPacking', status: false})
        const formData = new FormData();
        formData.append('date_start', date_start);
        formData.append('date_end', date_end);
        formData.append('period', period);
        await axios.post('/admin/packing/list.php', formData)
            .then((res) => {
                packing.value = res.data.packing
                router.push({name: 'PlanPacking'})
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })

        updateLoader({method: 'findPacking', status: true})
    }

    const findPackingMinDate = async () => {
        updateLoader({method: 'findPackingMinDate', status: false})
        await axios.get('/admin/packing/min_date.php')
            .then((res) => {
                minDate.value = res.data.min_date
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findPackingMinDate', status: true})
    }

    return {
        getPacking,
        getMinDate,
        findPacking,
        findPackingMinDate,
    }
});