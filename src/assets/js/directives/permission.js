import Vue from "vue";
import storage from "../../../store/index";

export default Vue.directive('permission',  {
  //只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。
  bind(el, binding) {

  },
  //被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）
  inserted(el, binding) {
    /**传入的权限和指令的值进行对比*/
    if (!storage.get("button").toString().includes(binding.value)) {
      el.style.cursor = 'not-allowed'
      el.parentNode.replaceChild(el.cloneNode(true), el)
    }
  },
  //第一次是紧跟在 bind 之后调用，获得的参数是绑定的初始值，之后被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新（详细的钩子函数参数见下）
  update(el, binding) {

  },
  //被绑定元素所在模板完成一次更新周期时调用
  componentUpdated(el, binding) {

  },
  //只调用一次， 指令与元素解绑时调用
  unbind(el, binding) {

  }
})

/**
 (el, binding, vnode, oldVnode)
 el：指令所绑定的元素，可以用来直接操作 DOM 。

 binding：一个对象，包含以下属性
 name：指令名，不包含v-的前缀；
 value：指令的绑定值；例如：v-my-directive="1+1"，value的值是2；
 oldValue：指令绑定的前一个值，仅在update和componentUpdated钩子函数中可用，无论值是否改变都可用；
 expression：绑定值的字符串形式；例如：v-my-directive="1+1"，expression的值是'1+1'；
 arg：传给指令的参数；例如：v-my-directive:foo，arg的值为 'foo'；
 modifiers：一个包含修饰符的对象；例如：v-my-directive.a.b，modifiers的值为{'a':true,'b':true}

 vnode：Vue编译的生成虚拟节点；

 oldVnode：上一次的虚拟节点，仅在update和componentUpdated钩子函数中可用
 */
