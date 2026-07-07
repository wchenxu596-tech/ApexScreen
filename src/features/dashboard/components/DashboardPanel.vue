<script setup lang="ts">
/**
 * DashboardPanel — 大屏面板容器
 * 提供统一的标题、加载态、错误态、暗色主题背景
 */

defineOptions({ name: 'DashboardPanel' })

const props = withDefaults(
  defineProps<{
    title: string
    loading?: boolean
    span?: number
    height?: number
  }>(),
  {
    loading: false,
    span: 4,
    height: 300,
  },
)
</script>

<template>
  <div
    class="dashboard-panel"
    :style="{
      gridColumn: `span ${span}`,
      minHeight: `${height}px`,
    }"
  >
    <!-- 标题栏 -->
    <div class="panel-header">
      <span class="panel-title">{{ title }}</span>
      <slot name="header-extra" />
    </div>

    <!-- 内容区 -->
    <div class="panel-body">
      <div v-if="loading" class="panel-loading">
        <div class="loading-spinner" />
        <span>加载中...</span>
      </div>
      <slot v-else />
    </div>
  </div>
</template>

<style scoped>
.dashboard-panel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 1px;
}

.panel-body {
  flex: 1;
  padding: 16px 20px;
  position: relative;
}

.panel-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
