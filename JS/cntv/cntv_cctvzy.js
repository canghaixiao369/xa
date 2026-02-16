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
        { type_name: "中华情" , type_id: "TOPC1451541564922207" },
{ type_name: "回声嘹亮" , type_id: "TOPC1451535575561597" },
{ type_name: "你好生活第三季" , type_id: "TOPC1627961377879898" },
{ type_name: "我的艺术清单" , type_id: "TOPC1582272259917160" },
{ type_name: "黄金100秒" , type_id: "TOPC1451468496522494" },
"{ type_name: 非常6+1" , type_id: "TOPC1451467940101208" },
{ type_name: "向幸福出发" , type_id: "TOPC1451984638791216" },
{ type_name: "幸福账单" , type_id: "TOPC1451984801613379" },
{ type_name: "中国文艺报道" , type_id: "TOPC1601348042760302" },
{ type_name: "舞蹈世界" , type_id: "TOPC1451547605511387" },
{ type_name: "艺览天下" , type_id: "TOPC1451984851125433" },
{ type_name: "天天把歌唱" , type_id: "TOPC1451535663610626" },
{ type_name: "金牌喜剧班" , type_id: "TOPC1611826337610628" },
{ type_name: "环球综艺秀" , type_id: "TOPC1571300682556971" },
{ type_name: "挑战不可能第五季" , type_id: "TOPC1579169060379297" },
{ type_name: "我们有一套" , type_id: "TOPC1451527089955940" },
{ type_name: "为了你" , type_id: "TOPC1451527001597710" },
{ type_name: "朗读者第一季" , type_id: "TOPC1487120479377477" },
{ type_name: "挑战不可能第二季" , type_id: "TOPC1474277421637816" },
{ type_name: "精彩一刻" , type_id: "TOPC1451464786232149" },
{ type_name: "挑战不可能之加油中国" , type_id: "TOPC1547519813971570" },
{ type_name: "挑战不可能第一季" , type_id: "TOPC1452063816677656" },
{ type_name: "机智过人第三季" , type_id: "TOPC1564019920570762" },
{ type_name: "经典咏流传第二季" , type_id: "TOPC1547521714115947" },
{ type_name: "挑战不可能第三季" , type_id: "TOPC1509500865106312" },
{ type_name: "经典咏流传第一季" , type_id: "TOPC1513676755770201" },
{ type_name: "欢乐中国人第二季" , type_id: "TOPC1516784350726581" },
{ type_name: "故事里的中国第一季" , type_id: "TOPC1569729252342702" },
{ type_name: "你好生活第二季" , type_id: "TOPC1604397385056621" },
{ type_name: "喜上加喜" , type_id: "TOPC1590026042145705" },
{ type_name: "走在回家的路上" , type_id: "TOPC1577697653272281" },
{ type_name: "综艺盛典" , type_id: "TOPC1451985071887935" },
{ type_name: "艺术人生" , type_id: "TOPC1451984891490556" },
{ type_name: "全家好拍档" , type_id: "TOPC1474275463547690" },
{ type_name: "大魔术师" , type_id: "TOPC1451984047073332" },
{ type_name: "欢乐一家亲" , type_id: "TOPC1451984214170587" },
{ type_name: "开心辞典" , type_id: "TOPC1451984378754815" },
{ type_name: "综艺星天地" , type_id: "TOPC1451985188986150" },
{ type_name: "激情广场" , type_id: "TOPC1451984341218765" },
{ type_name: "笑星大联盟" , type_id: "TOPC1451984731428297" },
{ type_name: "天天乐" , type_id: "TOPC1451984447718918" },
{ type_name: "欢乐英雄" , type_id: "TOPC1451984242834620" },
{ type_name: "欢乐中国行" , type_id: "TOPC1451984301286720" },
{ type_name: "我爱满堂彩" , type_id: "TOPC1451538709371329" },
{ type_name: "综艺头条" , type_id: "TOPC1569226855085860" },
{ type_name: "中华情" , type_id: "TOPC1451541564922207" },
{ type_name: "魔法奇迹" , type_id: "TOPC1451542029126607" }
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