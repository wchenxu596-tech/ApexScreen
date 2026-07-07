<script setup lang="ts">
defineOptions({ name: 'NotFoundView' })
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面未找到</p>
    <router-link to="/" class="back-link">返回大屏</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: rgb(255, 255, 255, 60%);
  gap: 16px;
}

.not-found h1 {
  font-size: 72px;
  color: rgb(255, 255, 255, 15%);
  margin: 0;
}

.back-link {
  color: #60a5fa;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
