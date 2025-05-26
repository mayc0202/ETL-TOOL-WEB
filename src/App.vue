<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 全局样式  */

/* 浮动 */
.flex {
  display: flex;
}

/* 换行 */
.wrap {
  flex-wrap: wrap;
}

/* 均匀分配 */
.around {
  justify-content: space-around;
}

/* 两边分配 */
.between {
  justify-content: space-between;
}

/* 底部 */
.footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 底部悬浮 */
.fiex_bottom {
  display: flex;
  position: fixed;
  z-index: 999;
  border: none;
  bottom: -0.1%;
  width: 75%;
  height: 64rpx;
  padding: 30rpx 100rpx 60rpx 100rpx;
  background-color: white;
}

/* 按钮样式 */
.hand {
  cursor: pointer;
}

/* input样式统一 */
.input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #b3b3b3;
  font-size: 14px;
}
.input::-moz-placeholder { /* Firefox 19+ */
  color: #b3b3b3;
  opacity: 1;
}
.input:-ms-input-placeholder { /* IE 10+ */
  color: #b3b3b3;
}
.input:-moz-placeholder { /* Firefox 18- */
  color: #b3b3b3;
  opacity: 1;
}
.input::placeholder {
  color: #b3b3b3;
  font-size: 14px;
}
</style>
