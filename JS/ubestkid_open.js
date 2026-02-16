// 无搜索功能
import { _ } from './lib/cat.js';
let key = '🐯贝乐虎';
let HOST = 'https://vd.ubestkid.com';
let siteKey = '';
let siteType = 0;
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

async function request(reqUrl, referer, mth, data, hd) {
    const headers = {
        "User-Agent": MOBILE_UA,
    };
    if (referer) headers.referer = encodeURIComponent(referer);
    let res = await req(reqUrl, {
        method: mth || "get",
        headers: headers,
        data: data,
        postType: mth === "post" ? "json" : "",
    });
    return res.content;
}

async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype
}

async function home(filter) {
    const classes = [{ type_id: 65, type_name: '🐯最新上架' }, { type_id: 113, type_name: '🐯人气热播' }, { type_id: 56, type_name: '🐯经典童谣' }, { type_id: 137, type_name: '🐯开心贝乐虎' }, { type_id: 53, type_name: '🐯律动儿歌' }, { type_id: 59, type_name: '🐯经典儿歌' }, { type_id: 101, type_name: '🐯超级汽车1' }, { type_id: 119, type_name: '🐯超级汽车第二季' }, { type_id: 136, type_name: '🐯超级汽车第三季' }, { type_id: 95, type_name: '🐯三字经' }, { type_id: 133, type_name: '🐯幼儿手势舞' }, { type_id: 117, type_name: '🐯哄睡儿歌' }, { type_id: 70, type_name: '🐯英文儿歌' }, { type_id: 116, type_name: '🐯节日与节气' }, { type_id: 97, type_name: '🐯恐龙世界' }, { type_id: 55, type_name: '🐯动画片儿歌' }, { type_id: 57, type_name: '🐯流行歌曲' }, { type_id: 118, type_name: '🐯贝乐虎入园记' }, { type_id: 106, type_name: '🐯贝乐虎大百科' }, { type_id: 62, type_name: '🐯经典古诗' }, { type_id: 63, type_name: '🐯经典故事' }, { type_id: 128, type_name: '🐯萌虎学功夫' }, { type_id: 100, type_name: '🐯绘本故事' }, { type_id: 121, type_name: '🐯开心贝乐虎英文版' }, { type_id: 96, type_name: '🐯嗨贝乐虎情商动画' }, { type_id: 108, type_name: '🐯动物音乐派对' }, { type_id: 126, type_name: '🐯动物音乐派对英文版' }, { type_id: 105, type_name: '🐯奇妙的身体' }, { type_id: 124, type_name: '🐯奇妙的身体英文版' }, { type_id: 64, type_name: '🐯认知卡片' }, { type_id: 109, type_name: '🐯趣味简笔画' }, { type_id: 78, type_name: '🐯数字儿歌' }, { type_id: 120, type_name: '🐯识字体验版' }, { type_id: 127, type_name: '🐯启蒙系列体验版' }];
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
    const link = HOST + "/api/v1/bv/video";
    const pdata = { age: 1, appver: "6.1.9", egvip_status: 0, svip_status: 0, vps: 60, subcateId: 56, "p": 1 };
    const jo = JSON.parse(await request(link, "", "post", pdata)).result;
    const videos = [];
    _.each(jo.items, (it) => {
        // 将vid和videoResource编码到vod_id中
        const idObj = {
            vid: it.vid,
            resources: it.videoResource || []
        };
        videos.push({
            vod_id: JSON.stringify(idObj),
            vod_name: it.title,
            vod_pic: it.image,
            vod_remarks: '👀' + it.viewcount || '',
        })
    });
    return JSON.stringify({
        list: videos,
    })
}

async function category(tid, pg, filter, extend) {
    if (pg <= 0 || typeof pg == 'undefined') pg = 1;
    const link = HOST + "/api/v1/bv/video";
    const pdata = { age: 1, appver: "6.1.9", egvip_status: 0, svip_status: 0, vps: 60, subcateId: tid, "p": pg };
    const jo = JSON.parse(await request(link, "", "post", pdata)).result;
    const videos = [];
    _.each(jo.items, (it) => {
        // 将vid和videoResource编码到vod_id中
        const idObj = {
            vid: it.vid,
            resources: it.videoResource || []
        };
        videos.push({
            vod_id: JSON.stringify(idObj),
            vod_name: it.title,
            vod_pic: it.image,
            vod_remarks: '👀' + it.viewcount || '',
        })
    });
    const pgCount = pg * 60 > jo.total ? parseInt(pg) : parseInt(pg) + 1;
    return JSON.stringify({
        page: parseInt(pg),
        pagecount: pgCount,
        limit: 60,
        total: jo.total,
        list: videos,
    })
}

async function detail(id) {
    let idObj;
    try {
        idObj = JSON.parse(id);
    } catch (e) {
        // 如果解析失败，可能是旧格式或纯vid，兼容处理
        idObj = { vid: id, resources: [] };
    }
    
    const vod = {
        vod_id: id,
        vod_remarks: '',
        // 增加简介内容
        vod_content: '沧海笑学习php修改，加微c772109739可以购买小可音乐车载U盘和抖音同款各类车载DJ',
    };
    
    const playlist = [];
    
    // 如果有videoResource，构建多清晰度播放列表
    if (idObj.resources && idObj.resources.length > 0) {
        // 按清晰度排序：1080P > 720P > 540P > 其他，确保1080P默认选中
        const qualityOrder = { 'R1080P': 1, '1080P': 1, 'R720P': 2, '720P': 2, 'R540P': 3, '540P': 3, 'R480P': 4, '480P': 4, 'R360P': 5, '360P': 5 };
        
        const sortedResources = idObj.resources.sort((a, b) => {
            const orderA = qualityOrder[a.ratio] || 99;
            const orderB = qualityOrder[b.ratio] || 99;
            return orderA - orderB;
        });
        
        _.each(sortedResources, (res) => {
            playlist.push(res.ratioName + '$' + res.url);
        });
    } else {
        // 没有多清晰度信息，尝试通过vid获取（备用方案）
        // 如果idObj.vid是完整URL，直接使用
        if (typeof idObj.vid === 'string' && idObj.vid.startsWith('http')) {
            playlist.push('播放$' + idObj.vid);
        } else {
            playlist.push('播放$' + id);
        }
    }
    
    vod.vod_play_from = "道长在线";
    vod.vod_play_url = playlist.join('#');
    
    return JSON.stringify({
        list: [vod],
    });
}

async function play(flag, id, flags) {
    // console.debug('贝乐虎 id =====>' + id); // js_debug.log
    return JSON.stringify({
        parse: 0,
        url: id,
    });
}

async function search(wd, quick) {
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
