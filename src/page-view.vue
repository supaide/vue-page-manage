<template>
<div :class="className">
  <!-- https://cn.vuejs.org/v2/guide/transitions.html#过渡的类名 -->
  <transition :name="transitionName" :mode="transitionMode"
    v-on:before-enter="beforeEnter"
    v-on:after-enter="afterEnter"
  >
    <router-view class="page-view" :change="change"></router-view>
  </transition>
</div>
</template>
<script>
import RouterView from './router-view' 
import {util, url} from 'h5-webutil'
import equal from 'fast-deep-equal'

let checkSSR = function () {
  if (typeof window === 'undefined') {
    return false
  }
  let query = url.decodeQuery(window.location.href)
  return query[1] && typeof query[1].__SSR !== 'undefined'
}

let excludeCloneKeys = [
  '__ob__',
  '__historyId',
  '__pageStatus',
  '__validators',
  '__error',
  '__validateKey'
]

export default {
  components: {
    RouterView
  },
  props: {
    className: {
      type: String,
      default: 'page-wrap'
    }
  },
  data () {
    return {
      change: 0,
      transitionName: null,
      transitionMode: null,
    }
  },
  created () {
    this.transitionName = this.$router.transitionName
    this.transitionMode = this.$router.transitionMode
    this.prePages = []
    this.currentPages = []
    this.$router.__pageViews.push(this)
    this.historyId = null
  },
  destroyed () {
    let pageViews = []
    for (let i=0; i<this.$router.__pageViews.length; i++) {
      if (this.$router.__pageViews[i]._uid != this._uid) {
        pageViews.push(this.$router.__pageViews[i])
      }
    }
    this.$router.__pageViews = pageViews
  },
  methods: {
    beforeEnter () {
      if (checkSSR()) {
        return
      }
      this.currentPages = []
      this.prePages = []
      let thisPageViewExist = false
      for (let i=0; i<this.$router.__pageViews.length; i++) {
        if (this.$router.__pageViews[i]._uid == this._uid) {
          thisPageViewExist = true
        }
        if (thisPageViewExist) {
          let pageView = this.$router.__pageViews[i]
          for (let j=0; j<pageView.$children.length; j++) {
            if (pageView.$children[j].$data.__pageStatus) {
              this.prePages.push([pageView.$children[j], pageView])
            } else {
              this.currentPages.push([pageView.$children[j], pageView])
            }
          }
        }
      }
      let lifecycle = 'onCreate'
      for (let i=0; i<this.currentPages.length; i++) {
        let node = this.currentPages[i]
        let pageView = node[1]
        node = node[0]
        if (node.$data.__pageStatus === lifecycle) {
          continue
        }
        let originData = util.clone(node.$data, excludeCloneKeys)
        node.$set(node.$data, '__pageStatus', lifecycle)

        if (this.historyId) {
          let bundleId = this.historyId + '_' + node.__path
          let currentEndRoute = this.$router.currentRoute.slice(-1)[0]
          if (currentEndRoute && currentEndRoute[1].meta && currentEndRoute[1].meta.reuse) {
            let currentData = this.$router.bundle(bundleId)
            if (currentData) {
              Object.keys(currentData).forEach((key) => {
                node.$set(node.$data, key, currentData[key])
              })
            }
          }
          this.$router.bundle(bundleId, originData)
          node.$set(node.$data, '__historyId', this.historyId)
        }

        if (node.$options[lifecycle]) {
          try {
            node.$options[lifecycle].call(node, this.$router.params || {})
          } catch (e) {
            console.log(e)
          }
        }
      }
    },
    afterEnter () {
      if (checkSSR()) {
        return
      }
      let lifecycle = 'onResume'
      for (let i=0; i<this.currentPages.length; i++) {
        let node = this.currentPages[i]
        let pageView = node[1]
        node = node[0]
        if (node.$data.__pageStatus === lifecycle) {
          continue
        }
        if (node.$options.title && typeof document !== 'undefined') {
          document.title = node.$options.title
        }
        node.$set(node.$data, '__pageStatus', lifecycle)
        if (node.$options[lifecycle]) {
          try {
            node.$options[lifecycle].call(node, this.$router.params || {})
          } catch (e) {
            console.log(e)
          }
        }
      }
      lifecycle = 'onStop'
      for (let i=0; i<this.prePages.length; i++) {
        let node = this.prePages[i]
        let pageView = node[1]
        node = node[0]
        if (node.$data.__pageStatus === lifecycle) {
          continue
        }

        if (this.historyId) {
          let bundleId = node.$data.__historyId + '_' + node.__path
          let originData = this.$router.bundle(bundleId)
          if (typeof originData !== "undefined") {
            let currentData = util.clone(node.$data, excludeCloneKeys)
            let data = {}
            if (currentData) {
              Object.keys(originData).forEach(function (key) {
                if (!equal(originData[key], currentData[key])) {
                  data[key] = currentData[key]
                }
              })
            }
            this.$router.bundle(bundleId, data)
          }
        } 

        if (node.$options[lifecycle]) {
          try {
            node.$options[lifecycle].call(node, this.$router.params || {})
          } catch (e) {
            console.log(e)
          }
        }
        node.$set(node.$data, '__pageStatus', lifecycle)
      }
      this.$router._pageViewLoadFinished()
    },
    doPageChange (historyId, direction) {
      this.historyId = historyId
      if (!this.$router.__started_pageview) {
        this.$router.__started_pageview = true
        this.transitionName = null
      } else {
        if (direction) {
          this.transitionName = this.$router.transitionName + '-' + direction
        } else {
          this.transitionName = this.$router.transitionName
        }
      }
      this.change = +new Date
    }
  },
}
</script>
<style lang="less">
.page-wrap {
  position: relative;
  height: 100%;
  width: 100%;
  .page-view {
    //position: absolute;
    //height: 100%;
    height: inherit;
    width: 100%;
    overflow-y: auto;
    //top: 0;
    //display: inline-block;
  }
}
.page-view-enter, .page-view-right-leave-active {
  position: absolute;
  transform: translateX(31px);
  will-change: transform;
}
.page-view-leave, .page-view-right-leave {
  position: absolute;
}
.page-view-enter-active, .page-view-leave-active, .page-view-right-enter-active, .page-view-right-leave-active {
  position: absolute;
  transition: all 0.4s;
}
.page-view-enter, .page-view-leave-active, .page-view-right-enter, .page-view-right-leave-active {
  opacity: 0;
}
.page-view-leave-active, .page-view-right-enter {
  transform: translateX(-31px);
  will-change: transform;
}
</style>
