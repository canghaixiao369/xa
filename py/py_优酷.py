# coding=utf-8
# !/usr/bin/python
import json
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pprint import pprint
from urllib.parse import quote
from pyquery import PyQuery as pq
import requests
sys.path.append('..')
from base.spider import Spider


class Spider(Spider):

    def init(self, extend=""):
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        pass

    def getName(self):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def destroy(self):
        pass

    host='https://www.youku.com'

    shost='https://search.youku.com'

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        'referer': f'{host}/',
        'Cookie': 'cna=8PoxIIT5IX8CAXW9X8dtcng8; __ysuid=1739263218185nJ2; isg=BNLSi6Bd4dVBKR0ptMT3jVG4I5i049Z9d6lpx5wrDAU-r3OphHOQjUkMGwuT304V; _m_h5_tk=2a2cf99969eeca1c4f964c88ed66f3bc_1740984288415; _m_h5_tk_enc=e718a138ce110ed6b16a10a387fce90d; __ayft=1740979793217; __aysid=1740979793217Dqe; __arpvid=1740979793217nXrxYC-1740979793230; __ayscnt=1; __aypstp=1; __ayspstp=1; xlly_s=1; tfstk=gDKKdzaBEAeL_UImxDggqVvBFjHM93pF6BJbq_f3PCd9hKPhPyj3VbpcsHfHKM18eQAGreAlA7ZJwKakwLkFF_OWw_YnSmveLgSSZ_nmmp7Wkauey_aIFG6VHAXCUiX6UgSSif4gVwoA4I8ZNuTBCABlEuwBN9asBTXLRg1CP5a1h115VQ_C1l6V3WwCFk_sBT51NgsWNdG5GYf_z_ZJlZ-k9mM8KPU9X9QdwufT23tgmw1fq1ZSahBpgs9C63t5t4bYkLOSwujXuCKRlpm8bMvv5G6pNmGCfKT9nwKKMkfPyhdpyBDuzOLJFnSFD8iBBMCdlHQUhxRXBLTcWhDj0MICOUjeE-hHBHdHLhpuFPsdxFQvvii4O_YMH3BJ4bo9MpTXNUIzvnxAxnFcMT4IBAUzzwXaGIomaqcU6LBOiv3uzz7ilOCmBrUzzwYVBsDgRzzP5OC..'
    }

    def cf(self,params,b=False):
        response = self.fetch(f'{self.host}/category/data?params={quote(json.dumps(params))}&optionRefresh=1&pageNo=1', headers=self.headers).json()
        data=response['data']['filterData']
        session=quote(json.dumps(data['session']))
        if b:
            return session,self.get_filter_data(data['filter']['filterData'][1:])
        return session

    def process_key(self, key):
        if '_' not in key:
            return key
        parts = key.split('_')
        result = parts[0]
        for part in parts[1:]:
            if part:
                result += part[0].upper() + part[1:]
        return result

    def get_filter_data(self, data):
        result = []
        try:
            for item in data:
                if not item.get('subFilter'):
                    continue
                first_sub = item['subFilter'][0]
                if not first_sub.get('filterType'):
                    continue
                filter_item = {
                    'key': self.process_key(first_sub['filterType']),
                    'name': first_sub['title'],
                    'value': []
                }
                for sub in item['subFilter']:
                    if 'value' in sub:
                        filter_item['value'].append({
                            'n': sub['title'],
                            'v': sub['value']
                        })
                if filter_item['value']:
                    result.append(filter_item)

        except Exception as e:
            print(f"处理筛选数据时出错: {str(e)}")

        return result

    def homeContent(self, filter):
        result = {}
        categories = ["电视剧", "电影", "综艺", "动漫", "少儿", "纪录片", "文化", "亲子", "教育", "搞笑", "生活",
                      "体育", "音乐", "游戏"]
        classes = [{'type_name': category, 'type_id': category} for category in categories]
        filters = {}
        self.typeid = {}
        with ThreadPoolExecutor(max_workers=len(categories)) as executor:
            tasks = {
                executor.submit(self.cf, {'type': category}, True): category
                for category in categories
            }

            for future in as_completed(tasks):
                try:
                    category = tasks[future]
                    session, ft = future.result()
                    filters[category] = ft
                    self.typeid[category] = session
                except Exception as e:
                    print(f"处理分类 {tasks[future]} 时出错: {str(e)}")

        result['class'] = classes
        result['filters'] = filters
        return result

    def homeVideoContent(self):
        doc=pq(self.session.get(self.host).text)
        doc('body div').eq(-1).remove()
        try:
            last_script = doc('script').eq(-1).text().split('__INITIAL_DATA__ =')[-1][:-1].replace('undefined','null')
            jdata = json.loads(last_script)
            vlist = []
            for i in jdata['moduleList']:
                if i.get('components') and type(i['components']) is list:
                    for j in i['components']:
                        if j.get('itemList') and type(j['itemList']) is list:
                            for k in j['itemList']:
                                if k.get('videoLink'):
                                    vlist.append({
                                        'vod_id': k.get('videoLink'),
                                        'vod_name': k.get('title'),
                                        'vod_pic': ('' if k.get('img', '').startswith('http') else 'https:')+k.get('img',''),
                                        'vod_year': k.get('rightTagText'),
                                        'vod_remarks': k.get('summary')
                                    })
            return {'list': vlist}
        except Exception as e:
            print(f"处理主页视频数据时出错: {str(e)}")
            return {'list': []}

    def categoryContent(self, tid, pg, filter, extend):
        result = {}
        vlist = []
        result['page'] = pg
        result['limit'] = 90
        result['total'] = 999999
        pagecount = 9999
        params = {'type': tid}
        id = self.typeid[tid]
        params.update(extend)
        if pg == '1':
            id=self.cf(params)
        data=self.session.get(f'{self.host}/category/data?session={id}&params={quote(json.dumps(params))}&pageNo={pg}').json()
        try:
            data=data['data']['filterData']
            for i in data['listData']:
                vlist.append({
                    'vod_id': i.get('videoLink'),
                    'vod_name': i.get('title'),
                    'vod_pic': i.get('img'),
                    'vod_year': i.get('rightTagText'),
                    'vod_remarks': i.get('summary')
                })
            self.typeid[tid]=quote(json.dumps(data['session']))
        except:
            pagecount=pg
        result['list'] = vlist
        result['pagecount'] = pagecount
        return result

    def detailContent(self, ids):
        id=('' if ids[0].startswith('http') else 'https:')+ids[0]
        vod = {
            'vod_id': '',
            'vod_name': '',
            'vod_pic': '',
            'type_name': '',
            'vod_year': '',
            'vod_area': '',
            'vod_remarks': '',
            'vod_actor': '',
            'vod_director': '',
            'vod_content': '',
            'vod_play_from': '',
            'vod_play_url': ''
        }
        pass

    def searchContent(self, key, quick, pg="1"):
        data=self.session.get(f'{self.shost}/api/search?pg={pg}&keyword={key}').json()
        vlist = []
        for i in data['pageComponentList']:
            if i.get('commonData'):
                i=i['commonData']
                if i.get('leftButtonDTO') and i['leftButtonDTO'].get('action') and i['leftButtonDTO']['action'].get('value'):
                    vlist.append({
                        'vod_id': i['leftButtonDTO']['action']['value'],
                        'vod_name': i['titleDTO'].get('displayName'),
                        'vod_pic': i['posterDTO'].get('vThumbUrl'),
                        'vod_year': i.get('feature'),
                        'vod_remarks': i.get('updateNotice')
                    })
        return {'list': vlist, 'page': pg}

    def playerContent(self, flag, id, vipFlags):
        return  {'parse': 1, 'url': id, 'header': ''}

    def localProxy(self, param):
        pass


if __name__ == "__main__":
    sp = Spider()
    formatJo = sp.init([])
    # formatJo = sp.homeContent(False)  # 主页，等于真表示启用筛选
    # formatJo = sp.homeVideoContent()  # 主页视频
    formatJo = sp.searchContent("斗罗",False,'1') # 搜索{"area":"大陆","by":"hits","class":"国产","lg":"国语"}
    # formatJo = sp.categoryContent('电视剧', '1', False, {})  # 分类
    # formatJo = sp.detailContent(['139625'])  # 详情
    # formatJo = sp.playerContent("","https://www.yingmeng.net/vodplay/140148-2-1.html",{}) # 播放
    # formatJo = sp.localProxy({"":"https://www.yingmeng.net/vodplay/140148-2-1.html"}) # 播放
    pprint(formatJo)
