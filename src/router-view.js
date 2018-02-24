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

    let depth = 0
    let fullPath = []
    for (let i=0; i<router.__pageViews.length; i++) {
      fullPath.push(router.currentRoute[i][1].path)
      if (router.__pageViews[i]._uid == parent._uid) {
        depth = i
        break
      }
    }

    const matched = router.currentRoute[depth][1]
    parent._routerViewCache || (parent._routerViewCache = {})
    // change 更新时，route view被触发多次更新（原因未确定），因此复用之前的实例
    if (parent._routerViewCache[matched.path]) {
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
