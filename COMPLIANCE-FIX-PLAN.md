# OUDYN 美国/欧盟上线合规审计与修复方案

| 项目 | 内容 |
|---|---|
| 版本 | v1.0 |
| 日期 | 2026-11-23 |
| 审计对象 | 线上 `https://www.oudyn.com` + 当前代码库 |
| 目标市场 | 美国、欧盟、英国（香港/广州运营） |
| 文档性质 | 修复方案 + 成果验收清单；**本轮未修改任何代码/线上内容** |
| 重要声明 | 本文不是法律意见。上线前请美国/欧盟/英国律师复核 |

---

## 0. 一页结论

**当前版本不能投放美国/欧盟。** 问题不是“文案有点夸张”，而是三类硬伤：

1. **假身份**：Milano 工作室、Via Tortona 地址、+39 电话、Est. 2016、Italian craftsmanship。
2. **假证据**：Pexels/本地 stock 图冒充“Actual watch”；6 条编造买家故事打 “Verified purchase”；1,200+、32 countries、six people 等无依据数据。
3. **假交易**：Checkout 只把订单写进 KV，不发邮件、不收款、不锁库存，却告诉客户 “A record has been sent”。

**上线顺序：先拆 P0，再做 P1 证据重建，最后 P2 交易与放量。P0 未 100% 通过前，不要投广告、不要接美/欧流量。**

---

## 1. 审计范围与现状证据

### 1.1 已审页面

`/`、`/watches`、`/watches/[slug]`、`/collections`、`/collections/[handle]`、`/archive`、`/stories`、`/stories/[slug]`、`/about`、`/authentication`、`/shipping`、`/faq`、`/sell`、`/contact`、`/terms`、`/privacy`、`/account`、`/wishlist`、`/checkout`、Header、Footer。

### 1.2 线上原文证据（2026-11-23 抓取）

| 页面 | 线上原文/现象 | 级别 | 问题 |
|---|---|---|---|
| 首页 | `Oudyn Watchs · Milano · Est. 2016`；`Pre-owned luxury watches, authenticated in Milano.`；`Via Tortona 27, 20144 Milano` | P0 | 虚假主体/地址 |
| 首页 | `Actual watch` 标在 stock 图下 | P0 | 把占位图说成实物 |
| 首页 | `photographed as received` | P0 | 与 stock 图事实不符 |
| `/watches` | `Crafting modern timepieces ... Italian craftsmanship.` | P0 | 暗示意大利制造，实际为瑞士二手表 |
| `/watches` | 中文商品标题：`劳力士 黑水鬼 Submariner Date 126610LN 41mm 2023年`；`¥ 108,000` | P0 | 英文站混中文 SKU + CNY |
| PDP | `99新 · 2023 · 全套（盒、证、卡）`；`¥ 108,000 Tax & duties included` | P0 | 品相/税费表述不可核验 |
| PDP | 4 张不同 stock 图被标为 `view 1–4` | P0 | 货不对板 |
| PDP | `官方保修至 2028 年` 与 `24 Months warranty` 并存 | P0 | 保修口径矛盾 |
| `/stories` | `06 stories · Verified purchases · Milano`；6 条编造故事 | P0 | 假评论/FTC/EU 高风险 |
| `/shipping` | `duties buyer's responsibility`；`VAT is removed at checkout` | P0 | 与 PDP “duties included” 冲突 |
| `/checkout` | `Prices in EUR` + `VAT Included`，实际显示 `¥` | P0 | 币种/税费矛盾 |
| `/checkout` | `A record has been sent to {email}`；`Orders are held for 48 hours` | P0 | 无邮件、无锁库存、无支付 |
| Footer | Visa/Amex/PayPal/Apple Pay 图标；Instagram/YouTube/Pinterest/Hodinkee 平台首页；`Shipping to Italy` | P0 | 假支付方式/假背书 |
| `/contact` | `+39 02 1234 5678` | P0 | 明显占位电话 |
| `/about` | 2016–2026 编年史；`1,200+ watches inspected`；`32 countries`；`six people` | P0 | 无依据数据 |
| `/account` | `An OUDYN account is issued with the first order`；`for the life of the watch` | P1 | 无账户系统，承诺不存在 |
| `/terms` | 卖家 `OUDYN WATCHS, Via Tortona 27, 20144 Milano, Italy`；意大利法/米兰法院 | P0 | 合同主体虚假 |
| `/privacy` | Milano controller；声称 analytics cookies 经同意，但站点无 banner/analytics；仅意大利 Garante | P0 | GDPR 主体/权利/代表缺失 |

