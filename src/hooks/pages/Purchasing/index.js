import {Purchasing} from "@/store/Admin/Purchasing/Purchasing.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {ProductsConnection} from "@/store/Admin/Products/Connection.js";
import {computed, ref, watch} from "vue";
export const HookPurchasing = () => {
    const {
        getPurchasing,
        getMinDate,
        findPurchasing,
    } = Purchasing();

    const {
        getProductsConnections,
    } = ProductsConnection()

    const computedPurchasing = ref({})

    const router = useRouter();
    const route = useRoute()

    const {data: date_start} = validateInput("Date", "")
    const {data: date_end} = validateInput("Date", "")
    const {data: period} = validateInput("Number", 0, 1)

    const submitFindPurchasing = async () => {
        date_start.value.tacked = true
        date_end.value.tacked = true
        period.value.tacked = true

        if (date_start.value.valid && date_end.value.valid && period.value.valid) {
            await findPurchasing({
                date_start: date_start.value.value,
                date_end: date_end.value.value,
                period: period.value.value,
            })
        }
    }

    watch(() => getPurchasing.value, () => {
        const purchasing = {
            connection: [],
            products: [],
            consumable: [],
            other: []
        }
        if(getPurchasing.value) {
            const productsConnectionsList = []
            getProductsConnections.value.forEach((connection) => {
                const connectionItem = {
                    title: connection.title,
                    sum_actual: computed(() => {
                        let sum = 0
                        connectionItem.list.forEach((item) => {
                            sum += item.actual
                        })
                        return sum
                    }),
                    update_sum_expense: () => {
                        let sum = 0
                        connectionItem.list.forEach((item) => {
                            if(item.active) {
                                sum += item.expense
                            }
                        })
                        connectionItem.sum_expense.value = sum
                    },
                    sum_expense: ref(0),
                    sum_all_expense: computed(() => {
                        let sum = 0
                        connectionItem.list.forEach((item) => {
                            sum += item.expense
                        })
                        return sum
                    }),
                    list: [],
                    sum_day: computed(() => {
                        return (connectionItem.sum_expense.value / +getPurchasing.value.days).toFixed(5)
                    }),
                }
                connection.list.forEach((item) => {
                    const findProduct = Object.values(getPurchasing.value.products).find(product => +product.id === +item.product)
                    if (findProduct) {
                        if(findProduct.expense_composite) {
                            connectionItem.list.push({
                                id: findProduct.id,
                                expense: findProduct.expense,
                                actual: findProduct.actual,
                                title: `${findProduct.title}(О)` ,
                                active: true,
                                percent: computed(() => {
                                    return (100 / connectionItem.sum_all_expense.value * +findProduct.expense).toFixed()
                                }),
                                sum_day: computed(() => {
                                    return (+findProduct.expense / +getPurchasing.value.days).toFixed(5)
                                })
                            })
                            connectionItem.list.push({
                                id: findProduct.id,
                                expense: findProduct.expense_composite,
                                actual: 0,
                                title: `${findProduct.title}(С)` ,
                                active: true,
                                percent: computed(() => {
                                    return (100 / connectionItem.sum_all_expense.value * +findProduct.expense_composite).toFixed()
                                }),
                                sum_day: computed(() => {
                                    return (+findProduct.expense_composite / +getPurchasing.value.days).toFixed(5)
                                })
                            })
                        } else {
                            connectionItem.list.push({
                                ...findProduct,
                                active: true,
                                percent: computed(() => {
                                    return (100 / connectionItem.sum_all_expense.value * +findProduct.expense).toFixed(5)
                                }),
                                sum_day: computed(() => {
                                    return (+findProduct.expense / +getPurchasing.value.days).toFixed(5)
                                })
                            })
                        }
                        productsConnectionsList.push(item.product)
                    }
                    connectionItem.update_sum_expense()
                })
                purchasing.connection.push(connectionItem)
            })

            Object.values(getPurchasing.value.products).filter(item => !productsConnectionsList.includes(item.id)).forEach(product => {
                if(product.expense_composite) {
                    const connectionItem = {
                        title: product.title,
                        sum_actual: computed(() => {
                            let sum = 0
                            connectionItem.list.forEach((item) => {
                                sum += item.actual
                            })
                            return sum
                        }),
                        update_sum_expense: () => {
                            let sum = 0
                            connectionItem.list.forEach((item) => {
                                if(item.active) {
                                    sum += item.expense
                                }
                            })
                            connectionItem.sum_expense.value = sum
                        },
                        sum_expense: ref(0),
                        sum_all_expense: computed(() => {
                            let sum = 0
                            connectionItem.list.forEach((item) => {
                                sum += item.expense
                            })
                            return sum
                        }),
                        list: [],
                        sum_day: computed(() => {
                            return (connectionItem.sum_expense.value / +getPurchasing.value.days).toFixed(5)
                        })
                    }
                    connectionItem.list.push({
                        expense: product.expense,
                        actual: product.actual,
                        title: `${product.title}(О)` ,
                        active: true,
                        percent: computed(() => {
                            return (100 / connectionItem.sum_all_expense.value * +product.expense).toFixed()
                        }),
                        sum_day: computed(() => {
                            return (+product.expense / +getPurchasing.value.days).toFixed(5)
                        })
                    })
                    connectionItem.list.push({
                        expense: product.expense_composite,
                        actual: 0,
                        title: `${product.title}(С)` ,
                        active: true,
                        percent: computed(() => {
                            return (100 / connectionItem.sum_all_expense.value * +product.expense_composite).toFixed()
                        }),
                        sum_day: computed(() => {
                            return (+product.expense_composite / +getPurchasing.value.days).toFixed(5)
                        })
                    })
                    purchasing.connection.push(connectionItem)
                    connectionItem.update_sum_expense()
                } else {
                    purchasing.products.push({...product, sum_day: (+product.expense / +getPurchasing.value.days).toFixed(5)})
                }
            })

            purchasing.consumable = Object.values(getPurchasing.value.consumable).map(item => {
                return {...item, sum_day: (+item.expense / +getPurchasing.value.days).toFixed(5)}
            }).sort((a, b) => b.title.localeCompare(a.title, "ru"))
            purchasing.other = Object.values(getPurchasing.value.other).map(item => {
                return {...item, sum_day: (+item.expense / +getPurchasing.value.days).toFixed(5)}
            }).sort((a, b) => a.title.localeCompare(b.title, "ru"))
        }

        computedPurchasing.value = purchasing
    })

    const columnsDays = computed(() => {
        return [30, 60, 90, 120, 150, 180, +getPurchasing.value.period].sort((a, b) => a - b)
    })

    return {
        getPurchasing,
        getMinDate,
        router,
        route,
        date_start,
        date_end,
        period,
        submitFindPurchasing,
        computedPurchasing,
        columnsDays
    }
}