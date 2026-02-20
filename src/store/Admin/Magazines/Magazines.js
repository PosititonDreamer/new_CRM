import {Loader} from "@/store/Loader.js";
import {Messages} from "@/store/Messages.js";
import {useRouter} from "vue-router";
import axios from "axios";
import {computed, ref} from "vue";
import {defineStore} from "pinia";

export const Magazines = defineStore('Magazines', () => {
    const minDate = ref('');
    const magazinesGoods = ref([])
    const magazinesWeight = ref([])
    const magazinesConsumable = ref([])
    const magazinesOther = ref([])
    const magazinesList = ref([])

    const getMinDate = computed(() => minDate)
    const getMagazinesGoods = computed(() => magazinesGoods)
    const getMagazinesWeight = computed(() => magazinesWeight)
    const getMagazinesConsumable = computed(() => magazinesConsumable)
    const getMagazinesOther = computed(() => magazinesOther)
    const getMagazinesList = computed(() => magazinesList)

    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const router = useRouter();

    const findMinDate = async () => {
        updateLoader({method: 'findMinDate', status: false})
        await axios.get("/admin/magazines/min_date.php")
            .then(res => {
                minDate.value = res.data.min_date
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findMinDate', status: true})
    }

    const findMagazines = async ({warehouse, date_start, date_end}) => {
        updateLoader({method: 'findMagazines', status: false})
        const formData = new FormData();
        formData.append('warehouse', warehouse);
        formData.append('date_start', date_start);
        formData.append('date_end', date_end);
        await axios.post("/admin/magazines/list.php", formData)
            .then(res => {
                magazinesList.value = res.data.list
                magazinesGoods.value = res.data.goods
                magazinesWeight.value = res.data.weight
                magazinesConsumable.value = res.data.consumable
                magazinesOther.value = res.data.other
                router.push({name: 'Magazines'})
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findMagazines', status: true})
    }

    return {
        getMinDate,
        getMagazinesGoods,
        getMagazinesWeight,
        getMagazinesConsumable,
        getMagazinesOther,
        getMagazinesList,
        findMinDate,
        findMagazines,
    }
});
