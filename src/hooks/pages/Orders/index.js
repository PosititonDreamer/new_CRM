import {Orders} from "@/store/Orders/Orders.js";
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {Auth} from "@/store/Workers/Auth.js";
import {Messages} from "@/store/Messages.js";

export const HookOrders = () => {
    const {getWorker} = Auth()

    const filter = ref(
        {
            date_start: null,
            date_end: null,
            delivery: null,
            sort: 'old',
        }
    )

    const router = useRouter();
    const route = useRoute();
    const {addMessages} = Messages()

    const {
        getOrders,
        getNextPage,
        getOrderDetail,
        getGoodsList,
        getProductsList,
        getKitsList,
        getPresentsList,
        getBoxesList,
        createOrders,
        updateOrders,
        deleteOrders,
        returnOrders,
        collectOrders,
        sendOrders,
        addTrack,
        addBlank,
        sendTelegramMessage,
        findOrders
    } = Orders()

    const {data: client} = validateInput("String", "", 1)
    const {data: address} = validateInput("String", "", 1)
    const {data: track} = validateInput("String", "", 1)
    const {data: comment} = validateInput("String", "", 0)
    const {data: phone} = validateInput("String", "", 0)
    const {data: email} = validateInput("String", "", 0)
    const {data: delivery} = validateInput("String", "", 1)
    const composition = ref([])
    const boxes = ref([])
    const tackedOrders = ref([])
    const {data: file} = validateInput("File", null)
    const payed = ref(false)
    const collectGoods = ref([])

    const addComposition = (item = {good: '0', quantity: 0, type: '', product: ''}, id = Date.now()) => {
        const {data: product} = validateInput("String", item.product, 1)
        const {data: good} = validateInput("String", item.good, 1)
        const {data: quantity} = validateInput("Number", item.quantity, 0)
        const {data: type} = validateInput("String", item.type, 1)

        composition.value.push({
            product,
            good,
            quantity,
            type,
            id
        })
    }

    const removeComposition = (id) => {
        composition.value = composition.value.filter((item) => +item.id !== +id)
    }

    const addBox = (value = "", id = Date.now()) => {
        const {data: box} = validateInput("String", value, 1)
        boxes.value.push({
            box,
            id
        })
    }

    const removeBox = (id) => {
        boxes.value = boxes.value.filter((item) => +item.id !== +id)
    }

    const order = {
        client,
        address,
        track,
        comment,
        phone,
        email,
        delivery,
        composition,
        file,
        boxes,
        payed
    }

    const submitCreateOrders = async (afterPage = 'Orders') => {
        client.value.tacked = true
        phone.value.tacked = true
        address.value.tacked = true
        delivery.value.tacked = true
        track.value.tacked = true
        composition.value.forEach(item => {
            item.good.tacked = true
            item.quantity.tacked = true
            item.type.tacked = true
            item.product.tacked = true
        })
        const check = client.value.valid && phone.value.valid && address.value.valid && delivery.value.valid && track.value.valid
        const checkComposition = !composition.value.find(item => !item.good.valid || !item.type.valid || !item.quantity.valid)

        if (check && checkComposition) {
            await createOrders({
                client: client.value.value,
                phone: phone.value.value,
                address: address.value.value,
                delivery: delivery.value.value,
                track: track.value.value,
                comment: comment.value.value,
                email: email.value.value,
                payed: payed.value,
                blank: file.value.value,
                worker: getWorker.value.id,
                composition: composition.value.map(item => {
                    if (item.type.value === 'present') {
                        const findPresent = getPresentsList.value.find(present => present.id.toString() === item.good.value)
                        return {
                            good: findPresent.id,
                            type: findPresent.type,
                            quantity: 1,
                            present: 1
                        }
                    }

                    return {
                        good: item.good.value,
                        quantity: item.quantity.value,
                        present: 0,
                        type: item.type.value,
                    }
                })
            }, afterPage)
        }
    }

    const submitUpdateOrders = async (afterPage = 'Orders') => {
        client.value.tacked = true
        phone.value.tacked = true
        address.value.tacked = true
        delivery.value.tacked = true
        track.value.tacked = true
        composition.value.forEach(item => {
            item.good.tacked = true
            item.quantity.tacked = true
            item.type.tacked = true
            item.product.tacked = true
        })
        const check = client.value.valid && phone.value.valid && address.value.valid && delivery.value.valid && track.value.valid
        const checkComposition = !composition.value.find(item => !item.good.valid || !item.type.valid || !item.quantity.valid)

        if (check && checkComposition) {
            await updateOrders({
                id: route.params.id,
                client: client.value.value,
                phone: phone.value.value,
                address: address.value.value,
                delivery: delivery.value.value,
                track: track.value.value,
                comment: comment.value.value,
                email: email.value.value,
                payed: payed.value,
                blank: file.value.value,
                composition: composition.value.map(item => {
                    if (item.type.value === 'present') {
                        const findPresent = getPresentsList.value.find(present => present.id.toString() === item.good.value)
                        return {
                            good: findPresent.id,
                            type: findPresent.type,
                            quantity: 1,
                            present: 1
                        }
                    }

                    return {
                        good: item.good.value,
                        quantity: item.quantity.value,
                        present: 0,
                        type: item.type.value,
                    }
                })
            }, afterPage)
        }
    }

    const submitDeleteOrders = async (afterPage = 'Orders') => {
        await deleteOrders(route.params.id, afterPage)
    }

    const submitReturnOrders = async (afterPage = 'Orders') => {
        await returnOrders(route.params.id, afterPage)
    }

    const submitCollectOrders = async (afterPage = 'Orders') => {
        boxes.value.forEach(box => {
            box.box.tacked = true
        })

        if (!boxes.value.find(box => !box.box.valid) && collectGoods.value.length === getOrderDetail.value.goods_list.length) {
            await collectOrders({
                id: route.params.id,
                worker: getWorker.value.id,
                boxes: boxes.value.map(box => box.box.value)
            }, afterPage)
        }
    }

    const submitAddTrack = async (afterPage = 'Orders') => {
        if (getOrderDetail.value.address.delivery === 'CDEK') {
            track.value.tacked = true
            if (track.value.valid) {
                await addTrack({
                    id: route.params.id,
                    track: track.value.value,
                    blank: null
                }, afterPage)
            }
        } else {
            track.value.tacked = true
            file.value.tacked = true
            if (track.value.valid && file.value.valid) {
                await addTrack({
                    id: route.params.id,
                    track: track.value.value,
                    blank: file.value.value
                }, afterPage)
            }
        }
    }

    const submitAddBlank = async (afterPage = 'Orders') => {
        file.value.tacked = true

        if (file.value.valid) {
            await addBlank({
                id: route.params.id,
                blank: file.value.value
            }, afterPage)
        }
    }

    const submitSendOrders = async (afterPage = 'Orders') => {
        if (tackedOrders.value.length) {
            await sendOrders(tackedOrders.value, afterPage)
        }
    }

    const clearData = () => {
        client.value.value = ""
        address.value.value = ""
        track.value.value = ""
        comment.value.value = ""
        phone.value.value = ""
        email.value.value = ""
        delivery.value.value = ""
        composition.value = []
        file.value.value = null
        boxes.value = []
        payed.value = false
        collectGoods.value = []
        tackedOrders.value = []

        client.value.tacked = false
        address.value.tacked = false
        track.value.tacked = false
        comment.value.tacked = false
        phone.value.tacked = false
        email.value.tacked = false
        delivery.value.tacked = false
        composition.value.tacked = false
    }

    const actionsOrders = computed(() => {
        if (getWorker.value.rule === 'Админ') {
            if (+route.params.status === 1) {
                return [
                    {
                        name: "collect",
                        text: "Собрать"
                    },
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
                    },
                    {
                        name: "addBlank",
                        text: "Добавить бланк"
                    },
                    {
                        name: "openBlank",
                        text: "Открыть бланк"
                    },
                    {
                        name: "sendMessage",
                        text: "Получить в ТГ"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 2) {
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
                        name: "send",
                        text: "Отправить"
                    },
                    {
                        name: "addBlank",
                        text: "Добавить бланк"
                    },
                    {
                        name: "openBlank",
                        text: "Открыть бланк"
                    },
                    {
                        name: "sendMessage",
                        text: "Получить в ТГ"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 3) {
                return [
                    {
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        name: "addTrack",
                        text: "Добавить трек-номер"
                    },
                    {
                        name: "collect",
                        text: "Собрать"
                    },
                    {
                        name: "delete",
                        text: "Удалить"
                    },
                ]
            } else if (+route.params.status === 4) {
                return [
                    {
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        name: "return",
                        text: "Вернуть"
                    },
                    {
                        name: "sendMessage",
                        text: "Получить в ТГ"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 5) {
                return [
                    {
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        name: "sendMessage",
                        text: "Получить в ТГ"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 6) {
                return [
                    {
                        status: [6, 7],
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        status: [6],
                        name: "addTrack",
                        text: "Добавить трек-номер"
                    },
                    {
                        status: [7],
                        name: "send",
                        text: "Отправить"
                    },
                    {
                        status: [7],
                        name: "addBlank",
                        text: "Добавить бланк"
                    },
                    {
                        status: [7],
                        name: "openBlank",
                        text: "Открыть бланк"
                    },
                    {
                        status: [7],
                        name: "sendMessage",
                        text: "Получить в ТГ"
                    },
                    {
                        status: [7],
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            }
        } else if (getWorker.value.rule === 'Оператор') {
            if (+route.params.status === 1) {
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
                    },
                    {
                        name: "addBlank",
                        text: "Добавить бланк"
                    },
                    {
                        name: "sendMessage",
                        text: "Получить в ТГ"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 2) {
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
                        name: "addBlank",
                        text: "Добавить бланк"
                    },
                    {
                        name: "sendMessage",
                        text: "Получить в ТГ"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 3) {
                return [
                    {
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        name: "addTrack",
                        text: "Добавить трек-номер"
                    },
                    {
                        name: "delete",
                        text: "Удалить"
                    },
                ]
            } else if (+route.params.status === 4) {
                return [
                    {
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        name: "return",
                        text: "Вернуть"
                    },
                    {
                        name: "sendMessage",
                        text: "Получить в ТГ"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 5) {
                return [
                    {
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        name: "sendMessage",
                        text: "Получить в ТГ"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 6) {
                return [
                    {
                        status: [6, 7],
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        status: [6],
                        name: "addTrack",
                        text: "Добавить трек-номер"
                    },
                    {
                        status: [7],
                        name: "addBlank",
                        text: "Добавить бланк"
                    },
                    {
                        status: [7],
                        name: "sendMessage",
                        text: "Получить в ТГ"
                    },
                    {
                        status: [7],
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            }
        } else if (getWorker.value.rule === 'Сборщик') {
            if (+route.params.status === 1) {
                return [
                    {
                        name: "collect",
                        text: "Собрать"
                    },
                    {
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        name: "openBlank",
                        text: "Открыть бланк"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 2) {
                return [
                    {
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        name: "send",
                        text: "Отправить"
                    },
                    {
                        name: "openBlank",
                        text: "Открыть бланк"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 3) {
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
            } else if (+route.params.status === 4) {
                return [
                    {
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 5) {
                return [
                    {
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            } else if (+route.params.status === 6) {
                return [
                    {
                        status: [6, 7],
                        name: "preview",
                        text: "Посмотреть"
                    },
                    {
                        status: [7],
                        name: "send",
                        text: "Отправить"
                    },
                    {
                        status: [7],
                        name: "openBlank",
                        text: "Открыть бланк"
                    },
                    {
                        status: [7],
                        name: "copyTrack",
                        text: "Скопировать трек-номер"
                    },
                ]
            }
        }
    })

    const filterDelivery = [
        {
            name: "Все",
            value: null
        },
        {
            name: "CDEK",
            value: "CDEK"
        },
        {
            name: "Яндекс Доставка",
            value: "Яндекс Доставка"
        },
        {
            name: "Почта России",
            value: "Почта России"
        },
        {
            name: "Boxberry",
            value: "Boxberry"
        },
    ]

    const filterSort = [
        {
            name: "Вначале старые",
            value: 'old'
        },
        {
            name: "Вначале новые",
            value: 'new'
        }
    ]

    const compositionTypes = [
        {
            name: "Товар",
            value: 'good'
        },
        {
            name: "Набор",
            value: 'kit'
        },
        {
            name: "Подарок",
            value: 'present'
        }
    ]

    const computedStatus = (status) => {
        if (+status === 1) {
            return 'Создан'
        }
        if (+status === 2) {
            return 'Собран'
        }
        if (+status === 3) {
            return 'В обработке'
        }
        if (+status === 4) {
            return 'Отправлен'
        }
        if (+status === 5) {
            return 'Возвращен'
        }
        if (+status === 6) {
            return 'Собран без трека'
        }
        if (+status === 7) {
            return 'Добавлен трек'
        }
    }

    const computedGoods = computed(() => {
        if (!getGoodsList.value.length) {
            return []
        }

        return getGoodsList.value.map(good => {
            good.product_item = getProductsList.value.find(item => item.id === good.product)
            return {
                name: `${good.packing} ${good.product_item.measure}`,
                value: good.id,
                product: good.product
            }
        })
    })

    const computedProducts = computed(() => {
        if (!getProductsList.value.length) {
            return []
        }

        return getProductsList.value.map(product => {
            return {
                name: product.show_title ? product.show_title : product.title,
                value: product.id
            }
        })
    })

    const computedKits = computed(() => {
        if (!getKitsList.value.length) {
            return []
        }

        return getKitsList.value.map(kit => {
            return {
                name: kit.title,
                value: kit.id,
            }
        })
    })

    const computedPresents = computed(() => {
        if (!getPresentsList.value.length) {
            return []
        }

        return getPresentsList.value.map(present => {
            return {
                name: present.title,
                value: present.id.toString(),
                type: present.type
            }
        })
    })

    const computedDetailOrdersComposition = computed(() => {
        if (!getOrderDetail.value) {
            return []
        }

        return getOrderDetail.value.composition_list.map(item => {
            if (item.type === 'good') {
                const findGood = getGoodsList.value.find(good => +good.id === +item.good)
                const findProduct = getProductsList.value.find(product => +product.id === +findGood.product)

                return `${!!+item.present ? 'Подарок: ' : ''}${findProduct.show_title ? findProduct.show_title : findProduct.title}, ${findGood.packing} ${findProduct.measure} ${+item.quantity > 1 ? ' - ' + item.quantity + ' шт.' : ''}`
            }

            if (item.type === 'kit') {
                const findKit = getKitsList.value.find(kit => +kit.id === +item.good)

                return `${findKit.title} ${+item.quantity > 1 ? ' - ' + item.quantity + ' шт.' : ''}`
            }

            if (item.type === 'other') {
                const findPresent = getPresentsList.value.find(present => +present.id === +item.good && present.type === 'other')
                return `Подарок: ${findPresent.title}`
            }

            return item
        })
    })

    const computedDetailOrdersGoods = computed(() => {
        if (!getOrderDetail.value) {
            return []
        }
        const newArray = getOrderDetail.value.goods_list.map(item => {
            if (item.type === 'good') {
                const findProduct = getProductsList.value.find(product => +product.id === +item.product)

                return {
                    title: `${findProduct.show_title ? findProduct.show_title : findProduct.title}, ${item.packing} ${findProduct.measure}`,
                    quantity: item.quantity,
                    ready: !!+item.ready,
                    type: 'good',
                    id: item.id
                }
            }

            if (item.type === 'other') {
                return {
                    title: item.title,
                    quantity: item.quantity,
                    ready: !!+item.ready,
                    type: 'other',
                    id: item.id
                }
            }
        })

        return [...newArray.filter(item => item.type === 'good'), ...newArray.filter(item => item.type === 'other')]
    })

    const computedBoxesList = computed(() => {
        return getBoxesList.value.map(box => {
            return {
                name: box.title,
                value: box.id
            }
        })
    })

    const changeFilter = () => {
        findOrders({...filter.value})
    }

    const findNextPage = () => {
        findOrders({...filter.value}, getNextPage.value)
    }

    const openBlank = (id) => {
        window.open(`/api/orders/blank.php?id=${id}`, '_blank')
    }

    const openBlankList = () => {
        window.open(`/api/orders/blank.php?status=${route.params.status}`, '_blank')
    }

    const copyTracksAll = () => {
        const copyTrack = getOrders.value.filter(item => item.delivery === 'CDEK').map(item => `${item.track.replace(/\s/g, "")}`).join(',')
        navigator.clipboard.writeText(copyTrack)
        addMessages(['Трек-номера скопированы'], 'success')
    }

    const copyTrack = (order) => {
        if (order.delivery === 'CDEK') {
            navigator.clipboard.writeText(order.track.replace(/\s/g, ""))
        } else {
            navigator.clipboard.writeText(order.track)
        }
        addMessages(['Трек-номер скопированы'], 'success')
    }

    const copyNumber = (number) => {
        navigator.clipboard.writeText(number)
        addMessages(['Номер заказа скопирован'], 'success')
    }


    return {
        router,
        route,
        getOrders,
        getNextPage,
        getOrderDetail,
        getGoodsList,
        getProductsList,
        getKitsList,
        getPresentsList,
        getBoxesList,
        computedBoxesList,
        sendTelegramMessage,
        filter,
        addComposition,
        removeComposition,
        submitCreateOrders,
        submitUpdateOrders,
        submitDeleteOrders,
        submitReturnOrders,
        submitCollectOrders,
        submitSendOrders,
        submitAddTrack,
        submitAddBlank,
        order,
        addBox,
        removeBox,
        actionsOrders,
        filterDelivery,
        filterSort,
        compositionTypes,
        clearData,
        computedStatus,
        computedGoods,
        computedProducts,
        computedKits,
        computedPresents,
        computedDetailOrdersComposition,
        computedDetailOrdersGoods,
        collectGoods,
        tackedOrders,
        changeFilter,
        findNextPage,
        openBlank,
        openBlankList,
        copyTracksAll,
        copyTrack,
        copyNumber,
    }
}