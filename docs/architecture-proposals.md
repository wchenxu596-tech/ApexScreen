# 🏗️ 巅峰数据大屏 — 技术架构方案选型

> 最后更新: 2026-07-07

---

## 一、项目需求全景

| 维度 | 要求 |
|------|------|
| **形态** | 纯前端 SPA，数据大屏展示 |
| **数据** | 前期 Mock，后期无缝切换真实 API |
| **测试** | 单元测试 + 组件测试 + E2E 测试 |
| **日志** | 前端日志收集、分级、可扩展 |
| **代码质量** | Lint + 格式化 + 提交规范 + 自动化检查 |
| **模块化** | 严禁单文件堆叠，组件/服务/工具严格分离 |

---

## 二、方案对比总览

| 维度 | 方案一：React 分层领域架构 | 方案二：Vue 3 特性模块架构 | 方案三：React 插件化微内核架构 |
|------|--------------------------|--------------------------|----------------------------|
| **核心理念** | 严格分层、关注点分离 | 按业务特性自治、内聚优先 | 内核稳定、功能即插件 |
| **复杂度** | ⭐⭐⭐ 中等 | ⭐⭐ 较低 | ⭐⭐⭐⭐ 较高 |
| **上手难度** | 中等 | 较低 | 较高 |
| **扩展性** | 良好 | 良好 | 优秀 |
| **适合团队规模** | 3-8 人 | 1-5 人 | 5-15 人 |
| **适合场景** | 中大型标准化项目 | 快速迭代、中小项目 | 多产品线、高度可扩展 |

---

## 三、方案一：React + 分层领域架构 (Layered Domain Architecture)

### 3.1 技术栈

```
┌─ 框架: React 18 + TypeScript + Vite
├─ 状态管理: Zustand（轻量）+ React Query（服务端状态）
├─ 样式: Tailwind CSS + CSS Modules
├─ 可视化: ECharts + D3.js（工具函数层）
├─ 路由: React Router v6
├─ 构建: Vite 5
```

### 3.2 架构分层

```
src/
├── app/                        # 应用入口
│   ├── App.tsx                 # 根组件
│   ├── router.tsx              # 路由配置
│   └── providers.tsx            # 全局 Provider 组合
│
├── layers/                     # ▸ 核心分层 ◂
│   ├── presentation/           # ─── 展示层 ───
│   │   ├── components/         #     通用UI组件（Button, Card, Modal...）
│   │   ├── layouts/            #     布局组件（Header, Sidebar, Grid...）
│   │   └── widgets/            #     大屏部件（ChartWidget, MapWidget...）
│   │
│   ├── application/            # ─── 应用层 ───
│   │   ├── hooks/              #     业务 Hooks（useDashboardData, useRealtime...）
│   │   ├── stores/             #     Zustand stores（dashboardStore, themeStore...）
│   │   └── contexts/           #     React Contexts
│   │
│   ├── domain/                 # ─── 领域层 ───
│   │   ├── models/             #     数据模型 & 类型定义
│   │   ├── services/           #     领域服务（数据聚合、计算、格式化）
│   │   └── ports/              #     端口定义（接口抽象，依赖倒置）
│   │
│   └── infrastructure/         # ─── 基础设施层 ───
│       ├── api/                #     API 客户端（适配器模式）
│       │   ├── adapters/       #         MockAdapter, ApiAdapter
│       │   ├── client.ts       #         统一请求客户端（Axios/fetch）
│       │   └── endpoints.ts    #         API 端点配置
│       │
│       ├── mock/               #     Mock 数据系统
│       │   ├── data/           #         Mock 数据集
│       │   ├── handlers/       #         MSW handlers
│       │   └── generators/     #         数据生成器（faker.js）
│       │
│       ├── logging/            #     📋 日志系统
│       │   ├── logger.ts       #         日志核心（分级、格式化）
│       │   ├── transports/     #         输出通道（Console, Remote, File）
│       │   ├── middleware/     #         日志中间件（性能、错误追踪）
│       │   └── config.ts       #         日志配置
│       │
│       └── theme/              #     主题系统
│           ├── tokens.ts       #         设计令牌
│           └── utils.ts        #         主题工具
│
├── features/                   # ▸ 业务特性模块 ◂
│   ├── dashboard/              #     ── 大屏首页 ──
│   │   ├── components/         #         特性内组件
│   │   ├── hooks/              #         特性内 Hooks
│   │   └── index.ts            #         对外暴露
│   │
│   └── data-center/            #     ── 数据中心 ──
│       ├── components/
│       ├── hooks/
│       └── index.ts
│
├── shared/                     # ▸ 共享工具层 ◂
│   ├── utils/                  #     通用工具函数
│   ├── constants/              #     全局常量
│   └── types/                  #     全局类型
│
├── testing/                    # ▸ 测试系统 ◂
│   ├── setup.ts                #     测试环境配置
│   ├── mocks/                  #     测试用 Mock
│   ├── helpers/                #     测试辅助函数
│   └── fixtures/               #     测试固定数据
│
├── config/                     # ▸ 项目配置 ◂
│   ├── env.ts                  #     环境变量管理
│   └── app.config.ts           #     应用配置
│
├── quality/                    # ▸ ⚡ 代码质量系统 ◂
│   ├── eslint.config.js        #     ESLint 配置
│   ├── .prettierrc              #     Prettier 配置
│   ├── commitlint.config.js    #     提交规范
│   └── .husky/                 #     Git hooks
│
└── main.tsx                    # 应用启动入口
```

