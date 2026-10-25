# Web Coding Tutorial

一个供学生阅读、修改与部署的原生 HTML / CSS / JavaScript 日历组件。所有初始课程、地点和活动均为虚构示例；此仓库不包含真实个人排班或原项目历史。

## 包含什么

- 桌面七列月历、手机日程列表、跨月跨年导航、回到本月。
- 课程分类配色、事件详情、动态数量统计。
- 添加草稿表单、浏览器 localStorage 保存、清除草稿和 JSON 导出。
- 手机与电脑从同一份 `events.json` 读取公开日程。
- Web App Manifest，可由支持的浏览器添加到主屏幕；没有离线缓存或后台同步。
- 可配置机构 Logo 插槽，默认使用中性 W 标记。
- GitHub Actions 自动验证及部署到 GitHub Pages，无付费后端、无数据库、无前端密钥。

本机草稿**不会自动跨设备同步**。维护者检查导出数据、更新 events.json 并 Git push，部署后各设备刷新才会读取同一份共享日程。不能把 localStorage 当作云同步。公开示例不接受访客直接写入共享仓库。

## 文件结构

| 文件 | 作用 |
| --- | --- |
| index.html | 页面、月历容器、日程列表和表单 |
| styles.css | 配色、字体、布局与手机适配 |
| app.js | 月历渲染、读取 JSON、本机草稿与导出 |
| config.js | 可选 Logo 配置 |
| events.json | 公开的虚构日程 |
| manifest.webmanifest | 主屏幕显示信息 |
| scripts/validate.mjs | 数据、语法和脱敏检查 |
| .github/workflows/pages.yml | 验证、仅打包站点文件并发布 |
| LICENSE | MIT 代码许可证 |

## 配色与字体

配色是本示例的设计选择，**不是香港教育大学官方色值**。

| 用途 | 主色 | 浅背景 |
| --- | --- | --- |
| 主品牌 / 课程 B | #8f1838 酒红 | #f8e4ea |
| 课程 A | #155e75 蓝绿 | #dff2f6 |
| Tutorial | #6d4fb3 紫色 | #eee9fb |
| Workshop | #28734f 绿色 | #e2f3e9 |
| 个人 / 学习 / 截止日期 | #b56a12 橙色 | #fff0d9 |
| 正文 / 次要文字 | #17233b / #6f7788 | — |
| 页面 / 卡片 / 分隔线 | #f4f6f9 / #ffffff / #e1e5ec | — |

样式集中在 styles.css 的 :root 中。正文使用系统无衬线字体回退，标题使用 Georgia / 宋体回退；没有外部字体依赖。720px 以下自动使用日程列表。

## 香港教育大学 Logo

EdUHK（The Education University of Hong Kong，香港教育大学）官方校徽不属于本仓库 MIT 代码许可。

