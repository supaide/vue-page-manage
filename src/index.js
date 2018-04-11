import install from './install'
import {event, url} from 'h5-webutil'
import equal from 'fast-deep-equal'

let DEFAULT_OPTIONS = {
  transition: true,
  transitionName: 'page-view',
  transitionMode: null,
  paramsInjector: null,
  beforeEach: null,
  beforeEnter: null,
  exitHandler: null,
  errorHandler: null,
  maxHistorySize: 100,// history最大栈长
  launcherMode: 'singleTop', // normal | singleTop | singleTask
  compareParam: true, // singleTop|singleTask 比较时，参数默认参与比较
  singleIndex: true,  // 首页只保留一个实例
  routeMode: 'html5'  // html5 | hash
}

const VueRoute = function (routers, options) {
  this.routers = routers || []
  this.setOptions(DEFAULT_OPTIONS)
  this.setOptions(options)
  this.pathToRouterIndex = {}
  this.rid = 0
  this.startUrl = null
  initWithLocalStorage.call(this, true)
}

VueRoute.prototype.setOptions = function (options) {
  if (!options) return
  for(let k in options) {
    if (DEFAULT_OPTIONS[k] !== undefined) {
      this[k] = options[k]
    }
  }
}

let initWithLocalStorage = function (reset) {
  if (reset) {
    this.history = []
    this.bundles = {}
    this.finishedHistoryIds = []
    this.onPageChange = false
    this.__pageViews = []
    this.__browserHistoryLen = 0
    this.__finished = false
    this.__started = false
    this.preRoute = null
    this.currentRoute = null
  }
  if (typeof localStorage === 'undefined') {
    return
  }
  try {
    let h_t = localStorage.getItem('_h_t')
    let ts = +new Date
    if (!reset && h_t && ts - h_t < 5000) {
      let h_h = localStorage.getItem('_h_h')
      let h_b = localStorage.getItem('_h_b')
      let h_f = localStorage.getItem('_h_f')
      if (h_h) {
        this.history = JSON.parse(h_h)
      }
      if (h_b) {
        this.bundles = JSON.parse(h_b)
      }
      if (h_f) {
        this.finishedHistoryIds = JSON.parse(h_f)
      }
    }
  } catch (e) {
    console.log(e)
  }
  localStorage.removeItem('_h_t')
  localStorage.removeItem('_h_h')
  localStorage.removeItem('_h_b')
  localStorage.removeItem('_h_f')
}

VueRoute.prototype.restart = function (startUrl) {
  initWithLocalStorage.call(this, true)
  this.setStartUrl(startUrl)
}

VueRoute.prototype.init = function (app) {
  if (this.app) {
    return
  }

  initWithLocalStorage.call(this)

  this.app = app
  let that = this
  let path = null
  let params = null
  if (this.history.length > 0) {
    this.startUrl = this.history[this.history.length-1][1]
    params = this.history[this.history.length-1][2]
    path = this.startUrl
    this.rid = this.history[this.history.length-1][0].split('_')[0] - 0
  }

  this.__browserHistoryLen = window.history.length
  window.addEventListener("popstate", function(e) { 
    var currentBrowserHistoryLen = window.history.length
    if (!that.__finished && currentBrowserHistoryLen - that.__browserHistoryLen < 3) {
      console.log('push state '+that.__finished)
      window.history.pushState({_t: +new Date()}, '')
    }
    event.emit('navbarback_sys')
  })
  window.history.pushState({_t: +new Date()}, '')
  if (!this.startUrl) {
    if (this.routeMode == 'html5') {
      this.startUrl = window.location.pathname + window.location.search
    } else {
      this.startUrl = window.location.hash.slice(1)
      if (!this.startUrl) {
        this.startUrl = '/'
      }
    }
  }
  let queryInfo = url.decodeQuery(this.startUrl)
  path = queryInfo[0].join('/')
  params = queryInfo[1]
  window.onunload = window.onbeforeunload = () => {
    backupHistory.call(this)
  }
  let onBack = function (type) {
    that.finish(type)
  }
  event.on('navbarback_sys', function () {
    onBack(1)
  })
  event.on('navbarback', function () {
    onBack(2)
  })

  if (this.startUrl) {
    this.goto(path || '/', params)
  }
}

const backupHistory = function () {
  if (this.history.length < 1) {
    return
  }
  let ts = +new Date
  localStorage.setItem('_h_t', ts)
  localStorage.setItem('_h_b', JSON.stringify(this.bundles))
  localStorage.setItem('_h_h', JSON.stringify(this.history))
  localStorage.setItem('_h_f', JSON.stringify(this.finishedHistoryIds))
}