### 3.3 数据流（Mock ↔ API 切换）

```
[组件] → [useDashboardData hook]
              ↓
         [DashboardService] (领域服务)
              ↓
         [DataPort] (端口抽象)
           ↙         ↘
    [MockAdapter]  [ApiAdapter]
         ↓              ↓
    mock/data/     axios/fetch
```

**切换方式**：通过环境变量或运行时配置，一行代码切换数据源：

```typescript
// config/env.ts
export const dataSource = import.meta.env.VITE_DATA_SOURCE === 'api'
  ? new ApiAdapter()
  : new MockAdapter();
```

### 3.4 测试系统

```
testing/
├── unit/                  # Vitest — 纯函数 & 工具测试
│   └── services/          #   领域服务测试
├── component/             # Vitest + RTL — 组件测试
│   └── __tests__/         #   .test.tsx 跟随组件
├── e2e/                   # Playwright — 端到端测试
│   ├── specs/             #   测试用例
│   ├── fixtures/          #   测试固定数据
│   └── auth.setup.ts      #   鉴权配置
└── coverage/              # 覆盖率报告输出
```

| 层级 | 工具 | 覆盖目标 | 覆盖率目标 |
|------|------|---------|-----------|
| 单元测试 | Vitest | utils、services、models | ≥ 90% |
| 组件测试 | RTL | 组件渲染、交互 | ≥ 80% |
| E2E 测试 | Playwright | 核心用户流程 | 关键路径覆盖 |

### 3.5 日志系统设计

```typescript
// infrastructure/logging/logger.ts

enum LogLevel { DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3 }

interface LogEntry {
  level: LogLevel;
  message: string;
  module: string;        // 来源模块
  timestamp: string;
  context?: Record<string, unknown>;  // 上下文数据
  traceId?: string;      // 链路追踪 ID
}

// 使用示例
logger.info('Dashboard', '数据加载完成', { widgetCount: 12, duration: 320 });
logger.error('API', '请求失败', { endpoint: '/api/xxx', status: 500 });
```

**日志输出通道**：
- **ConsoleTransport** — 开发环境，彩色格式化
- **RemoteTransport** — 生产环境，上报远端日志服务
- **FileTransport** — 数据大屏本地持久化（可选）

### 3.6 代码质量系统

```
前置检查 ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
                                    │
[git commit] → [husky] → [lint-staged]
                            │
                    ├─ eslint --fix     ← 代码规范
                    ├─ prettier --write ← 代码格式化
                    └─ vitest related  ← 关联测试
                            │
                            ↓
                      [commit-msg] → commitlint ← 提交信息规范
                            │
                            ↓
                   成功提交 ✅ → CI 阶段运行全量检查
```

### 3.7 优劣分析

**优势** ✅
- 分层清晰，职责边界明确
- 适配器模式天然支持 Mock/API 切换
- 测试隔离性好，每层可独立测试
- 团队协作时冲突少，各层职责清晰

**劣势** ❌
- 分层增加了文件跳转成本
- 小型变更需要跨多层修改
- 对团队成员的分层意识要求较高

---

## 四、方案二：Vue 3 + 特性模块架构 (Feature-based Architecture)

### 4.1 技术栈

```
┌─ 框架: Vue 3 + TypeScript + Vite
├─ 状态管理: Pinia
├─ 样式: UnoCSS + Scoped CSS
├─ 可视化: ECharts + Vue-ECharts
├─ 路由: Vue Router 4
├─ 构建: Vite 5
```

### 4.2 架构结构

