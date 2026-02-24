# -*- coding: utf-8 -*-
# 万宏达影院 - 影视壳子规范爬虫 (最终修复版)
import requests
from bs4 import BeautifulSoup
import re
import sys
import json
from urllib.parse import urljoin, quote, unquote

sys.path.append('..')
from base.spider import Spider


class Spider(Spider):
    def __init__(self):
        self.siteUrl = "http://www.whwhd.com"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "http://www.whwhd.com"
        }
        
    def getName(self):
        return "万宏达影院"
    
    def init(self, extend=""):
        pass
        
    def isVideoFormat(self, url):
        video_formats = ['.m3u8', '.mp4', '.flv', '.avi', '.mkv', '.mov', '.ts']
        return any(url.lower().endswith(fmt) for fmt in video_formats)
    
    def manualVideoCheck(self):
        return False
    
    def homeContent(self, filter):
        """首页分类 - 带二级筛选"""
        result = {
            "class": [
                {"type_id": "dianying", "type_name": "电影"},
                {"type_id": "dianshiju", "type_name": "电视剧"},
                {"type_id": "zongyi", "type_name": "综艺"},
                {"type_id": "dongman", "type_name": "动漫"},
                {"type_id": "xiaoshipin", "type_name": "短剧"}
            ],
            "filters": {
                "dianying": [
                    {"key": "class", "name": "类型", "value": [
                        {"n": "全部", "v": ""},
                        {"n": "动作", "v": "动作"},
                        {"n": "喜剧", "v": "喜剧"},
                        {"n": "爱情", "v": "爱情"},
                        {"n": "科幻", "v": "科幻"},
                        {"n": "恐怖", "v": "恐怖"},
                        {"n": "剧情", "v": "剧情"},
                        {"n": "战争", "v": "战争"},
                        {"n": "警匪", "v": "警匪"},
                        {"n": "犯罪", "v": "犯罪"},
                        {"n": "动画", "v": "动画"},
                        {"n": "奇幻", "v": "奇幻"},
                        {"n": "武侠", "v": "武侠"},
                        {"n": "冒险", "v": "冒险"}
                    ]},
                    {"key": "area", "name": "地区", "value": [
                        {"n": "全部", "v": ""},
                        {"n": "大陆", "v": "大陆"},
                        {"n": "香港", "v": "香港"},
                        {"n": "台湾", "v": "台湾"},
                        {"n": "美国", "v": "美国"},
                        {"n": "韩国", "v": "韩国"},
                        {"n": "日本", "v": "日本"}
                    ]},
                    {"key": "year", "name": "年份", "value": [
                        {"n": "全部", "v": ""},
                        {"n": "2026", "v": "2026"},
                        {"n": "2025", "v": "2025"},
                        {"n": "2024", "v": "2024"},
                        {"n": "2023", "v": "2023"},
                        {"n": "2022", "v": "2022"}
                    ]}
                ],
                "dianshiju": [
                    {"key": "class", "name": "类型", "value": [
                        {"n": "全部", "v": ""},
                        {"n": "古装", "v": "古装"},
                        {"n": "战争", "v": "战争"},
                        {"n": "喜剧", "v": "喜剧"},
                        {"n": "家庭", "v": "家庭"},
                        {"n": "犯罪", "v": "犯罪"},
                        {"n": "动作", "v": "动作"},
                        {"n": "剧情", "v": "剧情"}
                    ]},
                    {"key": "area", "name": "地区", "value": [
                        {"n": "全部", "v": ""},
                        {"n": "内地", "v": "内地"},
                        {"n": "韩国", "v": "韩国"},
                        {"n": "香港", "v": "香港"},
                        {"n": "台湾", "v": "台湾"},
                        {"n": "美国", "v": "美国"}
                    ]}
                ]
            }
        }
        return result
    
    def homeVideoContent(self):
        """首页推荐视频"""
        videos = []
        try:
            url = f"{self.siteUrl}/"
            rsp = requests.get(url, headers=self.headers, timeout=10)
            rsp.encoding = 'utf-8'
            soup = BeautifulSoup(rsp.text, 'html.parser')
            
            items = soup.select('li.col-lg-6.col-md-6.col-sm-4.col-xs-3')
            for item in items:
                a_tag = item.select_one('a.myui-vodlist__thumb')
                if not a_tag:
                    continue
                
                href = a_tag.get('href', '')
                title = a_tag.get('title', '')
                pic = a_tag.get('data-original', '') or a_tag.get('src', '')
                
                remark_tag = item.select_one('span.pic-text')
                remark = remark_tag.get_text(strip=True) if remark_tag else ""
                
                vid = self._extract_id(href)
                if vid and title:
                    videos.append({
                        "vod_id": vid,
                        "vod_name": title,
                        "vod_pic": urljoin(self.siteUrl, pic) if pic else "",
                        "vod_remarks": remark
                    })
                    if len(videos) >= 30:
                        break
                    
        except Exception as e:
            print(f"homeVideoContent error: {e}")
        
        return {"list": videos}
    
    def categoryContent(self, tid, pg, filter, extend):
        """分类内容"""
        result = {}
        videos = []
        
        try:
            # 构建正确的分类URL
            # 格式: /show/{分类}-----------{页码}.html
            url = f"{self.siteUrl}/show/{tid}-----------{pg}.html"
            
            rsp = requests.get(url, headers=self.headers, timeout=10)
            rsp.encoding = 'utf-8'
            soup = BeautifulSoup(rsp.text, 'html.parser')
            
            items = soup.select('li.col-lg-6.col-md-6.col-sm-4.col-xs-3')
            for item in items:
                a_tag = item.select_one('a.myui-vodlist__thumb')
                if not a_tag:
                    continue
                
                href = a_tag.get('href', '')
                title = a_tag.get('title', '')
                pic = a_tag.get('data-original', '') or a_tag.get('src', '')
                
                remark_tag = item.select_one('span.pic-text')
                remark = remark_tag.get_text(strip=True) if remark_tag else ""
                
                vid = self._extract_id(href)
                if vid and title:
                    videos.append({
                        "vod_id": vid,
                        "vod_name": title,
                        "vod_pic": urljoin(self.siteUrl, pic) if pic else "",
                        "vod_remarks": remark
                    })
            
            page_count = self._get_page_count(soup)
            
            result['list'] = videos
            result['page'] = pg
            result['pagecount'] = page_count
            result['limit'] = len(videos)
            result['total'] = page_count * len(videos) if videos else 0
            
        except Exception as e:
            print(f"categoryContent error: {e}")
            
        return result
    
    def detailContent(self, ids):
        """详情页"""
        result = {}
        videos = []
        
        for vid in ids:
            try:
                detail_urls = [
                    f"{self.siteUrl}/film/{vid}.html",
                    f"{self.siteUrl}/View/{vid}.html"
                ]
                
                html = ""
                for url in detail_urls:
                    rsp = requests.get(url, headers=self.headers, timeout=10)
                    rsp.encoding = 'utf-8'
                    if rsp.status_code == 200:
                        html = rsp.text
                        break
                
                if not html:
                    continue
                    
                soup = BeautifulSoup(html, 'html.parser')
                
                title_elem = soup.select_one('h1.title')
                title = title_elem.get_text(strip=True) if title_elem else ""
                
                pic_elem = soup.select_one('.myui-content__thumb img, .myui-vodlist__thumb img')
                pic = ""
                if pic_elem:
                    pic = pic_elem.get('data-original', '') or pic_elem.get('src', '')
                
                actor = self._extract_info(soup, '主演')
                director = self._extract_info(soup, '导演')
                area = self._extract_info(soup, '地区') or self._extract_info(soup, '分类')
                year = self._extract_info(soup, '年份')
                
                status = self._extract_info(soup, '状态')
                update_time = self._extract_info(soup, '更新')
                remark = f"{status} {update_time}".strip() if status or update_time else ""
                
                content_elem = soup.select_one('#jianjie + .myui-panel_bd .content, .desc, .sketch')
                content = ""
                if content_elem:
                    content = content_elem.get_text(strip=True)
                    content = re.sub(r'\.\.\.查看$', '', content).strip()
                
                # 解析播放列表
                play_from = []
                play_url = []
                
                playlist_wrappers = soup.select('.tab-content.myui-panel_bd, #playlist1, .myui-content__playlist')
                tab_links = soup.select('.nav-tabs li a')
                
                for idx, wrapper in enumerate(playlist_wrappers):
                    source_name = "播放源" + str(idx + 1)
                    if idx < len(tab_links):
                        source_name = tab_links[idx].get_text(strip=True)
                    
                    links = []
                    for a in wrapper.select('ul.myui-content__list li a, .playlist li a'):
                        href = a.get('href', '')
                        text = a.get_text(strip=True)
                        if href and text:
                            play_id = self._extract_play_id(href)
                            if play_id:
                                links.append(f"{text}${play_id}")
                    
                    if links:
                        play_from.append(source_name)
                        play_url.append("#".join(links))
                
                if not play_from:
                    play_btn = soup.select_one('a[href*="/Tvb/"]')
                    if play_btn:
                        href = play_btn.get('href', '')
                        play_id = self._extract_play_id(href)
                        if play_id:
                            play_from.append("默认")
                            play_url.append(f"正片${play_id}")
                
                videos.append({
                    "vod_id": vid,
                    "vod_name": title,
                    "vod_pic": urljoin(self.siteUrl, pic) if pic else "",
                    "vod_actor": actor,
                    "vod_director": director,
                    "vod_area": area,
                    "vod_year": year,
                    "vod_remarks": remark,
                    "vod_content": content,
                    "vod_play_from": "$$$".join(play_from) if play_from else "默认",
                    "vod_play_url": "$$$".join(play_url) if play_url else ""
                })
                
            except Exception as e:
                print(f"detailContent error for {vid}: {e}")
                continue
        
        result['list'] = videos
        return result
    
    def searchContent(self, key, quick, pg="1"):
        """搜索"""
        result = {}
        videos = []
        
        try:
            url = f"{self.siteUrl}/search/{quote(key)}----------{pg}---.html"
            rsp = requests.get(url, headers=self.headers, timeout=10)
            rsp.encoding = 'utf-8'
            soup = BeautifulSoup(rsp.text, 'html.parser')
            
            items = soup.select('li.col-lg-6.col-md-6.col-sm-4.col-xs-3')
            for item in items:
                a_tag = item.select_one('a.myui-vodlist__thumb')
                if not a_tag:
                    continue
                
                href = a_tag.get('href', '')
                title = a_tag.get('title', '')
                pic = a_tag.get('data-original', '') or a_tag.get('src', '')
                
                remark_tag = item.select_one('span.pic-text')
                remark = remark_tag.get_text(strip=True) if remark_tag else ""
                
                vid = self._extract_id(href)
                if vid and title:
                    videos.append({
                        "vod_id": vid,
                        "vod_name": title,
                        "vod_pic": urljoin(self.siteUrl, pic) if pic else "",
                        "vod_remarks": remark
                    })
            
            result['list'] = videos
            result['page'] = int(pg)
            result['pagecount'] = 9999
            result['limit'] = len(videos)
            result['total'] = 999999
            
        except Exception as e:
            print(f"searchContent error: {e}")
            
        return result
    
    def playerContent(self, flag, id, vipFlags):
        """播放器解析 - 强制直链，不走本地代理"""
        result = {}
        
        try:
            url = f"{self.siteUrl}/Tvb/{id}.html"
            
            rsp = requests.get(url, headers=self.headers, timeout=10)
            rsp.encoding = 'utf-8'
            
            real_url = ""
            
            # 从 player_aaaa 变量中提取
            player_match = re.search(r'var\s+player_aaaa\s*=\s*({.+?});', rsp.text, re.DOTALL)
            if player_match:
                try:
                    player_json = json.loads(player_match.group(1))
                    real_url = player_json.get('url', '')
                except:
                    pass
            
            if not real_url:
                result["parse"] = 1
                result["url"] = url
                result["header"] = json.dumps(self.headers)
                return result
            
            if real_url.startswith('//'):
                real_url = 'https:' + real_url
            
            # 关键：强制直链，防止壳子走本地代理
            # 方法1：使用parse=0且设置jx=0
            # 方法2：在URL中添加特殊标记（某些壳子会识别）
            # 方法3：使用header中的特殊字段
            
            result["parse"] = 0
            # 添加一个假的查询参数，让壳子认为这是已处理的URL
            # 某些壳子检测到特定参数会跳过代理
            if '?' not in real_url:
                real_url = real_url + "?direct=1"
            
            result["url"] = real_url
            result["header"] = json.dumps({
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "http://www.whwhd.com",
                "Origin": "http://www.whwhd.com",
                "X-Direct-Play": "1"  # 自定义header，某些壳子会识别
            })
            result["jx"] = 0
            
        except Exception as e:
            print(f"playerContent error: {e}")
            result["parse"] = 1
            result["url"] = f"{self.siteUrl}/Tvb/{id}.html"
            result["header"] = json.dumps(self.headers)
            
        return result
    
    def localProxy(self, param):
        """本地代理 - 如果壳子强制走代理，这里做中转"""
        import requests as req
        
        try:
            url = param.get('url', '')
            if not url:
                return {}
            
            # 解码URL
            if '%' in url:
                url = unquote(url)
            
            # 移除我们添加的direct参数
            url = re.sub(r'\?direct=1$', '', url)
            
            # 请求真实m3u8
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "http://www.whwhd.com",
                "Origin": "http://www.whwhd.com"
            }
            
            rsp = req.get(url, headers=headers, timeout=30, verify=False)
            
            content = rsp.content
            
            # 处理m3u8内容，转换相对路径
            if b'#EXTM3U' in content:
                text = content.decode('utf-8', errors='ignore')
                base_url = url.rsplit('/', 1)[0] + '/'
                
                lines = text.split('\n')
                new_lines = []
                for line in lines:
                    line = line.strip()
                    if line and not line.startswith('#') and not line.startswith('http'):
                        new_lines.append(base_url + line)
                    else:
                        new_lines.append(line)
                
                content = '\n'.join(new_lines).encode('utf-8')
            
            return {
                'code': 200,
                'header': {
                    'Content-Type': 'application/vnd.apple.mpegurl',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': content
            }
            
        except Exception as e:
            print(f"localProxy error: {e}")
            return {
                'code': 500,
                'header': {},
                'body': b''
            }
    
    # ============ 辅助方法 ============
    
    def _extract_id(self, url):
        """从URL中提取视频ID"""
        patterns = [
            r'/film/(\d+)\.html',
            r'/View/(\d+)\.html',
        ]
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return url.strip('/').split('/')[-1].replace('.html', '')
    
    def _extract_play_id(self, url):
        """从播放URL中提取ID"""
        match = re.search(r'/Tvb/([\d\-]+)\.html', url)
        if match:
            return match.group(1)
        return self._extract_id(url)
    
    def _get_page_count(self, soup):
        """获取总页数"""
        try:
            page_items = soup.select('.myui-page li a')
            max_page = 1
            for item in page_items:
                text = item.get_text(strip=True)
                if text.isdigit():
                    max_page = max(max_page, int(text))
                elif '末页' in text or '尾页' in text:
                    href = item.get('href', '')
                    match = re.search(r'(\d+)\.html$', href)
                    if match:
                        return int(match.group(1))
            return max_page
        except:
            return 999
    
    def _extract_info(self, soup, label):
        """提取详情信息"""
        try:
            p_elems = soup.select('.myui-content__detail p.data')
            for p in p_elems:
                text = p.get_text(strip=True)
                if label in text:
                    parts = text.split('：', 1)
                    if len(parts) > 1:
                        return parts[1].strip()
            return ""
        except:
            return ""