### 1.3 代码级证据

| 位置 | 现象 | 影响 |
|---|---|---|
| `apps/web/src/lib/api.ts` `formatPrice()` | 永远返回 `¥` + `zh-CN` 格式 | 英文站显示 CNY |
| `apps/api/src/emdash.ts` `isNew` | `bool(data.is_new) \|\| true`，恒为 true | “New in” 可能误标二手表 |
| `apps/api/src/emdash.ts` `localWatchImages()` | 主动把 Pexels 图替换为 4 张本地 stock 图 | 系统性掩盖非实拍 |
| `packages/catalog/data/stories.json` | 6 条故事全部 `verified: true` | 假“Verified purchase” |
| `functions/api/catalog/[[path]].ts` | 订单 append 到 KV；无邮件、无支付、无库存锁 | Checkout 是假交易 |
| `apps/web/src/components/store/StoreProvider.tsx` | 孤品数量可加到 9 | 与“one of one”矛盾 |
| EmDash feed | 253 条、7 个 merchant；仅按 `merchant_id` 过滤 | 过滤失败会漏别家商品 |

---

## 2. 修复目标（Definition of Done）

全部满足才算“可重新开放美/欧流量”：

1. **0 条无法举证的事实**：每个 “verified / authenticated / serviced / warranty / country / year” 都能指向证据。
2. **每个 SKU 有真实证据链**：8–12 张实拍 + 品相报告 + service 状态 + box/papers + aftermarket 披露。
3. **全站一套价格真相**：币种、税费、关税、运费、发货地在 PDP/cart/checkout/shipping/FAQ/terms 完全一致。
4. **真实主体可核验**：公司名、注册号、地址、电话、邮箱、营业时间、欧盟/英国代表全部可查。
5. **交易真实**：Checkout 真收款/真邮件/真锁库存；做不到就明确写 “Enquiry”，不冒充下单。

---

## 3. 路线选择

### A. 香港/广州独立 dealer（推荐，1–2 周）

- 主体：香港公司（或广州公司）+ 两个真实门店地址。
- 定位：`OUDYN — Independent pre-owned Rolex dealer. Hong Kong & Guangzhou.`
- 卖点：真实现货、逐只实拍、逐只检测报告、香港 DDP、14 天退货、24 个月机芯保修（如真实可履约）。
- 优势：香港是合法二手名表贸易/物流枢纽；真实门店比假米兰更有说服力。

### B. 真开米兰实体（3–6 个月，成本高）

只有真租店、真雇人、真做意大利税务，才能保留 “Milano studio” 的事实性描述。否则删除所有米兰主体信息。

### C. 继续现状（不可行）

支付商 KYC、Google Merchant Center、Meta/Google 广告、chargeback、FTC/EU 投诉，任何一项都会先炸。

---

## 4. 全站统一口径

### 4.1 主体信息（必须真实）

- 法定名称（与注册证一致）
- 香港/广州注册地址 + 门店地址
- 商业登记号 / 统一社会信用代码（如适用）
- 电话（带国家码）、邮箱、WhatsApp
- 营业时间（HKT/CST）
- 欧盟 GPSR 责任人 + GDPR 欧盟代表（如无欧盟实体）
- 英国 GDPR 代表（如 targeting UK）
- `OUDYN is an independent reseller and is not affiliated with Rolex SA.`

### 4.2 价格/税费：只选 DDP 或 DAP

| 模式 | 页面写法 | 谁付税/关税 | 前提 |
|---|---|---|---|
| **DDP（推荐）** | `Price includes shipping, insurance, import duties and VAT to the US/EU.` | 卖家 | 欧盟进口商/责任人、美国清关行、EORI/税号 |
| **DAP（过渡）** | `Price excludes import VAT/duty; estimate shown at checkout; payable to the courier.` | 买家 | 结账前明确展示估算，不能写 “included” |

