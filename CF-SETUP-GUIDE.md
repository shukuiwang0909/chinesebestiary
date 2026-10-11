# Cloudflare 配置完整流程（手把手版）

> 总时长：15–20 分钟。全程浏览器操作，只有部署一步用命令行。

---

## 阶段 A：把域名接入 Cloudflare（DNS 托管）

### A1. Cloudflare 添加站点

1. 打开 https://dash.cloudflare.com → 登录（没有就注册，免费）
2. 首页点 **"Add a site" / 添加站点**
3. 输入 `chinesebestiary.com` → 点 **"Continue"**
4. 选择套餐：**Free**（$0）→ 点 **"Continue"**
5. Cloudflare 会扫描现有 DNS 记录（刚注册的域名基本没有，不用管）
6. **关键一步**：Cloudflare 分配给你两个 NS 服务器，长这样：
   ```
   lara.ns.cloudflare.com
   greg.ns.cloudflare.com
   ```
   ⚠️ **把这两个记下来，每台电脑分配的不一样，以你页面显示的为准**

### A2. Spaceship 改 NS

1. 打开 https://spaceship.com → 登录
2. 顶部菜单 **"Domains"** → 点 `chinesebestiary.com`
3. 左侧菜单找 **"Nameservers" / "DNS & Nameservers"**
4. 选择 **"Custom nameservers"**（自定义），删掉 Spaceship 默认的两条
5. 填入 Cloudflare 刚才分配的两个 NS（例：`lara.ns.cloudflare.com`、`greg.ns.cloudflare.com`）
6. **保存**

### A3. 等生效

- 回到 Cloudflare 站点页面，状态会从 **"Pending nameserver update"** 变成 **"Active"**
- 通常 5 分钟–2 小时，偶尔 24 小时
- 不用干等，直接进入阶段 B，Pages 部署不依赖 NS

---

## 阶段 B：部署站点到 Cloudflare Pages

### B1. 本机登录 Wrangler（一次性）

```bash
cd ~/shanhaijing-bestiary/site
npx wrangler login
```

- 终端会弹出一个授权链接 → 浏览器打开 → 点 **"Allow"** 授权
- 终端显示 `Successfully logged in` 即完成

### B2. 首次部署

```bash
npm run deploy
```

这一条命令自动完成：构建 → Pagefind 索引 → 创建 Pages 项目 → 部署上线。

完成后终端会显示访问地址，形如：
```
https://chinesebestiary.pages.dev
```

**先打开这个 pages.dev 地址确认站点正常**。

### B3.（可选）指定项目名

如果 wrangler 自动生成的项目名不满意，可以用：

```bash
npx wrangler pages project create chinesebestiary --production-branch=main
npm run deploy
```

---

## 阶段 C：绑定自定义域名

1. Cloudflare Dashboard → 左侧 **"Workers & Pages"**
2. 点你的项目 `chinesebestiary`
3. 顶部标签 **"Custom domains"** → 点 **"Set up a custom domain"**
4. 输入 `chinesebestiary.com` → 点 **"Continue"** → **"Activate domain"**
5. 因为 NS 已在 Cloudflare，验证和 SSL 全自动，**1–5 分钟内生效**
6. 同时再加一个 `www.chinesebestiary.com`（可选，做 301 跳转）

### 验证生效

```bash
curl -sI https://chinesebestiary.com | head -5
# 看到 HTTP/2 200 + cf-ray 头就是 Cloudflare 在服务了
```

---

## 阶段 D：上线后检查清单

| 检查项 | 方法 |
|---|---|
| HTTPS 正常 | 浏览器访问，锁标志无警告 |
| 词条页可访问 | https://chinesebestiary.com/creatures/nine-tailed-fox/ |
| 站内搜索可用 | 首页搜索框输入 "fox" 有结果 |
| JSON-LD 生效 | 词条页查看源代码，搜 `application/ld+json` |
| Google 收录 | 去 https://search.google.com/search-console 添加站点（用 Cloudflare 验证一键通过） |

### Search Console 接入（重要，第一天就做）

1. https://search.google.com/search-console → 登录 Google 账号
2. **"添加资源"** → 选 **"网址前缀"** → 输入 `https://chinesebestiary.com`
3. 验证方式选 **"Cloudflare"** → 一键授权验证（因为 NS 已在 Cloudflare，秒过）
4. 提交 sitemap：`https://chinesebestiary.com/sitemap-index.xml`（Astro 自动生成）

---

## 常见问题

**Q：NS 改了但 Cloudflare 一直 Pending？**
- 检查 Spaceship 里 NS 是否保存成功（有时要删掉旧的才能加新的）
- 用 `dig +short chinesebestiary.com NS` 验证全球生效情况，等即可

**Q：部署成功但自定义域名 522/525 错误？**
- 等 5 分钟再试，SSL 证书签发需要时间

**Q：pages.dev 能访问但自定义域名不行？**
- 阶段 C 的 Custom domain 没配对，回 Dashboard 检查

**Q：后续更新怎么部署？**
```bash
npm run deploy
# 就这一条，1 分钟上线
```
