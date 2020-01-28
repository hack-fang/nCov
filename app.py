import json
import time
import requests
from flask import Flask, render_template, jsonify

from pyecharts.charts import Map
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
    overall_data['time'] = time.strftime(
        "%m-%d %H:%M", time.localtime(time.time()))
    return overall_data


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
        if r.get("provinceShortName") == None:
            pass
        else:
            p_data[r["provinceShortName"]] = r["confirmedCount"]

    p_data = [(k,v) for k,v in p_data.items()]    
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


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/map")
def get_map():
    data = update_china_data()
    return china_map(data).dump_options_with_quotes()


@app.route("/map1")
def get_map1():

    cities_data = update_province_data("安徽省")
    return province_map(cities_data,"安徽").dump_options_with_quotes()


@app.route("/map2")
def get_map2():

    cities_data = update_province_data("河北省")
    return province_map(cities_data,"河北").dump_options_with_quotes()


@app.route("/news")
def get_news():
    news = update_news()
    return jsonify(news)

@app.route("/news1")
def get_anhui_news():
    news = update_province_news("安徽省")
    return jsonify(news)

@app.route("/news2")
def get_hebei_news():
    news = update_province_news("河北省")
    return jsonify(news)    

@app.route("/overall")
def get_overall():
    overall = update_overall_latest()
    return jsonify(overall)

@app.route("/overall1")
def get_anhui():
    anhui = update_province_latest("安徽省")
    return jsonify(anhui)

@app.route("/overall2")
def get_hebei():
    hebei = update_province_latest("河北省")
    return jsonify(hebei)


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)
