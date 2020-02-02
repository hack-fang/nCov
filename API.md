# 接口协议


本接口为全国新型肺炎疫情实时数据接口，数据来源为丁香园，开放给所有有需要的人。兼容 [BlankerL](https://github.com/BlankerL/DXY-2019-nCoV-Crawler) 的接口，并提供额外的接口


https://lab.ahusmart.com/

## 请求接口 /nCoV/api/overall

返回病毒研究情况以及全国疫情概览，可指定返回数据为最新发布数据或时间序列数据。

|  变量名 |  注释 |
| :------------: | :------------: |
| latest  | 1：返回最新数据（默认）0：返回时间序列数据(顺序)  |

## 返回数据 


|  变量名 |  注释 |
| :------------: | :------------: |
|  countRemark |  全国疫情信息概览 |
|  virus | 病毒名称  |
| infectSource  |  传染源 |
|  passWay |  	传播途径  |
|  remarkX |  注释内容，X为1~5 |
| confirmedCount  | 确诊人数  |
| suspectedCount  | 疑似感染人数  |
|  curedCount |   	治愈人数 |
| deadCount  |  	死亡人数 |
| updateTime  |  数据最后变动时间 |



### 实例 

- Method: **GET**
- URL:```nCoV/api/overall?latest=1```


#### Response

- Body

```json
{
    "results": [
        {
            "infectSource": "野生动物，可能为中华菊头蝠",
            "passWay": "经呼吸道飞沫传播，亦可通过接触传播，存在粪-口传播可能性",
            "dailyPic": "https://img1.dxycdn.com/2020/0202/725/3394327332126027029-135.png",
            "summary": "",
            "countRemark": "",
            "confirmedCount": 14489,
            "suspectedCount": 19544,
            "curedCount": 430,
            "deadCount": 304,
            "virus": "新型冠状病毒 2019-nCoV",
            "remark1": "易感人群：人群普遍易感。老年人及有基础疾病者感染后病情较重，儿童及婴幼儿也有发病",
            "remark2": "潜伏期：一般为 3～7 天，最长不超过 14 天，潜伏期内存在传染性",
            "remark3": "",
            "remark4": "",
            "remark5": "",
            "generalRemark": "疑似病例数来自国家卫健委数据，目前为全国数据，未分省市自治区等",
            "abroadRemark": "",
            "updateTime": 1580654688047
        }
    ],
    "success": true
}
```


## 请求接口 /nCoV/api/area

返回自2020年1月22日凌晨3:00（爬虫开始运行）至今，中国所有省份、地区或直辖市及世界其他国家的所有疫情信息变化的时间序列数据（精确到市），能够追溯确诊/疑似感染/治愈/死亡人数的时间序列。

注：自2020年1月22日凌晨3:00至2020年1月24日凌晨3:40之间的数据只有省级数据，自2020年1月24日起，丁香园才开始统计并公开市级数据。 

|  变量名 |  注释 |
| :------------: | :------------: |
| latest  | 1：返回最新数据（默认）0：返回时间序列数据(顺序)  |
| province  | 省份、地区或直辖市，如：湖北省、香港、北京市。   |

## 返回数据 


|  变量名 |  注释 |
| :------------: | :------------: |
|  country        |	     国家名称   |
|provinceName 	  |省份、地区或直辖市全称|
|provinceShortName|省份、地区或直辖市简称|
|confirmedCount   |	确诊人数|
|suspectedCount   | 	疑似感染人数|
|curedCount       |	治愈人数|
|deadCount 	      |死亡人数|
|comment 	      |其他信息|
|cities 	      |下属城市的情况|
|updateTime       |	数据更新时间|



### 实例 

- Method: **GET**
- URL:```nCoV/api/area?province=上海市&latest=1```


#### Response

- Body

```json
{
    "results": [
        {
            "country": "中国",
            "provinceName": "上海市",
            "provinceShortName": "上海",
            "confirmedCount": 182,
            "suspectedCount": 0,
            "curedCount": 10,
            "deadCount": 1,
            "cities": [
                {
                    "cityName": "外地来沪人员",
                    "confirmedCount": 74,
                    "curedCount": 5,
                    "deadCount": 1,
                    "locationId": -1,
                    "suspectedCount": 0
                },
                {
                    "cityName": "浦东新区",
                    "confirmedCount": 35,
                    "curedCount": 0,
                    "deadCount": 0,
                    "locationId": 310115,
                    "suspectedCount": 0
                },
                {
                    "cityName": "静安区",
                    "confirmedCount": 9,
                    "curedCount": 0,
                    "deadCount": 0,
                    "locationId": 310106,
                    "suspectedCount": 0
                },
                ...
            ],
            "comment": "治愈数据统一归属上海市公卫临床中心，暂无具体分区",
            "updateTime": 1580624381002,
            "createTime": 0,
            "modifyTime": 0
        }
    ],
    "success": true
}
```

## 请求接口 /nCoV/api/news

返回所有与疫情有关的新闻信息，包含数据来源以及数据来源链接。
按发布顺序倒序排列。 

|  变量名 |  注释 |
| :------------: | :------------: |
| province  |  	省份或直辖市，如：湖北省、北京市。
如不设定，则默认返回所有城市的新闻数据。  |
| num  | 所需新闻条数，all返回所有新闻。默认为10条。    |

## 返回数据 


|  变量名 |  注释 |
| :------------: | :------------: |
|pubDate |	新闻发布时间|
|title 	|新闻标题|
|summary |	新闻内容概述|
|infoSource |	数据来源|
|sourceUrl |	来源链接|
|province |	省份或直辖市名称|
|provinceId |	省份或直辖市代码|



### 实例 

- Method: **GET**
- URL:```/nCoV/api/news?num=3&province=湖北省```


#### Response

- Body

```json
{
    "results": [
        {
            "title": "保障湖北防控物资需要是重中之重",
            "summary": "2月2日，中央应对疫情工作领导小组会议指出，保障湖北省特别是武汉市疫情防控物资需要是重中之重。国家已集中人力物力支持。会议确定，要加快湖北医院和床位建设，组织更多呼吸、重症等高水平医护人员支援湖北。抓紧弥补湖北医用口罩防护服缺口。国务院联防联控机制各单位要帮助解决重点医用防控物资生产运输遇到的问题。所有紧缺物资实行国家统一调度。湖北省要做好医疗防控物资管理、优化使用。\n",
            "infoSource": "人民日报",
            "sourceUrl": "http://m.weibo.cn/2803301701/4467603688992599",
            "pubDate": 1580643186000,
            "provinceName": "湖北省",
            "provinceId": "42"
        },
        {
            "title": "武汉市金银潭医院今天37人出院",
            "summary": "【好消息！#武汉市金银潭医院今天37人出院#】2日下午2时，武汉市金银潭医院有37名确诊新型冠状病毒肺炎患者出院，是迄今为止该院出院人数最多的一天。本次出院年纪最大的患者已88岁，也是该院出院年龄最大的患者。医务人员将治愈出院的患者们送出医院大门，并嘱咐他们回家后需要居家隔离两周，医务人员将会随时对他们的健康状况进行回访。（人民日报客户端）网页链接\n",
            "infoSource": "人民网",
            "sourceUrl": "http://m.weibo.cn/2286908003/4467583149418870",
            "pubDate": 1580638289000,
            "provinceName": "湖北省",
            "provinceId": "42"
        },
        {
            "title": "金银潭医院一天37人出院",
            "summary": "2日下午，武汉金银潭医院有37名确诊新型冠状病毒肺炎患者出院，是迄今为止该院出院人数最多的一天。医务人员将治愈出院患者们送出大门，嘱咐他们回家后要居家隔离两周，医务人员会随时回访。本次出院年纪最大患者已88岁，是该院出院年龄最大患者。一定要健康！",
            "infoSource": "人民日报",
            "sourceUrl": "http://m.weibo.cn/2803301701/4467581769048139",
            "pubDate": 1580637959000,
            "provinceName": "湖北省",
            "provinceId": "42"
        }
    ],
    "success": true
}
```


## 请求接口 /nCoV/api/rumors

返回与疫情有关的谣言以及丁香园的辟谣。
按发布顺序倒序排列。 

|  变量名 |  注释 |
| :------------: | :------------: |
| num  | 所需最新谣言与辟谣内容条数，all返回所有指定rumorType的内容。默认为10条。    |

## 返回数据 


|  变量名 |  注释 |
| :------------: | :------------: |
|id |	谣言编号|
|title |	谣言标题|
|mainSummary |	辟谣内容概述|
|body |	辟谣内容全文|
|sourceUrl |	来源链接|



### 实例 

- Method: **GET**
- URL:```/nCoV/api/rumors?num=3```


#### Response

- Body

```json
{
    "results": [
        {
            "id": 93,
            "title": "喝茶可以预防新冠病毒？",
            "mainSummary": "丁香医生团队辟谣：补水挺好，预防病毒没用",
            "body": "目前尚无证据证明喝茶可以预防新冠病毒。尽量保持室内空气流通，注意卫生，勤洗手，吃熟食，远离人群就是最好的预防手段了。",
            "sourceUrl": ""
        },
        {
            "id": 92,
            "title": "新冠病毒通过眼神对视传播？",
            "mainSummary": "丁香医生团队辟谣：系编造，造谣网民已被依法处罚。",
            "body": "在国家卫健委印发的《新型冠状病毒感染的肺炎诊疗方案（试行第四版）》中显示，新型冠状病毒经呼吸道飞沫传播是主要的传播途径，亦可通过接触传播。而眼神对视不属于前述任何一种。\n另外，造谣网民已被依法处罚。",
            "sourceUrl": ""
        },
        {
            "id": 91,
            "title": "晒太阳可以杀灭新型冠状病毒？",
            "mainSummary": "丁香医生团队辟谣：太阳的照射温度达不到 56℃，且日照紫外线也达不到紫外线消毒灯的强度",
            "body": "太阳的照射温度达不到56℃，且日照紫外线也达不到紫外线消毒灯的强度，不论从哪一个角度都不能达到杀灭病毒的要求。若要外出晒太阳，仍需戴好口罩，做好必要防护。",
            "sourceUrl": ""
        }
    ],
    "success": true
}
```




## 请求接口 /nCoV/api/provinceName

返回数据库内有数据条目的省份、地区、直辖市列表。 



### 实例 

- Method: **GET**
- URL:```/nCoV/api/provinceName```


#### Response

- Body

```json
{
    "results": [
        "湖北省",
        "广东省",
        "浙江省",
        "北京市",
        "上海市",
        "湖南省",
        "安徽省",
        "重庆市",
        "四川省",
        "山东省",
        "广西壮族自治区",
        "福建省",
        "江苏省",
        "河南省",
        "海南省",
        "天津市",
        "江西省",
        "陕西省",
        "贵州省",
        "辽宁省",
        "香港",
        "黑龙江省",
        "澳门",
        "新疆维吾尔自治区",
        "甘肃省",
        "云南省",
        "台湾",
        "山西省",
        "吉林省",
        "河北省",
        "宁夏回族自治区",
        "内蒙古自治区",
        "青海省",
        "西藏自治区",
        "泰国",
        "日本",
        "新加坡",
        "美国",
        "澳大利亚",
        "法国",
        "韩国",
        "德国",
        "马来西亚",
        "越南",
        "尼泊尔",
        "加拿大",
        "柬埔寨",
        "斯里兰卡",
        "阿联酋",
        "芬兰",
        "印度",
        "意大利",
        "蒙古",
        "英国",
        "俄罗斯",
        "西班牙",
        "瑞典",
        "菲律宾",
        "待明确地区"
    ],
    "success": true
}
```

## 请求接口 /nCoV/api/city

返回城市的最新疫情数据 

|  变量名 |  注释 |
| :------------: | :------------: |
| cityName | 二级行政区域，如 合肥市 或 浦东新区    |

## 返回数据 


|  变量名 |  注释 |
| :------------: | :------------: |
|cityName|	二级行政区域|
| confirmedCount  | 确诊人数  |
| suspectedCount  | 疑似感染人数  |
|  curedCount |   	治愈人数 |
| deadCount  |  	死亡人数 |



### 实例 

- Method: **GET**
- URL:```/nCoV/api/city?cityName=万州区```


#### Response

- Body

```json
{
    "results": [
        {
            "cityName": "万州区",
            "confirmedCount": 33,
            "suspectedCount": 0,
            "curedCount": 0,
            "deadCount": 0
        }
    ],
    "success": true
}
```
