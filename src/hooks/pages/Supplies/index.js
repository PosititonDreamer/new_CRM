import {Supplies} from "@/store/Admin/Supplies/Supplies.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {computed, ref} from "vue";
import {Products} from "@/store/Admin/Products/Products.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import supplies from "@/pages/Admin/Supplies/Supplies.vue";

export const HookSupplies = () => {
    const {
        getSupplies,
        getGoods,
        createSupplies,
        updateSupplies,
        deleteSupplies,
    } = Supplies()

    const {getProducts} = Products()
    const {getMeasureUnits} = MeasureUnits()

    const router = useRouter()
    const route = useRoute()

    const {data: warehouseReceive} = validateInput("String", "", 1)
    const {data: warehouseGive} = validateInput("String", "", 1)
    const suppliesList = ref([])

    const addSuppliesItem = ({good_receive, good_give, good_type}, id = Date.now()) => {
        suppliesList.value.push({
            good_receive,
            good_give,
            good_type,
            id
        })
    }

    const deleteSuppliesItem = (id) => {
        suppliesList.value = suppliesList.value.filter(supply => +supply.id !== +id)
    }

    const submitCreateSupplies = async () => {
        warehouseReceive.value.tacked = true
        warehouseGive.value.tacked = true

        if (warehouseReceive.value.valid && warehouseGive.value.valid && suppliesList.value.length) {
            await createSupplies({
                warehouse_receive: warehouseReceive.value.value,
                warehouse_give: warehouseGive.value.value,
                list: suppliesList.value.map(supply => {
                    return {
                        good_receive: supply.good_receive,
                        good_give: supply.good_give,
                        good_type: supply.good_type,
                    }
                })
            })
        }
    }

    const submitUpdateSupplies = async () => {
        if (suppliesList.value.length) {
            await updateSupplies({
                id: route.params.id,
                list: suppliesList.value.map(supply => {
                    return {
                        good_receive: supply.good_receive,
                        good_give: supply.good_give,
                        good_type: supply.good_type,
                    }
                })
            })
        }
    }

    const submitDeleteSupplies = async () => {
        await deleteSupplies(route.params.id)
    }

    const clearData = () => {
        warehouseReceive.value.tacked = false
        warehouseGive.value.tacked = false

        suppliesList.value = []
        warehouseReceive.value.value = ''
        warehouseGive.value.value = ''
    }

    const suppliesActions = [
        {
            name: "update",
            text: "Изменить"
        },
        {
            name: "delete",
            text: "Удалить"
        },
    ]

    const suppliesReceive = computed(() => {
        const goods = []
        const weight = []
        const consumable = []
        const other = []

        if (warehouseReceive.value.value) {
            getProducts.value.forEach(product => {
                getGoods.value.filter(good => good.type === 'good' && +good.warehouse === +warehouseReceive.value.value && +good.product === +product.id).forEach(good => {
                    if (!good.weight && !suppliesList.value.find(item => +item.good_receive === +good.id && item.good_type === 'good')) {
                        const measure = getMeasureUnits.value.find(unit => +unit.id === +product.measure_unit)
                        goods.push({
                            id: good.id,
                            title: `${product.show_title ? product.show_title : product.title}, ${good.quantity} ${measure.title}`
                        })
                    }
                })
                getGoods.value.filter(good => good.type === 'weight' && +good.warehouse === +warehouseReceive.value.value && +good.product === +product.id).forEach(good => {
                    if (!suppliesList.value.find(item => +item.good_receive === +good.id && item.good_type === 'weight')) {
                        weight.push({
                            id: good.id,
                            title: `${product.show_title ? product.show_title : product.title}`
                        })
                    }
                })
            })

            getGoods.value.filter(good => good.type === 'consumable' && +good.warehouse === +warehouseReceive.value.value).forEach(good => {
                if (!suppliesList.value.find(item => +item.good_receive === +good.id && item.good_type === 'consumable')) {
                    consumable.push({
                        id: good.id,
                        title: `${good.title}`
                    })
                }
            })

            getGoods.value.filter(good => good.type === 'other' && +good.warehouse === +warehouseReceive.value.value).forEach(good => {
                if (!suppliesList.value.find(item => +item.good_receive === +good.id && item.good_type === 'other')) {
                    other.push({
                        id: good.id,
                        title: `${good.title}`
                    })
                }
            })
        }

        return {
            goods,
            weight,
            consumable,
            other,
        }
    })

    const suppliesGive = computed(() => {
        const goods = []
        const weight = []
        const consumable = []
        const other = []

        if (warehouseGive.value.value) {
            getProducts.value.forEach(product => {
                getGoods.value.filter(good => good.type === 'good' && +good.warehouse === +warehouseGive.value.value && +good.product === +product.id).forEach(good => {
                    if (!suppliesList.value.find(item => +item.good_give === +good.id && item.good_type === 'good')) {
                        const measure = getMeasureUnits.value.find(unit => +unit.id === +product.measure_unit)
                        goods.push({
                            id: good.id,
                            title: `${product.show_title ? product.show_title : product.title}, ${good.quantity} ${measure.title}`
                        })
                    }
                })
                getGoods.value.filter(good => good.type === 'weight' && +good.warehouse === +warehouseGive.value.value && +good.product === +product.id).forEach(good => {
                    if (!suppliesList.value.find(item => +item.good_give === +good.id && item.good_type === 'weight')) {
                        weight.push({
                            id: good.id,
                            title: `${product.show_title ? product.show_title : product.title}`
                        })
                    }
                })
            })

            getGoods.value.filter(good => good.type === 'consumable' && +good.warehouse === +warehouseGive.value.value).forEach(good => {
                if (!suppliesList.value.find(item => +item.good_give === +good.id && item.good_type === 'consumable')) {
                    consumable.push({
                        id: good.id,
                        title: `${good.title}`
                    })
                }
            })

            getGoods.value.filter(good => good.type === 'other' && +good.warehouse === +warehouseGive.value.value).forEach(good => {
                if (!suppliesList.value.find(item => +item.good_give === +good.id && item.good_type === 'other')) {
                    other.push({
                        id: good.id,
                        title: `${good.title}`
                    })
                }
            })
        }

        return {
            goods,
            weight,
            consumable,
            other,
        }
    })

    const computedSuppliesList = computed(() => {
        const goods = []
        const weight = []
        const consumable = []
        const other = []

        if (suppliesList.value.length) {
            suppliesList.value.forEach(good => {
                if (good.good_type === 'good') {
                    const findGoodReceive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findProductReceive = getProducts.value.find(item => +item.id === +findGoodReceive.product)
                    const measureReceive = getMeasureUnits.value.find(item => +item.id === +findProductReceive.measure_unit)

                    const findGoodGive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findProductGive = getProducts.value.find(item => +item.id === +findGoodGive.product)
                    const measureGive = getMeasureUnits.value.find(item => +item.id === +findProductGive.measure_unit)

                    goods.push({
                        id: good.id,
                        receive: `${findProductReceive.show_title ? findProductReceive.show_title : findProductReceive.title}, ${findGoodReceive.quantity} ${measureReceive.title}`,
                        give: `${findProductGive.show_title ? findProductGive.show_title : findProductGive.title}, ${findGoodGive.quantity} ${measureGive.title}`,
                    })

                }
                if (good.good_type === 'weight') {
                    const findGoodReceive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findProductReceive = getProducts.value.find(item => +item.id === +findGoodReceive.product)

                    const findGoodGive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findProductGive = getProducts.value.find(item => +item.id === +findGoodGive.product)

                    weight.push({
                        id: good.id,
                        receive: `${findProductReceive.show_title ? findProductReceive.show_title : findProductReceive.title}`,
                        give: `${findProductGive.show_title ? findProductGive.show_title : findProductGive.title}`,
                    })
                }
                if (good.good_type === 'consumable') {
                    const findGoodReceive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findGoodGive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)

                    consumable.push({
                        id: good.id,
                        receive: `${findGoodReceive.title}`,
                        give: `${findGoodGive.title}`,
                    })
                }
                if (good.good_type === 'other') {
                    const findGoodReceive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findGoodGive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)

                    other.push({
                        id: good.id,
                        receive: `${findGoodReceive.title}`,
                        give: `${findGoodGive.title}`,
                    })
                }
            })
        }

        return {
            goods,
            weight,
            consumable,
            other,
        }
    })

    const findSuppliesList = (list) => {
        const goods = []
        const weight = []
        const consumable = []
        const other = []


        if (list.length && getProducts.value.length && getGoods.value.length && getMeasureUnits.value.length) {
            list.forEach(good => {
                if (good.good_type === 'good') {
                    const findGoodReceive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findProductReceive = getProducts.value.find(item => +item.id === +findGoodReceive.product)
                    const measureReceive = getMeasureUnits.value.find(item => +item.id === +findProductReceive.measure_unit)

                    const findGoodGive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findProductGive = getProducts.value.find(item => +item.id === +findGoodGive.product)
                    const measureGive = getMeasureUnits.value.find(item => +item.id === +findProductGive.measure_unit)

                    goods.push({
                        id: good.id,
                        receive: `${findProductReceive.show_title ? findProductReceive.show_title : findProductReceive.title}, ${findGoodReceive.quantity} ${measureReceive.title}`,
                        give: `${findProductGive.show_title ? findProductGive.show_title : findProductGive.title}, ${findGoodGive.quantity} ${measureGive.title}`,
                    })

                }
                if (good.good_type === 'weight') {
                    const findGoodReceive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findProductReceive = getProducts.value.find(item => +item.id === +findGoodReceive.product)

                    const findGoodGive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findProductGive = getProducts.value.find(item => +item.id === +findGoodGive.product)

                    weight.push({
                        id: good.id,
                        receive: `${findProductReceive.show_title ? findProductReceive.show_title : findProductReceive.title}`,
                        give: `${findProductGive.show_title ? findProductGive.show_title : findProductGive.title}`,
                    })
                }
                if (good.good_type === 'consumable') {
                    const findGoodReceive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findGoodGive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)

                    consumable.push({
                        id: good.id,
                        receive: `${findGoodReceive.title}`,
                        give: `${findGoodGive.title}`,
                    })
                }
                if (good.good_type === 'other') {
                    const findGoodReceive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)
                    const findGoodGive = getGoods.value.find(item => +item.id === +good.good_receive && item.type === good.good_type)

                    other.push({
                        id: good.id,
                        receive: `${findGoodReceive.title}`,
                        give: `${findGoodGive.title}`,
                    })
                }
            })
        }

        return {
            goods,
            weight,
            consumable,
            other,
        }
    }


    return {
        router,
        route,
        getSupplies,
        getGoods,
        addSuppliesItem,
        deleteSuppliesItem,
        submitCreateSupplies,
        submitUpdateSupplies,
        submitDeleteSupplies,
        clearData,
        suppliesActions,
        warehouseReceive,
        warehouseGive,
        suppliesList,
        suppliesReceive,
        suppliesGive,
        computedSuppliesList,
        findSuppliesList
    }
}