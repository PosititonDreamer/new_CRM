import {Presents} from "@/store/Admin/Presents/Presents.js";
import {useRoute, useRouter} from "vue-router";
import {validateInput} from "@/hooks/validateInput.js";
import {Products} from "@/store/Admin/Products/Products.js";
import {Packing} from "@/store/Admin/Products/Packing.js";
import {MeasureUnits} from "@/store/Admin/Products/MeasureUnits.js";
import {computed, ref} from "vue";

export const HookPresents = () => {
    const {
        getPresents,
        createPresents,
        updatePresents,
        deletePresents,
    } = Presents()

    const {
        getProducts
    } = Products()

    const {
        getPacking
    } = Packing()

    const {
        getMeasureUnits
    } = MeasureUnits()

    const router = useRouter()
    const route = useRoute()

    const {data: product} = validateInput("String", "")
    const {data: packing} = validateInput("String", "")

    const clearData = () => {
        product.value.value = ""
        packing.value.value = ""

        packing.value.tacked = false
        product.value.tacked = false
    }

    const submitCreatePresent = async () => {
        product.value.tacked = true
        packing.value.tacked = true

        if(packing.value.valid && product.value.valid) {
            await createPresents({
                packing: packing.value.value
            })
        }
    }

    const submitUpdatePresent = async () => {
        product.value.tacked = true
        packing.value.tacked = true

        if(packing.value.valid && product.value.valid) {
            await updatePresents({
                id: route.params.id,
                packing: packing.value.value,
            })
        }
    }

    const submitDeletePresent = async () => {
        await deletePresents(route.params.id)
    }

    const computedProducts = computed(() => {
        if(!getProducts.value.length) return []

        return getProducts.value.map(gProduct => {
            return {
                name: gProduct.show_title ?? gProduct.title,
                value: gProduct.id,
            }
        })
    })

    const computedPackings = computed(() => {
        if(!getPacking.value.length || !product.value.value) return []

        const findProduct = getProducts.value.find(gProduct => +gProduct.id === +product.value.value)
        const measure = getMeasureUnits.value.find(measureUnit => +measureUnit.id === +findProduct.measure_unit)

        return getPacking.value.filter(gPacking => gPacking.product === product.value.value).map(gPacking => {
            return {
                name: `${gPacking.packing} ${measure.title}`,
                value: gPacking.id,
            }
        })
    })

    const computedPresents = computed(() => {
        if(!getProducts.value.length || !getPacking.value.length || !getMeasureUnits.value.length) return []

        return getPresents.value.map(gPresent => {
            const pack = getPacking.value.find(getPacking => +getPacking.id === +gPresent.packing)
            const findProduct = getProducts.value.find(gProduct => +gProduct.id === +pack.product)
            const measure = getMeasureUnits.value.find(measureUnit => +measureUnit.id === +findProduct.measure_unit)

            return {
                id: gPresent.id,
                title: `${findProduct.show_title ?? findProduct.title}, ${pack.packing} ${measure.title}`,
            }
        })
    })

    const actionsPresents = ref([
        {
            name: "update",
            text: "Изменить"
        },
        {
            name: "remove",
            text: "Удалить"
        }
    ])

    return {
        getPresents,
        router,
        route,
        product,
        packing,
        clearData,
        submitCreatePresent,
        submitUpdatePresent,
        submitDeletePresent,
        computedProducts,
        computedPackings,
        actionsPresents,
        computedPresents
    }
}