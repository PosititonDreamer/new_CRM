import {useRoute, useRouter} from "vue-router";
import {Magazines} from "@/store/Admin/Magazines/Magazines.js";
import {Warehouses} from "@/store/Admin/Warehouses/Warehouses.js";
import {validateInput} from "@/hooks/validateInput.js";
import {computed} from "vue";
import {Products} from "@/store/Admin/Products/Products.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";

export const HookMagazines = () => {
    const {
        getMinDate,
        getMagazinesGoods,
        getMagazinesWeight,
        getMagazinesConsumable,
        getMagazinesOther,
        getMagazinesList,
        getMagazinesInfo,
        findMagazines,
    } = Magazines()

    const {getWarehouses} = Warehouses()
    const {getProducts} = Products()
    const {getMeasureUnits} = MeasureUnits()

    const router = useRouter();
    const route = useRoute()

    const {data: date_start} = validateInput("Date", "")
    const {data: date_end} = validateInput("Date", "")
    const {data: warehouse} = validateInput("String", "", 1)

    const magazine = {
        date_start,
        date_end,
        warehouse,
    }

    const submitFindGraphics = async () => {
        date_start.value.tacked = true
        date_end.value.tacked = true
        warehouse.value.tacked = true

        if(date_start.value.valid && date_end.value.valid && warehouse.value.valid ){
            await findMagazines({
                date_start: date_start.value.value,
                date_end: date_end.value.value,
                warehouse: warehouse.value.value,
            })
        }
    }

    const computedSelectWarehouse = computed(() => {
        return getWarehouses.value.map(warehouse => {
            return {
                name: warehouse.title,
                value: warehouse.id
            }
        })
    })

    const computedAllMagazines = computed(() => {
        if(!getProducts.value.length || !getMagazinesList.value.length || !getMeasureUnits.value.length) {
         return null
        }

        const show = {
            goods: new Array(getMagazinesList.value.length).fill(false),
            weight: new Array(getMagazinesList.value.length).fill(false),
            consumable: new Array(getMagazinesList.value.length).fill(false),
            other: new Array(getMagazinesList.value.length).fill(false)
        }

        const goods = getProducts.value.map(product => {
            const findGoods = getMagazinesGoods.value.filter(good => +good.product === +product.id)
            const measure = getMeasureUnits.value.find(unit => +unit.id === +product.measure_unit)
            let prevBalance = 0
            return {
                title: product.show_title ? product.show_title : product.title,
                measure: measure.title,
                goods: findGoods.map(good => {
                    return {
                        ...good,
                        list: getMagazinesList.value.map((item, key) => {
                            const findGood = item.list.good.find(child => +child.good === +good.id)

                            if(findGood) {
                                show.goods[key] = true
                            }

                            if(item.type === 'supply') {
                                return {
                                    balance: findGood?.balance ?? null,
                                    type: item.supply_type === 'income' ? 'green' : 'red'
                                }
                            }

                            if(item.type === 'hand') {
                                return {
                                    balance: findGood?.balance ?? null,
                                    type: findGood?.type_view ?? 'default'
                                }
                            }

                            let type = 'default'
                            if(key === 0) {
                                prevBalance = 0;
                            } else {
                                if(findGood && prevBalance > +findGood.balance) {
                                    type = 'red'
                                } else if(findGood && prevBalance < +findGood.balance) {
                                    type = 'green'
                                } else {
                                    type = 'gray'
                                }
                            }
                            if(findGood?.balance) {
                                prevBalance = +findGood.balance
                            }
                            return {
                                balance: findGood?.balance ?? null,
                                type
                            }
                        })
                    }
                }).sort((a,b) => +a.quantity - +b.quantity)
            }
        }).filter(product => product.goods.length > 0)

        const weight = getProducts.value.map(product => {
            const findGood = getMagazinesWeight.value.find(good => +good.product === +product.id)
            const measure = getMeasureUnits.value.find(unit => +unit.id === +product.measure_unit)

            if(!findGood) {
                return null
            }
            let prevBalance = 0

            return {
                title: product.show_title ? product.show_title : product.title,
                measure: measure.title,
                goods: {
                    ...findGood,
                    list: getMagazinesList.value.map((item, key) => {
                        const findWeight = item.list.weight.find(child => +child.good === +findGood.id)

                        if(findWeight) {
                            show.weight[key] = true
                        }

                        if(item.type === 'supply') {
                            return {
                                balance: findWeight?.balance ?? null,
                                type: item.supply_type === 'income' ? 'green' : 'red'
                            }
                        }

                        if(item.type === 'hand') {
                            return {
                                balance: findWeight?.balance ?? null,
                                type: findWeight?.type_view ?? 'default'
                            }
                        }

                        let type = 'default'
                        if(key === 0) {
                            prevBalance = 0;
                        } else {
                            if(findWeight && prevBalance > +findWeight.balance) {
                                type = 'red'
                            } else if(findWeight && prevBalance < +findWeight.balance) {
                                type = 'green'
                            } else {
                                type = 'gray'
                            }
                        }
                        if(findWeight?.balance) {
                            prevBalance = +findWeight.balance
                        }
                        return {
                            balance: findWeight?.balance ?? null,
                            type
                        }
                    })
                }
            }
        }).filter(product => product)

        const consumable = getMagazinesConsumable.value.map(consumable => {
            let prevBalance = 0
            return {
                title: consumable.title,
                goods: getMagazinesList.value.map((item, key) => {
                    const findConsumable = item.list.consumable.find(child => +child.good === +consumable.id)

                    if(findConsumable) {
                        show.consumable[key] = true
                    }

                    if(item.type === 'supply') {
                        return {
                            balance: findConsumable?.balance ?? null,
                            type: item.supply_type === 'income' ? 'green' : 'red'
                        }
                    }

                    if(item.type === 'hand') {
                        return {
                            balance: findConsumable?.balance ?? null,
                            type: findConsumable?.type_view ?? 'default'
                        }
                    }

                    let type = 'default'
                    if(key === 0) {
                        prevBalance = 0;
                    } else {
                        if(findConsumable && prevBalance > +findConsumable.balance) {
                            type = 'red'
                        } else if(findConsumable && prevBalance < +findConsumable.balance) {
                            type = 'green'
                        } else {
                            type = 'gray'
                        }
                    }
                    if(findConsumable?.balance) {
                        prevBalance = +findConsumable.balance
                    }
                    return {
                        balance: findConsumable?.balance ?? null,
                        type
                    }
                })
            }
        })

        const other = getMagazinesOther.value.map(other => {
            let prevBalance = 0
            return {
                title: other.title,
                goods: getMagazinesList.value.map((item, key) => {
                    const findOther = item.list.other.find(child => +child.good === +other.id)

                    if(findOther) {
                        show.other[key] = true
                    }

                    if(item.type === 'supply') {
                        return {
                            balance: findOther?.balance ?? null,
                            type: item.supply_type === 'income' ? 'green' : 'red'
                        }
                    }

                    if(item.type === 'hand') {
                        return {
                            balance: findOther?.balance ?? null,
                            type: findOther?.type_view ?? 'default'
                        }
                    }

                    let type = 'default'
                    if(key === 0) {
                        prevBalance = 0;
                    } else {
                        if(findOther && prevBalance > +findOther.balance) {
                            type = 'red'
                        } else if(findOther && prevBalance < +findOther.balance) {
                            type = 'green'
                        } else {
                            type = 'gray'
                        }
                    }
                    if(findOther?.balance) {
                        prevBalance = +findOther.balance
                    }
                    return {
                        balance: findOther?.balance ?? null,
                        type
                    }
                })
            }
        })

        console.log({
            goods,
            weight,
            consumable,
            other,
            show
        })

        return {
            goods,
            weight,
            consumable,
            other,
            show
        }
    })

    const computedMagazinesHead = computed(() => {
        return getMagazinesList.value.map(item => {
            let date = item.date.split('-')
            date = [date[1], [date[2]]].join('-')
            return {
                date: date.split('-').reverse().join('.'),
                type: item.type !== 'everyday' ? item.type === 'supply' ? 'П' : 'Р' : null,
                supply_type: item.type === 'supply' || item.type === 'hand' ? item.supply_type ?? 'income' : null,
            }
        })
    })

    return {
        getMinDate,
        route,
        router,
        magazine,
        computedSelectWarehouse,
        computedAllMagazines,
        computedMagazinesHead,
        getMagazinesInfo,
        submitFindGraphics
    }
}