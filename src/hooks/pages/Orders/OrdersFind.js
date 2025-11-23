import {OrdersFind} from "@/store/Orders/OrdersFind.js";
import {validateInput} from "@/hooks/validateInput.js";
import {useRoute, useRouter} from "vue-router";
import {Orders} from "@/store/Orders/Orders.js";

export const HookOrdersFind = () => {
    const {
        getOrders,
        findOrders,
        deleteOrders,
        returnOrders,
    } = OrdersFind()

    const {sendTelegramMessage} = Orders()

    const route = useRoute()
    const router = useRouter()

    const {data: type} = validateInput("String", "track", 1)
    const {data: text} = validateInput("String", "", 3)

    const submitFindOrders = async (afterPage = 'OrdersFind') => {
        type.value.tacked = true
        text.value.tacked = true

        if(text.value.valid && type.value.valid) {
            await findOrders({
                type: type.value.value,
                text: text.value.value
            }, afterPage)
        }
    }

    const submitDeleteOrders = async (afterPage = 'OrdersFind') => {
        await deleteOrders(route.params.id, afterPage)
    }

    const submitReturnOrders = async (afterPage = 'OrdersFind') => {
        await returnOrders(route.params.id, afterPage)
    }

    const typesList = [
        {
            value: "track",
            name: "Трек-номеру"
        },
        {
            value: "text",
            name: "ФИО"
        }
    ]

    const actionsList = [
        {
            status: [1, 2, 3, 4, 5],
            name: "preview",
            text: "Посмотреть"
        },
        {
            status: [1, 2, 3, 4, 5],
            name: "sendMessage",
            text: "Получить в ТГ"
        },
        {
            status: [1, 3],
            name: "delete",
            text: "Удалить"
        },
        {
            status: [4],
            name: "return",
            text: "Вернуть заказ"
        },
    ]


    return {
        route,
        router,
        getOrders,
        submitFindOrders,
        submitDeleteOrders,
        submitReturnOrders,
        typesList,
        type,
        text,
        actionsList,
        sendTelegramMessage
    }
}