//地图
var china_map = echarts.init(document.getElementById('china_map'), 'white', { renderer: 'canvas' });
var anhui_map = echarts.init(document.getElementById('anhui_map'), 'white', { renderer: 'canvas' });
var hebei_map = echarts.init(document.getElementById('hebei_map'), 'white', { renderer: 'canvas' });

// 条形图
var china_bar = echarts.init(document.getElementById('china_bar'), 'white', { renderer: 'canvas' });
var anhui_bar = echarts.init(document.getElementById('anhui_bar'), 'white', { renderer: 'canvas' });
var hebei_bar = echarts.init(document.getElementById('hebei_bar'), 'white', { renderer: 'canvas' });




$(
    function () {
        
        updateOverall();
        updatePOverall("安徽省","#anhui_overview");
        updatePOverall("河北省","#hebei_overview");

       


        // 取全国及省新闻
        updateNews();
        updatePNews("安徽省","#anhui_news");
        updatePNews("河北省","#hebei_news");

        


        // 取地图所需数据
        fetchData();
        fetchPData("安徽省",anhui_map);
        fetchPData("河北省",hebei_map);
       


        // 取条形图所需数据
        fetchRankData();
        fetchPRankData("安徽省",anhui_bar);
        fetchPRankData("河北省",hebei_bar);




        setInterval(updateOverall, 60 * 1000);
        setInterval(updatePOverall("安徽省","#anhui_overview"), 60 * 1000);
        setInterval(updatePOverall("河北省","#hebei_overview"), 60 * 1000);

        setInterval(updateNews, 60 * 1000);
        setInterval(updatePNews("安徽省","#anhui_news"), 60 * 1000);
        setInterval(updatePNews("河北省","#hebei_news"), 60 * 1000);

        setInterval(fetchData, 30 * 60 * 1000)
        setInterval(fetchPData("安徽省",anhui_map), 30 * 60 * 1000)
        setInterval(fetchPData("河北省",hebei_map), 30 * 60 * 1000)


        setInterval(fetchRankData, 30 * 60 * 1000)
        setInterval(fetchPRankData("安徽省",anhui_bar), 30 * 60 * 1000)
        setInterval(fetchPRankData("河北省",hebei_bar), 30 * 60 * 1000)



    }
);

function getHost() {
    return document.location.protocol + "//" + window.location.host;
}

function updateOverall() {
    $.ajax({
        type: "GET",
        url: getHost() + "/overall",
        dataType: 'json',
        success: function (result) {
            var t = new Date()
            overall_html = '<li class="text-muted"> <i class="fa fa-bug pr-2"></i>病毒：' + result['result']['virus'] + '</li><li class="text-muted"><i class="fa fa-bolt pr-2"></i>源头：' + result['result']['infectSource'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>  疑似病例：' + result['result']['suspectedCount'] + '</li><li class="text-muted"><i class="fa fa-heartbeat pr-2"></i>确诊病例：' + result['result']['confirmedCount'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>治愈病例：' + result['result']['curedCount'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>死亡病例：' + result['result']['deadCount'] + '</li><li class="text-muted"><i class="fa fa-clock-o pr-2"></i>更新时间：' + result['time'] + '</li>'
            $('#china_overview').html(overall_html)
        }
    });
}

function updatePOverall(province,domid) {
    $.ajax({
        type: "GET",
        url: getHost() + "/poverall/"+province,
        dataType: 'json',
        success: function (result) {
            var t = new Date()
            overall_html = '<li class="text-muted"> <h3>' + province + '</h3> <li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>  疑似病例：' + result['suspectedCount'] + '</li><li class="text-muted"><i class="fa fa-heartbeat pr-2"></i>确诊病例：' + result['confirmedCount'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>治愈病例：' + result['curedCount'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>死亡病例：' + result['deadCount'] + '</li><li class="text-muted"><i class="fa fa-clock-o pr-2"></i>更新时间：' + result['time'] + '</li>'
            $(domid).html(overall_html)
        }
    });
}


function updateNews() {
    $.ajax({
        type: "GET",
        url: getHost() + "/news",
        dataType: 'json',
        success: function (result) {
            news_html = ""
            for (var i = 0, len = result.length; i < len; i++) {
                news_html += "<li><div class='base-timeline-info'><a href=" + result[i]['sourceUrl'] + ">" + result[i]['title'] + "</a></div><small class='text-muted'>" + result[i]['infoSource'] + '</small></li>'
            }
            $('#china_news').html(news_html)
        }
    });
}

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



function fetchData() {
    $.ajax({
        type: "GET",
        url: getHost() + "/map",
        dataType: 'json',
        success: function (result) {
            china_map.setOption(result);


        }
    });
}
function fetchPData(province,pchart) {
    $.ajax({
        type: "GET",
        url: getHost() + "/pmap/"+province,
        dataType: 'json',
        success: function (result) {

            pchart.setOption(result);

        }
    });
}



function fetchRankData() {
    $.ajax({
        type: "GET",
        url: getHost() + "/rank",
        dataType: 'json',
        success: function (result) {

            china_bar.setOption(result);

        }
    });
}

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
