import {SuppliesWarehouse} from "@/store/SuppliesWarehouse/SuppliesWarehouse.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {computed, ref, watch} from "vue";

export const HookSuppliesWarehouse = () => {
    const {
        getSupplies,
        getSuppliesTypes,
        getSuppliesWarehouse,
        getSuppliesDetail,
        createSuppliesWarehouse,
        updateSuppliesWarehouse,
        deleteSuppliesWarehouse,
        sendSuppliesWarehouse,
        acceptSuppliesWarehouse,
        clearDetail
    } = SuppliesWarehouse()

    const route = useRoute()
    const router = useRouter()

    const {data: supply} = validateInput("String", "", 1)
    const suppliesList = ref([])
    const collectedList = ref([])

    const computedList = computed(() => {
        if (!supply.value.value || !getSuppliesWarehouse.value.length) {
            return null
        }

        const data = {
            goods: [],
            weight: [],
            other: [],
            consumable: [],
            goods_weight: []
        }

        const findSupply = getSuppliesWarehouse.value.find(item => +item.id === +supply.value.value)
        data.goods_weight = !findSupply.list.weight_give ? [] : findSupply.list.weight_give.map(item => {
            return {
                product: item.product,
                balance: item.balance,
                title: item.show_title ? item.show_title : item.title,
                measure: item.measure,
                currentBalance: computed(() => {
                    let balance = item.balance
                    const items = suppliesList.value.filter(count => count.product === item.product && count.type === 'good')
                    if (items.length) {
                        items.forEach(count => {
                            balance -= count.quantity * count.value
                        })
                    }
                    const itemsWeight = suppliesList.value.filter(count => count.product === item.product && count.type === 'weight')
                    if (itemsWeight.length) {
                        itemsWeight.forEach(count => {
                            balance -= count.value
                        })
                    }
                    return balance
                })
            }
        })

        findSupply.list.good?.receive.forEach(item => {
            const giveItem = findSupply.list.good.give.find(give => give.id === item.id)

            if (giveItem.weight) {
                data.goods.push({
                    id: item.id,
                    title: item.show_title ? item.show_title : item.title,
                    quantity: item.quantity,
                    balance: item.balance,
                    max: computed(() => {
                        const findItem = data.goods_weight.find(find => find.product === item.product)
                        if(findItem) {
                            let balance = +findItem.currentBalance.value
                            let value = 0

                            const findSupply = suppliesList.value.find(supplyItem => supplyItem.id === item.id)
                            if (findSupply) {
                                value = findSupply.value
                            }

                            return Math.floor(balance / item.quantity) + value
                        } else {
                            return 0
                        }
                    }),
                    measure: item.measure,
                    product: item.product,
                    type: 'good',
                    few: +item.few,
                    few_very: +item.few_very,
                    value: computed(() => suppliesList.value.find(supplyItem => supplyItem.id === item.id))
                })
            } else {
                data.goods.push({
                    id: item.id,
                    title: item.show_title ? item.show_title : item.title,
                    quantity: item.quantity,
                    balance: item.balance,
                    max: +giveItem.balance,
                    measure: item.measure,
                    product: item.product,
                    few: +item.few,
                    few_very: +item.few_very,
                    type: 'good',
                    value: computed(() => suppliesList.value.find(supplyItem => supplyItem.id === item.id))
                })
            }
        })

        findSupply.list.weight?.receive.forEach(item => {
            const giveItem = findSupply.list.weight.give.find(give => give.id === item.id)
            const weightItem = data.goods_weight.find(weightItem => +weightItem.id === item.id)
            if (weightItem) {
                data.weight.push({
                    id: item.id,
                    title: item.show_title ? item.show_title : item.title,
                    quantity: item.quantity,
                    balance: item.balance,
                    max: weightItem.currentBalance,
                    measure: item.measure,
                    product: item.product,
                    type: 'weight',
                    few: +item.few,
                    few_very: +item.few_very,
                    value: computed(() => suppliesList.value.find(supplyItem => supplyItem.id === item.id))
                })
            } else {
                data.weight.push({
                    id: item.id,
                    title: item.show_title ? item.show_title : item.title,
                    quantity: item.quantity,
                    balance: item.balance,
                    max: +giveItem.balance,
                    measure: item.measure,
                    product: item.product,
                    type: 'weight',
                    few: +item.few,
                    few_very: +item.few_very,
                    value: computed(() => suppliesList.value.find(supplyItem => supplyItem.id === item.id))
                })
            }
        })

        findSupply.list.consumable?.receive.forEach(item => {
            const giveItem = findSupply.list.consumable.give.find(give => give.id === item.id)
            data.consumable.push({
                id: item.id,
                title: item.title,
                balance: item.balance,
                max: +giveItem.balance,
                type: 'consumable',
                few: +item.few,
                few_very: +item.few_very,
                value: computed(() => suppliesList.value.find(supplyItem => supplyItem.id === item.id))
            })
        })

        findSupply.list.other?.receive.forEach(item => {
            const giveItem = findSupply.list.other.give.find(give => give.id === item.id)
            data.other.push({
                id: item.id,
                title: item.title,
                balance: item.balance,
                max: +giveItem.balance,
                type: 'other',
                few: +item.few,
                few_very: +item.few_very,
                value: computed(() => suppliesList.value.find(supplyItem => supplyItem.id === item.id))
            })
        })

        if(data.goods.length) {
            data.goods = data.goods.sort((a, b) => {
                if(a.title === b.title) {
                    return +a.quantity - +b.quantity
                }
                return a.title - b.title
            })
        }

        return data
    })

    const changeSupply = () => {
        suppliesList.value = []
        const findSupply = getSuppliesWarehouse.value.find(item => +item.id === +supply.value.value)
        if (findSupply) {
            findSupply.list.good?.receive.forEach(item => {
                suppliesList.value.push({
                    id: item.id,
                    quantity: item.quantity,
                    product: item.product,
                    type: 'good',
                    value: 0
                })
            })
            findSupply.list.weight?.receive.forEach(item => {
                suppliesList.value.push({
                    id: item.id,
                    product: item.product,
                    type: 'weight',
                    value: 0
                })
            })
            findSupply.list.consumable?.receive.forEach(item => {
                suppliesList.value.push({
                    id: item.id,
                    type: 'consumable',
                    value: 0
                })
            })
            findSupply.list.other?.receive.forEach(item => {
                suppliesList.value.push({
                    id: item.id,
                    type: 'other',
                    value: 0
                })
            })
        }
    }

    const submitCreateSuppliesWarehouse = async (afterPage = 'SuppliesWarehouse') => {
        supply.value.tacked = true
        if (supply.value.valid && suppliesList.value.find(item => item.value > 0)) {
            await createSuppliesWarehouse({
                supply: supply.value.value,
                list: suppliesList.value.filter(item => item.value > 0).map(item => {
                    return {
                        warehouse_connection: item.id,
                        quantity: item.value
                    }
                })
            }, afterPage)
        }
    }

    const submitUpdateSuppliesWarehouse = async (afterPage = 'SuppliesWarehouse') => {
        if (suppliesList.value.find(item => item.value > 0)) {
            await updateSuppliesWarehouse({
                id: route.params.id,
                list: suppliesList.value.filter(item => item.value > 0).map(item => {
                    return {
                        warehouse_connection: item.id,
                        quantity: item.value
                    }
                })
            }, afterPage)
        }
    }

    const submitDeleteSuppliesWarehouse = async (afterPage = 'SuppliesWarehouse') => {
        await deleteSuppliesWarehouse(route.params.id, afterPage)
    }

    const submitSendSuppliesWarehouse = async (afterPage = 'SuppliesWarehouse') => {
        if (collectedList.value.length === getSuppliesDetail.value.list?.length) {
            await sendSuppliesWarehouse(route.params.id, afterPage)
        }
    }

    const submitAcceptSuppliesWarehouse = async (afterPage = 'SuppliesWarehouse') => {
        await acceptSuppliesWarehouse(route.params.id, afterPage)
    }

    const clearData = () => {
        supply.value.value = ''
        supply.value.tacked = false

        suppliesList.value = []
        collectedList.value = []
        clearDetail()
    }

    const computedWarehouse = computed(() => {
        return getSuppliesWarehouse.value.filter(warehouse => +warehouse.warehouse_give !== +route.params.warehouse).map(warehouse => {
            return {
                value: warehouse.id,
                name: warehouse.warehouse_give_title
            }
        })
    })

    const computedSupplyList = computed(() => {
        return getSupplies.value.map(item => {
            const warehouse = getSuppliesWarehouse.value.find(supplyWarehouse => +supplyWarehouse.id === +item.supply_warehouse)
            const status = getSuppliesTypes.value.find(supplyType => +supplyType.id === +item.supply_status)
            return {
                ...item,
                warehouse: +route.params.warehouse !== +item.supply_warehouse ? `Поставка в: ${warehouse?.warehouse_receive_title}` : `Поставка из: ${warehouse?.warehouse_give_title}`,
                status: status.title,
                actions: computed(() => {
                    if (+route.params.warehouse !== +item.supply_warehouse) {
                        if (+item.supply_status === 1) {
                            return [
                                {
                                    name: "preview",
                                    text: "Посмотреть"
                                },
                                {
                                    name: "collect",
                                    text: "Собрать"
                                },
                            ]
                        }
                        return [
                            {
                                name: "preview",
                                text: "Посмотреть"
                            },
                        ]
                    } else {
                        if (+item.supply_status === 1) {
                            return [
                                {
                                    name: "preview",
                                    text: "Посмотреть"
                                },
                                {
                                    name: "update",
                                    text: "Изменить"
                                },
                                {
                                    name: "delete",
                                    text: "Удалить"
                                }
                            ]
                        }
                        if (+item.supply_status === 2) {
                            return [
                                {
                                    name: "preview",
                                    text: "Посмотреть"
                                },
                                {
                                    name: "accept",
                                    text: "Принять"
                                },
                            ]
                        }
                        if (+item.supply_status === 3) {
                            return [
                                {
                                    name: "preview",
                                    text: "Посмотреть"
                                },
                            ]
                        }
                    }
                })
            }
        })
    })

    const computedDetailSupply = computed(() => {
        if (getSuppliesDetail.value && getSuppliesWarehouse.value.length && getSuppliesTypes.value.length) {
            const warehouse = getSuppliesWarehouse.value.find(supplyWarehouse => +supplyWarehouse.id === +getSuppliesDetail.value.supply.supply_warehouse)
            const status = getSuppliesTypes.value.find(supplyType => +supplyType.id === +getSuppliesDetail.value.supply.supply_status)
            const newList = {
                goods: [],
                weight: [],
                consumable: [],
                other: []
            }
            const statusList = []
            let allItems = []
            if (+getSuppliesDetail.value.supply.supply_warehouse === +route.params.warehouse) {
                allItems = [
                    ...warehouse.list.good?.give.map(item => {
                        item.type = 'good';
                        return item
                    }) ?? [],
                    ...warehouse.list.weight?.give.map(item => {
                        item.type = 'weight';
                        return item
                    }) ?? [],
                    ...warehouse.list.consumable?.give.map(item => {
                        item.type = 'consumable';
                        return item
                    }) ?? [],
                    ...warehouse.list.other?.give.map(item => {
                        item.type = 'other';
                        return item
                    }) ?? [],
                ]

            } else {
                allItems = [
                    ...warehouse.list.good?.receive.map(item => {
                        item.type = 'good';
                        return item
                    }) ?? [],
                    ...warehouse.list.weight?.receive.map(item => {
                        item.type = 'weight';
                        return item
                    }) ?? [],
                    ...warehouse.list.consumable?.receive.map(item => {
                        item.type = 'consumable';
                        return item
                    }) ?? [],
                    ...warehouse.list.other?.receive.map(item => {
                        item.type = 'other';
                        return item
                    }) ?? [],
                ]
            }

            getSuppliesDetail.value.list.forEach(item => {
                const findItem = allItems.find(good => +good.id === +item.supply_warehouse_connection)
                if (findItem.type === 'good') {
                    newList.goods.push({
                        id: findItem.id,
                        title: `${findItem.show_title ? findItem.show_title : findItem.title}, ${findItem.quantity} ${findItem.measure}`,
                        quantity: +item.quantity,
                        measure: 'шт.'
                    })
                }
                if (findItem.type === 'weight') {
                    newList.weight.push({
                        id: findItem.id,
                        title: `${findItem.show_title ? findItem.show_title : findItem.title}`,
                        quantity: +item.quantity,
                        measure: findItem.measure,
                    })
                }
                if (findItem.type === 'consumable') {
                    newList.consumable.push({
                        id: findItem.id,
                        title: findItem.title,
                        quantity: +item.quantity,
                        measure: 'шт.'
                    })
                }
                if (findItem.type === 'other') {
                    newList.other.push({
                        id: findItem.id,
                        title: findItem.title,
                        quantity: +item.quantity,
                        measure: 'шт.'
                    })
                }
            })

            getSuppliesDetail.value.status_list.forEach(item => {
                const findStatus = getSuppliesTypes.value.find(status => +status.id === +item.supply_process_status)
                statusList.push({
                    title: findStatus.title,
                    date: item.date,
                })
            })

            return {
                title: +route.params.warehouse === +getSuppliesDetail.value.supply.supply_warehouse ? `Поставка в: ${warehouse.warehouse_receive_title}` : `Поставка из: ${warehouse.warehouse_give_title}`,
                statusId: +getSuppliesDetail.value.supply.supply_status,
                status: status.title,
                list: [...newList.goods, ...newList.weight, ...newList.consumable, ...newList.other],
                statusList,
                date: getSuppliesDetail.value.supply.date,
                warehouse: +getSuppliesDetail.value.supply.supply_warehouse

            }
        } else {
            return null
        }
    })

    return {
        route,
        router,
        getSupplies,
        getSuppliesTypes,
        getSuppliesWarehouse,
        getSuppliesDetail,
        createSuppliesWarehouse,
        updateSuppliesWarehouse,
        deleteSuppliesWarehouse,
        sendSuppliesWarehouse,
        acceptSuppliesWarehouse,
        supply,
        computedList,
        suppliesList,
        collectedList,
        submitCreateSuppliesWarehouse,
        submitUpdateSuppliesWarehouse,
        submitDeleteSuppliesWarehouse,
        submitSendSuppliesWarehouse,
        submitAcceptSuppliesWarehouse,
        clearData,
        computedWarehouse,
        changeSupply,
        computedSupplyList,
        computedDetailSupply
    }
}