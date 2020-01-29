$(
    function () {
        
        update_china("china");
        update_province("安徽省","anhui");
        update_province("河北省","hebei");
        update_province("湖北省","hubei");
        update_province("浙江省","zhejiang");
         
    }
);

function getHost() {
    return document.location.protocol + "//" + window.location.host;
}



//更新全国数据和定时器
function update_china(country_name){
    // 分别初始化地图和条形图
    var map = echarts.init(document.getElementById(`${country_name}_map`), 'white', { renderer: 'canvas' });
    var bar = echarts.init(document.getElementById(`${country_name}_bar`), 'white', { renderer: 'canvas' });

    // 分别更新统计数据,新闻,地图数据,条形图排行数据
    updateOverall(`#${country_name}_overview`);
    updateNews(`#${country_name}_news`);
    fetchData(map);
    fetchRankData(bar);
    // 启动定时刷新
    setInterval(updateOverall(`#${country_name}_overview`), 60 * 1000);
    setInterval(updateNews(`#${country_name}_news`), 60 * 1000);
    setInterval(fetchData(map), 30 * 60 * 1000)
    setInterval(fetchRankData(bar), 30 * 60 * 1000)
}


//更新省份数据和定时器
function update_province(province,province_pinyin){
    // 分别初始化地图和条形图
    var pmap = echarts.init(document.getElementById(`${province_pinyin}_map`), 'white', { renderer: 'canvas' });
    var pbar = echarts.init(document.getElementById(`${province_pinyin}_bar`), 'white', { renderer: 'canvas' });
    // 分别更新统计数据,新闻,地图数据,条形图排行数据
    updatePOverall(province,`#${province_pinyin}_overview`);
    updatePNews(province,`#${province_pinyin}_news`);
    fetchPData(province,pmap);
    fetchPRankData(province,pbar);
    // 启动定时刷新
    setInterval(updatePOverall(province,`#${province_pinyin}_overview`), 60 * 1000);
    setInterval(updatePNews(province,`#${province_pinyin}_news`), 60 * 1000);
    setInterval(fetchPData(province,pmap), 30 * 60 * 1000)
    setInterval(fetchPRankData(province,pbar), 30 * 60 * 1000)
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

//更新省概况数据
function updatePOverall(province,domid) {
    $.ajax({
        type: "GET",
        url: getHost() + "/poverall/"+province,
        dataType: 'json',
        success: function (result) {
            var t = new Date()
            overall_html = '<li class="text-muted"> <h3>' + province + '</h3> <li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>  疑似病例：<strong>' + result['suspectedCount'] + '</strong></li><li class="text-muted"><i class="fa fa-heartbeat pr-2"></i>确诊病例：<strong>' + result['confirmedCount'] + '</strong></li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>治愈病例：<strong>' + result['curedCount'] + '</strong></li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>死亡病例：<strong>' + result['deadCount'] + '</strong></li><li class="text-muted"><i class="fa fa-clock-o pr-2"></i>更新时间：<strong>' + result['time'] + '</strong></li>'
            $(domid).html(overall_html)
        }
    });
}

//更新全部新闻
function updateNews(domid) {
    $.ajax({
        type: "GET",
        url: getHost() + "/news",
        dataType: 'json',
        success: function (result) {
            news_html = ""
            for (var i = 0, len = result.length; i < len; i++) {
                news_html += "<li><div class='base-timeline-info'><a href=" + result[i]['sourceUrl'] + ">" + result[i]['title'] + "</a></div><small class='text-muted'>" + result[i]['infoSource'] + '</small></li>'
            }
            $(domid).html(news_html)
        }
    });
}

// 更新省新闻
function updatePNews(province,domid) {
    $.ajax({
        type: "GET",
        url: getHost() + "/pnews/"+province,
        dataType: 'json',
        success: function (result) {
            news_html = ""
            for (var i = 0, len = result.length; i < len; i++) {
                news_html += "<li><div class='base-timeline-info'><a href=" + result[i]['sourceUrl'] + ">" + result[i]['title'] + "</a></div><small class='text-muted'>" + result[i]['infoSource'] + '</small></li>'
            }
            $(domid).html(news_html)
        }
    });
}


// 取各省地图数据
function fetchData(map) {
    $.ajax({
        type: "GET",
        url: getHost() + "/map",
        dataType: 'json',
        success: function (result) {
            map.setOption(result);


        }
    });
}

// 取省市地图数据
function fetchPData(province,pmap) {
    $.ajax({
        type: "GET",
        url: getHost() + "/pmap/"+province,
        dataType: 'json',
        success: function (result) {

            pmap.setOption(result);

        }
    });
}


// 取各省排行数据
function fetchRankData(bar) {
    $.ajax({
        type: "GET",
        url: getHost() + "/rank",
        dataType: 'json',
        success: function (result) {

            bar.setOption(result);

        }
    });
}

// 取省市排行数据
function fetchPRankData(province,pbar) {
    $.ajax({
        type: "GET",
        url: getHost() + "/prank/"+province,
        dataType: 'json',
        success: function (result) {

            pbar.setOption(result);

        }
    });
}
