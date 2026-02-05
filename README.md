# Tetris 俄罗斯方块

一个现代化的俄罗斯方块游戏，使用 React + TypeScript + Vite + Tailwind CSS 构建。

## 功能特性

- **完整游戏机制**: 7种经典方块 (I, O, T, S, Z, J, L)
- **超级旋转系统 (SRS)**: 支持踢墙的旋转机制
- **合成音效**: 使用 Web Audio API 生成游戏音效
- **响应式设计**: 支持桌面和移动设备
- **触控操作**: 移动端触摸按钮控制
- **分数系统**: 等级提升、高分记录、本地存储
- **现代 UI**: 深色主题配霓虹光效

## 控制方式

### 键盘 (桌面端)
- **← →**: 左右移动
- **↓**: 加速下落
- **↑**: 旋转
- **空格**: 硬降 (直接落到底)
- **P**: 暂停/继续
- **Enter**: 开始游戏

### 触摸 (移动端)
- **方向按钮**: 移动和旋转
- **下落按钮**: 硬降
- **开始/暂停按钮**: 游戏控制

## 安装与运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Web Audio API

## 在线游玩

游戏已部署到 Vercel，点击下方链接开始游戏：

[开始游戏 →](https://your-vercel-url.vercel.app)

## 游戏截图

![游戏界面](screenshot.png)

## License

MIT