**禁止：**

- 没有欧盟进口商/清关行却写 `Tax & duties included`
- 美国订单写 `VAT included`（美国是 sales tax）
- 同一页同时出现 “duties included” 和 “duties buyer's responsibility”
- 用 `Free shipping` 掩盖必付的进口税费

### 4.3 商品证据标准（每个 SKU）

- 8–12 张实拍：正面、背面、侧面、表盘微距、表扣、表带、表耳、序列号打码、盒/证/卡、时间戳卡
- 30 秒视频（可选但强烈建议）
- 品相报告：表壳/表盘/表圈/表镜/表带/表扣/机芯
- Service 状态：已保养（日期/师傅）/ 未保养 / 走时数据
- Box & papers：原盒/证书/卡/册子，逐项拍照
- Aftermarket 披露：表盘/表圈/指针/表带是否后换
- 序列号：不公开完整序列号，私下提供给买家
- 防水：未测试就写 “not pressure-tested”，不要写 “water resistance tested”

### 4.4 评价标准

- 只展示有订单号、有书面同意、可核验的真实评价
- `Verified purchase` 只能用于已核验订单
- 没有评价就写 `New store — no reviews yet`，不要编
- 不做“示例故事”却保留 Verified 徽章

### 4.5 文案替换表

| 位置 | 删除 | 替换 |
|---|---|---|
| 首页 kicker | `Oudyn Watchs · Milano · Est. 2016` | `OUDYN · Hong Kong & Guangzhou · Independent dealer` |
| 首页 H1 | `Pre-owned luxury watches, authenticated in Milano.` | `Pre-owned Rolex, inspected and documented piece by piece.` |
| 首页副文 | `inspected, serviced where needed, and photographed in our studio` | `Each watch is photographed as it is, checked by our watchmaker, and sold with a written condition report. Ships worldwide from Hong Kong.` |
| 首页 studio card | Via Tortona 27 / Milano | 真实香港/广州门店地址 + HKT/CST 营业时间 |
| PDP 图片说明 | `Actual watch` | 仅真实实拍可用 `This exact watch`；否则删除 |
| PDP 价格 | `Tax & duties included` | DDP 或 DAP 对应文案（见 4.2） |
| PDP 保证条 | `24 months warranty`（无条款） | `24-month limited warranty on the movement; statutory rights unaffected.` |
| 列表页 H1 | `Crafting modern timepieces ... Italian craftsmanship.` | `Pre-owned Rolex, independently inspected in Hong Kong.` |
| 列表页服务条 | `Free Shipping — Taxes and duties are included` | `Shipping, insurance and import duties included`（仅 DDP 时） |
| Shipping | `from Milano` / same-day CET | `Dispatched from Hong Kong.` + 真实时效 |
| Footer | `Shipping to Italy` | 国家/币种选择器，或 `Shipping worldwide from Hong Kong` |
| Footer | 假支付图标/假社交 | 只保留真实支付方式与真实账号 |
| 全站 | `Italian craftsmanship` / `Made in Italy` | 删除；Rolex 原产地为瑞士 |

---

## 5. 分阶段执行计划

| 阶段 | 时间 | 目标 | 主要动作 | 产出 |
|---|---|---|---|---|
| **P0 止血** | Day 0（2 小时） | 先停止误导 | 删假故事、Actual watch、假电话/支付图标/社交；checkout 改 Enquiry 或关闭 | P0 验收包 |
| **P1 身份/证据** | Day 1–3 | 让客户能信 | 真实主体、门店实拍、20 只表实拍、英文 listing、品相报告 | 身份页 + 200 张实拍 + 20 条 listing |
| **P1 法务** | Day 3–5 | 能合规卖 | Terms/Privacy/Returns/Warranty/Authenticity/Imprint/Cookie；EU/UK 代表 | 6 份政策页 |
| **P2 交易** | Day 5–10 | 能真收款 | 支付、订单邮件、库存锁、电话/州字段、测试订单 | 3 单端到端测试 |
| **P2 放量** | Week 2–4 | 能规模化 | 真实评价、Google Business Profile、Merchant Center、无障碍、软启动 | 10 条真实评价 + 5 单软启动 |