VueRoute.prototype.bundle = function (id, data) {
  if (data === undefined) {
    return this.bundles[id]
  } else {
    if (data && Object.keys(data).length > 0) {
      this.bundles[id] = data
    } else {
      delete this.bundles[id]
    }
  }
}

VueRoute.prototype.match = function (location) {
  let queryInfo = url.decodeQuery(location)
  let path = queryInfo[0].join('/')
  let matched = getMatchedRouters.call(this, path, true)
  if (matched) {
    return {matched: matched, fullPath: location}
  } else {
    return {matched: []}
  }
}

VueRoute.prototype.replace = function (location) {
  let queryInfo = url.decodeQuery(location)
  //TODO replace
  this.goto(queryInfo[0].join('/'), queryInfo[1])
}

VueRoute.prototype.push = function (location) {
  let queryInfo = url.decodeQuery(location)
  this.goto(queryInfo[0].join('/'), queryInfo[1])
}

VueRoute.prototype.goto = function (path, params, backward) {
  this.__finished = false
  if (this.onPageChange || this.routers.length < 1) {
    return
  }
  path = path || '/'
  if (!backward && this.history.length > 0 && this.__started) {
    let lastHistory = this.history[this.history.length-1]
    if (path == lastHistory[1] && (!params && !lastHistory[2] || equal(params, lastHistory[2]))) {
      processFinishedHistory.call(this)
      return
    }
  }
  this.onPageChange = true
  let matched = getMatchedRouters.call(this, path, true)
  if (!matched || matched.length < 1) {
    this.onPageChange = false
    if (this.history.length < 1) {
      this.goto(this.routers[0].path)
      return
    }
    if (this.errorHandler) {
      this.errorHandler(404, {path: path})
    }
    processFinishedHistory.call(this)
    return
  }
  if (this.beforeEach) {
    this.beforeEach(matched, this.currentRoute, routeChangeAt(matched, this.currentRoute), !backward, (status, p) => {
      let type = typeof status
      if (type === 'undefined' || (type === 'boolean' && status)) {
        beforeEachCallback.call(this, path, params, matched, !backward, this.__started)
        this.__started = true
      } else {
        this.onPageChange = false
        if (type === 'string') {
          this.goto(status, p)
          return
        } else if (type !== 'boolean' && this.errorHandler) {
          this.errorHandler(status, p)
        } 
        processFinishedHistory.call(this)
      }
    })
  } else {
    beforeEachCallback.call(this, path, params, matched, !backward, this.__started)
    this.__started = true
  }
}

const processFinishedHistory = function () {
  if (this.finishedHistoryIds.length < 1) {
    return
  }
  let lastHistory = this.history.slice(-1)[0]
  let newHistory = []
  let newBundles = {}
  for (let i=0; i<this.history.length; i++) {
    let remove = false
    for (let j=0; j<this.finishedHistoryIds.length; j++) {
      let path = '/' + this.history[i][1] + '/'
      if (this.history[i][0] == this.finishedHistoryIds[j] || path.indexOf('/'+this.finishedHistoryIds[j]+'/') >= 0) {
        remove = true
        break
      }
    }
    if (!remove) {
      newHistory.push(this.history[i])
      let bundleId = this.history[i][0]+'_'+this.history[i][1]
      if (typeof this.bundles[bundleId] !== 'undefined') {
        newBundles[bundleId] = this.bundles[bundleId]
      }
    }
  }

  this.history = newHistory
  this.bundles = newBundles
  this.finishedHistoryIds = []
  if (newHistory.length > 0) {
    let newLastHistory = newHistory.slice(-1)[0]
    if (lastHistory[0] != newLastHistory[0]) {
      this.goto(newLastHistory[1], newLastHistory[2], true)
    }
  }
}