```
src/
├── app/                       # 应用入口
│   ├── App.vue
│   ├── router/
│   └── providers.ts
│
├── features/                  # ▸ 每个目录是一个完整特性 ◂
│   ├── dashboard/             # ── 大屏展示特性 ──
│   │   ├── components/        #     特性组件
│   │   ├── composables/       #     组合式函数 (Vue 3 hooks)
│   │   ├── stores/            #     Pinia Store
│   │   ├── services/          #     特性服务
│   │   ├── types.ts           #     特性类型
│   │   ├── __tests__/         #     特性测试
│   │   └── index.ts           #     特性入口（导出公开 API）
│   │
│   ├── data-source/           # ── 数据源管理特性 ──
│   │   ├── components/
│   │   ├── composables/
│   │   ├── stores/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── realtime/              # ── 实时数据特性 ──
│   │   └── ...
│   │
│   └── settings/              # ── 设置特性 ──
│       └── ...
│
├── shared/                    # ▸ 共享基础设施 ◂
│   ├── ui/                    #     基础 UI 组件库
│   │   ├── ApexButton/
│   │   ├── ApexCard/
│   │   ├── DataChart/
│   │   └── ...
│   │
│   ├── utils/                 #     通用工具
│   ├── constants/             #     全局常量
│   └── types/                 #     全局类型
│
├── data/                      # ▸ 数据适配层 ◂
│   ├── adapters/              #     MockAdapter / ApiAdapter
│   │   ├── BaseAdapter.ts
│   │   ├── MockAdapter.ts
│   │   └── ApiAdapter.ts
│   │
│   ├── mock/                  #     Mock 数据
│   │   ├── dashboard/
│   │   └── realtime/
│   │
│   └── client/                #     请求客户端
│       ├── http.ts
│       └── websocket.ts
│
├── logging/                   # ▸ 📋 日志系统 ◂
│   ├── logger.ts
│   ├── plugins/               #     日志插件（可扩展）
│   └── monitors/              #     性能 & 错误监控
│
├── testing/                   # ▸ 测试系统 ◂
│   ├── setup.ts
│   └── __mocks__/
│
└── config/                    # ▸ 配置 ◂
    ├── env.ts
    └── app.config.ts
```

### 4.3 数据流（组合式 API 风格）

```typescript
// features/dashboard/composables/useDashboardData.ts

import { ref, onMounted, onUnmounted } from 'vue';
import { useDataAdapter } from '@/data/adapters/useDataAdapter';

export function useDashboardData(dashboardId: string) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const adapter = useDataAdapter();  // 自动返回 Mock 或 Api

  const fetchData = async () => {
    loading.value = true;
    try {
      data.value = await adapter.getDashboardData(dashboardId);
    } catch (e) {
      error.value = e;
      logger.error('Dashboard', '获取数据失败', { dashboardId, error: e });
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchData);

  // 实时更新
  let interval: ReturnType<typeof setInterval>;
  if (import.meta.env.VITE_REALTIME === 'true') {
    interval = setInterval(fetchData, 5000);
  }
  onUnmounted(() => clearInterval(interval));

  return { data, loading, error, refresh: fetchData };
}
```

### 4.4 测试系统

```
src/features/dashboard/__tests__/
├── composables/           # 测试组合式函数
│   └── useDashboardData.spec.ts
├── components/            # 测试组件
│   └── DashboardWidget.spec.ts
└── services/              # 测试服务
    └── dashboardService.spec.ts
```

**测试配置** — 测试跟随特性，一个特性一个测试目录，高内聚。

### 4.5 代码质量系统

**ESLint + @vue/eslint-config + Prettier + Husky + lint-staged**

```json5
// package.json
{
  "scripts": {
    "lint": "eslint src --fix",
    "format": "prettier --write src",
    "type-check": "vue-tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "prepare": "husky"
  }
}
```

### 4.6 优劣分析

**优势** ✅
- 特性内高内聚，一个功能改一个目录
- Vue 3 Composition API 天然适合逻辑复用
- 学习曲线平缓，开发效率高
- 特性可以独立开发、测试、移除

**劣势** ❌
- 跨特性共享逻辑需要收敛到 shared/
- 特性间可能有循环依赖风险
- 相比 React 生态稍小，部分库选择有限

---

## 五、方案三：React + 插件化微内核架构 (Plugin-based Microkernel)

### 5.1 技术栈

