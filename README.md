# 未完成的图鉴

四幕桌面档案叙事 demo。纯 HTML、CSS 和 JavaScript，无需构建或后端。

## 试玩

**单文件离线版：**双击 `未完成的图鉴_离线版.html`，用 Chrome、Edge 或 Safari 打开。图片、字体、样式、剧情代码与字体许可证全部内置，无需网络、服务器或旁边的文件夹。也可以单独复制这个文件到另一台电脑试玩。进度按浏览器和文件位置保存；移动文件后可能需要重新开始。

重新生成单文件：`python3 build_offline.py`。

直接用浏览器打开 `dist/index.html`，或在本目录运行 `python3 -m http.server 4173 --directory dist`，访问 `http://localhost:4173`。

全部操作为点击：选择文书、点击两处虚线文字核对、选择条目并盖章。没有拖拽、倒计时和连续动画。音效默认关闭，右上角可开启。

进度保存在当前浏览器的 localStorage；在浏览器隐私设置不允许存储时，游戏仍能进行，但不能持久保存。目录中可重新开始。

## 四幕

1. 加工完成，待交：分清用途和确认范围。
2. 照片里没有等待：核对日期，保留不同经历，处理公开范围。
3. 收到，不等于明白：区分送达、理解和最终结果。
4. 请留下一个入口：选择三页入口与首页，试读后发布。

所有工单、日期、地址与角色均为虚构关卡内容，不代表真实工业规范。历史片段只重构档案支持的内容，不修改历史。

## 素材

`dist/assets/portraits.png` 为六位人物的 3 × 2 图集，使用提供的《请出示证件》截图作为风格参考重新生成。`photos.png` 为三张文书插图，`room.png` 用于开始页。全部由内置 image_gen 工具生成；工具未暴露模型选择，因此不将它们标为 gpt-image-2.5 生成。

完整提示词见 `ASSET_PROMPTS.md`。人物通过 CSS 定位图集，不需要裁切，也没有立绘动画。

## 文件

界面使用本地 Fusion Pixel 12px 简体中文像素字体，来源为 https://github.com/TakWolf/fusion-pixel-font 。字体许可证随文件保存在 `dist/assets/fonts/LICENSE-OFL`。文书纸张为新增生成素材 `dist/assets/paper-aged.png`；像素切角标签和边框由 CSS 绘制。

- `dist/index.html`：入口。
- `dist/style.css`：响应式静态平面界面。
- `dist/pixel-ui.css`：像素标签、纸张底图与中文像素字体。
- `dist/game.js`：剧情、证据规则、盖章、存档、结局。
- `tests/playthrough.cjs`：浏览器完整流程验证。脚本中 Playwright 路径为当前开发环境的依赖路径；其他环境可改为本地安装的 `playwright`。

## 验证

启动本地静态服务后运行 `node tests/playthrough.cjs`。覆盖四幕主线、错误处理、隐私遮蔽、保存恢复、三个首页试读分支、发布结尾和窄屏布局。
