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
{ type_name: v"运动大不同" ,  ype_id: "TOPC1451552002869953" },
{ type_name: "天下足球" ,  ype_id: "TOPC1451551777876756" },
{ type_name: "篮球公园" ,  ype_id: "TOPC1451549958391444" },
{ type_name: "体育新闻" ,  ype_id: "TOPC1451551426170389" },
{ type_name: "足球之夜" ,  ype_id: "TOPC1451552481492403" },
{ type_name: "北京2022" ,  ype_id: "TOPC1462860742367700" },
{ type_name: "体坛快讯" ,  ype_id: "TOPC1451550970356385" },
{ type_name: "体育世界" ,  ype_id: "TOPC1451551371554333" },
{ type_name: "欧冠开场哨" ,  ype_id: "TOPC1451550484638864" },
{ type_name: "棋牌乐" ,  ype_id: "TOPC1451550531682936" },
{ type_name: "健身动起来" ,  ype_id: "TOPC1451549599140203" },
{ type_name: "体育晨报" ,  ype_id: "TOPC1451551258388672" },
{ type_name: "体谈" ,  ype_id: "TOPC1451551830518827" },
{ type_name: "ATP周刊" ,  ype_id: "TOPC1551324792732798" },
{ type_name: "冰球冰球" ,  ype_id: "TOPC1551323337921620" },
{ type_name: "冰天雪地" ,  ype_id: "TOPC1551323403033398" },
{ type_name: "约战果岭" ,  ype_id: "TOPC1551324843068553" },
{ type_name: "艺术里的奥林匹克" ,  ype_id: "TOPC1634807797280923" },
{ type_name: "逐冰追雪" ,  ype_id: "TOPC1634807873035403" },
{ type_name: "五环纪事" ,  ype_id: "TOPC1634807936107991" },
{ type_name: "奥秘无穷" ,  ype_id: "TOPC1634808174904190" },
{ type_name: "奥林匹克人" ,  ype_id: "TOPC1634808300961576" },
{ type_name: "体育在线" ,  ype_id: "TOPC1451540777295250" },
{ type_name: "运动大不同" ,  ype_id: "TOPC1451552002869953" },
{ type_name: "NBA最前线" ,  ype_id: "TOPC1451548615930237" },
{ type_name: "冠军欧洲" ,  ype_id: "TOPC1451549411228903" },
{ type_name: "巅峰时刻" ,  ype_id: "TOPC1451549547540149" },
{ type_name: "赛车时代" ,  ype_id: "TOPC1451550589995997" },
{ type_name: "体育人间" ,  ype_id: "TOPC1451551310742737" },
{ type_name: "武林大会" ,  ype_id: "TOPC1451551891055866" },
{ type_name: "谁是球王" ,  ype_id: "TOPC1451550868295303" }
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