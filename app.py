import json
import time
import requests
import os
from flask import Flask, render_template, jsonify

from pyecharts.charts import Map, Bar
from pyecharts import options as opts

app = Flask(__name__)

# 第三方开放API
# baseUrl = "https://lab.isaaclin.cn/nCoV/api/"

baseUrl = "https://lab.ahusmart.com/nCoV/api/"

# 映射丁香园城市命名和echart需要的城市名称
path = os.path.join(os.path.dirname(
    os.path.abspath(__file__)), "province_cities.json")
with open(path, "r", encoding="utf-8") as f:
    province_city_fixed = json.load(f)


# 更新全国或省份的新闻
def update_news(area):
    # china代表全国新闻
    if area == "china" or area == "中国":
        url = baseUrl + 'news?num=7'
    # 省份新闻
    else:
        province = area
        url = baseUrl + 'news?num=7&province='+province

    news_data = []
    data = json.loads(requests.get(url).text)
    for r in data['results']:
        news_data.append({
            'title': r['title'],
            'sourceUrl': r['sourceUrl'],
            'infoSource': time.strftime('%m-%d %H:%M:%S', time.localtime(r['pubDate'] / 1000)) + '    ' + r['infoSource']
        })
    return news_data


# 获取最新的全国统计数据
def update_overall_latest():
    url = baseUrl + 'overall?latest=1'
    overall_data = json.loads(requests.get(url).text)

    rsp = {}
    rsp["result"] = overall_data["results"][0]
    rsp['time'] = time.strftime(
        "%m-%d %H:%M", time.localtime(time.time()))
    return rsp



# 同时提供所需的省份各市的概览数据、map、bar数据数据，减少请求次数
def update_province_all_data(province):
    url = baseUrl + 'area?latest=1&province='+province
    province_data = json.loads(requests.get(url).text)

    # 取最新一条统计概览数据
    latest_data = province_data["results"][0]
    latest_data['time'] = time.strftime(
        "%m-%d %H:%M", time.localtime(time.time()))
    province_latest_data = latest_data
    # 省份简称，用来确定echart中的省份地图
    province_shortname = latest_data["provinceShortName"]

    # 地图数据
    cities_map_data = []
    # 条形图数据
    cities_bar_data = []
    for c in latest_data["cities"]:
        city_data = []  # 地图数据需要城市或区的全称
        city_data1 = []
        # 先在修正表中找
        if province_city_fixed[province].get(c["cityName"]) != None:
            city_data.append(province_city_fixed[province][c["cityName"]])
        # 没有则延用原始名称
        else:
            city_data.append(c["cityName"])
        city_data.append(c["confirmedCount"])

        # bar 数据
        city_data1.append(c["cityName"])
        city_data1.append(c["confirmedCount"])

        cities_map_data.append(city_data)
        cities_bar_data.append(city_data1)
    
    #分别生成地图数据和条形图数据
    province_map_data = province_map(
        cities_map_data, province_shortname).dump_options_with_quotes()
    province_bar_data = rank_bar(
        cities_bar_data, province).dump_options_with_quotes()
    
    return province_latest_data, province_map_data, province_bar_data


# 全国各省的地图数据、条形图数据,减少请求次数
def update_china_all_data():

    url = baseUrl + 'area?latest=1'
    data = json.loads(requests.get(url).text)

    p_data = {}
    for r in data['results']:
        # 去除别的国家数据
        if r.get("provinceShortName") == None or r.get("country") != "中国":
            pass
        else:
            p_data[r["provinceShortName"]] = r["confirmedCount"]

    # 先对字典进行排序,按照value从大到小
    p_data = sorted(p_data.items(), key=lambda x: x[1], reverse=True)

    # 分别生成地图数据和条形图数据
    china_map_data = china_map(p_data).dump_options_with_quotes()
    china_bar_data = rank_bar(p_data, "全国").dump_options_with_quotes()
    return china_map_data, china_bar_data

# 中国地图
def china_map(data)-> Map:
    # 热力图配置信息
    opt = [
        {"min": 1001, "color": '#731919'},
        {"min": 500, "max": 1000, "color": 'red'},
        {"min": 100, "max": 499, "color": '#e26061'},
        {"min": 10, "max": 99, "color": '#f08f7f'},
        {"min": 1, "max": 9, "color": '#ffb86a'},
        {"value": 0, "color": '#ffffff'}
    ]

    c = (
        Map()
        .add(
            "确诊人数", data, "china", is_map_symbol_show=False,
        )
        .set_series_opts(label_opts=opts.LabelOpts(is_show=True, font_size=8))
        .set_global_opts(
            visualmap_opts=opts.VisualMapOpts(
                max_=1000, is_piecewise=True, pieces=opt),
            legend_opts=opts.LegendOpts(is_show=False),
            title_opts=opts.TitleOpts(title="全国疫情情况")
        )
    )
    return c

# 省份地图
def province_map(cities_data, province) -> Map:

    opt = [
        {"min": 100, "color": '#731919'},
        {"min": 10, "max": 99, "color": '#f08f7f'},
        {"min": 1, "max": 9, "color": '#ffb86a'},
        {"value": 0, "color": '#ffffff'}
    ]
    c = (
        Map()
        .add(
            "确诊人数",
            cities_data,
            province,
            is_map_symbol_show=False
        )

        .set_series_opts(label_opts=opts.LabelOpts(is_show=True, font_size=9))
        .set_global_opts(
            visualmap_opts=opts.VisualMapOpts(
                max_=200, is_piecewise=True, pieces=opt),
            title_opts=opts.TitleOpts(title=province+"疫情情况"),
            legend_opts=opts.LegendOpts(is_show=False))
    )
    return c


def rank_bar(map_data, name) -> Bar:
    attr = []
    value = []
    for i in map_data:
        a = i[0]
        v = i[1]
        attr.append(a)
        value.append(v)
    # 反转数据
    attr.reverse()
    value.reverse()

    c = (
        Bar()
        .add_xaxis(attr)
        .add_yaxis("确诊人数", value)
        .reversal_axis()
        .set_series_opts(label_opts=opts.LabelOpts(position="right", color="black"))
        .set_global_opts(
            title_opts=opts.TitleOpts(title=name+"统计数据"),
            yaxis_opts=opts.AxisOpts(
                axislabel_opts=opts.LabelOpts(rotate=-45, font_size=11)),
        )

    )
    return c


@app.route("/")
def index():
    return render_template("index.html")


# 区域新闻,area 的取值为中国 或 省份名如"安徽省"
@app.route("/news/<string:area>")
def get_news(area):
    news = update_news(area)
    return jsonify(news)


# 中国数据概览
@app.route("/overall")
def get_overall():
    overall = update_overall_latest()
    return jsonify(overall)


# 返回全国各省的所有map数据、bar数据
@app.route("/chinaData")
def get_china_data():
    china_map_data, china_bar_data = update_china_all_data()
    china_data = {
        "map": china_map_data,
        "bar": china_bar_data
    }
    return jsonify(china_data)


# 返回省份所有的数据(概览数据，各市map数据，各市bar图数据)
@app.route("/data/<string:provinceName>")
def get_province_data(provinceName):
    province_latest_data, province_map_data, province_bar_data = update_province_all_data(
        provinceName)

    province_data = {
        "overview": province_latest_data,
        "map": province_map_data,
        "bar": province_bar_data}

    return jsonify(province_data)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
