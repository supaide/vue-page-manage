import PageView from './page-view.vue'

export default function install (Vue) {
  if (install.installed) return
  install.installed = true
  if (Vue.component('page-view')) {
    return
  }

  Vue.config.errorHandler = function (err, vm, info) {
    console.log(err)
    console.log(info)
  }

  Vue.component('page-view', PageView)

  Vue.mixin({
    beforeCreate () {
      if (this.$options.router) {
        this._routerRoot = this
        this._router = this.$options.router
        this.$options.router.init(this)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
    },
    props: {
      __path: null
    },
    data () {
      return {
        __historyId: 0,
        __pageStatus: null
      }
    },
    destroyed () {
      if (this.$options.onDestroy) {
        this.$options.onDestroy.call(this)
      }
    },
    methods: {
      finish (pattern) {
        setTimeout(() => {
          let historyId = this.$data.__historyId
          if (pattern) {
            historyId = pattern
          }
          this.$router.finish(3, historyId)
        }, 0)
      }
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get () {
      return this._routerRoot._router
    }
  })

}
