// ==UserScript==
// @name        网页标题重整
// @namespace   Chaoses Ib
// @include     http://*
// @include     https://*
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @grant       none
// @version     0.2.4
// @author      -
// @description 2020/10/4 下午1:14:10
// ==/UserScript==

(function(){
  //'use strict';
  var jq = $.noConflict(true);
  
  if(false){
    listenLoad(() => alert("load event listened"));
    /*window.addEventListener('load', function() {
         alert("load event listened");
    }, false);
    */
    
    window.onload = () => alert("onload");
    
    setTimeout(() => alert("timeout 3000"), 3000);
    
    document.ready(() => alert("document.ready"));
  }
  
  var kv = [
    {
      //"·怎么回复才有面子？？【杨超越吧】_百度贴吧"
      match: /https:\/\/tieba\.baidu\.com\/p\//,
      replace: /【([^】]+)】_百度贴吧$/,
      replacement: " - $1"
    },
    {
      //"【后宫推荐】五部经典的初次热血后宫场景（第一期）_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili"
      match: /https:\/\/www\.bilibili\.com\/video\//,
      mode: 3,
      replace: /_哔哩哔哩 \(゜-゜\)つロ 干杯~-bilibili$/,
      replacement: " - 哔哩哔哩"
    },
    {
      //"YYUT新搬运的个人空间 - 哔哩哔哩 ( ゜- ゜)つロ 乾杯~ Bilibili"
      match: /https:\/\/space\.bilibili\.com\//,
      mode: 2,
      replace: / - 哔哩哔哩 \( ゜- ゜\)つロ 乾杯~ Bilibili$/,
      replacement: " - 哔哩哔哩"
    },
    {
      //"《明日方舟》2020年感谢庆典分享会 - 明日方舟 - 哔哩哔哩直播，二次元弹幕直播平台"
      //https://live.bilibili.com/5555734
      match: /https:\/\/live\.bilibili\.com\//,
      replace: / - 哔哩哔哩直播，二次元弹幕直播平台$/,
      replacement: " - 哔哩哔哩直播"
    },
    {
      //"(130) 【歌枠】もうすぐ80万人！？sing a songぺこ！【ホロライブ/兎田ぺこら】 - YouTube"
      match: /https:\/\/www\.youtube\.com\//,
      mode: 3,
      replace: /\(\d+\) /
    },

    {
      //E小说
      //"第四百四十六章 欺负鬼_李凡慕千凝_我真不是隐世高手李凡_玄幻_E小说"
      match: /https:\/\/www\.zwda\.com\//,
      replace: /_[^_]*_[^_]*_[^_]*_E小说$/
    },
    
    {
      //"STM32使用printf函数打印的字符如何使用python脚本在PC上读取？-CSDN论坛"
      match: /https:\/\/bbs\.csdn\.net\//,
      replace: /-CSDN论坛$/,
      replacement: " - CSDN论坛"
    },
    {
      //"RDTSC命令详解_tbwork-CSDN博客"
      match: /https:\/\/blog\.csdn\.net\//,
      replace: /-CSDN博客$/,
      replacement: " - CSDN博客"
    },
    {
      //Python Docs
      //"3. An Informal Introduction to Python — Python 3.9.5 documentation"
      match: /https:\/\/docs\.python\.org\//,
      replace: /^(?:\d+\. )?(.+) — Python [\d.]+ documentation$/,
      replacement: function(title, g1){
        var version = /https:\/\/docs\.python\.org\/([\d.]+)\//.exec(window.location.href)[1]
        if(version == "2" || version == "3")
          return `${g1} - Python${version} Docs`
        else
          return `${g1} - Python ${version} Docs`
      }
    },
    
    
    {
      //"用户:脂肪酸钠 - 维基教科书，自由的教学读本"
      match: /https:\/\/zh\.wikibooks\.org\/wiki\//,
      replace: /，自由的教学读本$/
    },
    {
      //"科幻季刊 - 维基百科，自由的百科全书"
      match: /https:\/\/zh\.wikipedia\.org\/wiki\//,
      replace: /，自由的百科全书$/
    },
    {
      //"(9 封私信 / 80 条消息) 求推荐一款舒服好用的自定义键位鼠标，10-20个按键左右？工作用？ - 知乎"
      match: /https:\/\/www\.zhihu\.com\//,
      //match: /https:\/\/www\.zhihu\.com\/question\//,
      mode: 3,
      replace: /^\([^)]+\) /
    },
    {
      //"(4) What is the most disgusting thing you’ve ever seen on the Internet? - Quora"
      match: /https:\/\/www\.quora\.com\//,
      mode: 1,
      replace: /^\(\d+\) /
    },
    {
      //"联想秀大批「黑科技」，机器人、平板、折叠屏还有未来"
      //https://mp.weixin.qq.com/s/l8cWNPNQKVf2VhjIOLm_8g
      //https://mp.weixin.qq.com/s?__biz=MzA4NTI3NTkyNQ==&mid=2654011302&idx=1&sn=81083e26e6caf9bc6e2e64b80d4cb8cb&chksm=841e3bdcb369b2ca3eb5747c99da3b88bce4f955e219446e93d77f3103b38d1616d6debd5bbb&scene=126&sessionid=1604074548&key=360754e56e033319bb44ae0b839bed5bdc2a94abbab36e77fd3a9fb8e6b31a490d67920b4c36aa649304e3fe471665c054b2f82b4b4b6f1456f402306e4e81c865de83aed870df86688cbb2bc321f80f1e3f6e58a0146c41b4c2c7f59918d7200a6f0b04330f0786597b4aa39d4547546c595aca16e774e9055ba0a57b5d4c2c&ascene=1&uin=MjEwNzQ4OTcwMw%3D%3D&devicetype=Windows+10+x64&version=62090538&lang=zh_CN&exportkey=AarxJe31yI3qjdJizM4O%2FqA%3D&pass_ticket=u5jcivRZfrTkXLFTN6v7n2aC4AB4hPZmugRobPX6x5OQp3S1D%2BtXgiPV%2FY8%2BXMTT&wx_header=0
      match: /https:\/\/mp\.weixin\.qq\.com\/s/,
      mode: 1,
      replace: /^.+$/,
      replacement: function(title){
        //文章标题 - 公众号
        //var title = jq('meta[property="og:title"]').attr("content") + " - " + jq("#js_name")[0].outerText;
        //$('meta[property="og:title"]').attr("content", title);
        return title + " - " + jq("#js_name")[0].outerText;
      },
    },
    {
      //Twitter
      //https://twitter.com/poriuretan_dayo/status/1392659895825039362
      //"(20) ぽりうれたん on Twitter: "露出狂 https://t.co/lrXPqn46Yl" / Twitter"
      //"ぽりうれたん: 露出狂 - Twitter"
      match: /https:\/\/twitter\.com\//,
      mode: 3,
      replace: /(?:\(\d+\) )?(.*?) on Twitter: "(.*?)(?: https:\/\/t\.co\/[^"]+)?" \/ Twitter/,
      replacement: "$1: $2 - Twitter"
    }
  ];
  
  var url = window.location.href;
  //alert(url);
  for(let e of kv){
    if(!matchTitle(e.match)) continue;
    //alert(url + "\nmatch: " + e.match + " " + e.mode + " " + matchTitle(e.match) + " " + !matchTitle(e.match));
    if(e.mode == undefined) e.mode = 0;
    //if(e.replacement == undefiend) e.replacement = "";
    switch(e.mode){
      case 0: //立即修改
        replaceTitle(e.replace, e.replacement);
        break;
      case 3: //周期修改
        replaceTitle(e.replace, e.replacement);
        setInterval(() => replaceTitle(e.replace, e.replacement), 3000);
        break;
      case 2: //修改两次
        replaceTitle(e.replace, e.replacement);
      case 1: //滴答十秒
        listenClock(() => replaceTitle(e.replace, e.replacement));
    }
    break;
  }
    
  function matchTitle(regexp){
    return url.search(regexp) != -1;
  }
    
  function replaceTitle(regexp, replacement = ""){
    var newTitle = document.title.replace(regexp, replacement);
    var bool = document.title != newTitle;
    if(bool) document.title = newTitle;
    //alert(newTitle + bool);
    return bool;
  }

  function listenClock(func, timeout = 10000){
    var timer;
    var timer2 = setTimeout(function(){ clearTimeout(timer); }, timeout);
    (function(){
      if(func() != true){
        timer = setTimeout(arguments.callee, 1000);
        //alert("clock " + timer);
        //if(timer >= 10) clearTimeout(timer);
      } else clearTimeout(timer2);
    })();
  }

  function listenLoad(func){
    window.addEventListener('load', func, false);
  }
})();