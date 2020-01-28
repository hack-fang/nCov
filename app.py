import json
import time
import requests
from flask import Flask, render_template, jsonify

from pyecharts.charts import Map,Bar
from pyecharts import options as opts

app = Flask(__name__)

# 全国新闻
def update_news():
    url = 'http://lab.isaaclin.cn/nCoV/api/news'
    news_data = []
    data = json.loads(requests.get(url).text)
    for r in reversed(data['results'][-7:]):
        news_data.append({
            'title': r['title'],
            'sourceUrl': r['sourceUrl'],
            'infoSource': time.strftime('%m-%d %H:%M:%S', time.localtime(r['pubDate'] / 1000)) + '    ' + r['infoSource']
        })
    return news_data


# 指定省份新闻
def update_province_news(province):
    url = 'http://lab.isaaclin.cn/nCoV/api/news?province='+province
    news_data = []
    data = json.loads(requests.get(url).text)
    for r in reversed(data['results'][-7:]):
        news_data.append({
            'title': r['title'],
            'sourceUrl': r['sourceUrl'],
            'infoSource': time.strftime('%m-%d %H:%M:%S', time.localtime(r['pubDate'] / 1000)) + '    ' + r['infoSource']
        })
    return news_data

# 获取最新的全国统计数据
def update_overall_latest():
    url = 'http://lab.isaaclin.cn/nCoV/api/overall?latest=1'
    overall_data = json.loads(requests.get(url).text)
    
    rsp = {}
    rsp["result"] = overall_data["results"][0]
    rsp['time'] = time.strftime(
        "%m-%d %H:%M", time.localtime(time.time()))
    print(rsp)
    return rsp


# 获取省份各市数据数据
def update_province_data(province):
    url = 'http://lab.isaaclin.cn/nCoV/api/area?province='+province
    province_data = json.loads(requests.get(url).text)
    province_data['time'] = time.strftime(
        "%m-%d %H:%M", time.localtime(time.time()))

    # 取最新一条统计数据
    latest_data = province_data["results"][-1]
    cities_data = []
    for  c  in latest_data["cities"]:
        city_data = []
        city_data.append(c["cityName"]+"市")
        city_data.append(c["confirmedCount"])
        cities_data.append(city_data)

    return cities_data

# 获取最新的省份统计数据
def update_province_latest(province):
    url = 'http://lab.isaaclin.cn/nCoV/api/area?province='+province
    province_data = json.loads(requests.get(url).text)
    
    # 取最新一条统计数据
    latest_data = province_data["results"][-1]
    latest_data['time'] = time.strftime(
        "%m-%d %H:%M", time.localtime(time.time()))

    return latest_data


# 中国各省数据
def update_china_data(unit=3600 * 2):

    url = 'http://lab.isaaclin.cn/nCoV/api/area?latest=1'
    
    data = json.loads(requests.get(url).text)

    p_data = {}
    for r in data['results']:
        # 去除别的国家数据
        if r.get("provinceShortName") == None  or r.get("country") != "中国":
            pass
        else:
            p_data[r["provinceShortName"]] = r["confirmedCount"]


    # 先对字典进行排序,按照value从大到小
    p_data= sorted(p_data.items(), key=lambda x: x[1], reverse=True)
    
    #   
    print(p_data)  
  
    return p_data


def china_map(data)-> Map:
    opt= [
        {"min":1001,"color":'#731919'},
        {"min":500,"max":1000,"color":'red'},
        {"min":100,"max":499,"color":'#e26061'},
        {"min":10,"max":99,"color":'#f08f7f'},
        {"min":1,"max":9,"color":'#ffb86a'},
        {"value":0,"color":'#ffffff'}
    ]
    c = (
            Map()
            .add(
                "确诊人数", data, "china", is_map_symbol_show=False,
            )
            .set_series_opts(label_opts=opts.LabelOpts(is_show=True,font_size=8))
            .set_global_opts(
                visualmap_opts=opts.VisualMapOpts(max_=1000,is_piecewise=True,pieces=opt),
                legend_opts=opts.LegendOpts(is_show=False),
                title_opts=opts.TitleOpts(title="全国疫情情况")
            )
        )
    return c




def province_map(cities_data,province) -> Map:
    
    opt= [
        {"min":100,"color":'#731919'},
        {"min":10,"max":99,"color":'#f08f7f'},
        {"min":1,"max":9,"color":'#ffb86a'},
        {"value":0,"color":'#ffffff'}
    ]
    c = (
        Map()
        .add(
            "确诊人数",
            cities_data,
            province,
            is_map_symbol_show=False

        )

        .set_series_opts(label_opts=opts.LabelOpts(is_show=True,font_size=8))
        .set_global_opts(
            visualmap_opts=opts.VisualMapOpts(max_=20,is_piecewise=True,pieces=opt), 
            title_opts=opts.TitleOpts(title=province+"省疫情情况"),
            legend_opts=opts.LegendOpts(is_show=False))
    )
    return c

def rank_bar(map_data,name) -> Bar:
    attr = []
    value = []
    for i in map_data:
        a= i[0]
        v= i[1]
        attr.append(a)
        value.append(v)
    # 反转
    attr.reverse()
    value.reverse()

    # value = [13, 10, 7, 6, 5, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1]
    # attr = ['合肥市', '阜阳市', '马鞍山市', '亳州市', '安庆市', '六安市', '铜陵市', '芜湖市',
    #         '滁州市', '宿州市', '池州市', '蚌埠市', '宣城市', '淮北市', '淮南市', '黄山市']
    # attr.reverse()
    # value.reverse()
    c = (
        Bar()
        .add_xaxis(attr)
        .add_yaxis("确诊人数", value)
        .reversal_axis()
        .set_series_opts(label_opts=opts.LabelOpts(position="right",color="black"))
        .set_global_opts(
            title_opts=opts.TitleOpts(title=name+"统计数据"),
            yaxis_opts=opts.AxisOpts(axislabel_opts=opts.LabelOpts(rotate=-45,font_size=11)),
            )
    
    )
    return c


@app.route("/")
def index():
    return render_template("index.html")

# 全国地图数据
@app.route("/map")
def get_map():
    data = update_china_data()
    return china_map(data).dump_options_with_quotes()

# 指定省份地图数据
@app.route("/pmap/<string:provinceName>")
def get_pmap(provinceName):

    cities_data = update_province_data(provinceName)
    return province_map(cities_data,provinceName[:-1]).dump_options_with_quotes()

# 中国新闻
@app.route("/news")
def get_news():
    news = update_news()
    return jsonify(news)

# 指定省份新闻
@app.route("/pnews/<string:provinceName>")
def get_pnews(provinceName):
    news = update_province_news(provinceName)
    return jsonify(news)

# 中国数据概览
@app.route("/overall")
def get_overall():
    overall = update_overall_latest()
    return jsonify(overall)

# 指定省份数据概览
@app.route("/poverall/<string:provinceName>")
def get_poverall(provinceName):
    anhui = update_province_latest(provinceName)
    return jsonify(anhui)

# 中国省份数据排序
@app.route("/rank")
def get_rank():
    province_data = update_china_data()
    return rank_bar(province_data,"全国").dump_options_with_quotes()

# 指定省份的城市数据排序
@app.route("/prank/<string:provinceName>")
def get_prank(provinceName):
    cities_data = update_province_data(provinceName)   
    return rank_bar(cities_data,provinceName).dump_options_with_quotes()



if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)
