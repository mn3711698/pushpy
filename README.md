# pushpy
> pushpy 是参考https://github.com/guren-cloud/vpush-pro-sdk修改。    

> 让更多有的人拥有自己的推送工具

> 我们提供您可以部署的后台：https://github.com/mn3711698/pushcom


## 一个版本通天下
>  注册使用：https://push.yjyzj.cn

## 快速集成并体验

第1步：
> 请到https://push.yjyzj.cn  注册您的帐号，以便快速集成后可以看到效果

> 在首页“基本信息”-- 找到 “formid接口url”，下边要用到

第2步：
下载并将libs放到小程序根目录下，解压后在`app.js`中引入你需要的核心模块，比如用专业版的基础版SDK：
``` js
const vPush = require('./libs/pushpy.js');

App({
  vPush: new vPush('https://push.yjyzj.cn/api/1?'),
  ...
});
```

第3步：
在首页json配置文件中引入组件，比如`pages/index/index.json`：
``` json
{
  "usingComponents": {
    "vpush-checkin": "/libs/components/checkin"
  }
}
```

第4步：
在首页wxml文件中加载组件，比如`pages/index/index.wxml`：
``` wxml
<vpush-checkin />
```


刷新小程序，如果出现弹框签到提示，那么就代表集成OK了！ 


我自己的集成小程序示例  https://github.com/mn3711698/dszmini

## 交流更多请加QQ群
QQ群号：920176170


![](https://github.com/mn3711698/pushpy/blob/master/pushpyQQ.png)
