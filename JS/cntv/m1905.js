class Spider {
  getName() {
    return "1905 电影网";
  }

  init(extend = "") {
    // 在此处添加初始化逻辑
  }

  isVideoFormat(url) {
    // 在此处实现视频格式检查逻辑
  }

  manualVideoCheck() {
    // 在此处实现手动视频检查逻辑
  }

  homeContent(filter) {
    let result = {};
    let cateManual = {
      "电影": "n_1/o3p",
      "微电影": "n_1_c_922/o3p",
      "系列电影": "n_2/o3p",
      "记录片": "c_927/o3p",
      "晚会": "n_1_c_586/o3p",
      "独家": "n_1_c_178/o3p",
      "综艺": "n_1_c_1024/o3p",
      "体育": "n_1_c_1053/o3p"
    };
    let classes = [];
    for (let k in cateManual) {
      classes.push({
        "type_name": k,
        "type_id": cateManual[k]
      });
    }
    result["class"] = classes;
    return result;
  }

  homeVideoContent() {
    let result = {};
    let url = 'https://www.1905.com/vod/cctv6/lst/';
    let headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.43",
      "Referer": "https://www.1905.com/vod/list/n_1/o3p1.html",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
    };
    let rsp = this.fetch(url, headers);
    let html = this.html(rsp.text);
    let aList = html.xpath("//div[@class='grid-2x']/a");
    let videos = [];
    for (let a of aList) {
      let aid = a.xpath("./@href")[0]; // https://www.1905.com/vod/play/85646.shtml
      if ('//vip.1905.com' in str(aid)) {
        continue; // 跳过 VIP 视频
      }
      aid = this.regStr(reg = r'play/(.*?).sh', src = aid); // 85646
      let img = a.xpath('./img/@src')[0];
      let title = a.xpath('./img/@alt')[0];
      videos.push({
        "vod_id": aid,
        "vod_name": title,
        "vod_pic": img,
        "vod_remarks": ""
      });
    }
    result["list"] = videos;
    return result;
  }

  categoryContent(tid, pg, filter, extend) {
    let result = {};
    let url = 'https://www.1905.com/vod/list/{}{}.html'.format(tid, pg);
    let headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.43",
      "Referer": "https://www.1905.com/vod/list/n_1/o3p1.html",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
    };
    let rsp = this.fetch(url, headers);
    let html = this.html(rsp.text);
    let aList = (tid!= 'n_2/o3p')? html.xpath("//section[contains(@class,'search-list')]/div/a") : html.xpath("//div[@class='mod']/div[1]/a");
    let videos = [];
    let limit = len(aList);
    for (let a of aList) {
      let aid = a.xpath("./@href")[0]; // https://www.1905.com/vod/play/85646.shtml
      aid = this.regStr(reg = r'play/(.*?).sh', src = aid); // 85646
      let img = a.xpath('./img/@src')[0];
      let title = a.xpath('./@title')[0];
      videos.push({
        "vod_id": aid,
        "vod_name": title,
        "vod_pic": img,
        "vod_remarks": ""
      });
    }
    result["list"] = videos;
    result["page"] = pg;
    result["pagecount"] = 100;
    result["limit"] = limit;
    result["total"] = 100 * limit;
    return result;
  }

  detailContent(array) {
    let aid = array[0];
    let url = "https://www.1905.com/api/content/?callback=&m=Vod&a=getVodSidebar&id={0}&fomat=json".format(aid);
    let rsp = this.fetch(url);
    let root = json.loads(rsp.text);
    let title = root["title"];
    let pic = root["thumb"];
    let remark = root["commendreason"];
    let content = root["description"];
    let actor = root["starring"];
    let direct = root["direct"];
    let vod = {
      "vod_id": aid,
      "vod_name": title,
      "vod_pic": pic,
      "type_name": "",
      "vod_year": "",
      "vod_area": "",
      "vod_remarks": remark,
      "vod_actor": actor,
      "vod_director": direct,
      "vod_content": content
    };
    let vodItems = [];
    let series = root["info"]["series_data"];
    for (let ser of series) {
      vodItems.push(ser["title"] + "$" + ser["contentid"]);
    }
    let playList = [];
    let joinStr = "#".join(vodItems);
    playList.push(joinStr);
    vod["vod_play_from"] = "默认最高画质";
    vod["vod_play_url"] = "$$$".join(playList);
    let result = {
      "list": [vod]
    };
    return result;
  }

  searchContent(key, quick) {
    // 在此处实现搜索内容逻辑
  }
}
