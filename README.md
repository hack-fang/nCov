# 新型肺炎疫情地图

提供以下功能

* 实时疫情地图(全国、安徽省、河北省、湖北省)
* 实时疫情消息(全国、安徽省、河北省、湖北省)
* 疫情数据统计排序(全国、安徽省、河北省、湖北省)

需要增加其他省份信息可发issue或查看 `自定义省份` 自行增加部署

## 预览图

![图片.png](https://i.loli.net/2020/01/28/tiecqYUAa1F57Ju.png)

手机端效果更佳

在线预览:http://yiqing.ahusmart.com/

## 项目基于
* python3
* flask
* pyecharts
* requests

## 安装依赖

```bash
pip install -r requirements.txt  -i https://pypi.tuna.tsinghua.edu.cn/simple
```

## 自定义省份

默认导入的是全国、安徽、河北、湖北的地图,已经内置中国各省份地图

1. 所有省份地图在`/static/vendor/map/`目录下,按需在index.html中引入相应地图即可

2. index.html文件
适当位置复制以下模板内容,只需修改`xxx`即可,建议以省份的小写拼音命名如 anhui_overview ...

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

3. 修改update.js 文件

适当位置增加以下模板内容即可,仿写即可

```javascript
var xxx_map = echarts.init(document.getElementById('xxx_map'), 'white', { renderer: 'canvas' });
...

var xxx_bar = echarts.init(document.getElementById('xxx_bar'), 'white', { renderer: 'canvas' });

$(
    function () {
        ...
        updatePOverall("xxx省","#xxx_overview");
        ...
        updatePNews("xxx省","#xxx_news");
        ...
        fetchPData("xxx省",xxx_map);
        ...
        fetchPRankData("xxx省",xxx_bar);
        ...
        setInterval(updatePOverall("xxx省","#xxx_overview"), 60 * 1000);
        setInterval(updatePNews("xxx省","#xxx_news"), 60 * 1000);
        setInterval(fetchPData("xxx省",xxx_map), 30 * 60 * 1000)
        setInterval(fetchPRankData("xxx省",xxx_bar), 30 * 60 * 1000)
    })

```

4.  运行程序, 打开网页(http://127.0.0.1:5000)

5. enjoy it



## 致谢

* 感谢[Isaac Lin](https://github.com/BlankerL)提供数据接口：<http://lab.isaaclin.cn/nCoV/>
* 感谢[nCoV-Map](https://github.com/sangyx/nCoV-Map)开放的源码