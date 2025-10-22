import {Goods} from "@/store/Admin/Goods/Goods.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";

export const HookGoods = () => {
    const {getGoods, createGoods, updateGoods, updateBalanceGoods, deleteGoods} = Goods()

    const route = useRoute()
    const router = useRouter()

    const {data: product} = validateInput("String", "", 1)
    const {data: quantity} = validateInput("Number", 0, 1)
    const {data: balance} = validateInput("Number", 0, 0)
    const {data: few} = validateInput("Number", 0, 0)
    const {data: few_very} = validateInput("Number", 0, 0)
    const {data: article} = validateInput("String", "", 0)

    const good = {
        product,
        quantity,
        balance,
        few,
        few_very,
        article,
    }

    const submitCreateGoods = async () => {
        product.value.tacked = true
        quantity.value.tacked = true
        if(product.value.valid && quantity.value.valid) {
            await createGoods({
                product: product.value.value,
                quantity: quantity.value.value,
                balance: balance.value.value,
                few: few.value.value,
                few_very: few_very.value.value,
                article: article.value.value,
                warehouse: route.params.warehouse
            })
        }
    }

    const submitUpdateGoods = async () => {
        product.value.tacked = true
        quantity.value.tacked = true
        if(product.value.valid && quantity.value.valid) {
            await updateGoods({
                id: route.params.id,
                product: product.value.value,
                quantity: quantity.value.value,
                balance: balance.value.value,
                few: few.value.value,
                few_very: few_very.value.value,
                article: article.value.value,
                warehouse: route.params.warehouse
            })
        }
    }

    const submitUpdateBalanceGoods = async () => {
        await updateBalanceGoods({
            id: route.params.id,
            balance: balance.value.value,
            warehouse: route.params.warehouse
        })
    }

    const submitDeleteGoods = async () => {
        await deleteGoods({
            id: route.params.id,
            warehouse: route.params.warehouse
        })
    }

    return {
        route,
        router,
        good,
        getGoods,
        submitCreateGoods,
        submitUpdateGoods,
        submitUpdateBalanceGoods,
        submitDeleteGoods,
    }

}
