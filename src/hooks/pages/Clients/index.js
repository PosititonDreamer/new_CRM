import {Clients} from "@/store/Clients/Clients.js";
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";
import {validateInput} from "@/hooks/validateInput.js";

export const HookClients = () => {
    const {
        getClients,
        getClientsFullNameList,
        getNextPage,
        findClients,
        findClientsList,
        findClientsFullNameList,
        joinClients,
        joinAddress,
        updateClients,
        clearClientsFullNameList,
    } = Clients()

    const filter = ref({
        sort: 'new'
    })

    const joinClientsList = ref([])
    const joinAddressList = ref([])

    const {data: client} = validateInput("String", "", 1)
    const {data: full_name} = validateInput("String", "", 1)
    const {data: address} = validateInput("String", "", 1)

    const {data: phone} = validateInput("String", "", 1)
    const {data: email} = validateInput("String", "", 1)
    const {data: name} = validateInput("String", "", 1)

    const router = useRouter()
    const route = useRoute()

    const findNextPage = async () => {
        await findClients({...filter.value}, getNextPage.value)
    }

    const submitFindClientsList = async (afterPage) => {
        client.value.tacked = true
        if (client.value.valid) {
            await findClientsList(client.value.value, afterPage)
        }
    }

    let timeout

    const submitFindClientsFullNameList = async () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            if(full_name.value.value.trim().length > 3){
                findClientsFullNameList(full_name.value.value)
            }
        }, 150)

    }

    const submitJoinClients = async (afterPage) => {
        if (joinClientsList.value.length) {
            await joinClients(
                {
                    client: route.params.client,
                    clients_join: joinClientsList.value.map(client => client.id)
                }, afterPage
            )
        }
    }

    const submitJoinAddress = async (afterPage) => {
        address.value.tacked = true

        if (address.value.valid && joinAddressList.value.length) {
            await joinAddress(
                {
                    address: address.value.value,
                    address_join: joinAddressList.value.map(item => item.id)
                }, afterPage
            )
        }
    }

    const submitUpdateClients = async (afterPage) => {
        phone.value.tacked = true
        email.value.tacked = true
        name.value.tacked = true

        if (phone.value.valid && email.value.valid && name.value.valid) {
            await updateClients({
                id: route.params.client,
                phone: phone.value.value,
                email: email.value.value,
                full_name: name.value.value,
            }, afterPage)
        }
    }

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

    const changeFilter = () => {
        findClients({...filter.value})
    }

    const actionsOrders = [
        {
            name: "preview",
            text: "Посмотреть"
        }
    ]

    const actionsClients = [
        {
            name: "update",
            text: "Изменить"
        },
        {
            name: "joinClients",
            text: "Объединить с другим"
        },
        {
            name: "joinAddress",
            text: "Объединить адреса"
        }
    ]

    const computedAddress = computed(() => {
        if(!route.params.client){
            return []
        }
        const findClient = getClients.value.find((client) => +client.id ===+ route.params.client)
        if(findClient){
            return findClient.address.map(address => {
                return {
                    name: `${address.delivery} ${address.address}`,
                    value: address.id,
                    item: address
                }
            })
        }
        return []
    })

    const clearData = () => {
        client.value.value = ''
        full_name.value.value = ''
        address.value.value = ''
        phone.value.value = ''
        email.value.value = ''
        name.value.value = ''
        joinClientsList.value = []
        joinAddressList.value = []

        client.value.tacked = false
        full_name.value.tacked = false
        address.value.tacked = false
        phone.value.tacked = false
        email.value.tacked = false
        name.value.tacked = false
        clearClientsFullNameList()
    }

    return {
        getClients,
        getClientsFullNameList,
        filter,
        joinClientsList,
        joinAddressList,
        client,
        full_name,
        address,
        router,
        route,
        findNextPage,
        submitFindClientsList,
        submitFindClientsFullNameList,
        submitJoinClients,
        submitJoinAddress,
        filterSort,
        changeFilter,
        actionsOrders,
        actionsClients,
        phone,
        email,
        name,
        submitUpdateClients,
        clearData,
        getNextPage,
        computedAddress
    }
}