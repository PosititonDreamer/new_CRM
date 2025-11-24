import {defineStore} from "pinia";
import axios from "axios";
import {Auth} from "@/store/Workers/Auth.js";
import {computed, ref} from "vue";
import {Loader} from "@/store/Loader.js";
import {Messages} from "@/store/Messages.js";
import {useRoute} from "vue-router";

export const Assembler = defineStore('Assembler', () => {

    const warehouses = ref([])
    const goods = ref([])
    const goodsWeight = ref([])
    const goodsConsumable = ref([])
    const goodsOther = ref([])
    const products = ref([])
    const measureUnits = ref([])
    const goodsOtherType = ref([])

    const getWarehouses = computed(() => warehouses)
    const getGoods = computed(() => goods)
    const getGoodsWeight = computed(() => goodsWeight)
    const getGoodsConsumable = computed(() => goodsConsumable)
    const getGoodsOther = computed(() => goodsOther)
    const getProducts = computed(() => products)
    const getMeasureUnits = computed(() => measureUnits)
    const getGoodsOtherType = computed(() => goodsOtherType)

    const {getWorker} = Auth()
    const {updateLoader} = Loader()
    const {addMessages} = Messages();
    const route = useRoute();

    const findWarehouses = async () => {
        updateLoader({method: 'findWarehouses', status: false})
        await axios.get(`/assembler/warehouses/list.php?worker=${getWorker.value.id}`)
            .then(res => {
                warehouses.value = res.data.warehouses
                addMessages(res.data.messages, 'success')
            })

            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findWarehouses', status: true})
    }

    const findGoods = async () => {
        updateLoader({method: 'findGoods', status: false})
        await axios.get(`/assembler/goods/list.php?warehouse=${route.params.warehouse}`)
        .then(res => {
            goods.value = res.data.goods
            products.value = res.data.products
            measureUnits.value = res.data.measure_units
            addMessages(res.data.messages, 'success')
        })
        .catch((err) => {
            addMessages(err.response.data.messages, 'error')
        })
        updateLoader({method: 'findGoods', status: true})
    }

    const findGoodsWeight = async () => {
        updateLoader({method: 'findGoodsWeight', status: false})
        await axios.get(`/assembler/goods/weight/list.php?warehouse=${route.params.warehouse}`)
            .then(res => {
                goodsWeight.value = res.data.goods_weight
                products.value = res.data.products
                measureUnits.value = res.data.measure_units
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findGoodsWeight', status: true})
    }

    const findGoodsConsumable = async () => {
        updateLoader({method: 'findGoodsConsumable', status: false})
        await axios.get(`/assembler/goods/consumable/list.php?warehouse=${route.params.warehouse}`)
            .then(res => {
                goodsConsumable.value = res.data.goods_consumable
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findGoodsConsumable', status: true})
    }

    const findGoodsOther = async () => {
        updateLoader({method: 'findGoodsOther', status: false})
        await axios.get(`/assembler/goods/other/list.php?warehouse=${route.params.warehouse}`)
            .then(res => {
                goodsOther.value = res.data.goods_other
                goodsOtherType.value = res.data.goods_other_type
                addMessages(res.data.messages, 'success')
            })
            .catch((err) => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findGoodsOther', status: true})
    }

    return {
        findWarehouses,
        findGoods,
        findGoodsWeight,
        findGoodsConsumable,
        findGoodsOther,
        getWarehouses,
        getGoods,
        getGoodsWeight,
        getGoodsConsumable,
        getGoodsOther,
        getProducts,
        getMeasureUnits,
        getGoodsOtherType,
    }
});
