/**
 * XLink Consumer App - API Client
 * 
 * A comprehensive API testing and debugging tool for the Consumer App backend.
 * 
 * Usage:
 *   node scripts/api-client.js [command] [options]
 * 
 * Commands:
 *   list                    - List all available API endpoints
 *   test [endpoint]         - Test a specific endpoint
 *   test-all                - Test all endpoints (health check)
 *   set-session [sessionId] - Save sessionId for future requests
 *   set-env [env]           - Set default environment (beta/prod/local)
 * 
 * Examples:
 *   node scripts/api-client.js list
 *   node scripts/api-client.js test caseLibrary
 *   node scripts/api-client.js test-all
 *   node scripts/api-client.js set-session YOUR_SESSION_ID
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

// ============================================
// Configuration
// ============================================

const CONFIG_FILE = path.join(__dirname, '.api-client-config.json');

const ENVIRONMENTS = {
  prod: { name: 'Production', host: 'https://xlink.fsgo365.cn' },
  beta: { name: 'Beta/Test', host: 'https://xlinkbeta.fsgo365.cn' },
  local: { name: 'Local Dev', host: 'http://localhost:8080' }
};

// ============================================
// API Endpoints Registry
// Extracted from project source code
// ============================================

const API_ENDPOINTS = {
  // === Home Page APIs ===
  caseLibrary: {
    path: '/fsgo/wmz/basic/caseLibrary/query',
    method: 'POST',
    params: { 'is:state|integer#and': 1, sortField: 'createTime', sortOrder: 'desc' },
    description: 'Case Library (案例推荐)',
    category: 'Home'
  },
  wares: {
    path: '/fsgo/wmz/wares/query',
    method: 'POST',
    params: { page: 1, rows: 20, 'is:state|integer#and': 1, 'is:exts.isShow|integer#and': 1, sortField: 'createTime', sortOrder: 'desc' },
    description: 'Products List (商品列表)',
    category: 'Home'
  },
  waresClassify: {
    path: '/fsgo/wmz/wares/queryClassify.do',
    method: 'POST',
    params: { page: 1, rows: 10, parentId: '4417047658598871409', 'is:state|integer#and': 1, sortField: 'order', sortOrder: 'asc' },
    description: 'Product Categories (商品分类)',
    category: 'Home'
  },
  notices: {
    path: '/fsgo/wmz/document/query',
    method: 'POST',
    params: { _all: '1', 'is:type|integer#and': 3, 'is:exts.chooseApplet|string#and': '2', 'is:isTop|integer#and': 1, sortField: 'createTime', sortOrder: 'desc' },
    description: 'Notices/Banners (公告/轮播图)',
    category: 'Home'
  },
  
  // === User & Account ===
  myIncome: {
    path: '/fsgo/wmz/basic/income/myIncome',
    method: 'POST',
    params: {},
    description: 'My Income (我的收益)',
    category: 'Account'
  },
  myWarranty: {
    path: '/fsgo/wmz/document/myWarrantys',
    method: 'POST',
    params: { page: 1, rows: 10 },
    description: 'My Warranties (我的质保单)',
    category: 'Account'
  },
  myContract: {
    path: '/fsgo/wmz/basic/contract/myContract',
    method: 'POST',
    params: { page: 1, rows: 10 },
    description: 'My Contracts (我的合同)',
    category: 'Account'
  },
  
  // === Service Appointments (工单) ===
  serviceAppointments: {
    path: '/fsgo/wmz/basic/serviceAppointment/query',
    method: 'POST',
    params: { page: 1, rows: 10, sortField: 'updateTime', sortOrder: 'desc' },
    description: 'Service Appointments List (工单列表)',
    category: 'ServiceAppointment'
  },
  
  // === Orders ===
  orders: {
    path: '/fsgo/wmz/basic/order/query',
    method: 'POST',
    params: { _all: '1', sortField: 'createTime', sortOrder: 'desc' },
    description: 'Orders List (订单列表)',
    category: 'Order'
  },
  
  // === Surveys ===
  surveys: {
    path: '/fsgo/wmz/basic/survey/querySurvey',
    method: 'POST',
    params: { _all: '1' },
    description: 'Surveys List (勘察报告)',
    category: 'Survey'
  },
  surveysLegacy: {
    path: '/fsgo/wmz/biz/extForm/query/7971040108398070730.do',
    method: 'GET',
    description: 'Surveys List (勘察报告) - Legacy Path',
    category: 'Survey'
  },
  
  // === Partner/Store ===
  activityDef: {
    path: '/fsgo/wmz/biz/activityDef/query',
    method: 'POST',
    params: {},
    description: 'Activity Definitions (活动定义)',
    category: 'Store'
  },
  
  // === Messages ===
  messages: {
    path: '/fsgo/wmz/basic/message/query',
    method: 'POST',
    params: { 'is:state|integer#and': 1, sortField: 'createTime', sortOrder: 'desc' },
    description: 'Messages (消息通知)',
    category: 'Message'
  },
  
  // === Coupons ===
  myCoupons: {
    path: '/fsgo/wmz/basic/couponPrinting/query',
    method: 'GET',
    params: { _all: '1', 'in:status|array-integer#and': '2,3,5' },
    description: 'My Coupons (我的优惠券)',
    category: 'Coupon'
  },
  couponMall: {
    path: '/fsgo/wmz/basic/coupon/query',
    method: 'GET',
    params: { _all: '1', 'is:state|integer#and': 1 },
    description: 'Coupon Mall (卡券中心)',
    category: 'Coupon'
  },

  // === Inspection ===
  inspections: {
    path: '/fsgo/wmz/biz/extForm/queryByColName/inspectionAppointment.do',
    method: 'GET',
    params: { _all: '1' },
    description: 'Inspections (巡检报告)',
    category: 'Inspection'
  }
};

// ============================================
// Utility Functions
// ============================================

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (e) {}
  return { env: 'beta', sessionId: '' };
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function makeRequest(url, params, sessionId) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify(params);
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    };

    if (sessionId) {
      headers['Cookie'] = `JSESSIONID=${sessionId}`;
    }

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: headers
    };

    const client = isHttps ? https : http;
    const startTime = Date.now();

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          body: data,
          duration: duration
        });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ============================================
// Commands
// ============================================

async function listEndpoints() {
  console.log('\n📋 Available API Endpoints:\n');
  
  const categories = {};
  for (const [key, ep] of Object.entries(API_ENDPOINTS)) {
    if (!categories[ep.category]) categories[ep.category] = [];
    categories[ep.category].push({ key, ...ep });
  }
  
  for (const [cat, endpoints] of Object.entries(categories)) {
    console.log(`  📁 ${cat}`);
    for (const ep of endpoints) {
      console.log(`     • ${ep.key.padEnd(20)} - ${ep.description}`);
    }
    console.log('');
  }
  
  console.log(`Total: ${Object.keys(API_ENDPOINTS).length} endpoints\n`);
}

async function testEndpoint(endpointKey, config) {
  const endpoint = API_ENDPOINTS[endpointKey];
  if (!endpoint) {
    console.error(`❌ Unknown endpoint: ${endpointKey}`);
    console.log(`Run 'node scripts/api-client.js list' to see available endpoints.`);
    return false;
  }
  
  const env = ENVIRONMENTS[config.env];
  const url = env.host + endpoint.path;
  
  console.log(`\n🔗 Testing: ${endpointKey}`);
  console.log(`   ${endpoint.description}`);
  console.log(`   URL: ${url}`);
  console.log(`   Env: ${env.name}`);
  
  try {
    const result = await makeRequest(url, endpoint.params, config.sessionId);
    
    console.log(`   Status: ${result.statusCode} (${result.duration}ms)`);
    
    if (result.body === 'restart') {
      console.log(`   ⚠️  Auth required - Session expired or not set`);
      return false;
    }
    
    try {
      const json = JSON.parse(result.body);
      if (json.success === false) {
        console.log(`   ❌ Error: ${json.message}`);
        return false;
      }
      const count = Array.isArray(json.data) ? json.data.length : (json.data ? 1 : 0);
      console.log(`   ✅ Success - ${count} item(s) returned`);
      return true;
    } catch (e) {
      console.log(`   ⚠️  Non-JSON response: ${result.body.substring(0, 100)}`);
      return false;
    }
  } catch (e) {
    console.log(`   ❌ Request failed: ${e.message}`);
    return false;
  }
}

async function testAll(config) {
  console.log('\n🧪 Running API Health Check...\n');
  console.log(`Environment: ${ENVIRONMENTS[config.env].name}`);
  console.log(`Session: ${config.sessionId ? config.sessionId.substring(0, 20) + '...' : '(not set)'}\n`);
  console.log('─'.repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  for (const key of Object.keys(API_ENDPOINTS)) {
    const success = await testEndpoint(key, config);
    if (success) passed++;
    else failed++;
    console.log('─'.repeat(60));
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
}

// ============================================
// Main Entry
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'list';
  const config = loadConfig();
  
  console.log('\n════════════════════════════════════════');
  console.log('  🔧 XLink Consumer App - API Client');
  console.log('════════════════════════════════════════');
  
  switch (command) {
    case 'list':
      await listEndpoints();
      break;
      
    case 'test':
      const endpoint = args[1];
      if (!endpoint) {
        console.log('Usage: node scripts/api-client.js test [endpoint]');
        await listEndpoints();
      } else {
        await testEndpoint(endpoint, config);
        console.log('');
      }
      break;
      
    case 'test-all':
      await testAll(config);
      break;
      
    case 'set-session':
      const sessionId = args[1];
      if (!sessionId) {
        console.log('\n❌ Please provide a sessionId');
        console.log('Usage: node scripts/api-client.js set-session YOUR_SESSION_ID\n');
      } else {
        config.sessionId = sessionId;
        saveConfig(config);
        console.log(`\n✅ Session saved: ${sessionId.substring(0, 20)}...`);
        console.log('You can now run tests without specifying sessionId.\n');
      }
      break;
      
    case 'set-env':
      const env = args[1];
      if (!ENVIRONMENTS[env]) {
        console.log(`\n❌ Invalid environment: ${env}`);
        console.log(`Available: ${Object.keys(ENVIRONMENTS).join(', ')}\n`);
      } else {
        config.env = env;
        saveConfig(config);
        console.log(`\n✅ Environment set to: ${ENVIRONMENTS[env].name}\n`);
      }
      break;
      
    default:
      console.log(`\n❌ Unknown command: ${command}`);
      console.log('Available commands: list, test, test-all, set-session, set-env\n');
  }
}

main().catch(console.error);
