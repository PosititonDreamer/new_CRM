import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";
import {useRouter} from "vue-router";

export const Graphics = defineStore('Graphics', () => {
    const graphics = ref(null);
    const minDate = ref(null);

    const getGraphics = computed(() => graphics)
    const getMinDate = computed(() => minDate)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();

    const findGraphics = async ({date_start, date_end}) => {
        updateLoader({method: 'findGraphics', status: false})
        const formData = new FormData();
        formData.append('date_start', date_start);
        formData.append('date_end', date_end);
        await axios.post('/admin/graphics/list.php', formData)
            .then((res) => {
                graphics.value = res.data.graphics
                router.push({name: 'Graphics'})
                addMessages(res.data.messages, 'success');
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })

        updateLoader({method: 'findGraphics', status: true})
    }

    const findGraphicsMinDate = async () => {
        updateLoader({method: 'findGraphicsMinDate', status: false})
        await axios.get('/admin/graphics/min_date.php')
            .then((res) => {
                minDate.value = res.data.min_date
                router.push({name: 'Graphics'})
                addMessages(res.data.messages, 'success');
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findGraphicsMinDate', status: true})
    }

    return {
        getGraphics,
        getMinDate,
        findGraphics,
        findGraphicsMinDate,
    }
});