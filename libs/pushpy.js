/**
 * pushpy
 * 参考 https://github.com/guren-cloud/vpush-pro-sdk 修改而来
 * 更新时间：2019/10/01
 * -------------
 * 修改后的开源链接 https://github.com/mn3711698/pushpy
 * 使用方法：
 * - app.js中引入此模块文件，然后初始化：App({ vPush: new vPush('你的API服务接口地址'), ..})
 * - 比如：new vPush("https://push.yjyzj.cn/api/1?")
 * 其他提示：
 * - 这个SDK需要你配置你的小程序的request域名，为你部署好的API服务器地址。
 */

class vPush {
  constructor(api) {
    if (!api) {
      throw new Error("[vPush.init] 请设置您的API服务接口地址");
    }
    console.log("[+] https://github.com/mn3711698/pushpy");
    var mlwxappId = wx.getAccountInfoSync();
    this.HOST = api + '&appid=' + mlwxappId.miniProgram.appId;;
    this.STORAGE_KEY = '_VPUSH2_BASIC_OPENID';
    this.OPEN_ID = '';

    this.init();
  }

  // http请求后端
  _request(uri, data) {
    return new Promise((RES, REJ) => {
      wx.request({
        url: `${this.HOST}${uri}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data,
        success: RES,
        fail: REJ
      })
    });
  }

  // get请求
  _get(uri) {
    return new Promise((RES, REJ) => {
      wx.request({
        url: `${this.HOST}${uri}`,
        success: RES,
        fail: REJ
      })
    })
  }

  /**
   * 初始化
   */
  init() {
    this.initUser().then(openid => {
      //console.log('[vpush.init.ok] open_id=', openid);
      this.OPEN_ID = openid;
      // 登陆，获取用户头像等信息
      new Promise(RES => {
        wx.getUserInfo({
          success: ret => {
            RES(ret.userInfo);
          },
          fail: err => {
            RES({});
          }
        })
      }).then(userInfo => {
        // 获取当前操作系统等信息
        var info = wx.getSystemInfoSync();
        // 更新用户数据
        this._request('&viewid=home&part=login_update', {
          // 用户昵称、头像、性别
          openid: this.OPEN_ID,
          nickName: userInfo.nickName || "",
          avatarUrl: userInfo.avatarUrl || "",
          gender: userInfo.gender || 0,
          // 系统信息
          system: info.system,
          platform: info.platform,
          version: info.version,
          language: info.language,
          sdk: info.SDKVersion
        }).then(ret => {
          // 如果用户不存在，就刷新
          if (ret.code == 10000) {
            wx.removeStorageSync(this.STORAGE_KEY);
            return this.init();
          }
          //console.log('[vpush.update.ok]', ret);
        });
      });
    }).catch(err => {
      console.log('[vpush.init.err]', err);
    })
  }

  /**
   * 初始化用户
   * 根据code获取openId
   */
  initUser() {
    return new Promise((RES, REJ) => {
      // 如果有缓存，返回
      let cache = wx.getStorageSync(this.STORAGE_KEY);
      if (cache && cache.length > 10) return RES(cache);
      // 没有，就初始化
      wx.login({
        success: res => {
          //viewid=home&part=login
          this._request('&viewid=home&part=login', {
            code: res.code
          }).then(ret => {
            const { data } = ret;
            //console.log('&viewid=home&part=login', data);
            if (data.code !== 0) {
              return REJ(data.msg);
            }
            RES(data.openid);
            
            // 存储到缓存
            wx.setStorageSync(this.STORAGE_KEY, data.openid);
          }).catch(REJ);
        },
        fail: REJ
      })
    });
  }

  /**
   * 添加推送凭证
   */
  addFormId(e, callback) {
    
    var formId = '';
    if (typeof e === 'object') {
      formId = e.detail.formId;
    } else {
      formId = String(e);
    }
    
    // 判断formId是否为测试的
    if (formId.startsWith('the formId') || formId.startsWith('[') || formId === 'undefined') {
      callback && callback();
      return console.warn('[vpush] 调试的无效formId：', formId);
    }

    // 获取当前页面地址
    let page = getCurrentPages()[0].route;
    this._request('&viewid=home&part=client_formid&openid=' + this.OPEN_ID, {
      page,
      formId,
      platform: wx.getSystemInfoSync().platform
    }).then(ret => {
      callback && callback();
      //console.log('[vpush.addFormId.ret]', ret);
      const { data } = ret;
      if (data.code !== 0) {
        return console.warn('[vpush.addForm.fail]', data.msg);
      }
      //console.log('[vpush.addFormId.ok]', data.msg);
    });
  }
}

module.exports = vPush;