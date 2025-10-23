import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {GoodsWeight} from "@/store/Admin/Goods/Weight.js";
import {ref} from "vue";


export const HookGoodsWeight = () => {
    const {getGoodsWeight, createGoodsWeight, updateGoodsWeight, updateBalanceGoodsWeight, deleteGoodsWeight} = GoodsWeight();
    const route = useRoute()
    const router = useRouter()

    const {data: product} = validateInput("String", "", 1)
    const {data: balance} = validateInput("Number", 0, 0)
    const {data: few} = validateInput("Number", 0, 0)
    const {data: few_very} = validateInput("Number", 0, 0)
    const composite = ref(false)
    const compositeList = ref([])

    const goodWeight = {
        product,
        balance,
        few,
        few_very,
        composite,
        compositeList
    }

    const addCompositeItem = (itemGoodWeight = {weight_composite: '', proportion: 0}, id = Date.now()) => {
        const {data: weight_composite} = validateInput("String", itemGoodWeight.weight_composite, 1)
        const {data: proportion} = validateInput("Number", itemGoodWeight.proportion, 1)
        compositeList.value.push({id, weight_composite, proportion})
    }

    const removeCompositeItem = (id) => {
        compositeList.value = compositeList.value.filter(item => +item.id !== +id)
    }

    const submitCreateGoodsWeight = async () => {
        product.value.tacked = true
        let sum = 0
        if(composite.value) {
            compositeList.value.forEach(item => {
                item.weight_composite.tacked = true
                item.proportion.tacked = true
                sum += +item.proportion.value
            })
        }

        const checked = product.value.valid && (composite.value ? !compositeList.value.find(item => !item.proportion.valid || !item.weight_composite.valid) && sum === 100 : true)

        if(checked) {
            await createGoodsWeight({
                warehouse: route.params.warehouse,
                product: product.value.value,
                balance: balance.value.value,
                few: few.value.value,
                few_very: few_very.value.value,
                composite: composite.value,
                composite_list: compositeList.value.map(item => {
                    return {
                        weight_composite: getGoodsWeight.value.find(weight => weight.product === item.weight_composite.value).id,
                        proportion: item.proportion.value,
                    }
                })
            })
        }
    }

    const submitUpdateGoodsWeight = async () => {
        product.value.tacked = true
        let sum = 0

        if(composite.value) {
            compositeList.value.forEach(item => {
                item.weight_composite.tacked = true
                item.proportion.tacked = true
                sum += +item.proportion.value
            })
        }


        const checked = product.value.valid && (composite.value ? !compositeList.value.find(item => !item.proportion.valid || !item.weight_composite.valid) && sum === 100 : true)

        if(checked) {
            await updateGoodsWeight({
                id: route.params.id,
                warehouse: route.params.warehouse,
                product: product.value.value,
                balance: balance.value.value,
                few: few.value.value,
                few_very: few_very.value.value,
                composite: composite.value,
                composite_list: compositeList.value.map(item => {
                    return {
                        weight_composite: getGoodsWeight.value.find(weight => weight.product === item.weight_composite.value).id,
                        proportion: item.proportion.value,
                    }
                })
            })
        }
    }

    const submitUpdateBalanceGoodsWeight = async () => {
        await updateBalanceGoodsWeight({
            id: route.params.id,
            warehouse: route.params.warehouse,
            balance: balance.value.value,
        })
    }

    const submitDeleteGoodsWeight = async () => {
        await deleteGoodsWeight({
            id: route.params.id,
            warehouse: route.params.warehouse,
        })
    }

    return {
        getGoodsWeight,
        route,
        router,
        goodWeight,
        addCompositeItem,
        removeCompositeItem,
        submitCreateGoodsWeight,
        submitUpdateGoodsWeight,
        submitUpdateBalanceGoodsWeight,
        submitDeleteGoodsWeight,
    }
}