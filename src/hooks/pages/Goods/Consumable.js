import {GoodsConsumable} from "@/store/Admin/Goods/Consumable.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {ref} from "vue";

export const HookGoodsConsumable = () => {
    const {
        getGoodsConsumable,
        createGoodsConsumable,
        updateGoodsConsumable,
        updateBalanceGoodsConsumable,
        deleteGoodsConsumable,
    } = GoodsConsumable()

    const route = useRoute()
    const router = useRouter()

    const {data: title} = validateInput("String", "", 3)
    const {data: balance} = validateInput("Number", 0, 0)
    const {data: few} = validateInput("Number", 0, 0)
    const {data: few_very} = validateInput("Number", 0, 0)
    const {data: sort} = validateInput("Number", 0, 0)
    const binding = ref([])

    const consumable = {
        title,
        balance,
        few,
        few_very,
        sort,
        binding
    }

    const submitCreateGoodsConsumable = async () => {
        title.value.tacked = true

        if(title.value.valid) {
            await createGoodsConsumable({
                warehouse: route.params.warehouse,
                title: title.value.value,
                balance: balance.value.value,
                few: few.value.value,
                few_very: few_very.value.value,
                binding: binding.value
            })
        }
    }

    const submitUpdateGoodsConsumable = async () => {
        title.value.tacked = true
        if(title.value.valid) {
            await updateGoodsConsumable({
                id: route.params.id,
                warehouse: route.params.warehouse,
                title: title.value.value,
                balance: balance.value.value,
                few: few.value.value,
                few_very: few_very.value.value,
                binding: binding.value,
                sort: sort.value.value,
            })
        }
    }

    const submitUpdateBalanceGoodsConsumable = async () => {
        await updateBalanceGoodsConsumable({
            id: route.params.id,
            warehouse: route.params.warehouse,
            balance: balance.value.value,
        })
    }

    const submitDeleteGoodsConsumable = async () => {
        await deleteGoodsConsumable({
            id: route.params.id,
            warehouse: route.params.warehouse,
        })
    }

    return {
        getGoodsConsumable,
        route,
        router,
        consumable,
        submitCreateGoodsConsumable,
        submitUpdateGoodsConsumable,
        submitUpdateBalanceGoodsConsumable,
        submitDeleteGoodsConsumable,
    }
}