```
┌─ 框架: React 18 + TypeScript + Vite
├─ 状态管理: Zustand + React Query
├─ 样式: Tailwind CSS + CSS Modules
├─ 可视化: ECharts + D3.js
├─ 模块联邦: Module Federation (可选扩展)
├─ 构建: Vite 5 + vite-plugin-federation
```

### 5.2 架构结构

```
src/
├── kernel/                    # ▸ ⚡ 微内核（稳定、精简） ◂
│   ├── core/                  # ── 核心运行时 ──
│   │   ├── AppShell.tsx       #     应用壳
│   │   ├── PluginRegistry.ts  #     插件注册中心
│   │   ├── EventBus.ts        #     事件总线（跨插件通信）
│   │   └── Lifecycle.ts       #     生命周期管理
│   │
│   ├── interfaces/            # ── 插件接口定义 ──
│   │   ├── IPlugin.ts         #     插件接口
│   │   ├── IDataSource.ts     #     数据源接口
│   │   ├── IWidget.ts         #     大屏部件接口
│   │   └── ILogger.ts         #     日志接口
│   │
│   └── services/              # ── 内核服务 ──
│       ├── DataBus.ts         #     数据总线
│       ├── LoggerService.ts   #     日志服务
│       └── ConfigService.ts   #     配置服务
│
├── plugins/                   # ▸ 🔌 插件市场 ◂
│   ├── built-in/              # ── 内置插件 ──
│   │   ├── dashboard/         #     大屏展示插件
│   │   ├── data-source/       #     数据源插件
│   │   ├── realtime/          #     实时更新插件
│   │   └── theme-manager/     #     主题管理插件
│   │
│   └── external/              # ── 外部插件（Module Federation） ──
│       └── README.md          #     预留扩展点
│
├── adapters/                  # ▸ 🔄 适配器层 ◂
│   ├── data/                  # ── 数据适配器 ──
│   │   ├── BaseAdapter.ts
│   │   ├── MockAdapter.ts
│   │   └── ApiAdapter.ts
│   │
│   └── visualization/         # ── 可视化适配器 ──
│       ├── EChartsAdapter.ts
│       └── D3Adapter.ts
│
├── shared/                    # ▸ 共享层 ◂
│   ├── ui/                    #     通用 UI
│   ├── utils/                 #     工具函数
│   └── types/                 #     类型定义
│
├── logging/                   # ▸ 📋 日志系统（内核级服务） ◂
│   ├── LoggerService.ts
│   ├── transports/
│   ├── middleware/
│   └── config.ts
│
├── testing/                   # ▸ 测试系统 ◂
│   ├── kernel/                #     内核测试
│   ├── plugins/               #     插件测试
│   └── e2e/
│
├── quality/                   # ▸ 代码质量 ◂
│   └── ...
│
└── main.tsx
```

### 5.3 插件接口规范

```typescript
// kernel/interfaces/IPlugin.ts

interface IPluginMeta {
  id: string;           // 插件唯一 ID
  name: string;         // 插件名称
  version: string;      // 版本号
  dependencies?: string[]; // 依赖其他插件
}

interface IPlugin {
  meta: IPluginMeta;

  onInstall?(): void;         // 安装时
  onActivate?(): void;        // 激活时
  onDeactivate?(): void;      // 停用时
  onUninstall?(): void;       // 卸载时

  /** 插件提供的 Widget 列表 */
  getWidgets?(): IWidgetDefinition[];
}
```

### 5.4 数据流（事件驱动）

```
     [插件 A 触发]              [数据源插件]
         │                          │
         │   eventBus.emit(         │
         │     'data:request',      │
         │     { dashboardId }      │
         │   )                      │
         └─────────────────────────→│
                                    │
                           DataSourcePlugin
                           ┌──────────────────┐
                           │ MockAdapter?     │
                           │ ApiAdapter?      │
                           └──────┬───────────┘
                                  │ data
                                  ↓
                           eventBus.emit(
                             'data:loaded',
                             { dashboardId, data }
                           )
                                  │
         ←────────────────────────┘
         │
    [插件 A: 收到数据, 渲染 Widget]
```

### 5.5 Mock/API 切换机制

```typescript
// 全局切换 — 通过配置中心
ConfigService.set('data.adapter', 'mock');   // 使用 Mock
ConfigService.set('data.adapter', 'api');    // 使用 API

// 局部切换 — 每个插件可独立指定
const plugin = new DashboardPlugin({
  dataAdapter: new ApiAdapter({
    baseURL: '/api/v2',
    timeout: 10000,
  }),
});
```

### 5.6 测试系统

