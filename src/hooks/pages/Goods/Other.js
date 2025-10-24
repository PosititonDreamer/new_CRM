import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {GoodsOther} from "@/store/Admin/Goods/Other.js";

export const HookGoodsOther = () => {
    const {
        getGoodsOther,
        getGoodsOtherType,
        createGoodsOther,
        updateGoodsOther,
        updateBalanceGoodsOther,
        deleteGoodsOther,
    } = GoodsOther()

    const route = useRoute()
    const router = useRouter()

    const {data: title} = validateInput("String", "", 3)
    const {data: type} = validateInput("String", "", 1)
    const {data: balance} = validateInput("Number", 0, 0)
    const {data: few} = validateInput("Number", 0, 0)
    const {data: few_very} = validateInput("Number", 0, 0)
    const {data: sort} = validateInput("Number", 0, 0)

    const other = {
        title,
        type,
        balance,
        few,
        few_very,
        sort,
    }

    const submitCreateOther = async () => {
        title.value.tacked = true
        type.value.tacked = true

        if(title.value.valid && type.value.valid) {
            await createGoodsOther({
                warehouse: route.params.warehouse,
                type: type.value.value,
                title: title.value.value,
                balance: balance.value.value,
                few: few.value.value,
                few_very: few_very.value.value,
            })
        }
    }

    const submitUpdateOther = async () => {
        title.value.tacked = true
        type.value.tacked = true

        if(title.value.valid && type.value.valid) {
            await updateGoodsOther({
                id: route.params.id,
                warehouse: route.params.warehouse,
                type: type.value.value,
                title: title.value.value,
                balance: balance.value.value,
                few: few.value.value,
                few_very: few_very.value.value,
                sort: sort.value.value,
            })
        }
    }

    const submitUpdateBalanceOther = async () => {
        await updateBalanceGoodsOther({
            id: route.params.id,
            warehouse: route.params.warehouse,
            balance: balance.value.value,
        })
    }

    const submitDeleteOther = async () => {
        await deleteGoodsOther({
            id: route.params.id,
            warehouse: route.params.warehouse,
        })
    }

    return {
        getGoodsOther,
        getGoodsOtherType,
        route,
        router,
        other,
        submitCreateOther,
        submitUpdateOther,
        submitUpdateBalanceOther,
        submitDeleteOther,
    }
}