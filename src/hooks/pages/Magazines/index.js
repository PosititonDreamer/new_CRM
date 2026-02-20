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

        const goods = getProducts.value.map(product => {
            const findGoods = getMagazinesGoods.value.filter(good => +good.product === +product.id)
            const measure = getMeasureUnits.value.find(unit => +unit.id === +product.measure_unit)

            return {
                title: product.show_title ? product.show_title : product.title,
                measure: measure.title,
                goods: findGoods.map(good => {
                    return {
                        ...good,
                        list: getMagazinesList.value.map(item => {
                            const findGood = item.list.good.find(child => +child.good === +good.id)

                            return findGood?.balance ?? null
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

            return {
                title: product.show_title ? product.show_title : product.title,
                measure: measure.title,
                goods: {
                    ...findGood,
                    list: getMagazinesList.value.map(item => {
                        const findWeight = item.list.weight.find(child => +child.good === +findGood.id)

                        return findWeight?.balance ?? null
                    })
                }
            }
        }).filter(product => product)

        const consumable = getMagazinesConsumable.value.map(consumable => {
            return {
                title: consumable.title,
                goods: getMagazinesList.value.map(item => {
                    const findConsumable = item.list.consumable.find(child => +child.good === +consumable.id)

                    return findConsumable?.balance ?? null
                })
            }
        })

        const other = getMagazinesOther.value.map(other => {
            return {
                title: other.title,
                goods: getMagazinesList.value.map(item => {
                    const findOther = item.list.other.find(child => +child.good === +other.id)

                    return findOther?.balance ?? null
                })
            }
        })

        return {
            goods,
            weight,
            consumable,
            other
        }
    })

    const computedMagazinesHead = computed(() => {
        return getMagazinesList.value.map(item => {
            let date = item.date.split('-')
            date = [date[1], [date[2]]].join('-')
            return {
                date: date.split('-').reverse().join('.'),
                type: item.type !== 'everyday' ? 'Поставка' : null
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
        submitFindGraphics
    }
}