```
testing/
├── kernel/                  # 内核必须全面测试
│   ├── PluginRegistry.spec.ts
│   ├── EventBus.spec.ts
│   └── Lifecycle.spec.ts
│
├── plugins/                 # 每个插件独立测试
│   ├── dashboard.spec.ts
│   ├── data-source.spec.ts
│   └── realtime.spec.ts
│
└── integration/             # 集成测试 — 插件间交互
    └── dashboard-realtime.spec.ts
```

### 5.7 优劣分析

**优势** ✅
- 内核极其稳定，插件可独立开发、部署
- 扩展性最强，未来可接入第三方插件
- Module Federation 支持微前端拆分
- 适合多产品线复用内核

**劣势** ❌
- 架构复杂度高，初期搭建成本大
- 插件通信依赖事件总线，调试难度增加
- 过度设计风险 — 如果只有 1-2 个大屏，杀鸡用牛刀
- 对团队抽象能力要求最高

---

## 六、三维度综合评价

### 6.1 适合阶段匹配

```
方案一：React 分层架构
   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░  适合：项目起步 → 中期扩展
   推荐指数：⭐⭐⭐⭐⭐

方案二：Vue 3 特性模块
   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  适合：快速原型 → 持续迭代
   推荐指数：⭐⭐⭐⭐

方案三：React 微内核插件
   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  适合：产品成熟期 → 多产品线
   推荐指数：⭐⭐⭐
```

### 6.2 核心需求满足度

| 需求 | 方案一 | 方案二 | 方案三 |
|------|--------|--------|--------|
| Mock/API 无缝切换 | ✅ 适配器模式 | ✅ 适配器模式 | ✅ 适配器+配置中心 |
| 测试系统 | ✅ 分层测试 | ✅ 特性内测试 | ✅ 内核+插件独立测试 |
| 日志系统 | ✅ 独立日志层 | ✅ 可插拔日志 | ✅ 内核级日志服务 |
| 代码质量 | ✅ 完整工具链 | ✅ 完整工具链 | ✅ 完整工具链 |
| 模块化 | ✅ 严格分层 | ✅ 特性高内聚 | ✅ 插件化 |
| 学习成本 | 🟡 中等 | 🟢 低 | 🔴 高 |
| 开发效率 | 🟢 高 | 🟢 高 | 🟡 中 |
| 未来扩展 | 🟡 中 | 🟡 中 | 🟢 强 |

### 6.3 我的推荐 🏆

> **如果你还在犹豫，我推荐方案一（React 分层领域架构）**

**理由**：
1. **React 生态**是大屏可视化领域最成熟的（ECharts、D3 的 React 封装最完善）
2. **分层架构**简单直观，团队成员理解成本低，同时满足模块化要求
3. **适配器模式**是最优雅的 Mock/API 切换方案
4. **从 1 人到多人**都能平滑过渡，不会出现过设计或设计不足
5. **TypeScript + 分层**让代码质量和可维护性有天然保障

---

## 七、三方案共享的核心工程体系

无论选择哪个方案，以下系统是通用的：

### 7.1 质量工具链

| 工具 | 用途 | 阶段 |
|------|------|------|
| **ESLint** | 代码规范检查 + 自动修复 | 开发 & CI |
| **Prettier** | 统一代码风格 | 开发 & CI |
| **Husky** | Git hooks 管理 | 提交前 |
| **lint-staged** | 仅检查暂存文件 | 提交前 |
| **commitlint** | 提交信息规范（Conventional Commits） | 提交前 |
| **CI Pipeline** | 全量检查 + 测试 + 构建 | 推送后 |

### 7.2 日志系统标准

```
logger.debug('模块名', '调试信息', { 上下文 })
logger.info('模块名', '操作记录', { 上下文 })
logger.warn('模块名', '警告信息', { 上下文 })
logger.error('模块名', '错误信息', { 错误对象, 上下文 })
```

所有方案均支持：
- 📦 按模块分级
- 🔗 请求链路追踪 (traceId)
- 📤 多通道输出（控制台 / 远程 / 本地）
- 🚫 生产环境自动降级

### 7.3 Mock → API 切换策略（三方案通用）

```
[阶段一] 纯 Mock 开发
          VITE_DATA_SOURCE=mock → MockAdapter → 本地 fake data

[阶段二] Mock + 部分 API 联调
          VITE_DATA_SOURCE=mixed → 按路由分发 → 部分 Mock / 部分 API

[阶段三] 全量 API
          VITE_DATA_SOURCE=api → ApiAdapter → 真实后端
```

---

*以上方案可根据实际需求灵活组合和调整。*
