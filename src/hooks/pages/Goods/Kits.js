import {GoodsKit} from "@/store/Admin/Goods/Kits.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {ref} from "vue";

export const HookGoodsKit = () => {
    const {
        getGoodsKit,
        createGoodsKit,
        updateGoodsKit,
        deleteGoodsKit,
    } = GoodsKit()

    const route = useRoute()
    const router = useRouter()

    const {data: title} = validateInput("String", "", 3)
    const {data: number} = validateInput("Number", 0, 0)
    const {data: comment} = validateInput("String", "", 3)
    const list = ref([])
    const viewComment = ref(false)

    const kit = {
        title,
        number,
        list,
        viewComment,
        comment,
    }

    const addItem = (item = {quantity: 0, product: "", good: ""}, id = Date.now()) => {
        const {data: quantity} = validateInput("Number", item.quantity, 0)
        const {data: product} = validateInput("String", item.product, 1)
        const {data: good} = validateInput("String", item.good, 1)
        list.value.push({
            id,
            quantity,
            product,
            good
        })

    }

    const removeItem = (id) => {
        list.value = list.value.filter(item => item.id !== id)
    }

    const submitCreateGoodsKit = async () => {
        title.value.tacked = true
        number.value.tacked = true
        comment.value.tacked = true

        list.value.forEach(item => {
            item.quantity.tacked = true
            item.product.tacked = true
            item.good.tacked = true
        })

        const checkComment = viewComment.value ? comment.value.valid : true

        if(title.value.valid && number.value.valid && !list.value.find(item => !item.product.valid || !item.quantity.valid || !item.good.valid) && checkComment) {
            await createGoodsKit({
                warehouse: route.params.warehouse,
                title: title.value.value,
                number: number.value.value,
                comment: comment.value.value,
                view_comment: viewComment.value,
                list: list.value.map(item => {
                    return {
                        quantity: item.quantity.value,
                        good: item.good.value,
                    }
                })
            })
        }
    }

    const submitUpdateGoodsKit = async () => {
        title.value.tacked = true
        number.value.tacked = true
        comment.value.tacked = true

        list.value.forEach(item => {
            item.quantity.tacked = true
            item.product.tacked = true
            item.good.tacked = true
        })

        const checkComment = viewComment.value ? comment.value.valid : true

        if(title.value.valid && number.value.valid && !list.value.find(item => !item.product.valid || !item.quantity.valid || !item.good.valid) && checkComment) {
            await updateGoodsKit({
                id: route.params.id,
                warehouse: route.params.warehouse,
                title: title.value.value,
                number: number.value.value,
                comment: comment.value.value,
                view_comment: viewComment.value,
                list: list.value.map(item => {
                    return {
                        quantity: item.quantity.value,
                        good: item.good.value,
                    }
                })
            })
        }
    }

    const submitDeleteGoodsKit = async () => {
        await deleteGoodsKit({
            id: route.params.id,
            warehouse: route.params.warehouse,
        })
    }

    return {
        route,
        router,
        kit,
        addItem,
        removeItem,
        getGoodsKit,
        submitCreateGoodsKit,
        submitUpdateGoodsKit,
        submitDeleteGoodsKit,
    }
}