const getMatchedRouters = function (path, withRouter) {
  let path0 = path, path1 = null
  let matchedIndexs = []
  if (this.pathToRouterIndex[path] !== undefined) {
    matchedIndexs = this.pathToRouterIndex[path]
  } else {
    let routers = this.routers
    while(true) {
      let matchedIndex = -1
      for (let i=0; i<routers.length; i++) {
        if (0 !== path.indexOf(routers[i].path)) {
          continue
        }
        matchedIndex = i
        if (routers[i].redirect && !path1) {
          path = routers[i].redirect
          path1 = routers[i].redirect
          matchedIndexs = []
        } else {
          path = path.substr(routers[i].path.length+1)
        }
        break
      }
      if (matchedIndex < 0) {
        break
      }
      if (path == path1) {
        continue
      }
      matchedIndexs.push(matchedIndex)
      routers = routers[matchedIndex].children
      if (!routers) {
        break
      } else {
        if (path.length < 1) {
          let defaultPathIndex = 0
          for (let i=0; i<routers.length; i++) {
            if (routers[i].default) {
              defaultPathIndex = i
              break
            }
          }
          path = routers[defaultPathIndex].path
          path1 = path1 ? (path1 + path) : (path0 + path)
        }
      }
    }
    if (path0) {
      this.pathToRouterIndex[path0] = matchedIndexs
    }
    if (path1) {
      this.pathToRouterIndex[path1] = matchedIndexs
    }
  }
  if (withRouter) {
    let matchedRouters = []
    let routers = this.routers
    for (let i=0; i<matchedIndexs.length; i++) {
      matchedRouters.push([matchedIndexs[i], routers[matchedIndexs[i]]])
      routers = routers[matchedIndexs[i]].children
    }
    return matchedRouters
  } else {
    return matchedIndexs
  }
}

const confirmToExist = function () {
  if (this.history.length > 1 || this.onPageChange) {
    return false
  }
  let currentPath = this.history.slice(-1)[0][1]
  let matchedRouters = getMatchedRouters.call(this, currentPath, true)
  if (matchedRouters.length < 1) {
    return false
  }
  if (currentPath != this.routers[0].path) {
    this.finishedHistoryIds.push('_')
    this.history = []
    this.goto(this.routers[0].path)
  } else {
    this.__finished = true
    if (this.exitHandler) {
      this.exitHandler.call(this)
    } else {
      defaultExit.call(this)
    }
  }
  return true
}

VueRoute.prototype.onReady = function (cb) {
  if (this.isReady) {
    cb()
  }
  this.readyCbs = cb
}

/**
 *  type: 1 设备后退键；2 导航后退；3 代码显式finish
 */
