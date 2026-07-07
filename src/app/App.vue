<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { logger } from '@/logging'

const appStore = useAppStore()

onMounted(() => {
  appStore.init()
  logger.info('App', '应用组件已挂载')
})
</script>

<template>
  <div id="apex-screen" class="app-container">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