### 责任分工（按实际团队填）

| 角色 | 负责 |
|---|---|
| 内容/运营 | 文案、FAQ、政策页、评价征集 |
| 摄影/设计 | 门店与商品实拍、品相图、图片规范 |
| 开发 | 币种、图片、checkout、邮件、库存、schema |
| 法务（外部） | Terms/Privacy/消费者权利/进口税务复核 |
| 客服 | 真实地址/电话/时效、退货/保修流程 |

---

## 6. 成果列表（交付物 + 快速验收）

> 用法：每完成一项，把 `☐` 改成 `☑`，并把证据放到 `.qa/compliance/` 对应目录。**P0 全绿才允许重新开放流量。**

### 6.1 成果物总览

| # | 成果物 | 形式 | 覆盖范围 | 验收方式 |
|---|---|---|---|---|
| 1 | 真实主体页（Imprint/Contact） | 页面 | 公司名、注册号、地址、电话、邮箱、营业时间、EU/UK 代表 | 打开页面逐项对照注册证 |
| 2 | 门店实拍 | JPG/视频 | 香港 + 广州各 6 张以上，含招牌/地址/内部 | 与 Google Maps 街景对照 |
| 3 | 商品实拍 | JPG | 20 只 × 8–12 张，唯一、含时间戳 | 逐 SKU 人工比对，无重复 |
| 4 | 英文 listing | 文案 | 20 条标题/描述/规格 | 全英文、无中文、无绝对化承诺 |
| 5 | 品相报告 | PDF/页面 | 20 份，逐只表壳/表盘/机芯/表带 | 与实拍一致，可下载 |
| 6 | 认证报告样本 | PDF | 1 份完整样本 + 师傅姓名/资质 | 含日期、项目、结论、照片 |
| 7 | 价格/税费表 | 表格 | DDP 或 DAP + USD/EUR/GBP/HKD | 六个页面口径一致 |
| 8 | 法务页 | 页面 | Terms/Privacy/Returns/Warranty/Authenticity/Imprint/Cookie | 律师复核签字 |
| 9 | 真实评价 | 页面 | ≥10 条（或 0 条 + “no reviews yet”） | 每条有订单号/同意书 |
| 10 | Checkout 测试记录 | 截图/PDF | US/EU/UK 各 1 单 | 收到邮件、扣款、库存减 1 |
| 11 | Claims Register | 表格 | 所有对外声称 + 证据 + 负责人 + 复核日期 | 每条可追溯 |
| 12 | 验收截图包 | 文件夹 | 桌面 + 手机全页 | 按 6.2–6.4 清单归档 |

### 6.2 P0 止血清单（Day 0，必须 100%）

