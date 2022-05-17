import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // //1.payload新添加的商品
    // let oldPorduct = null;
    // for(let item of state.cartList) {
    //   if (item.idd === payload.idd) {
    //     oldPorduct = item;
    //   }
    // }

    //1.使用函数如果查到存在这个id数就返回
    let oldPorduct = context.state.cartList.find(function (item) {
      return item.iid ===payload.iid
    })

    //2.判断oldProduct
    if (oldPorduct) {
      // oldPorduct.count += 1
      //把两个步骤分开  目的是方便调试跟踪
      context.commit(ADD_COUNTER, oldPorduct);
      resolve('商品加一')
    } else {
      payload.count = 1
      // context.state.cartList.push(payload)
      context.commit(ADD_TO_CART, payload);
      resolve('添加商品')
    }

    // state.cartList.push(payload)
    })
  }
}