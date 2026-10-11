# Cloudflare Pages 部署指南

## 1. 首次本地运行

```bash
cd site
npm install
npm run dev
# → http://localhost:4321
```

## 2. 首次部署到 Cloudflare Pages

```bash
npm install
npx wrangler login          # 授权 Cloudflare 账号
npm run deploy              # 构建 + Pagefind 索引 + 部署
```

部署成功后 Cloudflare 会分配临时域名（如 `chinesebestiary.pages.dev`）。

## 3. 绑定自定义域名

1. Cloudflare Dashboard → Pages → chinesebestiary → Custom domains
2. 添加 `chinesebestiary.com`
3. 因为 NS 已在 Cloudflare，自动验证通过，SSL 自动签发（5 分钟内）

## 4. NS 切换（registrar 留在 Spaceship）

在 Spaceship 后台把 NS 改为：
```
lara.ns.cloudflare.com
greg.ns.cloudflare.com
```
（以 Cloudflare 添加站点时实际分配的两个 NS 为准）

## 5. 后续更新流程

```bash
git add -A && git commit -m "new entries"
npm run deploy
```
构建 + 索引 + 部署一条命令，全程约 1 分钟。
