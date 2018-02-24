## 背景
由于浏览器的history接口简单，无法支持历史页面的动态移除。在涉及到编辑页面的产品中，导航后退的体验不友好。

## 功能
vue-page-manage参考Android的Activity Manage，提供了一套灵活的页面管理功能。

### 特性
  - 基于vue的transition提供页面切换的过渡动画
  - 提供类似Android的启动模式配置：normal | singleTop | singleTask
  - 对history做了cache处理，页面刷新时，保留了页面堆栈信息

### 接口
  - goto
  - finish

### 生命周期
  - onCreate
  - onResume
  - onStop
