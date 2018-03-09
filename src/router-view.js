export default {
  functional: true,
  props: {
    change: 0
  },
  render (h, { props, children, parent, data }) {
    const router = parent.$router
    if (!router || !router.currentRoute) {
      return h()
    }
    const pageView = parent

    if (!router.changedPageViewIndex) {
      router.changedPageViewIndex = 0
    }
    let matched = null
    if (router.changedPageViewIndex < router.currentRoute.length) {
      matched = router.currentRoute[router.changedPageViewIndex][1]
    }
    let fullPath = []
    for (let i=0; i<router.currentRoute.length; i++) {
      if (i>router.changedPageViewIndex) {
        break
      }
      fullPath.push(router.currentRoute[i][1].path)
    }
    router.changedPageViewIndex++

    parent._routerViewCache || (parent._routerViewCache = {})
    // change 更新时，route view被触发多次更新（原因未确定），因此复用之前的实例
    if (matched && parent._routerViewCache[matched.path]) {
      return parent._routerViewCache[matched.path]
    }
    if (!matched || !matched.ctor) {
      delete parent._routerViewCache[matched.path]
      return h()
    }
    data.props = {
      __path: fullPath.join('/')
    }

    let node = h(matched.ctor, data, children)
    parent._routerViewCache = {}
    parent._routerViewCache[matched.path] = node
    return node
  }
}
