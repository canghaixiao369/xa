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
{ type_name: "角儿来了" , type_id: "TOPC1508747509633692" },
{ type_name: "梨园闯关我挂帅" , type_id: "TOPC1451558484007800" },
{ type_name: "CCTV空中剧院" , type_id: "TOPC1451558856402351" },
{ type_name: "过把瘾" , type_id: "TOPC1451558291260577" },
{ type_name: "名段欣赏" , type_id: "TOPC1451558515719854" },
{ type_name: "名家书场" , type_id: "TOPC1579401761622774" },
{ type_name: "宝贝亮相吧" , type_id: "TOPC1579401989187953" },
{ type_name: "中国京剧音配像精粹" , type_id: "TOPC1451558769767256" },
{ type_name: "九州大戏台" , type_id: "TOPC1451558399948678" },
{ type_name: "青春戏苑" , type_id: "TOPC1451558552047910" },
{ type_name: "戏曲青年说" , type_id: "TOPC1626161016006801" },
{ type_name: "了不起的戏曲" , type_id: "TOPC1657505173323752" },
{ type_name: "梨园周刊" , type_id: "TOPC1574909786070351" },
{ type_name: "中国京剧像音像集萃" , type_id: "TOPC1626832834318986" },
{ type_name: "典藏" , type_id: "TOPC1597825254395109" },
{ type_name: "快乐戏园" , type_id: "TOPC1451558438767762" },
{ type_name: "锦绣梨园" , type_id: "TOPC1451558328292617" },
{ type_name: "影视剧场" , type_id: "TOPC1451558728003217" },
{ type_name: "戏苑百家" , type_id: "TOPC1451558644535996" },
{ type_name: "跟我学" , type_id: "TOPC1451558178940505" },
{ type_name: "戏曲采风" , type_id: "TOPC1451558610462968" }
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