| ID | 必须交付的结果 | 位置 | 快速验收 | 通过标准 | 状态 |
|---|---|---|---|---|---|
| P0-01 | `/stories` 假故事全部删除，导航/页脚入口移除 | `/stories`、Header、Footer | 打开 URL 无 6 条故事；全局搜 `Buyer stories` 无入口 | 0 条假故事、0 入口 | ☐ |
| P0-02 | `Verified purchase` 与 `verified: true` 全部移除 | `stories.json`、`/stories` | `rg -n "Verified purchase\|verified: true" packages apps` | 0 命中 | ☐ |
| P0-03 | 首页 `Actual watch` 删除 | 首页 ModelDetail | 首页搜索 `Actual watch` 无结果 | 0 命中 | ☐ |
| P0-04 | 商品图不再用 4 张 stock 图冒充同一只表 | PDP/列表 | 每 SKU 图片唯一；无 `view 2/3/4` 不同表 | 0 个 SKU 用 stock 图 | ☐ |
| P0-05 | Milano/Via Tortona/Est. 2016 从事实性文案清除 | 首页/About/Contact/Terms/Privacy/Footer | 线上搜 `Milano\|Via Tortona\|Est. 2016` 无事实性用法 | 0 命中 | ☐ |
| P0-06 | 假电话 `+39 02 1234 5678` 删除 | Contact/Footer | 全局搜 `+39 02 1234 5678` | 0 命中 | ☐ |
| P0-07 | 未开通的支付图标删除 | Footer | 只显示真实可用支付方式 | 与支付商后台一致 | ☐ |
| P0-08 | 假社交/媒体链接删除 | Footer | 无 instagram.com/youtube.com/pinterest.com/hodinkee.com 首页链接 | 真实账号或删除 | ☐ |
| P0-09 | Tax/duty 矛盾文案下线 | PDP/Cart/Checkout/Shipping/FAQ | 六页只保留一套口径 | 无 “included + buyer pays” 并存 | ☐ |
| P0-10 | Checkout 改 “Enquiry” 或关闭 | `/checkout` | 不再出现 `Place order`、`record sent`、`held 48 hours` | 不冒充已下单 | ☐ |
| P0-11 | Account 入口移除或标注未开通 | Header/Footer/`/account` | 无 “issued with first order” 承诺 | 不误导 | ☐ |
| P0-12 | 假统计/编年史删除 | About | 搜 `1,200\|32 countries\|six people\|2016` 无事实性用法 | 只保留可证明数据 | ☐ |
| P0-13 | 虚假原产地/系列文案删除 | Watches/Collections/Archive | 搜 `Italian craftsmanship\|Built to order\|Limited Edition\|left production` | 0 命中 | ☐ |

### 6.3 P1 证据重建清单（Week 1–2）

| ID | 交付物 | 形式/数量 | 快速验收 | 通过标准 | 状态 |
|---|---|---|---|---|---|
| P1-01 | 真实主体与联系方式上线 | 1 页 | 公司名/注册号/地址/电话/邮箱/时间/EU/UK 代表齐全 | 与注册证一致 | ☐ |
| P1-02 | 香港/广州门店实拍 | 各 ≥6 张 + 1 视频 | 招牌、门牌、内部、街道 | 可在 Google Maps 找到 | ☐ |
| P1-03 | 20 只表逐只实拍 | 160–240 张 | 每 SKU ≥8 张，唯一 | 无重复、无 stock | ☐ |
| P1-04 | 英文 listing | 20 条 | 标题 `Rolex Submariner Date 126610LN` 格式；描述全英文 | 无中文、无绝对化 | ☐ |
| P1-05 | 品相 5 级定义 | 1 页 | Unworn/Like new/Excellent/Very good/Good/Fair 定义 + 图例 | 每只映射到 1 级 | ☐ |
| P1-06 | 逐只品相/服务/套件报告 | 20 份 | 表壳/表盘/表圈/表镜/表带/机芯 + service + box/papers | 与实拍一致 | ☐ |
| P1-07 | 认证报告样本 + 师傅资质 | 1 PDF | 姓名、资质、日期、检查项、结论、照片 | 可下载、非“厂家证书” | ☐ |
| P1-08 | 保修条款 | 1 页 | 24 个月机芯 limited warranty + 法定权利不受影响 | 律师复核 | ☐ |
| P1-09 | 退货/14 天撤回 | 1 页 + 表单 | 撤回表、退货地址、条件、退款时限 | 符合 CRD/UK CCRs | ☐ |
| P1-10 | DDP/DAP 价格表 | 1 表 | 币种、税费、运费、到岸成本 | 六页一致 | ☐ |
| P1-11 | Shipping 重写 | 1 页 | 香港发货、US/EU/UK 时效、保险、DDP/DAP | 与实际物流合同一致 | ☐ |
| P1-12 | Contact/FAQ 重写 | 2 页 | 真实地址/电话/WhatsApp/时效；无 Milano | 客服可复述 | ☐ |
| P1-13 | Terms/Privacy/Imprint/Cookie | 4 页 | 主体、数据、权利、Cookie、投诉 | 律师复核 | ☐ |
| P1-14 | EU/UK 代表 | 1 页 | 名称、地址、邮箱 | 可联系 | ☐ |
| P1-15 | 真实评价（或明确 0 条） | 页面 | 每条订单号/同意书/日期 | 无编造 | ☐ |
| P1-16 | Rolex 独立声明 | 全站页脚/PDP | `Not affiliated with Rolex SA.` | 每页可见 | ☐ |
| P1-17 | Product schema | 代码/页面 | `condition: Used`、price、shipping、returns | Rich Results 测试通过 | ☐ |
| P1-18 | 孤品数量 max 1 | 购物车/结账 | 不能加到 2 | 前端+后端都限制 | ☐ |
| P1-19 | Newsletter 同意/双重确认/退订 | 表单/邮件 | 未勾选不发送；邮件含退订 | 符合 ePrivacy | ☐ |
| P1-20 | Claims Register | 表格 | 每条声称 + 证据 + 负责人 + 复核日期 | 100% 可追溯 | ☐ |

