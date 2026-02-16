// 无搜索功能
import { _ } from './lib/cat.js';
let key = '视聚场';
let HOST = 'http://api.cntv.cn';
let siteKey = '';
let siteType = 0;
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 11; M2007J3SC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045714 Mobile Safari/537.36';

async function request(reqUrl, agentSp) {
    let res = await req(reqUrl, {
        method: 'get',
        headers: {
            'User-Agent': agentSp || MOBILE_UA,
        },
    });
    return res.content
}

async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype
}

async function home(filter) {
    const classes = [ 
        { type_name: "天涯共此时",type_id: "TOPC1451540858793305"},
{ type_name: "国宝档案",type_id: "TOPC1451540268188575"},
{ type_name: "外国人在中国",type_id: "TOPC1451541113743615"},
{ type_name: "文明之旅",type_id: "TOPC1451541205513705"},
{ type_name: "记住乡愁第六季",type_id: "TOPC1577672009520911"},
{ type_name: "跟着书本去旅行",type_id: "TOPC1575253587571324"},
{ type_name: "百家讲坛",type_id: "TOPC1451557052519584"},
{ type_name: "自然传奇",type_id: "TOPC1451558150787467"},
{ type_name: "探索·发现",type_id: "TOPC1451557893544236"},
{ type_name: "地理·中国",type_id: "TOPC1451557421544786"},
{ type_name: "动物世界",type_id: "TOPC1451378967257534"},
{ type_name: "人与自然",type_id: "TOPC1451525103989666"},
{ type_name: "中华民族",type_id: "TOPC1451525460925648"},
{ type_name: "国家记忆",type_id: "TOPC1473235107169415"},
{ type_name: "国宝·发现",type_id: "TOPC1571034869935436"},
{ type_name: "记住乡愁第七季",type_id: "TOPC1608533695279753"},
{ type_name: "时尚科技秀",type_id: "TOPC1570874587435537"},
{ type_name: "读书",type_id: "TOPC1451557523542854"},
{ type_name: "创新进行时",type_id: "TOPC1570875218228998"},
{ type_name: "解码科技史",type_id: "TOPC1570876640457386"},
{ type_name: "科学动物园",type_id: "TOPC1571021385508957"},
{ type_name: "考古公开课",type_id: "TOPC1571021251454875"},
{ type_name: "科幻地带",type_id: "TOPC1571021323137369"},
{ type_name: "实验现场",type_id: "TOPC1571021159595290"},
{ type_name: "人物·故事",type_id: "TOPC1570780618796536"},
{ type_name: "百家说故事",type_id: "TOPC1574995326079121"},
{ type_name: "透视新科技",type_id: "TOPC1576631973420833"},
{ type_name: "夕阳红",type_id: "TOPC1451543312252987"},
{ type_name: "心理访谈",type_id: "TOPC1451543382680164"},
{ type_name: "夜线",type_id: "TOPC1451543426689237"},
{ type_name: "我爱发明",type_id: "TOPC1569314345479107"},
{ type_name: "环球科技视野",type_id: "TOPC1451463780801881"},
{ type_name: "状元360",type_id: "TOPC1451528493821255"},
{ type_name: "1起聊聊",type_id: "TOPC1451374975347585"},
{ type_name: "秘境之眼",type_id: "TOPC1554187056533820"},
{ type_name: "文化视点",type_id: "TOPC1451536118642783"},
{ type_name: "文化正午",type_id: "TOPC1451538455169283"},
{ type_name: "文化大百科",type_id: "TOPC1451536035602751"},
{ type_name: "动物传奇",type_id: "TOPC1451984181884527"},
{ type_name: "文化讲坛",type_id: "TOPC1451984533334125"},
{ type_name: "流行无限",type_id: "TOPC1451540644606949"},
{ type_name: "天涯共此时",type_id: "TOPC1451540858793305"},
{ type_name: "国宝档案",type_id: "TOPC1451540268188575"},
{ type_name: "外国人在中国",type_id: "TOPC1451541113743615"},
{ type_name: "文明之旅",type_id: "TOPC1451541205513705"},
{ type_name: "记住乡愁第六季",type_id: "TOPC1577672009520911"},
{ type_name: "中国影像方志",type_id: "TOPC1592552941644815"},
{ type_name: "创新无限",type_id: "TOPC1451557109280614"},
{ type_name: "科技人生",type_id: "TOPC1451557739596986"},
{ type_name: "绿色空间",type_id: "TOPC1451557825546179"},
{ type_name: "重访",type_id: "TOPC1451558118808439"},
{ type_name: "走近科学",type_id: "TOPC1451558190239536"},
{ type_name: "原来如此",type_id: "TOPC1451558088858410"},
{ type_name: "科技之光",type_id: "TOPC1451557776198149"},
{ type_name: "文明密码",type_id: "TOPC1451557930785264"},
{ type_name: "真相",type_id: "TOPC1503545711557359"},
{ type_name: "大家",type_id: "TOPC1451557371520714"},
{ type_name: "讲述",type_id: "TOPC1451557691081955"},
{ type_name: "人物",type_id: "TOPC1451557861628208"},
{ type_name: "我爱发明（科普）",type_id: "TOPC1451557970755294"}
        ];
    const filterObj = {};
    return JSON.stringify({
        class: _.map(classes, (cls) => {
            cls.land = 1;
            cls.ratio = 1.78;
            return cls;
        }),
        filters: filterObj,
    })
}

async function homeVod() {
    const data = JSON.parse(await request(HOST + '/NewVideo/getVideoListByColumn?id=TOPC1451558856402351&n=10&sort=desc&p=1&mode=0&serviceId=tvcctv'));
    let videos = _.map(data.data.list, (it) => {
        return {
            vod_id: it.guid,
            vod_name: it.title,
            vod_pic: it.image,
            vod_remarks: it.time || '',
        }
    });
    return JSON.stringify({
        list: videos,
    })
}

async function category(tid, pg, filter, extend) {
    if (pg <= 0 || typeof pg == 'undefined') pg = 1;
    const data = JSON.parse(await request(HOST + '/NewVideo/getVideoListByColumn?id=' + tid + '&n=10&sort=desc&p=' + pg + '&mode=0&serviceId=tvcctv'));
    let videos = _.map(data.data.list, (it) => {
        return {
            vod_id: it.guid,
            vod_name: it.title,
            vod_pic: it.image,
            vod_remarks: it.time || '',
        }
    });
    const pgChk = JSON.parse(await request(HOST + '/NewVideo/getVideoListByColumn?id=' + tid + '&n=10&sort=desc&p=' + (parseInt(pg) + 1) + '&mode=0&serviceId=tvcctv')).data.list;
    const pgCount = pgChk.length > 0 ? parseInt(pg) + 1 : parseInt(pg);
    return JSON.stringify({
        page: parseInt(pg),
        pagecount: parseInt(pgCount),
        limit: 10,
        total: parseInt(data.total),
        list: videos,
    })
}

async function detail(id) {
    const vod = {
        vod_id: id,
        vod_remarks: '',
    };
    const playlist = ['点击播放' + '$' + 'https://hls.cntv.myhwcdn.cn/asp/hls/2000/0303000a/3/default/' + id + '/2000.m3u8'];
    vod.vod_play_from = key;
    vod.vod_play_url = playlist.join('#');
    return JSON.stringify({
        list: [vod],
    });
}

async function play(flag, id, flags) {
    // console.debug('视聚场 id =====>' + id); // js_debug.log
    return JSON.stringify({
        parse: 0,
        url: id,
    })
}

async function search(wd, quick, pg) {
    return '{}'
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
    }
}