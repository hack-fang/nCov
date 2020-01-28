# 新型肺炎疫情地图

暂时提供全国疫情状况和安徽省内、河北省疫情图

## 预览图
在线预览:http://yiqing.ahusmart.com/

## 项目基于
* python3
* flask
* pyecharts
* requests

## 安装依赖

```bash
pip install -r requirements.txt -i -i https://pypi.tuna.tsinghua.edu.cn/simple
```

## 自定义省份并导入

需要自行下载所需省份的地图包js文件,目前默认导入的是全国,安徽,河北的地图.

1. 地图下载并放在static/js目录下,在index.html中引入

地图下载地址[github](https://github.com/apache/incubator-echarts/tree/master/map/js/province)

2. 增加所需省份接口

主要增加app.py文件中省份新闻接口,省份各市数据接口,省份数据概览接口.

3. 修改update.js和index.html文件

在index.html中增加div容纳地图和新闻,并修改div的id信息,update.js中增加echarts,并分别建立对应的js函数


## 致谢
感谢[Isaac Lin](https://github.com/BlankerL)提供数据接口：<http://lab.isaaclin.cn/nCoV/>
感谢[nCoV-Map](https://github.com/sangyx/nCoV-Map)开放的源码