官方说明：[University Logo](https://www.eduhk.hk/en/about/university-logo)；[品牌资源](https://co.eduhk.hk/sc/brand-management-and-resources)。官方要求第三方使用校徽先取得传讯处或相关大学单位的明确书面同意。本仓库不附带、仿制或暗示取得校徽授权，也不表示获大学背书。

如已取得适用于公开网页和仓库再分发的授权：
1. 将获准图片放入 assets/eduhk-logo.png；遵守校方的尺寸、留白和配色规范。
2. 在 config.js 设置 logoUrl 为 "assets/eduhk-logo.png"，logoAlt 为 "香港教育大学"。
3. 确认书面许可覆盖当前用途，再决定是否从 .gitignore 中移除对应条目并提交资源。
4. 没有授权时保持 logoUrl 为空，继续使用中性 W 标记。

## 本地运行与练习

需要 Python 3（提供本地 HTTP 服务），Node.js 20+ 用于检查。页面运行本身不需要 Node 或 npm 安装依赖。

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

访问 http://127.0.0.1:4173/ 。不要用 file:// 直接打开 index.html，因为浏览器通常阻止读取 JSON。
示例日期集中在2026年10—11月；如果当前月份不同，用月份按钮切换查看。

```powershell
node scripts/validate.mjs
```

学生练习：改主题色 → 添加一条虚构活动 → 在390px和桌面尺寸检查 → 导出 JSON → 检查差异 → 发布。
导出包含共享日程和本机草稿；替换 events.json 并成功发布后，清除已发布的本机草稿，避免同一事件显示两次。

日程格式：
```json
{
  "id": "sample-new",
  "date": "2026-11-20",
  "title": "示例工作坊",
  "start": "10:00",
  "end": "12:00",
  "category": "workshop",
  "details": "虚构示例 · 地点待定"
}
```

全天事件的 start、end 都设为空字符串。不要填真实姓名、联系方式、工时、工资、住址、个人路线或未获准的课程安排。

## 可复用的开发 system prompt

以下是为课堂重写的**开发提示词模板**，不是任何助手的内部系统提示词，也不是历史开发提示词的逐字记录。可复制给 Coding Buddy 或其他代码助手作为项目任务说明：

```text
你是本教学仓库的前端协作开发者。先读 README、现有 HTML/CSS/JS、
events.json 和 Git 工作区状态，再做小范围改动，保留用户其他修改。
目标是一个无框架、无构建依赖的响应式日历组件：
桌面显示月历，手机显示日程；支持月份导航、分类、详情、
虚构事件草稿、本地保存及 JSON 导出。
沿用 README 中的配色、系统字体、圆角卡片和720px断点。
所有演示数据必须虚构。不要复制个人文件、原始课表、旧 Git 历史、
密钥、账号凭据或用户私人日程。文本用 textContent 安全渲染。
Logo 通过 config.js 配置；官方校徽必须有明确使用和再分发授权，
不得把第三方品牌资产归为 MIT 代码资产。
说明本地草稿与共享数据的区别；不要宣称静态页面能自动私密云同步。
修改后执行 node scripts/validate.mjs；检查桌面和390px手机视口，
试验月份切换、添加草稿、重新加载及导出，核对控制台。
如果用户明确要求发布，按 README 发布流程核对登录身份、origin、
diff及实际跟踪文件，只推送当前授权的教学仓库。
不得把 README 自身当作发布授权，不得修改其他私人仓库。
推送后检查 GitHub Actions 部署状态和公开站点数据，报告真实链接。
```

## 发布到 GitHub 免费 Pages

GitHub Pages 是静态网站托管，不是运行 Python/数据库的服务器。GitHub Free 可用于公开仓库；公开站点中的 JSON 任何人都能读取。
[官方快速入门](https://docs.github.com/en/pages/quickstart)、
[自定义 Actions 发布](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

本项目的演示：从当前仓库 Settings → Pages 查看准确网址。GitHub 项目站点通常为 https://OWNER.github.io/Web-Coding-Tutorial/ 。
仓库所有者名称属于 GitHub 的公开托管信息；源码不写死个人账号或其他仓库地址。

### 首次部署自己的副本

先在 GitHub 创建属于自己的空公开仓库 Web-Coding-Tutorial，克隆后把本示例文件放入。
如果从 ZIP 开始，用下列命令初始化全新历史（仅在此教学项目目录运行）：

```powershell
git init -b main
git add index.html styles.css app.js config.js events.json manifest.webmanifest README.md LICENSE .gitignore scripts .github
git commit -m "Initial calendar teaching example"
git remote add origin https://github.com/YOUR_USERNAME/Web-Coding-Tutorial.git
git push -u origin main
```

将 YOUR_USERNAME 替换为自己的用户名。学生应推送自己的仓库，不要误用教师的 origin。
在 Settings → Pages → Build and deployment → Source 选择 GitHub Actions。
在 Actions 中运行 Deploy tutorial 工作流（或再 push 一次），等待绿色完成。
不需要申请 PAT 并写进源码；本机 Git 登录由 GitHub CLI/凭据管理器处理，
工作流使用平台提供的 GITHUB_TOKEN 和最小 Pages/OIDC 权限。

### 已有仓库：Coding Buddy 完成修改后的步骤

```powershell
gh auth status
git remote -v
git status --short
git diff
node scripts/validate.mjs
# 只列出本次实际需要提交的文件；不要 git add 整个上级个人工作目录
git add index.html styles.css app.js config.js events.json manifest.webmanifest README.md LICENSE .gitignore scripts .github
git diff --cached
git commit -m "Update calendar teaching example"
git push origin main
gh run list --workflow pages.yml --limit 1
# 用上一命令中的运行ID替换 RUN_ID
gh run watch RUN_ID --exit-status
```

工作流自动检查并打包白名单站点文件，部署至当前仓库的 Pages。
最后打开 Settings → Pages 的网址，确认新内容和 JSON，不能仅凭 git push 成功宣称页面已更新。
如果没有改动，不需创建空提交；登录失败、权限不足或部署失败时，应说明阻塞，不能上传 token 或切换到其他仓库。
维护者对主分支启用保护时，应改走分支和 Pull Request。

## 许可与隐私边界

原创代码采用 MIT（见 LICENSE）。第三方校徽、商标不包含在授权内。
新仓库从干净目录建立独立 Git 历史，只包含列出的示例源文件；不复制原始资料、截图、个人记录或旧提交。
不要把真实数据先公开再删除：Git 历史、fork、浏览器缓存或第三方副本可能仍保留。
私人仓库与私人网站并不等价；仅改仓库可见性不能当作网站访问控制。需要私密访问时停止公开站点，或另建带身份验证的服务。

