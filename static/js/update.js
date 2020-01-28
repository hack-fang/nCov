var chart2 = echarts.init(document.getElementById('hebei-map'), 'white', { renderer: 'canvas' });

var chart1 = echarts.init(document.getElementById('ah-map'), 'white', { renderer: 'canvas' });

var chart = echarts.init(document.getElementById('ncov-map'), 'white', { renderer: 'canvas' });


$(
    function () {
        updateOverall();
        updateAnhui();
        updateHebei();

        updateNews();
        updateAnhuiNews();
        updateHebeiNews();

        fetchData(chart);
        fetchData1(chart1);
        fetchData2(chart2);

        setInterval(updateNews, 60 * 1000);
        setInterval(updateAnhuiNews, 60 * 1000);
        setInterval(updateHebeiNews, 60 * 1000);

        setInterval(updateOverall, 60 * 1000);
        setInterval(updateAnhui, 60 * 1000);
        setInterval(updateHebei, 60 * 1000);



        setInterval(fetchData, 30 * 60 * 1000)
        setInterval(fetchData1, 30 * 60 * 1000)
        setInterval(fetchData2, 30 * 60 * 1000)

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
            overall_html = '<li class="text-muted"> <i class="fa fa-bug pr-2"></i>病毒：' + result['results'][0]['virus'] + '</li><li class="text-muted"><i class="fa fa-bolt pr-2"></i>源头：' + result['results'][0]['infectSource'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>  疑似病例：' + result['results'][0]['suspectedCount'] + '</li><li class="text-muted"><i class="fa fa-heartbeat pr-2"></i>确诊病例：' + result['results'][0]['confirmedCount'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>治愈病例：' + result['results'][0]['curedCount'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>死亡病例：' + result['results'][0]['deadCount'] + '</li><li class="text-muted"><i class="fa fa-clock-o pr-2"></i>更新时间：' + result['time'] + '</li>'
            $('#overall').html(overall_html)
        }
    });
}

function updateAnhui() {
    $.ajax({
        type: "GET",
        url: getHost() + "/overall1",
        dataType: 'json',
        success: function (result) {
            var t = new Date()
            overall_html = '<li class="text-muted"> <h3>安徽省</h3> <li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>  疑似病例：' + result['suspectedCount'] + '</li><li class="text-muted"><i class="fa fa-heartbeat pr-2"></i>确诊病例：' + result['confirmedCount'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>治愈病例：' + result['curedCount'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>死亡病例：' + result['deadCount'] + '</li><li class="text-muted"><i class="fa fa-clock-o pr-2"></i>更新时间：' + result['time'] + '</li>'
            $('#overall1').html(overall_html)
        }
    });
}


function updateHebei() {
    $.ajax({
        type: "GET",
        url: getHost() + "/overall2",
        dataType: 'json',
        success: function (result) {
            var t = new Date()
            overall_html = '<li class="text-muted"> <h3>河北省</h3> <li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>  疑似病例：' + result['suspectedCount'] + '</li><li class="text-muted"><i class="fa fa-heartbeat pr-2"></i>确诊病例：' + result['confirmedCount'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>治愈病例：' + result['curedCount'] + '</li><li class="text-muted"><i class="fa fa-hospital-o pr-2"></i>死亡病例：' + result['deadCount'] + '</li><li class="text-muted"><i class="fa fa-clock-o pr-2"></i>更新时间：' + result['time'] + '</li>'
            $('#overall2').html(overall_html)
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
            $('#newslist').html(news_html)
        }
    });
}

function updateAnhuiNews() {
    $.ajax({
        type: "GET",
        url: getHost() + "/news1",
        dataType: 'json',
        success: function (result) {
            news_html = ""
            for (var i = 0, len = result.length; i < len; i++) {
                news_html += "<li><div class='base-timeline-info'><a href=" + result[i]['sourceUrl'] + ">" + result[i]['title'] + "</a></div><small class='text-muted'>" + result[i]['infoSource'] + '</small></li>'
            }
            $('#newslist1').html(news_html)
        }
    });
}

function updateHebeiNews() {
    $.ajax({
        type: "GET",
        url: getHost() + "/news2",
        dataType: 'json',
        success: function (result) {
            news_html = ""
            for (var i = 0, len = result.length; i < len; i++) {
                news_html += "<li><div class='base-timeline-info'><a href=" + result[i]['sourceUrl'] + ">" + result[i]['title'] + "</a></div><small class='text-muted'>" + result[i]['infoSource'] + '</small></li>'
            }
            $('#newslist2').html(news_html)
        }
    });
}


function fetchData() {
    $.ajax({
        type: "GET",
        url: getHost() + "/map",
        dataType: 'json',
        success: function (result) {
            chart.setOption(result);


        }
    });
}
function fetchData1() {
    $.ajax({
        type: "GET",
        url: getHost() + "/map1",
        dataType: 'json',
        success: function (result) {
            console.log(result)
            chart1.setOption(result);

        }
    });
}

function fetchData2() {
    $.ajax({
        type: "GET",
        url: getHost() + "/map2",
        dataType: 'json',
        success: function (result) {
            console.log(result)
            chart2.setOption(result);

        }
    });
}
