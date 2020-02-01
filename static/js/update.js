$(
    function () {

        update_china("中国", "china");
        update_province("安徽省", "anhui");
        update_province("河北省", "hebei");
        update_province("湖北省", "hubei");
        update_province("浙江省", "zhejiang");

    }
);

function getHost() {
    return document.location.protocol + "//" + window.location.host;
}



//更新全国数据和定时器
function update_china(country_name, country_pinyin) {
    // 分别初始化地图和条形图
    var map = echarts.init(document.getElementById(`${country_pinyin}_map`), 'white', { renderer: 'canvas' });
    var bar = echarts.init(document.getElementById(`${country_pinyin}_bar`), 'white', { renderer: 'canvas' });

    // 分别更新统计数据,新闻,地图数据,条形图排行数据
    // updateOverall(`#${country_pinyin}_overview`);
    // updateNews(`#${country_pinyin}_news`);
    // fetchChinaMapBarData(map,bar)

    // 启动定时刷新
    setInterval(updateOverall(`#${country_pinyin}_overview`), 60 * 1000);
    setInterval(updateNews(country_name, `#${country_pinyin}_news`), 60 * 1000);
    setInterval(fetchChinaMapBarData(map, bar), 10 * 60 * 1000)
}


//更新省份数据和定时器
function update_province(province, province_pinyin) {
    // 分别初始化地图和条形图
    var pmap = echarts.init(document.getElementById(`${province_pinyin}_map`), 'white', { renderer: 'canvas' });
    var pbar = echarts.init(document.getElementById(`${province_pinyin}_bar`), 'white', { renderer: 'canvas' });

    // // 更新新闻
    //updatePNews(province,`#${province_pinyin}_news`);
    // //更新统计数据,地图数据,条形图排行数据
    //fetchProvinceAllData(province,`#${province_pinyin}_overview`,pmap,pbar)

    // 启动定时刷新
    setInterval(updateNews(province, `#${province_pinyin}_news`), 60 * 1000);
    setInterval(fetchProvinceAllData(province, `#${province_pinyin}_overview`, pmap, pbar), 10 * 60 * 1000)
}



//更新中国概况数据
function updateOverall(domid) {
    $.ajax({
        type: "GET",
        url: getHost() + "/overall",
        dataType: 'json',
        success: function (result) {
            var t = new Date()
            overall_html = '<li class="text-muted"> <i class="fa fa-bug pr-2"></i>病毒：' + result['result']['virus'] + '</li><li class="text-muted"><i class="fa fa-bolt pr-2"></i>源头：' + result['result']['infectSource'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>  疑似病例：<strong>' + result['result']['suspectedCount'] + '</strong></li><li class="text-muted"><i class="fa fa-heartbeat pr-2"></i>确诊病例：<strong>' + result['result']['confirmedCount'] + '</strong></li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>治愈病例：<strong>' + result['result']['curedCount'] + '</strong></li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>死亡病例：<strong>' + result['result']['deadCount'] + '</strong></li><li class="text-muted"><i class="fa fa-clock-o pr-2"></i>更新时间：<strong>' + result['time'] + '</strong></li>'
            $(domid).html(overall_html)
        }
    });
}



//更新地区新闻，值可为"中国" 或 省份名如"安徽省" 
function updateNews(area, domid) {
    $.ajax({
        type: "GET",
        url: getHost() + "/news/" + area,
        dataType: 'json',
        success: function (result) {
            renderNews(result, domid)
        }
    });
}


// 在指定区域渲染新闻
function renderNews(result, domid) {
    news_html = ""
    for (var i = 0, len = result.length; i < len; i++) {
        news_html += "<li><div class='base-timeline-info'><a href=" + result[i]['sourceUrl'] + ">" + result[i]['title'] + "</a></div><small class='text-muted'>" + result[i]['infoSource'] + '</small></li>'
    }
    $(domid).html(news_html)
}

// 取 省份 概况数据、地图数据、条形图数据
function fetchProvinceAllData(province, domid, map, bar) {
    $.ajax({
        type: "GET",
        url: getHost() + "/data/" + province,
        dataType: 'json',
        success: function (result) {
            var t = new Date()
            overview = result["overview"]

            overall_html = '<li class="text-muted"> <h3>' + province + '</h3> <li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>  疑似病例：<strong>' + overview['suspectedCount'] + '</strong></li><li class="text-muted"><i class="fa fa-heartbeat pr-2"></i>确诊病例：<strong>' + overview['confirmedCount'] + '</strong></li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>治愈病例：<strong>' + overview['curedCount'] + '</strong></li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>死亡病例：<strong>' + overview['deadCount'] + '</strong></li><li class="text-muted"><i class="fa fa-clock-o pr-2"></i>更新时间：<strong>' + overview['time'] + '</strong></li>'
            $(domid).html(overall_html)

            mapdata = JSON.parse(result["map"])
            bardata = JSON.parse(result["bar"])


            bar.setOption(bardata);
            map.setOption(mapdata);


        }
    });
}




// 取全国各省市的map、bar图
function fetchChinaMapBarData(map, bar) {
    $.ajax({
        type: "GET",
        url: getHost() + "/chinaData",
        dataType: 'json',
        success: function (result) {
            mapdata = JSON.parse(result["map"])
            bardata = JSON.parse(result["bar"])
            map.setOption(mapdata);
            bar.setOption(bardata);

        }
    });
}