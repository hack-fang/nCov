# 新型肺炎疫情地图

## UPDATE 2020.2.4

新加入 `疫情小区图`，精确到小区级别，访问 [新型冠状病毒分布图](https://ncov.ahusmart.com/) ，数据来源于政府公开信息，持续更新中，后续考虑开放源代码和提供API接口自助查询，有最新城市公开的信息可发issue联系我增加。

## UPDATE 2020.2.1

由于旧版本存在网页载入性能问题，重写了python的部分接口以减少网络请求数量，性能提高约3倍。旧版本已归档为`V0.1`,不再更新。

`自定义省份` 功能修改步骤与之前基本相同，请参考 `自定义省份`

提供以下功能

* 提供开放的API接口 https://lab.ahusmart.com/nCoV/api/ 
  * 完全兼容第三方API接口 [Isaac Lin](https://github.com/BlankerL)，只需更换`app.py`中的`baseUrl`即可
  * API使用文档，参考 API.md
* 实时疫情地图
* 实时疫情消息
* 疫情数据统计排序
* 自定义增加省份


需要增加其他省份信息查看 `自定义省份` 

## 预览图

![图片.png](https://i.loli.net/2020/01/28/tiecqYUAa1F57Ju.png)

手机端效果更佳

在线预览:https://yiqing.ahusmart.com/

## 项目基于
* python3
* flask
* pyecharts
* requests

## 安装依赖运行

```bash
$ pip install -r requirements.txt  -i https://pypi.tuna.tsinghua.edu.cn/simple
$ python app.py
```

## Docker 运行

```bash
$ docker build -t crawler .
# 后台自动重启运行
$ docker run -it -d --restart=always --name my-crawler crawler
```

## 自定义省份部署

1. 所有省份地图在`/static/vendor/map/`目录下,按需在index.html中的末尾找到相应位置引入相应地图即可

2. 修改 templates/index.html文件
适当位置复制以下模板内容,只需修改下面4个`id`中的`xxx`即可,建议以省份的小写拼音命名如 anhui等(便于js函数调用)

```html
 <!-- body xxx --> 
<div class="card-body">
    <div class="row">
        <div class="col-xl-3">
            <ul class="list-unstyled mt-1" id="xxx_overview">
            </ul>

            <ul class="list-unstyled base-timeline" id="xxx_news">
            </ul>
        </div>
        <div class="col-xl-4">
            <div id="xxx_map" class="chart-container" style="width:360px; height:640px;">
            </div>
        </div>
        <div class="col-xl-5">
            <div id="xxx_bar" class="chart-container" style="width:355px; height:640px;" >
            </div>
        </div>
    </div>
</div>
<div>
    <hr />
</div>

```

3. 修改 static/js/update.js 文件

适当位置增加以下模板内容即可,仿写即可,`xxx` 为 上一步设置的名称,同样也建议按照省份拼音命名如 anhui

```javascript
$(
    function () {
        
        update_china("中国","china");
        update_province("安徽省","anhui");
        update_province("河北省","hebei");
        update_province("湖北省","hubei");
        update_province("浙江省","zhejiang");
        // 自定义的省份增加到此
        update_province("xxx省","xxx");
         
    }
);

```

4.  运行程序参考部署流程, 打开网页(http://127.0.0.1:5000)

5. enjoy it



## 致谢

* 感谢[Isaac Lin](https://github.com/BlankerL)提供数据接口：<https://lab.isaaclin.cn/nCoV/>
* 感谢[nCoV-Map](https://github.com/sangyx/nCoV-Map)开放的源码
