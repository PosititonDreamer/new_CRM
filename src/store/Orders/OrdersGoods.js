import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import axios from "axios";
import {Messages} from "@/store/Messages.js";
import {Loader} from "@/store/Loader.js";

export const OrdersGoods = defineStore('OrdersGoods', () => {
    const goodsOrders = ref([]);

    const getGoodsOrders = computed(() => goodsOrders)


    const {updateLoader} = Loader()
    const {addMessages} = Messages();

    const findOrdersGoods = async () => {
        updateLoader({method: 'findOrdersGoods', status: false})
        await axios.get('/orders/goods_in_orders.php')
            .then(res => {
                goodsOrders.value = res.data.goods.sort((a, b) => {
                    if(+a.sort === +b.sort) {
                        return +a.good_quantity - +b.good_quantity
                    } else {
                        return +a.sort - +b.sort
                    }
                });
                addMessages(res.data.messages, 'success')
            })
            .catch(err => {
                addMessages(err.response.data.messages, 'error')
            })
        updateLoader({method: 'findOrdersGoods', status: true})
    }

    return {
        getGoodsOrders,
        findOrdersGoods,
    }
})