### 6.4 P2 交易与放量清单（Week 2–4）

| ID | 交付物 | 形式 | 快速验收 | 通过标准 | 状态 |
|---|---|---|---|---|---|
| P2-01 | 支付接入 | Stripe/PayPal/银行转账 | 测试卡支付成功、3DS、退款 | 后台可对账 | ☐ |
| P2-02 | 订单邮件 + 数据库 + 库存锁 | 系统 | 下单后 1 分钟收邮件；库存减 1 | 无超卖 | ☐ |
| P2-03 | Checkout 字段 | 表单 | 电话、州/省、邮编、国家、地址校验 | US/EU/UK 均可下单 | ☐ |
| P2-04 | 三国测试订单 | 记录 | US/EU/UK 各 1 单，含退货 | 全链路通过 | ☐ |
| P2-05 | Google Business Profile + 评价平台 | 账号 | 两店可搜到；真实评价 ≥10 | 与网站一致 | ☐ |
| P2-06 | Cookie/CMP（如接 analytics） | 组件 | 拒绝后不加载非必要 cookie | 符合 GDPR/ePrivacy | ☐ |
| P2-07 | 无障碍 | 审计 | WCAG 2.1 AA 关键页通过 | 无阻断性错误 | ☐ |
| P2-08 | Merchant Center feed | Feed | 价格/库存/运费/退货政策一致 | 无 Misrepresentation | ☐ |
| P2-09 | 律师签字 | 文件 | 美/欧/英各一份复核意见 | 无 P0 遗留 | ☐ |
| P2-10 | 软启动 | 运营 | 5 单真实客户，0 chargeback | 观察 2 周 | ☐ |

---

## 7. 快速验收方法

### 7.1 线上文案残留（P0）

```bash
# 在仓库根目录运行
curl -sL https://www.oudyn.com/ \
  | rg -n "Milano|Via Tortona|Est\. 2016|Actual watch|Verified purchase"
# 期望：无输出（rg 返回 1）

curl -sL https://www.oudyn.com/stories/ \
  | rg -n "Verified purchases|Andrea C\.|UNO 40"
# 期望：无输出
```

### 7.2 源码残留

```bash
rg -n "Verified purchase|Actual watch|Tax & duties included|Prices in EUR|Free shipping within the EU" \
  apps/web/src packages/catalog

rg -n "\+39 02 1234 5678|Via Tortona|Est\. 2016" \
  apps/web/src
# 期望：无输出
```

### 7.3 商品图唯一性

```bash
# 可选：确认每个 SKU 图片数量与重复情况
curl -s https://www.oudyn.com/api/catalog/products \
  | jq -r '.items[] | [.slug, (.images | length)] | @tsv'
# 期望：每个 slug >= 8；同一图片 hash 不出现在两个 SKU
```

### 7.4 交易链路

1. 用测试邮箱下单 US 地址（含州/邮编/电话）。
2. 确认 1 分钟内收到订单邮件。
3. 确认后台订单状态、库存减 1。
4. 用测试卡支付，确认 3DS、扣款、发票。
5. 发起退货，确认 14 天撤回流程与退款。

### 7.5 证据归档结构（建议）