VueRoute.prototype.finish = function (type, historyId) {
  if (this.__finished) {
    return
  }
  if (!this.onPageChange && confirmToExist.call(this)) {
    replaceState.call(this)
    return
  }
  if (historyId) {
    historyId = historyId.replace(/^\/*|\/*$/g, '')
    this.finishedHistoryIds.push(historyId)
  } else {
    let lastHistory = this.history.slice(-1)[0]
    this.finishedHistoryIds.push(lastHistory[0])
    let indexs0 = getMatchedRouters.call(this, lastHistory[1]).slice(0, -1)
    if (type == 2 && indexs0.length > 0) {
      for (let i=this.history.length-1; i>=0; i--) {
        let indexs = getMatchedRouters.call(this, this.history[i][1]).slice(0, -1)
        if (indexs0.join(',') != indexs.join(',')) {
          break
        }
        this.finishedHistoryIds.push(this.history[i][0])
      }
    }
  }
  if (!this.onPageChange) {
    processFinishedHistory.call(this)
  }
}

const defaultExit = function () {
  var currentBrowserHistoryLen = window.history.length
  for (let i=0; i<=currentBrowserHistoryLen-this.__browserHistoryLen+1; i++) {
    window.history.back()
  }
}

VueRoute.prototype.exit = function (force) {
  this.__finished = true
  if (this.exitHandler) {
    this.exitHandler.call(this, force)
  } else {
    defaultExit.call(this)
  }
}

VueRoute.prototype.setStartUrl = function (startUrl) {
  this.startUrl = startUrl
}

const routeChangeAt = function (currentRoute, preRoute) {
  let startPos = 0
  if (!preRoute) {
    return startPos
  }
  for (let i=0; i<currentRoute.length; i++) {
    if (i>=preRoute.length) {
      break
    }
    if (currentRoute[i][0] != preRoute[i][0]) {
      startPos = i
      break
    }
  }
  return startPos
}

const setPageCtor = function (matched, level, routers) {
  return function (ctor) {
    var r = routers
    for (var i=0; i<matched.length; i++) {
      if (i == level) {
        if (ctor.__esModule && ctor.default) {
          ctor = ctor.default
        }
        r[matched[i][0]].ctor = ctor
        break
      }
      r = r[matched[i][0]].children
      if (!r) {
        break
      }
    }
  }
}

/**
 *  1、normal：直接入栈
 *  2、single task：只维持一个实例，该实例之上的全部出栈
 *  3、single top：栈顶只维持一个实例
 *  4、single task with params
 *  5、single top with params
 */
const resetHistory = function (path, params) {
  let existInHistory = -1
  if (this.launcherMode != 'normal' && this.history.length > 0) {
    for (let i=this.history.length-1; i>=0; i--) {
      if (path == this.history[i][1] && (!this.compareParam || (this.compareParam && (!params && !this.history[i][2] || equal(params, this.history[i][2]))))) {
        existInHistory = i
        break
      }
      if (this.launcherMode === 'singleTop') {
        break
      }
    }
  }
  if (existInHistory < 0) {
    this.rid++
    let historyId = this.rid + '_' + (+new Date)
    this.history.push([historyId, path, params && Object.keys(params).length > 0 ? params : null])
  } else {
    this.finishedHistoryIds.push('_')
    this.history = this.history.slice(0, existInHistory + 1)
    let currentEndRoute = this.currentRoute.slice(-1)[0]
    this.history.slice(-1)[0].push({reuse: currentEndRoute && currentEndRoute[1].meta && currentEndRoute[1].meta.reuse})
  }
  if (this.history.length > this.maxHistorySize) {
    this.finishedHistoryIds.push('_')
    this.history = this.history.slice(0-this.maxHistorySize)
  }
}

const getChangeDirection = function (changedPageViewIndex) {
  if (!this.preRoute || this.preRoute.length < 1) {
    return null
  }
  let prePath = this.preRoute[changedPageViewIndex][1].path
  let currentPath = this.currentRoute[changedPageViewIndex][1].path
  let preIndex = 0, currentIndex = 0
  let parents
  if (changedPageViewIndex < 1) {
    parents = this.routers
  } else {
    parents = this.preRoute[changedPageViewIndex-1][1].children
  }
  parents.map(function(r, i) {
    if (r.path == prePath) {
      preIndex = i
    }
    if (r.path == currentPath) {
      currentIndex = i
    }
  })
  if (preIndex > currentIndex) {
    return 'right'
  }
  return null
}

const replaceState = function (path, params) {
  if (!path && this.history.length > 0) {
    let lastHistory = this.history.slice(-1)[0]
    path = lastHistory[1]
    params = lastHistory[2]
  }
  let query = url.encodeQuery(params)
  if (query) {
    path += '?' + query
  }
  if (path) {
    let startChar = this.routeMode == 'html5' ? '/' : '#'
    if (path.indexOf(startChar) !== 0) {
      path = startChar + path
    }
    window.history.replaceState(null, null, path);
  }
}

VueRoute.prototype._pageViewLoadFinished = function () {
  doReady.call(this)
}

const doReady = function () {
  if (this.isReady) {
    return
  }
  this.isReady = true
  setTimeout(() => {
    this.readyCbs && this.readyCbs()
  }, 0)
}

const doPageChange = function (path, params, forward) {
  if (this.beforeEnter) {
    // TODO 是否需要拦截
    this.beforeEnter(this.currentRoute, this.params, forward)
  }
  replaceState.call(this, path, params)
  let changedPageViewIndex = routeChangeAt(this.currentRoute, this.preRoute)
  if (this.__pageViews.length > changedPageViewIndex) {
    this.changedPageViewIndex = changedPageViewIndex
    this.__pageViews[changedPageViewIndex].doPageChange(this.history[this.history.length - 1][0], getChangeDirection.call(this, changedPageViewIndex))
  }
  doReady.call(this)
  this.onPageChange = false
  processFinishedHistory.call(this)
}

const beforeEachCallback = function (path, params, matched, forward, started) {
  this.preRoute = this.currentRoute
  this.currentRoute = []
  let promises = []
  let asyncComponentIndexs = []
  for (let i=0; i<matched.length; i++) {
    if (!matched[i][1].ctor) {
      let ctype = typeof matched[i][1].component
      if (ctype === 'function') {
        let p = new matched[i][1].component()
        promises.push(p)
        asyncComponentIndexs.push(i)
      } else if (ctype === 'object') {
        matched[i][1].ctor = matched[i][1].component
      }
    }
    this.currentRoute.push(matched[i])
  }
  if (this.paramsInjector) {
    params = this.paramsInjector(params, forward)
  }
  if (forward && started || this.history.length < 1) {
    resetHistory.call(this, path, params)
  }
  params = this.history.slice(-1)[0][2]
  this.params = params
  if (promises.length < 1) {
    doPageChange.call(this, path, params, forward)
  } else {
    Promise.all(promises).then((ctors) => {
      ctors = [].concat(ctors)
      for (let i=0; i<ctors.length; i++) {
        if (ctors[i].__esModule && ctors[i].default) {
          matched[asyncComponentIndexs[i]][1].ctor = ctors[i].default
        } else {
          matched[asyncComponentIndexs[i]][1].ctor = ctors[i]
        }
      }
      doPageChange.call(this, path, params, forward)
    }, () => {
      this.onPageChange = false
      processFinishedHistory.call(this)
    })
  }
}

export default VueRoute
VueRoute.install = install
