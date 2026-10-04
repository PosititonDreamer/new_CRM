import {Mails} from "@/store/Admin/Mails/Mails.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {computed} from "vue";

export const HookMails = () => {
    const {
        getMails,
        createMail,
        updateMail,
        deleteMail,
    } = Mails()

    const router = useRouter()
    const route = useRoute()

    const {data: order_type} = validateInput("String", "", 0)
    const {data: mail_type} = validateInput("String", "", 0)
    const {data: min_orders} = validateInput("Number", 0, -1)
    const {data: max_orders} = validateInput("Number", 0, -1)
    const {data: text} = validateInput("String", "", 0)

    const mailTypes = [
        {
            name: 'Наложка',
            value: 'not_payed'
        },
        {
            name: 'Оплаченный заказ',
            value: 'payed'
        }
    ]

    const orderTypes = [
        {
            name: 'Создание заказа',
            value: 'after_create'
        },
        {
            name: 'Передача в доставку',
            value: 'in_delivery'
        },
        {
            name: 'Получение посылки',
            value: 'taking'
        }
    ]

    const mail = {
        order_type,
        mail_type,
        min_orders,
        max_orders,
        text,
    }

    const clearData = () => {
        order_type.value.value = ''
        mail_type.value.value = ''
        text.value.value = ''
        min_orders.value.value = 0
        max_orders.value.value = 0

        order_type.value.tacked = false
        mail_type.value.tacked = false
        text.value.tacked = false
        min_orders.value.tacked = false
        max_orders.value.tacked = false
    }

    const getMailsList = computed(() => {
        const mails = []

        if(!getMails.value.length) {
            return []
        }

        mailTypes.forEach((item) => {
            const newItem = {
                name: item.name,
                list: []
            }

            orderTypes.forEach((child) => {
                const newChild = {
                    name: child.name,
                    list: getMails.value.filter(mailItem => mailItem.mail_type && mailItem.order_type && mailItem.mail_type === item.value && mailItem.order_type === child.value),
                }
                newItem.list.push(newChild)
            })
            mails.push(newItem)
        })
        return mails
    })

    const submitCreateMail = async () => {
        order_type.value.tacked = true
        mail_type.value.tacked = true
        text.value.tacked = true
        min_orders.value.tacked = true
        max_orders.value.tacked = true
        if(order_type.value.valid && mail_type.value.valid && text.value.valid && min_orders.value.valid && max_orders.value.valid) {
            await createMail({
                text: text.value.value,
                order_type: order_type.value.value,
                mail_type: mail_type.value.value,
                min_orders: min_orders.value.value,
                max_orders: max_orders.value.value,
            })
        }
    }

    const submitUpdateMail = async () => {
        order_type.value.tacked = true
        mail_type.value.tacked = true
        text.value.tacked = true
        min_orders.value.tacked = true
        max_orders.value.tacked = true
        if(order_type.value.valid && mail_type.value.valid && text.value.valid && min_orders.value.valid && max_orders.value.valid) {
            await updateMail({
                id: route.params.id,
                text: text.value.value,
                order_type: order_type.value.value,
                mail_type: mail_type.value.value,
                min_orders: min_orders.value.value,
                max_orders: max_orders.value.value,
            })
        }
    }

    const submitDeleteMail = async () => {
        await deleteMail(route.params.id)
    }

    return {
        router,
        route,
        mailTypes,
        orderTypes,
        clearData,
        mail,
        getMails,
        getMailsList,
        submitCreateMail,
        submitUpdateMail,
        submitDeleteMail,
    }
}