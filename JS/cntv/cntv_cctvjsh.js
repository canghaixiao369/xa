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
        { type_name: "国防军事早报" , type_id: 1564109128610932" },
{ type_name: "正午国防军事" , type_id: 1564109254301161" },
{ type_name: "军事报道" , type_id: 1451527941788652" },
{ type_name: "防务新观察" , type_id: 1451526164984187" },
{ type_name: "军迷行天下" , type_id: 1564131644145429" },
{ type_name: "老兵你好" , type_id: 1564109722559395" },
{ type_name: "军武零距离" , type_id: 1564109434999268" },
{ type_name: "军事制高点" , type_id: 1564109356650207" },
{ type_name: "军事科技" , type_id: 1451528087494889" },
{ type_name: "军事纪实" , type_id: 1451527993718730" },
{ type_name: "谁是终极英雄" , type_id: 1451530272783201" },
{ type_name: "军营的味道" , type_id: 1564110136027687" },
{ type_name: "砺剑" , type_id: 1649983616689859" },
{ type_name: "军事纪录" , type_id: 1575602995944674" },
{ type_name: "国防故事" , type_id: 1578551434601482" },
{ type_name: "兵器面面观" , type_id: 1564110696628209" },
{ type_name: "第二战场" , type_id: 1564110615253124" },
{ type_name: "世界战史" , type_id: 1564110396694880" },
{ type_name: "五星剧场" , type_id: 1564110834985329" },
{ type_name: "国防微视频-军歌嘹亮" , type_id: 1564110222559767" },
{ type_name: "军情时间到" , type_id: 1462504102545692" },
{ type_name: "军情时间到" , type_id: 1462504102545692" },
{ type_name: "国防科工" , type_id: 1564109813378483" }
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