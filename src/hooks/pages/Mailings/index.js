import {useRouter, useRoute} from "vue-router";
import {Mailings} from "@/store/Admin/Mailing/Mailings.js";
import {validateInput} from "@/hooks/validateInput.js";
import {computed} from "vue";

export const HookMailings = () => {
    const {
        getMailings,
        createMailings,
        updateMailings,
        deleteMailings,
        sendMailings,
    } = Mailings()

    const {data: title} = validateInput('String', '')
    const {data: text} = validateInput('String', '')

    const router = useRouter();
    const route = useRoute();

    const submitCreateMailings = async () => {
        title.value.tacked = true
        text.value.tacked = true

        if(title.value.valid && text.value.valid) {
            await createMailings({
                title: title.value.value,
                text: text.value.value,
            })
        }
    }

    const submitUpdateMailings = async () => {
        title.value.tacked = true
        text.value.tacked = true

        if(title.value.valid && text.value.valid) {
            await updateMailings({
                id: route.params.id,
                title: title.value.value,
                text: text.value.value,
            })
        }
    }

    const submitDeleteMailings = async () => {
        await deleteMailings(route.params.id)
    }

    const sendMailingsTestTelegram = async () => {
        await sendMailings({
            id: route.params.id,
            type: 'telegram',
            test: true
        })
    }

    const sendMailingsTelegram = async () => {
        await sendMailings({
            id: route.params.id,
            type: 'telegram',
            test: false
        })
    }

    const sendMailingsTestEmail = async () => {
        await sendMailings({
            id: route.params.id,
            type: 'email',
            test: true
        })
    }

    const sendMailingsEmail= async () => {
        await sendMailings({
            id: route.params.id,
            type: 'email',
            test: false
        })
    }

    const actionsMailings = [
        {
            name: "update",
            text: "Изменить"
        },
        {
            name: "remove",
            text: "Удалить"
        },
        {
            name: "testTelegram",
            text: "Отправить тест в телеграмм"
        },
        {
            name: "testEmail",
            text: "Отправить тест на почту"
        },
        {
            name: "telegram",
            text: "Отправить в телеграмм"
        },
        {
            name: "email",
            text: "Отправить на почту"
        }
    ]

    return {
        router,
        route,
        title,
        text,
        getMailings,
        submitCreateMailings,
        submitUpdateMailings,
        submitDeleteMailings,
        sendMailingsTestTelegram,
        sendMailingsTelegram,
        sendMailingsTestEmail,
        sendMailingsEmail,
        actionsMailings
    }
}