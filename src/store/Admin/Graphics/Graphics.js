import {Graphics} from "@/hooks/pages/Graphics/index.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {computed, ref} from "vue";

export const HookGraphics = () => {
    const {
        getGraphics,
        getMinDate,
        findGraphics,
    } = Graphics();

    const router = useRouter();
    const route = useRoute()

    const {data: date_start} = validateInput("Date", "")
    const {data: date_end} = validateInput("Date", "")

    const submitFindGraphics = async () => {
        date_start.value.tacked = true

        if (date_start.value.valid) {
            if (date_end.value.value) {
                await findGraphics({
                    date_start: date_start.value.value,
                    date_end: date_end.value.value,
                })
            } else {
                await findGraphics({
                    date_start: date_start.value.value,
                    date_end: date_start.value.value,
                })
            }
        }
    }

    const direction = ref('horizontal')
    const margin = ref({
        left: 0,
        top: 20,
        right: 20,
        bottom: 0
    })

    const config = {
        "Заказы": {
            color: 'var(--primary)'
        },
        "Расходы": {
            color: 'var(--yellow)'
        },
        "Ср. Расходы": {
            color: 'var(--yellow-50)'
        },
        "Ср. Заказы": {
            color: 'var(--primary-50)'
        },
    }

    const configOrders = {
        "Заказы": {
            color: 'var(--primary)'
        },
        "Ср. Заказы": {
            color: 'var(--primary-50)'
        }
    }

    const computedGraphicsOrdersLines = computed(() => {
        return [
            {
                name: "Заказы",
                color: "var(--primary)"
            },
            {
                name: "Ср. Заказы",
                color: "var(--primary-50)"
            }
        ]
    })

    const computedGraphicsLines = computed(() => {
        return [
            {
                name: "Заказы",
                color: "var(--primary)"
            },
            {
                name: "Расходы",
                color: "var(--yellow)"
            },
            {
                name: "Ср. Расходы",
                color: "var(--yellow-50)"
            },
            {
                name: "Ср. Заказы",
                color: "var(--primary-50)"
            }
        ]
    })

    const computedGraphicsOrdersDay = computed(() => {
        if (!getGraphics.value) {
            return []
        }
        return getGraphics.value.orders.dates.map(date => {
            return {
                name: new Date(date.date).toLocaleDateString('ru-RU', {month: "numeric", day: 'numeric'}),
                'Заказы': date.count,
                "Ср. Заказы": (getGraphics.value.orders.count / getGraphics.value.orders.dates.length).toFixed(2).toString()
            }
        })
    })

    const computedGraphicsOrdersWeek = computed(() => {
        if (!getGraphics.value) {
            return []
        }
        return getGraphics.value.orders.weeks.map(date => {
            return {
                name: `${new Date(date.date_start).toLocaleDateString('ru-RU', {
                    month: "numeric",
                    day: 'numeric'
                })}-${new Date(date.date_end).toLocaleDateString('ru-RU', {month: "numeric", day: 'numeric'})}`,
                'Заказы': date.count,
                "Ср. Заказы": (getGraphics.value.orders.count / getGraphics.value.orders.weeks.length).toFixed(2).toString()
            }
        })
    })

    const computedGraphicsOrdersMonth = computed(() => {
        if (!getGraphics.value) {
            return []
        }
        return Object.values(getGraphics.value.orders.months).map(date => {
            return {
                name: date.month.split('-').reverse().join('.'),
                'Заказы': date.count,
                "Ср. Заказы": (getGraphics.value.orders.count / Object.values(getGraphics.value.orders.months).length).toFixed(2).toString()
            }
        })
    })

    const computedGraphicsOrdersYear = computed(() => {
        if (!getGraphics.value) {
            return []
        }
        return Object.values(getGraphics.value.orders.years).map(date => {
            return {
                name: date.year,
                'Заказы': date.count,
                "Ср. Заказы": (getGraphics.value.orders.count / Object.values(getGraphics.value.orders.years).length).toFixed(2).toString()
            }
        })
    })

    const computedGraphicDay = (item, type) => {
        return item.dates.map(date => {
            const findType = date.types.find(dateItem => +dateItem.count === +type.count)
            return {
                name: new Date(date.date).toLocaleDateString('ru-RU', {month: "numeric", day: 'numeric'}),
                'Заказы': findType ? findType.orders : 0,
                'Расходы': findType ? findType.quantity : 0,
                "Ср. Расходы": (type.quantity / item.dates.length).toFixed(2).toString(),
                "Ср. Заказы": (type.orders / item.dates.length).toFixed(2).toString(),
            }
        })
    }

    const computedGraphicWeek = (item, type) => {
        return item.weeks.map(date => {
            const findType = date.types.find(dateItem => +dateItem.count === +type.count)
            return {
                name: `${new Date(date.date_start).toLocaleDateString('ru-RU', {
                    month: "numeric",
                    day: 'numeric'
                })}-${new Date(date.date_end).toLocaleDateString('ru-RU', {month: "numeric", day: 'numeric'})}`,
                'Заказы': findType ? findType.orders : 0,
                'Расходы': findType ? findType.quantity : 0,
                "Ср. Расходы": (type.quantity / item.weeks.length).toFixed(2).toString(),
                "Ср. Заказы": (type.orders / item.weeks.length).toFixed(2).toString(),
            }
        })
    }

    const computedGraphicMonth = (item, type) => {
        return Object.values(item.months).map(date => {
            const findType = Object.values(date.types).find(dateItem => +dateItem.count === +type.count)
            return {
                name: date.month.split('-').reverse().join('.'),
                'Заказы': findType ? findType.orders : 0,
                'Расходы': findType ? findType.quantity : 0,
                "Ср. Расходы": (type.quantity / Object.values(item.months).length).toFixed(2).toString(),
                "Ср. Заказы": (type.orders / Object.values(item.months).length).toFixed(2).toString(),
            }
        })
    }

    const computedGraphicYear = (item, type) => {
        return Object.values(item.years).map(date => {
            const findType = Object.values(date.types).find(dateItem => +dateItem.count === +type.count)
            return {
                name: date.year,
                'Заказы': findType ? findType.orders : 0,
                'Расходы': findType ? findType.quantity : 0,
                "Ср. Расходы": (type.quantity / Object.values(item.years).length).toFixed(2).toString(),
                "Ср. Заказы": (type.orders / Object.values(item.years).length).toFixed(2).toString(),
            }
        })
    }

    return {
        getGraphics,
        getMinDate,
        submitFindGraphics,
        router,
        route,
        date_start,
        date_end,
        direction,
        margin,
        config,
        configOrders,
        computedGraphicsOrdersLines,
        computedGraphicsLines,
        computedGraphicsOrdersDay,
        computedGraphicsOrdersWeek,
        computedGraphicsOrdersMonth,
        computedGraphicsOrdersYear,
        computedGraphicDay,
        computedGraphicWeek,
        computedGraphicMonth,
        computedGraphicYear,
    }
}