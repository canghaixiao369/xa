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
        { type_name: "乐享汇" , type_id: "TOPC1528430065133683" },
{ type_name: "国际艺苑" , type_id: "TOPC1451379250581117" },
{ type_name: "中国音乐电视" , type_id: "TOPC1451542397206110" },
{ type_name: "精彩音乐汇" , type_id: "TOPC1451541414450906" },
{ type_name: "童声唱" , type_id: "TOPC1570593464032566" },
{ type_name: "民歌·中国" , type_id: "TOPC1451541994820527" },
{ type_name: "CCTV音乐厅" , type_id: "TOPC1451534421925242" },
{ type_name: "影视留声机" , type_id: "TOPC1451542346007956" },
{ type_name: "音乐人生" , type_id: "TOPC1451542308412911" },
{ type_name: "一起音乐吧" , type_id: "TOPC1451542132455743" },
{ type_name: "音乐公开课" , type_id: "TOPC1462849800640766" },
{ type_name: "乐游天下" , type_id: "TOPC1451541538046196" },
{ type_name: "中国节拍" , type_id: "TOPC1570025984977611" },
{ type_name: "聆听时刻" , type_id: "TOPC1570026397101703" },
{ type_name: "音乐周刊" , type_id: "TOPC1570593186033488" },
{ type_name: "合唱先锋" , type_id: "TOPC1570026172793162" },
{ type_name: "巅峰音乐汇" , type_id: "TOPC1451984095463376" },
{ type_name: "曲苑杂坛" , type_id: "TOPC1451984417763860" },
{ type_name: "星光舞台" , type_id: "TOPC1451542099519708" },
{ type_name: "百年歌声" , type_id: "TOPC1451534465694290" },
{ type_name: "音乐传奇" , type_id: "TOPC1451542222069826" },
{ type_name: "音乐告诉你" , type_id: "TOPC1451542273313866" },
{ type_name: "广场舞金曲" , type_id: "TOPC1528685010104859" },
{ type_name: "快乐琴童" , type_id: "TOPC1451541450128978" },
{ type_name: "歌声与微笑" , type_id: "TOPC1451541189657627" },
{ type_name: "今乐坛" , type_id: "TOPC1451541229451689" },
{ type_name: "乡村大舞台" , type_id: "TOPC1563179546003162" },
{ type_name: "印象·乡村" , type_id: "TOPC1563178734372977" }
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