```text
.qa/compliance/
  00-scope.md
  01-p0/
    home.png
    pdp.png
    stories-404.png
    footer.png
  02-identity/
    imprint.pdf
    store-hk.jpg
    store-gz.jpg
    google-maps.png
  03-products/
    p-rx-sub-126610ln/
      01.jpg ... 10.jpg
      report.pdf
  04-legal/
    terms-v2.pdf
    privacy-v2.pdf
    returns-v2.pdf
    warranty-v2.pdf
    eu-rep.pdf
  05-orders/
    test-us.pdf
    test-eu.pdf
    test-uk.pdf
  06-reviews/
    review-001.pdf
```

---

## 8. 验收 Gate（放行条件）

| Gate | 放行条件 | 验收人 | 日期 | 结论 |
|---|---|---|---|---|
| **Gate 1：可重新开放流量** | P0 13 项 100% 通过 |  |  | ☐ |
| **Gate 2：可投放广告** | P1 20 项 100% + 律师复核 |  |  | ☐ |
| **Gate 3：可规模化** | P2 10 项 100% + 5 单软启动 0 chargeback |  |  | ☐ |

---

## 9. 法务清单（按市场）

| 市场 | 必须处理 |
|---|---|
| **美国** | FTC Act §5；16 CFR 465 假评论；二手商品披露；Magnuson-Moss 书面保修（Limited Warranty）；加州 SB 478 总价展示；各州 sales tax 门槛；de minimis 取消后的清关/关税；CCPA/CPRA（达到门槛时） |
| **欧盟** | UCPD（假评论/虚假原产地/假 free）；CRD（身份、地址、电话、总价、14 天撤回、撤回表）；2019/771 两年法定保证；GPSR（欧盟责任人 + 商品页信息）；GDPR/ePrivacy（Cookie 同意、欧盟代表）；VAT/进口（>€150 不能用 IOSS）；REACH/CITES（皮革/ exotic 表带）；EAA 无障碍（2025-06-28 起，查微企豁免） |
| **英国/香港** | UK GDPR/UK 代表；CCRs 14 天取消；CRA 2015；UK VAT/进口；香港 PDPO；如从广州处理数据，评估中国 PIPL 跨境 |

其他：

- Rolex 商标只做指示性使用；写“独立转售商、非授权经销商”。
- 原产地按瑞士/中国如实申报；不要用 shipping 地混淆原产地。
- 18+；制裁/出口管制筛查。
- 高价值表建议做 stolen-watch 数据库核查；做了才写，没做不要写“provenance”。

---

## 10. 不要做的事

1. **不要只把 “Milano” 换成 “Hong Kong”**，却保留假故事、假实拍、假数据；模式不变，风险不变。
2. **不要在没有欧盟进口商/清关行时写 DDP/duties included**；这是税务和消费者双重风险。
3. **不要没有认证报告/师傅资质就写 “authenticated”**；写 “inspected” 更准确。
4. **不要把编造故事改成 “示例” 却保留 “Verified purchase”**；直接删。
5. **不要先投广告再补合规**；支付商/广告平台/Chargeback 会先于律师找上门。

---

## 11. 依据

- [FTC 消费者评论最终规则](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials)
- [FTC 二手/翻新商品披露指引](https://www.ftc.gov/system/files/ftc_gov/pdf/Used-Rebuilt.pdf)
- [欧盟 UCPD 指导（含假评论 23b/23c）](https://commission.europa.eu/document/download/13dc90fe-3271-414c-8180-b142d9f8407f_en?filename=c_2021_9320_1_ucpd-guidance_en.pdf)
- [欧盟 GPSR 2023/988](https://eur-lex.europa.eu/eli/reg/2023/988/oj)
- [CRD 2011/83/EU 第 6 条](https://www.legislation.gov.uk/cy/eudr/2011/83/article/6/data.pdf)
- [美国 de minimis 取消说明](https://www.avalara.com/us/en/blog/de-minimis-exemption-changes-coming.html)

---

## 12. 签收

| 角色 | 姓名 | 签字 | 日期 |
|---|---|---|---|
| 业务负责人 |  |  |  |
| 内容负责人 |  |  |  |
| 开发负责人 |  |  |  |
| 法务/外部律师 |  |  |  |

**下一步：确定路线 A（香港/广州真实身份）或 B（真开米兰实体），然后按 P0 → P1 → P2 执行。**
