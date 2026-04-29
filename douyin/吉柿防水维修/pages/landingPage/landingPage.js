Page({
  data: {
    name: '',
    phone: ''
  },
  onLoad() {
    this.login()
  },
  login() {
    tt.login({
      force: false, // 未登录时, 是否强制调起登录框
      success(res) {
        console.log(`login 调用成功${res.code} ${res.anonymousCode}`);
        tt.request({
          url: 'https://xlinkbeta.fsgo365.cn/fsgo/wmz/index/dyLogin',
          method: 'POST',
          header: {
            "content-type": 'application/x-www-form-urlencoded'
          },
          data: {
            appID: 'tt2b425dffb4746b0901', // 吉柿防水维修appID
            code: res.code, // 临时登录凭证, 有效期 3 分钟。
            anonymousCode: res.anonymousCode  // 用于标识当前设备, 无论登录与否都会返回, 有效期 3 分钟。
          },
          success: (res) => {
            console.log('登录成功 sessionId：', res.data.data.token);
            tt.setStorage({
              key: 'sessionId',
              data: res.data.data.token
            });
          },
          fail: (res) => {
            console.log('登录失败')
          },
        });
      },
      fail(res) {
        console.log(`login 调用失败`);
      },
    });
  },
  onBlur(e) {
    this.setData({
      [e.target.dataset.key]: e.detail.value,
    });
  },
  save() {
    if (!this.data.name) {
      tt.showToast({
        title: "请输入您的姓名",
        icon: 'none'
      });
      return;
    }
    if (!this.data.phone || !/^1[3456789]\d{9}$/.test(this.data.phone)) {
      tt.showToast({
        title: "请输入正确的手机号",
        icon: 'none'
      });
      return;
    }
    tt.request({
      url: 'https://xlinkbeta.fsgo365.cn/fsgo/wmz/basic/lead/upsert',
      method: 'POST',
      header: {
        "content-type": 'application/x-www-form-urlencoded',
        Cookie: 'JSESSIONID=' + tt.getStorageSync('sessionId')
      },
      data: {
        data: JSON.stringify({
          name: this.data.name,
          phone: this.data.phone,
          channel: ['50', '5010', '501020'], // 广告投放/今日头条/抖音
          leadStatus: ['0'], //线索状态
          customTime: String(new Date().toLocaleString()).replace(/\//g, '-'), // 留咨时间
          exts: {
            sourceType: "6", // 吉柿平台单
            leadDiscrepancy: '99' // 线索呼入呼出状态 99:其他
          }
        })
      },
      success() {
        console.log('success');
        tt.showModal({
          content: '提交成功，请等待客服与您联系。',
          showCancel: false
        });
      },
      fail() {
        console.log('fail');
        tt.showModal({
          content: '提交失败，请稍后重新。',
          showCancel: false
        });
      }
    })
  }
})