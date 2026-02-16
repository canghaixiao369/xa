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
        { type_name: "致富经" , type_id: "TOPC1568949310515140" },
{ type_name: "三农群英汇" , type_id: "TOPC1600745974233265" },
{ type_name: "田间示范秀" , type_id: "TOPC1563178908227191" },
{ type_name: "农业气象" , type_id: "TOPC1568949200635957" },
{ type_name: "中国三农报道" , type_id: "TOPC1600746045741952" },
{ type_name: "大地讲堂" , type_id: "TOPC1568966472372643" },
{ type_name: "乡土中国" , type_id: "TOPC1563178586782832" },
{ type_name: "振兴路上" , type_id: "TOPC1632709936747979" },
{ type_name: "谁知盘中餐" , type_id: "TOPC1568966325430648" },
{ type_name: "田野里的歌声" , type_id: "TOPC1632628323813790" },
{ type_name: "乡理乡亲" , type_id: "TOPC1568966155566515" },
{ type_name: "我的美丽乡村" , type_id: "TOPC1570787364956444" },
{ type_name: "攻坚日记" , type_id: "TOPC1568966013656550" },
{ type_name: "地球村日记" , type_id: "TOPC1568966232265609" },
{ type_name: "乡约" , type_id: "TOPC1568949394517190" },
{ type_name: "乡村剧场" , type_id: "TOPC1563179005948252" },
{ type_name: "乡村振兴面对面" , type_id: "TOPC1568966531726705" },
{ type_name: "乡间纪事" , type_id: "TOPC1563178829094125" },
{ type_name: "超级新农人" , type_id: "TOPC1597627647957699" },
{ type_name: "科技链" , type_id: "TOPC1563178120425659" },
{ type_name: "乡村振兴资讯" , type_id: "TOPC1568965444563295" },
{ type_name: "遍地英雄" , type_id: "TOPC1568966086614400" },
{ type_name: "健康之路" , type_id: "TOPC1451557646802924" },
{ type_name: "中华医药" , type_id: "TOPC1451541666791291" }
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