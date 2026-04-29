# XLink Consumer App - API Documentation

This document serves as a reference for the backend API integration of the Consumer App (房屋维修消费者端).

## 1. Environment Reference

The API endpoints switch based on the `_host` variable in `common/common.js`.

| Environment    | Base URL                       | Description                     |
| :------------- | :----------------------------- | :------------------------------ |
| **Production** | `https://xlink.fsgo365.cn`     | Live production server          |
| **Beta/Test**  | `https://xlinkbeta.fsgo365.cn` | Default development/test server |
| **Local**      | `http://localhost:8080`        | Local Java backend development  |

**API Path Prefix**: `/fsgo/wmz/` (unless specified otherwise)

---

## 2. Authentication Mechanism

The system uses **JSESSIONID** for session management.
- **Acquisition**: Triggered via `osg.doLogin` using `wx.login` code.
- **Persistence**: Stored in local storage as `sessionId`.
- **Usage**: Automatically attached by `osg.ajax` in the request headers (and as a Cookie in some platforms).

---

## 3. Core API Map

### 🏠 Home & Discovery
| Name                | Endpoint                  | Method | Description                            |
| :------------------ | :------------------------ | :----- | :------------------------------------- |
| **Case Library**    | `basic/caseLibrary/query` | POST   | 案例推荐 (Filtered by repair parts)    |
| **Products**        | `wares/query`             | POST   | 商品列表 (Filtered by tags/categories) |
| **Categories**      | `wares/queryClassify.do`  | POST   | 报修部位分类图标                       |
| **Banners/Notices** | `document/query`          | POST   | 首页轮播图及系统公告                   |

### 🛠️ Service & Work Orders (核心业务)
| Name             | Endpoint                          | Method | Description                             |
| :--------------- | :-------------------------------- | :----- | :-------------------------------------- |
| **Appointments** | `basic/serviceAppointment/query`  | POST   | 工单查询 (Status: 待上门, 施工中, etc.) |
| **Upsert Order** | `basic/serviceAppointment/upsert` | POST   | 创建/更新报修申请                       |
| **Surveys**      | `basic/survey/querySurvey`        | POST   | 查看技术经理的勘察报告                  |
| **Inspections**  | `basic/inspection/query`          | POST   | 施工巡检记录                            |

### 💰 Finance & Rewards
| Name              | Endpoint                | Method | Description       |
| :---------------- | :---------------------- | :----- | :---------------- |
| **My Income**     | `basic/income/myIncome` | POST   | 用户收益/返利汇总 |
| **My Coupons**    | `basic/coupon/myCoupon` | POST   | 用户的优惠券包    |
| **Order Payment** | `basic/order/query`     | POST   | 待支付订单列表    |

### 📄 Documents & Legal
| Name           | Endpoint                    | Method | Description  |
| :------------- | :-------------------------- | :----- | :----------- |
| **Contracts**  | `basic/contract/myContract` | POST   | 电子合同查询 |
| **Warranties** | `document/myWarrantys`      | POST   | 电子质保凭证 |

---

## 4. Debugging & Integration Testing

We have a built-in CLI tool for testing these APIs from the terminal.

### Setup
1. Get a valid `sessionId` from WeChat DevTools (Storage -> sessionId).
2. Save it: `node scripts/api-client.js set-session <YOUR_SESSION_ID>`

### Commands
- **List Endpoints**: `node scripts/api-client.js list`
- **Test Specific API**: `node scripts/api-client.js test caseLibrary`
- **Health Check**: `node scripts/api-client.js test-all`

---

## 5. Global Implementation Detail (`common/common.js`)

All API interactions go through the `osg.ajax(url, data, callback, options)` wrapper.
- **Auto-loading**: Displays a loading spinner unless `noload: true` is set.
- **Auto-error handling**: Alerts the user if `success` is false.
- **Session expiry**: Redirects to login if the server returns `"restart"`.

---

## 6. Known Issues & Problematic Interfaces

During development and maintenance, some inconsistencies and "problematic" areas have been identified:

### ⚠️ API Discrepancies
- **Surveys API**: 
  - documented: `basic/survey/querySurvey` (used in CLI).
  - Actual UI usage: `biz/extForm/query/7971040108398070730.do` (legacy form engine).
  - *Note*: The UI uses hardcoded form IDs which may become outdated if the backend schema changes.

### 🧩 Hardcoded Dependencies
- **Tenant IDs**: Many calls (like Survey and Lead) use hardcoded `tenantId: '1340835581184723420'`.
- **Category Parents**: `queryClassify.do` depends on a hardcoded `parentId: '4417047658598871409'` for the Consumer App hierarchy.

### 🔄 Complex Logic
- **Lead vs Upsert**: The `pages/declaration/declaration.vue` page routes to either `basic/serviceAppointment/upsert` or `basic/lead/upsert` depending on whether a `channel` is present in the scan/entry parameters.

### 🧪 Mock Data Persistence
- **Home Page Case Library**: In `pages/index/index.vue`, if the `caseLibrary` API returns an empty array, the UI may still display hardcoded mock cases (or previously cached ones) if not carefully cleared.

---

## 7. API Health Status (Verified 2026-01-21)

A full health check was performed using `scripts/api-client.js`.

| Endpoint         | Status | Actual Path Verified                                  | Notes                                              |
| :--------------- | :----: | :---------------------------------------------------- | :------------------------------------------------- |
| **Case Library** | ✅ 200  | `basic/caseLibrary/query`                             | Verified                                           |
| **Products**     | ✅ 200  | `wares/query`                                         | Verified                                           |
| **Categories**   | ✅ 200  | `wares/queryClassify.do`                              | Uses hardcoded `parentId`                          |
| **Notices**      | ✅ 200  | `document/query`                                      | Verified                                           |
| **Warranties**   | ✅ 200  | `document/myWarrantys`                                | Verified                                           |
| **My Coupons**   | ✅ 200  | `basic/couponPrinting/query`                          | **Corrected** (was `basic/coupon/myCoupon`)        |
| **Coupon Mall**  | ✅ 200  | `basic/coupon/query`                                  | **Corrected** (was `basic/coupon/queryCouponTemp`) |
| **Inspections**  | ✅ 200  | `biz/extForm/queryByColName/inspectionAppointment.do` | **Corrected** (uses Form Engine)                   |
| **Activity Def** | ✅ 200  | `biz/activityDef/query`                               | Verified                                           |
| **Surveys**      | ❌ 500  | `biz/extForm/query/7971040108398070730.do`            | **Failing**. Legacy form path is unstable.         |

> [!IMPORTANT]
> The `api-client.js` tool has been updated with the corrected paths found in the source code. Use it to verify status before deployment.
