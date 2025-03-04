import { createApp } from "vue";

const dialogData = [
  {
    scenario: "市場崩盤討論",
    messages: [
      {
        sender: "BTC鯨魚",
        content: "兄弟們，BTC要跌穿3萬了，準備好棺材吧",
        timestamp: Date.now() - 3600000 * 6,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "別慌，機構還在吸籌，這是假摔",
        timestamp: Date.now() - 3600000 * 5.8,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "什麼假摔？我昨天剛梭哈，現在血本無歸",
        timestamp: Date.now() - 3600000 * 5.5,
        contentType: "text",
      },
      {
        sender: "分析師Mike",
        content: "技術面看，已經跌破200日均線，完蛋了",
        timestamp: Date.now() - 3600000 * 5.2,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "淡定，這不過是牛市前的洗盤",
        timestamp: Date.now() - 3600000 * 5,
        contentType: "text",
      },
      {
        sender: "交易所小編",
        content: "平台一切正常，請理性投資哦",
        timestamp: Date.now() - 3600000 * 4.8,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "理性個屁！我房子都抵押買幣了",
        timestamp: Date.now() - 3600000 * 4.6,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "3萬有支撐？笑死，那是我的止損單",
        timestamp: Date.now() - 3600000 * 4.4,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "ETH才是救世主，BTC過氣了",
        timestamp: Date.now() - 3600000 * 4.2,
        contentType: "text",
      },
      {
        sender: "系統消息",
        content: "警告：市場波動加劇，請注意風險",
        timestamp: Date.now() - 3600000 * 4,
        contentType: "text",
        type: "system",
      },
      {
        sender: "分析師Mike",
        content: "這波拋售沒完，還有20%空間",
        timestamp: Date.now() - 3600000 * 3.8,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "20%？我直接清零了好嗎",
        timestamp: Date.now() - 3600000 * 3.6,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "我已經抄底了，感謝你們的恐慌",
        timestamp: Date.now() - 3600000 * 3.4,
        contentType: "text",
      },
      {
        sender: "交易所小編",
        content: "溫馨提示：下跌也是機會哦",
        timestamp: Date.now() - 3600000 * 3.2,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "機會？我看是送命題",
        timestamp: Date.now() - 3600000 * 3,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "誰能借我點USDT？我老婆要跟我離婚了",
        timestamp: Date.now() - 3600000 * 2.8,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "離婚就離婚，ETH會帶你飛",
        timestamp: Date.now() - 3600000 * 2.6,
        contentType: "text",
      },
      {
        sender: "分析師Mike",
        content: "別FOMO，這是熊市開端",
        timestamp: Date.now() - 3600000 * 2.4,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "熊市？我只看到財富自由的起點",
        timestamp: Date.now() - 3600000 * 2.2,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "起點？我連下車的機會都沒了",
        timestamp: Date.now() - 3600000 * 2,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "別哭，幣圈一日人間一年",
        timestamp: Date.now() - 3600000 * 1.8,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "現在不買ETH，過兩天只能看我開蘭博",
        timestamp: Date.now() - 3600000 * 1.6,
        contentType: "text",
      },
      {
        sender: "交易所小編",
        content: "請勿恐慌，歷史證明每次下跌後都會反彈",
        timestamp: Date.now() - 3600000 * 1.4,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "反彈？我現在只能去送外賣了",
        timestamp: Date.now() - 3600000 * 1.2,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "送外賣也不錯，至少穩",
        timestamp: Date.now() - 3600000 * 1,
        contentType: "text",
      },
      {
        sender: "分析師Mike",
        content: "穩？幣圈從來沒穩過",
        timestamp: Date.now() - 3600000 * 0.8,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "我剛加了100倍槓桿，梭哈抄底",
        timestamp: Date.now() - 3600000 * 0.6,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "100倍？大哥救我",
        timestamp: Date.now() - 3600000 * 0.4,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "救什麼救，自己上車啊！",
        timestamp: Date.now() - 3600000 * 0.2,
        contentType: "text",
      },
      {
        sender: "系統消息",
        content: "提醒：某交易所提幣已暫停",
        timestamp: Date.now() - 1800000,
        contentType: "text",
        type: "system",
      },
      {
        sender: "新手小白",
        content: "提幣暫停？我全倉還在裡面啊！",
        timestamp: Date.now() - 1700000,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "早就跟你說轉冷錢包，你不聽",
        timestamp: Date.now() - 1600000,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "冷錢包？ETH staking多香",
        timestamp: Date.now() - 1500000,
        contentType: "text",
      },
      {
        sender: "分析師Mike",
        content: "別吵了，盯著K線吧，馬上破底",
        timestamp: Date.now() - 1400000,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "破底我再買，這波穩賺",
        timestamp: Date.now() - 1300000,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "我連K線都不會看，怎麼辦",
        timestamp: Date.now() - 1200000,
        contentType: "text",
      },
      {
        sender: "交易所小編",
        content: "不會看K線？來我們平台學啊",
        timestamp: Date.now() - 1100000,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "學什麼學，直接梭哈才刺激",
        timestamp: Date.now() - 1000000,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "梭哈ETH吧，現在上車還不晚",
        timestamp: Date.now() - 900000,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "我已經沒錢上車了，賣腎嗎？",
        timestamp: Date.now() - 800000,
        contentType: "text",
      },
      {
        sender: "分析師Mike",
        content: "賣腎不如賣房，房市也崩了",
        timestamp: Date.now() - 700000,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "別賣腎，耐心等牛市就行",
        timestamp: Date.now() - 600000,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "牛市？我看是養老市",
        timestamp: Date.now() - 500000,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "嘲笑吧，等我ETH翻倍你們就哭了",
        timestamp: Date.now() - 400000,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "我現在只想哭，誰安慰我",
        timestamp: Date.now() - 300000,
        contentType: "text",
      },
      {
        sender: "交易所小編",
        content: "抱抱，跌完還有明天",
        timestamp: Date.now() - 200000,
        contentType: "text",
      },
      {
        sender: "分析師Mike",
        content: "明天？明天更慘",
        timestamp: Date.now() - 100000,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "慘什麼慘，長期看都是浮雲",
        timestamp: Date.now() - 50000,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "浮雲？我看是血海",
        timestamp: Date.now() - 10000,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "救命，我真的撐不下去了",
        timestamp: Date.now(),
        contentType: "text",
      },
    ],
  },
  {
    scenario: "被收割事件",
    messages: [
      {
        sender: "交易小韭菜",
        content: "兄弟們，我200萬USDT沒了，剛被清倉",
        timestamp: Date.now() - 3600000 * 6,
        contentType: "text",
      },
      {
        sender: "資深倒霉蛋",
        content: "什麼情況？你玩多大槓桿？",
        timestamp: Date.now() - 3600000 * 5.8,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "50倍，做多BTC，結果插針暴跌",
        timestamp: Date.now() - 3600000 * 5.6,
        contentType: "text",
      },
      {
        sender: "分析師老王",
        content: "50倍？你是來送快遞的吧",
        timestamp: Date.now() - 3600000 * 5.4,
        contentType: "text",
      },
      {
        sender: "暴富夢想家",
        content: "這波我看見了，1分鐘跌了5000刀",
        timestamp: Date.now() - 3600000 * 5.2,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "我還沒反應過來就爆倉了",
        timestamp: Date.now() - 3600000 * 5,
        contentType: "text",
      },
      {
        sender: "資深倒霉蛋",
        content: "兄弟，我懂，去年我也爆過",
        timestamp: Date.now() - 3600000 * 4.8,
        contentType: "text",
      },
      {
        sender: "加密貨幣教父",
        content: "槓桿是魔鬼，多少次了還不明白",
        timestamp: Date.now() - 3600000 * 4.6,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "我以為牛市來了，梭哈上車啊",
        timestamp: Date.now() - 3600000 * 4.4,
        contentType: "text",
      },
      {
        sender: "分析師老王",
        content: "牛市？這是大戶割你的車票",
        timestamp: Date.now() - 3600000 * 4.2,
        contentType: "text",
      },
      {
        sender: "系統消息",
        content: "用戶「幣圈新兵」加入群組",
        timestamp: Date.now() - 3600000 * 4,
        contentType: "text",
        type: "system",
      },
      {
        sender: "幣圈新兵",
        content: "剛入場，現在是抄底時機嗎？",
        timestamp: Date.now() - 3600000 * 3.8,
        contentType: "text",
      },
      {
        sender: "資深倒霉蛋",
        content: "抄底？看看這位兄弟的下場",
        timestamp: Date.now() - 3600000 * 3.6,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "別抄了，我就是前車之鑑",
        timestamp: Date.now() - 3600000 * 3.4,
        contentType: "text",
      },
      {
        sender: "暴富夢想家",
        content: "別怕，現在上車還能翻盤",
        timestamp: Date.now() - 3600000 * 3.2,
        contentType: "text",
      },
      {
        sender: "分析師老王",
        content: "翻盤？翻車還差不多",
        timestamp: Date.now() - 3600000 * 3,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "https://i.imgur.com/xyz123.jpg",
        timestamp: Date.now() - 3600000 * 2.8,
        contentType: "image",
      },
      {
        sender: "交易小韭菜",
        content: "這是我的爆倉截圖，紀念一下",
        timestamp: Date.now() - 3600000 * 2.6,
        contentType: "text",
      },
      {
        sender: "資深倒霉蛋",
        content: "哈哈哈，截圖都準備好了",
        timestamp: Date.now() - 3600000 * 2.4,
        contentType: "text",
      },
      {
        sender: "加密貨幣教父",
        content: "年輕人，學會現貨吧，槓桿不是你玩的",
        timestamp: Date.now() - 3600000 * 2.2,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "現貨？我連本金都沒了",
        timestamp: Date.now() - 3600000 * 2,
        contentType: "text",
      },
      {
        sender: "暴富夢想家",
        content: "沒本金就借啊，現在不梭哈啥時候梭？",
        timestamp: Date.now() - 3600000 * 1.8,
        contentType: "text",
      },
      {
        sender: "分析師老王",
        content: "借錢梭哈，你是嫌命長",
        timestamp: Date.now() - 3600000 * 1.6,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "我爸已經把我趕出家門了",
        timestamp: Date.now() - 3600000 * 1.4,
        contentType: "text",
      },
      {
        sender: "資深倒霉蛋",
        content: "趕出去？我還睡過橋洞呢",
        timestamp: Date.now() - 3600000 * 1.2,
        contentType: "text",
      },
      {
        sender: "加密貨幣教父",
        content: "橋洞也不錯，至少沒負債",
        timestamp: Date.now() - 3600000 * 1,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "負債？我信用卡都刷爆了",
        timestamp: Date.now() - 3600000 * 0.8,
        contentType: "text",
      },
      {
        sender: "暴富夢想家",
        content: "別慫，現在抄底，下個月開豪車",
        timestamp: Date.now() - 3600000 * 0.6,
        contentType: "text",
      },
      {
        sender: "分析師老王",
        content: "豪車？我看是共享單車",
        timestamp: Date.now() - 3600000 * 0.4,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "我連單車都買不起了",
        timestamp: Date.now() - 3600000 * 0.2,
        contentType: "text",
      },
      {
        sender: "資深倒霉蛋",
        content: "走路吧，健身還省錢",
        timestamp: Date.now() - 1800000,
        contentType: "text",
      },
      {
        sender: "加密貨幣教父",
        content: "這就是幣圈，歡迎體驗",
        timestamp: Date.now() - 1700000,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "體驗？我只想退圈",
        timestamp: Date.now() - 1600000,
        contentType: "text",
      },
      {
        sender: "暴富夢想家",
        content: "退什麼圈，現在進場才是王道",
        timestamp: Date.now() - 1500000,
        contentType: "text",
      },
      {
        sender: "分析師老王",
        content: "王道？我看是亡道",
        timestamp: Date.now() - 1400000,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "我現在只剩泡麵錢了",
        timestamp: Date.now() - 1300000,
        contentType: "text",
      },
      {
        sender: "資深倒霉蛋",
        content: "泡麵挺好，我吃了三年",
        timestamp: Date.now() - 1200000,
        contentType: "text",
      },
      {
        sender: "加密貨幣教父",
        content: "三年後你會感謝這一刻",
        timestamp: Date.now() - 1100000,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "感謝？我只想報警",
        timestamp: Date.now() - 1000000,
        contentType: "text",
      },
      {
        sender: "暴富夢想家",
        content: "警察管不了幣圈，快上車吧",
        timestamp: Date.now() - 900000,
        contentType: "text",
      },
      {
        sender: "分析師老王",
        content: "上車？我看是上天",
        timestamp: Date.now() - 800000,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "我已經在地獄了",
        timestamp: Date.now() - 700000,
        contentType: "text",
      },
      {
        sender: "資深倒霉蛋",
        content: "地獄歡迎你，兄弟",
        timestamp: Date.now() - 600000,
        contentType: "text",
      },
      {
        sender: "加密貨幣教父",
        content: "地獄出英雄，堅持住",
        timestamp: Date.now() - 500000,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "英雄？我連狗熊都不是",
        timestamp: Date.now() - 400000,
        contentType: "text",
      },
      {
        sender: "暴富夢想家",
        content: "別自卑，現在梭哈還能翻身",
        timestamp: Date.now() - 300000,
        contentType: "text",
      },
      {
        sender: "分析師老王",
        content: "翻身？我看是翻車",
        timestamp: Date.now() - 200000,
        contentType: "text",
      },
      {
        sender: "交易小韭菜",
        content: "我已經沒車可翻了",
        timestamp: Date.now() - 100000,
        contentType: "text",
      },
      {
        sender: "資深倒霉蛋",
        content: "沒事，徒步也挺好",
        timestamp: Date.now() - 50000,
        contentType: "text",
      },
      {
        sender: "加密貨幣教父",
        content: "這就是幣圈的洗禮，挺過去就行",
        timestamp: Date.now(),
        contentType: "text",
      },
    ],
  },
  {
    scenario: "FOMO上車熱潮",
    messages: [
      {
        sender: "BTC鯨魚",
        content: "BTC衝破6萬了，快上車！",
        timestamp: Date.now() - 3600000 * 6,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "ETH也跟著飛，現在不買等什麼？",
        timestamp: Date.now() - 3600000 * 5.8,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "真的假的？我還有1000U要不要梭？",
        timestamp: Date.now() - 3600000 * 5.6,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "梭啊！這波不上車就只能看我開蘭博",
        timestamp: Date.now() - 3600000 * 5.4,
        contentType: "text",
      },
      {
        sender: "分析師Mike",
        content: "別急，RSI超買了，小心回調",
        timestamp: Date.now() - 3600000 * 5.2,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "回調？我看是直奔10萬",
        timestamp: Date.now() - 3600000 * 5,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "ETH才是王道，Layer 2要爆發了",
        timestamp: Date.now() - 3600000 * 4.8,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "我剛加了10倍槓桿，爽歪歪",
        timestamp: Date.now() - 3600000 * 4.6,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "10倍？小弟弟，準備好爆倉吧",
        timestamp: Date.now() - 3600000 * 4.4,
        contentType: "text",
      },
      {
        sender: "系統消息",
        content: "用戶「牛市狂人」加入群組",
        timestamp: Date.now() - 3600000 * 4.2,
        contentType: "text",
        type: "system",
      },
      {
        sender: "牛市狂人",
        content: "兄弟們，牛市已確認，all in吧！",
        timestamp: Date.now() - 3600000 * 4,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "早就all in了，現在賺麻了",
        timestamp: Date.now() - 3600000 * 3.8,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "還沒上車的都後悔去吧",
        timestamp: Date.now() - 3600000 * 3.6,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "我爸不讓我玩幣，怎麼辦",
        timestamp: Date.now() - 3600000 * 3.4,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "不聽老人言，吃虧在眼前",
        timestamp: Date.now() - 3600000 * 3.2,
        contentType: "text",
      },
      {
        sender: "牛市狂人",
        content: "聽什麼爸，直接梭哈財富自由",
        timestamp: Date.now() - 3600000 * 3,
        contentType: "text",
      },
      {
        sender: "分析師Mike",
        content: "你們這群FOMO怪，早晚被割",
        timestamp: Date.now() - 3600000 * 2.8,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "割誰？我可是割韭菜的那個",
        timestamp: Date.now() - 3600000 * 2.6,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "ETH馬上破萬，誰還不信？",
        timestamp: Date.now() - 3600000 * 2.4,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "我把生活費都投進去了",
        timestamp: Date.now() - 3600000 * 2.2,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "生活費？兄弟你真會玩",
        timestamp: Date.now() - 3600000 * 2,
        contentType: "text",
      },
      {
        sender: "牛市狂人",
        content: "生活費算啥，我房子都抵押了",
        timestamp: Date.now() - 3600000 * 1.8,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "抵押？我直接賣了買BTC",
        timestamp: Date.now() - 3600000 * 1.6,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "現在不買ETH，過年只能吃泡麵",
        timestamp: Date.now() - 3600000 * 1.4,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "我已經在吃泡麵了，還能上車嗎",
        timestamp: Date.now() - 3600000 * 1.2,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "能，賣腎還能再戰",
        timestamp: Date.now() - 3600000 * 1,
        contentType: "text",
      },
      {
        sender: "牛市狂人",
        content: "腎不值錢，借貸上車吧",
        timestamp: Date.now() - 3600000 * 0.8,
        contentType: "text",
      },
      {
        sender: "分析師Mike",
        content: "借貸？你們真是瘋了",
        timestamp: Date.now() - 3600000 * 0.6,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "瘋？我看是天才",
        timestamp: Date.now() - 3600000 * 0.4,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "天才在左，韭菜在右",
        timestamp: Date.now() - 3600000 * 0.2,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "我算哪個？我不會是韭菜吧",
        timestamp: Date.now() - 1800000,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "你猜呢？哈哈哈",
        timestamp: Date.now() - 1700000,
        contentType: "text",
      },
      {
        sender: "牛市狂人",
        content: "別管韭菜，上車就行",
        timestamp: Date.now() - 1600000,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "車都開到月球了，還不快點",
        timestamp: Date.now() - 1500000,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "月球算啥，ETH要上火星",
        timestamp: Date.now() - 1400000,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "我借了5萬，準備all in",
        timestamp: Date.now() - 1300000,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "5萬？勉強夠車票",
        timestamp: Date.now() - 1200000,
        contentType: "text",
      },
      {
        sender: "牛市狂人",
        content: "all in好樣的，年底見豪宅",
        timestamp: Date.now() - 1100000,
        contentType: "text",
      },
      {
        sender: "分析師Mike",
        content: "豪宅？我看是狗窩",
        timestamp: Date.now() - 1000000,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "狗窩也比你強，我賺了500萬",
        timestamp: Date.now() - 900000,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "500萬算啥，ETH翻倍我賺1000萬",
        timestamp: Date.now() - 800000,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "我能不能賺個10萬就跑",
        timestamp: Date.now() - 700000,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "10萬？你也太沒志氣了",
        timestamp: Date.now() - 600000,
        contentType: "text",
      },
      {
        sender: "牛市狂人",
        content: "沒志氣也行，快上車別磨蹭",
        timestamp: Date.now() - 500000,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "磨蹭啥，現在不買過兩天哭去",
        timestamp: Date.now() - 400000,
        contentType: "text",
      },
      {
        sender: "ETH信徒",
        content: "哭？我看是跪著喊爸爸",
        timestamp: Date.now() - 300000,
        contentType: "text",
      },
      {
        sender: "新手小白",
        content: "我已經跪了，誰救我",
        timestamp: Date.now() - 200000,
        contentType: "text",
      },
      {
        sender: "鎖倉一哥",
        content: "救不了，自己爬上車",
        timestamp: Date.now() - 100000,
        contentType: "text",
      },
      {
        sender: "牛市狂人",
        content: "爬也行，牛市不等人",
        timestamp: Date.now() - 50000,
        contentType: "text",
      },
      {
        sender: "BTC鯨魚",
        content: "不等人+1，下一站10萬刀",
        timestamp: Date.now(),
        contentType: "text",
      },
    ],
  },
];

// Add crypto terms that will trigger animations
const rocketTriggerTerms = [
  "to the moon",
  "moon",
  "hodl",
  "lambo",
  "買入",
  "抄底",
  "暴漲",
  "牛市",
  "btc",
  "eth",
  "bitcoin",
  "ethereum",
  "比特幣",
  "以太坊",
  "pi",
  "漲",
  "幣圈",
  "加密貨幣",
  "區塊鏈",
  "挖礦",
  "空投",
  "defi",
  "nft",
  "大的要來了",
  "大的來了",
  "all in",
  "ath",
  "fomo",
  "dyor",
  "satoshi",
  "翻倍",
  "上月球",
  "财富自由",
  "拉盤",
  "出貨",
  "割韭菜",
  "賺麻了",
  "歐印",
  "上車",
  "下車",
  "屯幣",
  "套牢",
  "gm",
  "gn",
  "早安",
  "晚安",
  "diamond hands",
  "paper hands",
  "💎🙌",
  "🚀",
  "🌙",
  "🐂",
  "🧸",
  "🐋",
  "🦈",
  "🐳",
  "🦐",
  "早",
  "晚",
  "財富密碼",
  "梭哈",
  "爆倉",
  "插針",
  "減半",
  "百倍幣",
  "現貨",
  "合約",
  "洗盤",
  "止盈",
  "止損",
  "拉升",
  "砸盤",
  "山寨幣",
  "主流幣",
];

// Add response triggers for automatic replies
const responseTriggers = {
  eth: [
    "ETH必上10萬U，見證歷史吧！",
    "ETH將超越BTC，就在今年！",
    "以太坊2.0徹底解決了擴容問題，還有什麼理由不買？",
    "PoS機制讓ETH完勝比特幣，環保又高效",
    "隨著DeFi生態擴張，ETH將成為Web3基石",
    "ETH現在還便宜，再不上車就真的只能看別人發財了",
    "聽說機構都在大量買入ETH，馬上就要爆發了",
    "ETH才是未來！比特幣註定被淘汰",
    "Layer 2解決方案讓ETH速度媲美VISA，牛市要來了",
    "上個月梭哈ETH，現在已經賺了3倍，要起飛了！",
    "ETH這價格不買，過兩天只能跪著喊爸爸",
    "別等了，ETH要上火星，現在上車還不晚",
    "我的ETH已經翻倍，你還在等什麼？",
    "ETH生態無敵，誰還敢說它是垃圾？",
    "昨天抄底ETH，今天賺麻了，快跟上",
    "ETH牛市領頭羊，不信你就輸了",
    "再不買ETH，過年只能吃土",
    "ETH要破萬了，FOMO的感覺真爽",
    "聽我一句，ETH梭哈，下個月開豪車",
    "ETH才是真正的財富密碼，別錯過",
  ],
  btc: [
    "BTC永遠是王者，其他幣都是跟風",
    "薩爺的設計太完美了，比特幣才是唯一去中心化的幣",
    "10萬美金不是終點，而是起點",
    "跌了這麼多次還活得好好的，SoV無誤",
    "0.01個BTC就能走向財富自由",
    "BTC減半要來了，現在不買啥時候買？",
    "比特幣是信仰，誰敢說不行？",
    "我2017年買的BTC，現在賺翻了",
    "BTC上月球只是時間問題",
    "別FOMO，BTC現在還是底部，快上車",
    "機構都在囤BTC，你還在觀望？",
    "BTC跌到3萬我都不怕，長期必漲",
    "比特幣是數字黃金，永遠不會過時",
    "梭哈BTC，下個月住豪宅",
    "BTC牛市一來，誰都攔不住",
    "昨天抄底BTC，今天已經賺了50%",
    "BTC才是幣圈的根，其他都是浮雲",
    "不買BTC，你就不是真幣圈人",
    "BTC要破10萬了，快跟上這班車",
    "比特幣永不眠，現在進場還不晚",
  ],
  pi: [
    "Pi幣上線就值1000美金，現在挖還不晚",
    "我已經挖了2年，有10萬個Pi了",
    "Pi網絡真的要上主網了嗎？等太久了",
    "Pi就算值1塊錢，我也贏麻了",
    "我推薦了整個家族都在挖Pi",
    "Pi是下一個百倍幣，信我沒錯",
    "挖Pi不費電，為啥不試試？",
    "Pi上線那天，我要請全村吃飯",
    "現在不挖Pi，過兩年後悔死",
    "Pi幣免費挖，財富自由第一步",
    "聽說Pi要上交易所，準備起飛",
    "我挖Pi挖到手軟，爽歪歪",
    "Pi網絡改變世界，你還不加入？",
    "別懷疑，Pi就是下個BTC",
    "Pi幣現在是0元，未來是無限",
    "挖Pi的都是聰明人，你呢？",
    "Pi上主網我就能退休了",
    "Pi是幣圈的黑馬，快上車",
    "我朋友靠Pi賺了100萬，真的",
    "Pi幣不挖，你就錯過了人生",
  ],
  luna: [
    "別提這個傷心事了...",
    "我永遠支持Do Kwon，Luna 2.0會東山再起",
    "虧了900萬，現在只能做外賣了",
    "那不是崩盤，是暗殺",
    "我曾經是百萬富翁，20分鐘後變成負債累累",
    "Luna害我賣了車，現在只能走路",
    "Luna 2.0要來了，我還有救嗎？",
    "別笑，我Luna套牢還在等翻身",
    "Luna暴跌那天，我老婆跑了",
    "Luna是我的痛，永遠的痛",
    "我梭哈Luna，結果睡大街",
    "Luna再漲起來，我要報仇",
    "別提Luna，我心臟受不了",
    "Luna崩盤，我直接破產",
    "Luna害我賣房，現在租房子住",
    "我還信Luna能回來，你信嗎？",
    "Luna是教訓，永遠別碰穩定幣",
    "Luna跌到0，我人生也歸0",
    "我夢到Luna漲回來，醒來哭了",
    "Luna是我幣圈的噩夢，救命",
  ],
  doge: [
    "狗狗幣上1美元不是夢！",
    "馬斯克推特又提到DOGE了，趕快上車",
    "我2019年買的，已經漲了1000倍了",
    "狗狗軍團永不為奴！",
    "DOGE就是人民的幣，不像那些精英項目",
    "DOGE要上月球，馬斯克說了算",
    "現在不買DOGE，過兩天哭去",
    "狗狗幣翻倍，我要買跑車",
    "DOGE是迷因，也是財富",
    "我全倉DOGE，準備暴富",
    "馬斯克一發言，DOGE就飛",
    "DOGE牛市來了，快跟上",
    "狗狗幣不買，你就out了",
    "我靠DOGE賺了50萬，太爽了",
    "DOGE是散戶的希望，梭哈吧",
    "別看不起DOGE，它會讓你驚訝",
    "狗狗幣要破紀錄，快上車",
    "DOGE漲起來，谁敢不服？",
    "我昨天抄底DOGE，今天翻倍",
    "DOGE是下一個BTC，信不信由你",
  ],
  shib: [
    "SHIB殺死DOGE指日可待",
    "下一個百倍幣，SHIB軍團集合！",
    "持有1億SHIB不虧",
    "燒幣計劃非常成功，馬上就到0.01了",
    "柴犬生態比狗狗幣強多了",
    "SHIB要上月球，現在買還不晚",
    "我全倉SHIB，準備財富自由",
    "SHIB翻倍那天，我請客",
    "別等了，SHIB牛市已啟動",
    "SHIB是迷因幣之王，梭哈吧",
    "柴犬軍團崛起，誰敢小看？",
    "SHIB燒幣速度驚人，快上車",
    "我靠SHIB賺了10倍，太爽了",
    "SHIB生態擴張，下個ETH就是它",
    "現在不買SHIB，過年吃泡麵",
    "SHIB要破紀錄，FOMO起來",
    "柴犬幣翻身那天，我就退休",
    "SHIB是散戶的救星，all in吧",
    "我昨天抄底SHIB，今天賺麻了",
    "SHIB才是真正的財富密碼",
  ],
  暴跌: [
    "別慌，這只是健康回調",
    "抄底的機會來了，滿倉梭哈",
    "已經習慣了，幣圈一日，人間一年",
    "這還不算跌，2018年跌了90%我都挺過來了",
    "虧錢的舉手，我已經麻木了",
    "暴跌？我連帳戶都不敢看",
    "這是鯨魚在洗盤，別下車",
    "跌成這樣，我老婆要跟我離婚了",
    "抄底失敗，我直接爆倉",
    "暴跌是常態，淡定點",
    "我昨天買的，今天跌了50%",
    "跌到賣腎，我都不怕",
    "這波暴跌割了我一輛車",
    "別哭，跌完還有明天",
    "暴跌？我已經破產了",
    "抄底抄到山頂，救命",
    "跌成這樣，只能吃泡麵了",
    "暴跌是機會，快上車啊",
    "我套牢了，誰來救我",
    "跌到懷疑人生，幣圈真難",
  ],
  暴漲: [
    "我就說要梭哈吧，現在後悔了吧",
    "財富自由，就是這麼簡單",
    "牛市已確認，準備起飛",
    "漲到懷疑人生，我的算力挖到手軟",
    "幣圈一天，人間一年，我已經財富自由了",
    "暴漲那天，我請全群吃飯",
    "現在不買，過兩天只能看我開豪車",
    "漲起來誰敢不服？梭哈吧",
    "我昨天抄底，今天賺麻了",
    "暴漲是財富密碼，快跟上",
    "牛市來了，all in不後悔",
    "漲到手抖，我要退休了",
    "這波暴漲，我賺了一套房",
    "別FOMO，現在上車還不晚",
    "暴漲爽到飛起，誰還打工？",
    "我全倉進去，現在賺翻了",
    "漲成這樣，人生巔峰啊",
    "暴漲是散戶的春天，梭哈吧",
    "昨天還在哭，今天笑開花",
    "這波暴漲，我要上月球了",
  ],
  gm: [
    "GM! 早安幣圈兄弟姐妹們！",
    "GM！今天行情超好！",
    "GM是幣圈傳統，每天打GM的人都賺錢了",
    "GM！準備好抄底了嗎？",
    "早安！希望今天你的幣都能漲10倍",
    "GM！我已經盯盤三天沒睡了",
    "早安，昨晚做夢都夢到暴富了",
    "GM！今天要梭哈，誰跟我？",
    "早安，牛市氣息越來越濃",
    "GM！賺錢的日子開始了",
    "早安，昨天抄底今天翻倍",
    "GM！今天目標財富自由",
    "早安，兄弟們一起上車吧",
    "GM！行情要爆發，快準備",
    "早安，今天不賺就對不起自己",
    "GM！我已經all in了",
    "早安，暴漲就在今天",
    "GM！誰還沒上車？快點",
    "早安，幣圈從不睡覺",
    "GM！今天是我們的日子",
  ],
  gn: [
    "GN！歐洲美國兄弟們剛醒，接棒了",
    "晚安，明天醒來就財富自由了",
    "GN！希望睡醒能看到好消息",
    "幣圈從不睡覺，我只是休息一下",
    "晚安，明天再戰",
    "設好止損才能睡個好覺啊",
    "GN！今晚夢到BTC破10萬",
    "晚安，明天抄底去",
    "GN！賺錢的夢要做足",
    "晚安，幣圈永不熄火",
    "GN！今晚暴漲我可別錯過",
    "晚安，明天上車繼續戰",
    "GN！睡一覺起來賺麻了",
    "晚安，止損設好安心睡",
    "GN！明天牛市見",
    "晚安，今晚不盯盤了",
    "GN！希望醒來帳戶翻倍",
    "晚安，幣圈的夜永遠精彩",
    "GN！明天財富自由第一步",
    "晚安，兄弟們明天見",
  ],
};
const randomUserMessages = [
  "剛看了K線，感覺要漲了",
  "有人知道bybit交易所還能提幣嗎？",
  "我的錢包被盜了，怎麼辦",
  "現在的價格太誘人了，想加倉",
  "大戶在洗盤，別被騙了",
  "有大佬分析下行情嗎？",
  "推薦個靠譜的錢包",
  "聽說監管又有新政策了",
  "這個項目方跑路了嗎？",
  "我的質押收益到賬了，爽歪歪",
  "被清算了，求安慰",
  "剛抄底了一個新幣，感覺要騰飛",
  "鯨魚大戶又在出貨了",
  "暴跌的時候才是機會",
  "比特幣減半要來了，準備好了嗎？",
  "我梭哈了，現在心跳加速",
  "這波插針害我爆倉了",
  "誰有內幕消息，快分享",
  "交易所又崩了，氣死我了",
  "剛賣房all in，求好運",
  "抄底抄到山頂，心態崩了",
  "現在不買，過兩天哭去",
  "我的幣跌到只剩渣了",
  "剛入場就被割，救命",
  "這幣要上月球，快上車",
  "誰知道下個百倍幣是啥？",
  "我套牢半年了，還能解套嗎",
  "昨天賺了，今天全還回去了",
  "止損沒設，現在後悔死了",
  "聽說BTC要破10萬，真的假的",
  "我老婆不讓我玩幣，咋辦",
  "剛挖了點Pi，感覺要發財",
  "交易所提幣排隊，我慌了",
  "這波暴漲沒跟上，氣死",
  "我的NFT賣不出去了，咋整",
  "剛借錢加倉，求不爆倉",
  "誰有冷錢包教程，快教我",
  "這項目是空氣幣吧？跑路了",
  "我連續三天沒睡，盯盤中",
  "剛漲了10%，要不要賣？",
  "合約玩崩了，求復仇策略",
  "聽說機構進場了，真的嗎",
  "我的ETH staking收益好低",
  "暴跌那天我還在睡覺",
  "誰能借我點USDT救急",
  "這波牛市我必須上車",
  "剛被詐騙群騙了，心態炸",
  "我的幣被鎖倉，解不開",
  "昨天抄底，今天又跌了",
  "幣圈太刺激，我要退圈",
];

// Random user names for dynamic joining/leaving
const randomUserNames = [
  "比特大戶",
  "鏈上分析師",
  "幣圈紅人",
  "加密愛好者",
  "挖礦大神",
  "技術韭菜",
  "合約玩家",
  "幣安信徒",
  "DeFi達人",
  "NFT藝術家",
  "以太坊礦工",
  "加密萌新",
  "鯨魚觀察員",
  "幣圈老韭菜",
  "頭號玩家",
  "區塊鏈專家",
  "交易高手",
  "資深割韭菜",
  "鎖倉達人",
  "波段交易者",
  "山寨幣之王",
  "現貨穩健派",
  "槓桿狂人",
  "抄底先鋒",
  "止損受害者",
  "財富夢想家",
  "冷錢包衛士",
  "熱錢包玩家",
  "空投獵手",
  "質押狂熱者",
  "梭哈勇士",
  "爆倉幸存者",
  "幣圈段子王",
  "K線大師",
  "跑路預言家",
  "監管恐慌者",
  "迷因幣教主",
  "減半信徒",
  "散戶領袖",
  "機構內鬼",
  "追漲殺跌者",
  "財富守護神",
  "暴富幻想家",
  "破產詩人",
  "信仰傳教士",
  "幣圈老媽",
  "技術宅男",
  "貪婪之眼",
  "恐懼之手",
  "區塊鏈先知",
];

// Cryptocurrency price data
const cryptoPrices = [
  { symbol: "BTC", name: "Bitcoin", price: 63245.82, change: 2.5 },
  { symbol: "ETH", name: "Ethereum", price: 3471.91, change: -1.2 },
  { symbol: "BNB", name: "Binance Coin", price: 567.32, change: 0.8 },
  { symbol: "SOL", name: "Solana", price: 142.68, change: 5.3 },
  { symbol: "DOGE", name: "Dogecoin", price: 0.12, change: -2.7 },
  { symbol: "ADA", name: "Cardano", price: 0.43, change: 0.3 },
  { symbol: "DOT", name: "Polkadot", price: 6.58, change: 1.9 },
  { symbol: "XRP", name: "Ripple", price: 0.58, change: 3.1 },
  { symbol: "SHIB", name: "Shiba Inu", price: 0.000021, change: -4.5 },
];

const cryptoEmojis = {
  btc: '<i class="fa-brands fa-bitcoin"></i>',
  eth: '<i class="fa-brands fa-ethereum"></i>',
  doge: "Ð",
  ada: "₳",
  pi: "π",
};

const app = createApp({
  data() {
    return {
      currentUser: "您",
      groupMembers: 42,
      pinnedMessage: "重要通知：本群嚴禁發送詐騙訊息",
      messages: [],
      newMessage: "",
      showShareModal: false,
      shareLink: "https://s123104.github.io/web/eth/index.html", // 換成你的專案連結
      copySuccess: false,
      isInputFocused: false,
      showPinnedMessage: true,
      showMoreOptions: false,
      showCallOptions: false,
      hasUnreadMessages: false,
      autoScroll: true,
      lastReadIndex: 0,
      selectedImage: null,
      userAvatars: {
        BTC鯨魚: "https://api.dicebear.com/6.x/personas/svg?seed=BTC",
        ETH信徒: "https://api.dicebear.com/6.x/personas/svg?seed=ETH",
        分析師Mike: "https://api.dicebear.com/6.x/personas/svg?seed=Mike",
        新手小白: "https://api.dicebear.com/6.x/personas/svg?seed=Newbie",
        鎖倉一哥: "https://api.dicebear.com/6.x/personas/svg?seed=Holder",
        交易所小編: "https://api.dicebear.com/6.x/personas/svg?seed=Admin",
        交易小韭菜: "https://api.dicebear.com/6.x/personas/svg?seed=Loser",
        資深倒霉蛋: "https://api.dicebear.com/6.x/personas/svg?seed=Unlucky",
        分析師老王: "https://api.dicebear.com/6.x/personas/svg?seed=Wang",
        暴富夢想家: "https://api.dicebear.com/6.x/personas/svg?seed=Rich",
        加密貨幣教父:
          "https://api.dicebear.com/6.x/personas/svg?seed=Godfather",
        牛市狂人: "https://api.dicebear.com/6.x/personas/svg?seed=Bull",
        幣圈新兵: "https://api.dicebear.com/6.x/personas/svg?seed=Rookie",
        合約之王: "https://api.dicebear.com/6.x/personas/svg?seed=Contract",
        DeFi先鋒: "https://api.dicebear.com/6.x/personas/svg?seed=DeFi",
        NFT收藏家: "https://api.dicebear.com/6.x/personas/svg?seed=NFT",
        挖礦大叔: "https://api.dicebear.com/6.x/personas/svg?seed=Miner",
        山寨幣獵人: "https://api.dicebear.com/6.x/personas/svg?seed=Altcoin",
        套牢小王子: "https://api.dicebear.com/6.x/personas/svg?seed=Trapped",
        波段之神: "https://api.dicebear.com/6.x/personas/svg?seed=Wave",
        冷錢包信徒: "https://api.dicebear.com/6.x/personas/svg?seed=Cold",
        熱錢包玩家: "https://api.dicebear.com/6.x/personas/svg?seed=Hot",
        跑路觀察員: "https://api.dicebear.com/6.x/personas/svg?seed=Runaway",
        監管恐懼者: "https://api.dicebear.com/6.x/personas/svg?seed=Regulator",
        空投狂熱者: "https://api.dicebear.com/6.x/personas/svg?seed=Airdrop",
        質押達人: "https://api.dicebear.com/6.x/personas/svg?seed=Stake",
        梭哈勇士: "https://api.dicebear.com/6.x/personas/svg?seed=AllIn",
        抄底專家: "https://api.dicebear.com/6.x/personas/svg?seed=Bottom",
        止損受害者: "https://api.dicebear.com/6.x/personas/svg?seed=StopLoss",
        幣圈段子手: "https://api.dicebear.com/6.x/personas/svg?seed=Joker",
        鏈上偵探: "https://api.dicebear.com/6.x/personas/svg?seed=Chain",
        大戶內線: "https://api.dicebear.com/6.x/personas/svg?seed=Whale",
        技術宅: "https://api.dicebear.com/6.x/personas/svg?seed=Tech",
        財富傳教士: "https://api.dicebear.com/6.x/personas/svg?seed=Preacher",
        幣圈老媽: "https://api.dicebear.com/6.x/personas/svg?seed=Mom",
        迷因幣信徒: "https://api.dicebear.com/6.x/personas/svg?seed=Meme",
        槓桿狂徒: "https://api.dicebear.com/6.x/personas/svg?seed=Leverage",
        破產詩人: "https://api.dicebear.com/6.x/personas/svg?seed=Broke",
        現貨穩健派: "https://api.dicebear.com/6.x/personas/svg?seed=Spot",
        貪婪之眼: "https://api.dicebear.com/6.x/personas/svg?seed=Greed",
        恐懼之手: "https://api.dicebear.com/6.x/personas/svg?seed=Fear",
        區塊鏈夢想家: "https://api.dicebear.com/6.x/personas/svg?seed=Block",
        減半預言家: "https://api.dicebear.com/6.x/personas/svg?seed=Halving",
        散戶代言人: "https://api.dicebear.com/6.x/personas/svg?seed=Retail",
        機構臥底: "https://api.dicebear.com/6.x/personas/svg?seed=Insider",
        K線畫師: "https://api.dicebear.com/6.x/personas/svg?seed=Candle",
        追漲殺跌者: "https://api.dicebear.com/6.x/personas/svg?seed=Chaser",
        財富守護者: "https://api.dicebear.com/6.x/personas/svg?seed=Guard",
        幣圈幸存者: "https://api.dicebear.com/6.x/personas/svg?seed=Survivor",
        信仰布道者: "https://api.dicebear.com/6.x/personas/svg?seed=Believer",
      },
      cryptoPrices: JSON.parse(JSON.stringify(cryptoPrices)),
      showRocket: false,
      showFireworks: false,
      fireworks: [],
      showWaterEffect: false,
      inputPlaceholder: true,
      cursorPosition: 0,
      pricePulse: {},
      showPriceAlert: false,
      priceAlertData: {},
      marketSentiment: "neutral",
      isMarketVolatile: false,
      recentPriceHistory: {},
      localMessages: [],
      nightMode: false,
      topCoins: [], // For mini price display
      volatileMessages: [
        "天啊！行情太瘋狂了！",
        "誰能解釋一下發生了什麼？",
        "我的止損全部被觸發了！",
        "不敢看我的帳戶了",
        "這波行情太刺激了",
        "交易所又崩了，無法下單",
        "鯨魚在洗盤，別被震出局",
        "這是機構在操縱市場",
        "有大戶在進場嗎？",
        "行情太劇烈，我要休息一下",
        "插針害我爆倉，救命",
        "剛抄底就暴跌，心態崩了",
        "這波我虧了一輛車",
        "漲跌太快，我跟不上",
        "交易所提幣排隊，慌死了",
        "這行情是天堂還是地獄？",
        "我的槓桿爆了，誰救我",
        "暴跌那天我還在睡覺",
        "漲了又跌，我要瘋了",
        "誰知道這波啥情況？",
        "剛賺了50%，又全吐回去",
        "這市場太恐怖，受不了",
        "鯨魚砸盤，小心啊",
        "剛上車就翻車，救命",
        "止損沒設，現在哭了",
        "這波插針太狠，我沒了",
        "交易所卡單，我要退圈",
        "暴漲暴跌，心臟受不了",
        "我的幣跌到渣都不剩",
        "剛賣就漲，氣死我了",
        "這行情耍我玩呢？",
        "抄底抄到山頂，崩潰了",
        "誰有內幕，快告訴我",
        "這波我套牢了，解不開",
        "漲跌像過山車，太刺激",
        "交易所又宕機，氣炸了",
        "剛加倉就跌，運氣真背",
        "這市場不讓人活啊",
        "暴跌暴漲，我要退圈",
        "鯨魚在搞亂，散戶遭殃",
        "我的帳戶歸零了，救命",
        "這波太瘋狂，我睡不著",
        "剛抄底又插針，心態炸",
        "漲跌太快，手心冒汗",
        "交易所提不了幣，慌了",
        "這行情是魔鬼吧？",
        "我的幣一秒清零，哭了",
        "剛賺了又虧，心累了",
        "這波過山車，我要下車",
        "誰能穩住我，我慌了",
      ],
      unreadCount: parseInt(localStorage.getItem("unreadCount")) || 0,
      unreadDate: localStorage.getItem("unreadDate") || null,
    };
  },
  computed: {
    tickerItems() {
      return this.cryptoPrices.map((crypto) => {
        const changeSymbol = crypto.change >= 0 ? "+" : "";
        const changeClass = crypto.change >= 0 ? "up" : "down";
        const pulseClass = this.pricePulse[crypto.symbol] ? "price-update" : "";
        return {
          symbol: crypto.symbol,
          price: crypto.price.toFixed(crypto.price < 1 ? 6 : 2),
          change: Math.abs(crypto.change).toFixed(1),
          changeSymbol,
          changeClass,
          pulseClass,
        };
      });
    },
  },
  mounted() {
    this.loadRandomDialog();
    this.simulateIncomingMessages();
    this.simulatePriceChanges();
    this.simulateUserActivity();

    // 在 Vue mounted() 或全域腳本中執行
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    // 綁定所有沒有 data-has-action 的按鈕
    const buttons = this.$el.querySelectorAll("button:not([data-has-action])");
    console.log("綁定按鈕數量:", buttons.length);
    buttons.forEach((button) => {
      if (!button.closest(".share-modal")) {
        button.addEventListener("click", (e) => {
          this.openShareModal();
        });
      }
    });

    // Initialize price history
    this.cryptoPrices.forEach((crypto) => {
      this.recentPriceHistory[crypto.symbol] = {
        prices: [crypto.price],
        lastBigMove: Date.now(),
      };
    });

    // Load local messages if available
    this.loadLocalMessages();

    // Check if it's nighttime (between 8PM and 6AM)
    const currentHour = new Date().getHours();
    if (currentHour >= 20 || currentHour < 6) {
      this.nightMode = true;
    }

    this.updateTopCoins();

    // Update top coins every 3 seconds
    setInterval(() => {
      this.updateTopCoins();
    }, 3000);
  },
  methods: {
    openShareModal() {
      this.showShareModal = true;
    },
    closeShareModal() {
      this.showShareModal = false;
      this.copySuccess = false;
    },
    copyShareLink() {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(this.shareLink)
          .then(() => {
            this.copySuccess = true;
            setTimeout(() => {
              this.copySuccess = false;
            }, 2000);
          })
          .catch((err) => console.error("複製失敗: ", err));
      } else {
        // 備用方案
        const tempInput = document.createElement("input");
        tempInput.value = this.shareLink;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        this.copySuccess = true;
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      }
    },
    updateUnreadCount() {
      const today = new Date().toLocaleDateString();
      if (this.unreadDate !== today) {
        this.unreadCount = Math.floor(Math.random() * 10) + 1;
        this.unreadDate = today;
      } else {
        const increase =
          this.marketSentiment === "bullish"
            ? Math.floor(Math.random() * 5) + 1
            : this.marketSentiment === "bearish"
            ? Math.floor(Math.random() * 2) + 1
            : Math.floor(Math.random() * 3) + 1;
        this.unreadCount += increase;
      }
      if (this.unreadCount > 99) this.unreadCount = 99;
      localStorage.setItem("unreadCount", this.unreadCount);
      localStorage.setItem("unreadDate", this.unreadDate);
      this.hasUnreadMessages = true;
    },
    loadRandomDialog() {
      const randomIndex = Math.floor(Math.random() * dialogData.length);
      this.messages = [...dialogData[randomIndex].messages];
      this.scrollToBottom();
    },
    sendMessage() {
      if (this.newMessage.trim() === "") return;
      const newMsg = {
        sender: this.currentUser,
        content: this.newMessage,
        timestamp: Date.now(),
        contentType: "text",
      };
      this.messages.push(newMsg);
      this.updateUnreadCount();
      this.saveLocalMessages();

      // Check for trigger terms
      const lowerMsg = this.newMessage.toLowerCase();
      const shouldTriggerRocket = rocketTriggerTerms.some((term) =>
        lowerMsg.includes(term.toLowerCase())
      );

      if (shouldTriggerRocket) {
        // Randomly choose between rocket and fireworks
        const randEffect = Math.random();
        if (randEffect > 0.7) {
          this.triggerRocketAnimation();
        } else if (randEffect > 0.4) {
          this.triggerFireworksAnimation();
        } else {
          this.triggerWaterEffect();
        }
      }

      const matchedTerm = rocketTriggerTerms.find((term) =>
        lowerMsg.includes(term.toLowerCase())
      );
      if (matchedTerm) {
        if (
          ["暴漲", "漲", "牛市", "翻倍", "to the moon", "上月球"].includes(
            matchedTerm
          )
        ) {
          this.triggerRocketAnimation();
        } else if (["暴跌", "跌", "爆倉", "割韭菜"].includes(matchedTerm)) {
          this.triggerWaterEffect();
        } else if (["上車", "fomo", "all in", "梭哈"].includes(matchedTerm)) {
          this.triggerFireworksAnimation();
        } else {
          // 預設隨機動畫
          const randEffect = Math.random();
          if (randEffect > 0.7) this.triggerRocketAnimation();
          else if (randEffect > 0.4) this.triggerFireworksAnimation();
          else this.triggerWaterEffect();
        }
      }

      // Generate automatic responses based on message content
      this.generateAutoResponses(this.newMessage);

      // Special handling for GM/GN greetings
      if (
        lowerMsg.includes("gm") ||
        lowerMsg.includes("早安") ||
        lowerMsg.includes("早")
      ) {
        this.handleGreeting("gm");
      } else if (
        lowerMsg.includes("gn") ||
        lowerMsg.includes("晚安") ||
        lowerMsg.includes("晚")
      ) {
        this.handleGreeting("gn");
      }

      this.newMessage = "";
      this.scrollToBottom();
    },

    handleGreeting(type) {
      // Generate more enthusiastic responses for greetings
      const responses = responseTriggers[type];

      // Have multiple people respond to the greeting
      const respondCount = Math.floor(Math.random() * 5) + 3; // 3-7 responses
      const responders = Object.keys(this.userAvatars).filter(
        (name) => name !== this.currentUser
      );

      for (let i = 0; i < respondCount; i++) {
        const randomResponder =
          responders[Math.floor(Math.random() * responders.length)];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        setTimeout(() => {
          this.messages.push({
            sender: randomResponder,
            content: randomResponse,
            timestamp: Date.now() + i * 500,
            contentType: "text",
          });

          if (this.autoScroll) {
            this.scrollToBottom();
          } else {
            this.hasUnreadMessages = true;
          }

          // Save messages locally
          this.saveLocalMessages();
        }, 800 + i * 1200);
      }
    },

    loadLocalMessages() {
      const savedMessages = localStorage.getItem("cryptoChatMessages");
      if (savedMessages) {
        this.localMessages = JSON.parse(savedMessages);
        // If we have local messages, add a system message noting this
        this.messages.push({
          sender: "系統消息",
          content: "已加載聊天記錄",
          timestamp: Date.now(),
          contentType: "text",
          type: "system",
        });
      }
    },

    saveLocalMessages() {
      // Save last 100 messages to prevent storage issues
      const messagesToSave = this.messages.slice(-100);
      localStorage.setItem(
        "cryptoChatMessages",
        JSON.stringify(messagesToSave)
      );
    },

    formatPrice(price) {
      if (price >= 1000) {
        return price.toLocaleString(undefined, { maximumFractionDigits: 0 });
      } else if (price >= 1) {
        return price.toFixed(2);
      } else {
        return price.toFixed(6);
      }
    },

    updateTopCoins() {
      // Get top 3 coins by price
      const sortedCoins = [...this.cryptoPrices].sort(
        (a, b) => b.price - a.price
      );
      this.topCoins = sortedCoins.slice(0, 3);
    },

    generateAutoResponses(message) {
      const lowerMsg = message.toLowerCase();
      let hasTriggeredResponse = false;

      // 檢查加密幣觸發關鍵詞
      for (const [trigger, responses] of Object.entries(responseTriggers)) {
        if (lowerMsg.includes(trigger.toLowerCase())) {
          const responseCount =
            trigger.toLowerCase() === "eth"
              ? Math.floor(Math.random() * 3) + 3 // ETH 回應 3-5 則
              : Math.floor(Math.random() * 3) + 1; // 其他回應 1-3 則

          const responders = Object.keys(this.userAvatars).filter(
            (name) => name !== this.currentUser
          );

          for (let i = 0; i < responseCount; i++) {
            const randomResponder =
              responders[Math.floor(Math.random() * responders.length)];
            let randomResponse =
              responses[Math.floor(Math.random() * responses.length)];

            // 找出對應的加密幣資訊
            const crypto = this.cryptoPrices.find(
              (c) => c.symbol.toLowerCase() === trigger.toLowerCase()
            );

            if (crypto) {
              // 以 30% 機率加入價格資訊，否則加入隨機群友吐槽
              if (Math.random() < 0.3) {
                const price = this.formatPrice(crypto.price);
                const change = Math.abs(crypto.change).toFixed(1);
                const direction = crypto.change >= 0 ? "上漲" : "下跌";
                if (this.marketSentiment === "bullish") {
                  const phrases = [
                    `，幹，這波${direction}${change}%，${crypto.symbol}今天準備炸場啦！現價$${price}，速來搶盤！`,
                    `，看這行情，${crypto.symbol}正準備衝天，價格$${price}，買就對了！`,
                    `，幣圈大佬都在狂喊，${crypto.symbol}現價$${price}，上漲${change}%，別再猶豫了！`,
                    `，操，這波拉升真他媽猛，買進就是賺進，快看價格$${price}！`,
                    `，幣圈老鳥早就喊著了，${crypto.symbol}今天衝破天際，絕對別猶豫！`,
                  ];
                  randomResponse +=
                    phrases[Math.floor(Math.random() * phrases.length)];
                } else if (this.marketSentiment === "bearish") {
                  const phrases = [
                    `，幹，${crypto.symbol}只剩$${price}，跌了${change}%，準備好割肉了吧！`,
                    `，市場慘到家了，${crypto.symbol}跌${change}%，現價$${price}，這下慘得要命！`,
                    `，兄弟，${crypto.symbol}掉到$${price}，跌${change}%，真他媽慘，快回家反省！`,
                    `，操，這跌勢就像跳樓機，別再抱著幻想了，趕快準備割肉！`,
                    `，市場就像下水道一樣髒，${crypto.symbol}跌得你心都涼了！`,
                  ];
                  randomResponse +=
                    phrases[Math.floor(Math.random() * phrases.length)];
                } else {
                  const phrases = [
                    `，${crypto.symbol}現價$${price}，漲跌${change}%，就這樣吧！`,
                    `，唉，${crypto.symbol}就是這樣，價格$${price}，漲跌${change}%，摸不著邊際！`,
                    `，幹，就算波動也就這點幅度，隨便啦！`,
                  ];
                  randomResponse +=
                    phrases[Math.floor(Math.random() * phrases.length)];
                }
              } else {
                if (this.marketSentiment === "bullish") {
                  const phrases = [
                    `，幹，這行情爽到爆，買進就對了！`,
                    `，牛逼啊！感覺${crypto.symbol}隨時要火，快衝進場！`,
                    `，幣圈熱度爆棚，不買真的會後悔！`,
                    `，直接看這曲線，${crypto.symbol}今天就要衝破天際！`,
                    `，買進就是賺進，兄弟，別他媽猶豫了！`,
                  ];
                  randomResponse +=
                    phrases[Math.floor(Math.random() * phrases.length)];
                } else if (this.marketSentiment === "bearish") {
                  const phrases = [
                    `，操，這市場慘到爆，別再進場亂砸錢了！`,
                    `，兄弟，這下肯定又要被割，趕快觀望！`,
                    `，慘不忍睹，這行情像掉進坑，遠離為妙！`,
                    `，別再進場了，這跌幅讓人心寒，幹，還不撤退？`,
                    `，哥們兒，這市場太坑，進場只會變成韭菜！`,
                  ];
                  randomResponse +=
                    phrases[Math.floor(Math.random() * phrases.length)];
                }
              }
            }

            setTimeout(() => {
              this.messages.push({
                sender: randomResponder,
                content: randomResponse,
                timestamp: Date.now() + i * 1000,
                contentType: "text",
              });
              if (this.autoScroll) this.scrollToBottom();
              else this.hasUnreadMessages = true;
            }, 1000 + i * 1500);
          }

          // 新增：用戶提及幣時，有機率觸發價格小幅波動（受群聊熱度影響）
          const crypto = this.cryptoPrices.find(
            (c) => c.symbol.toLowerCase() === trigger.toLowerCase()
          );
          if (crypto && Math.random() < 0.3) {
            const change =
              (Math.random() * 4 - 2) *
              (this.marketSentiment === "bullish" ? 1.5 : 1); // 牛市更易上漲
            crypto.price = Math.max(
              0.000001,
              crypto.price * (1 + change / 100)
            );
            crypto.change = change;
            this.pricePulse[crypto.symbol] = true;
            setTimeout(() => {
              this.pricePulse[crypto.symbol] = false;
            }, 800);
            this.messages.push({
              sender: "系統消息",
              content: `${crypto.symbol} 因群聊熱度波動 ${change.toFixed(
                1
              )}%，現價$${this.formatPrice(crypto.price)}`,
              timestamp: Date.now(),
              contentType: "text",
              type: "system",
            });
          }

          // 如果觸發的是 ETH，70% 機率觸發暴漲特效（保持原邏輯）
          if (trigger.toLowerCase() === "eth" && Math.random() < 0.7) {
            setTimeout(() => {
              const ethIndex = this.cryptoPrices.findIndex(
                (crypto) => crypto.symbol === "ETH"
              );
              if (ethIndex >= 0) {
                const pumpPercentage = 10 + Math.random() * 15;
                const currentPrice = this.cryptoPrices[ethIndex].price;
                const newPrice = currentPrice * (1 + pumpPercentage / 100);

                this.cryptoPrices[ethIndex].price = newPrice;
                this.cryptoPrices[ethIndex].change = pumpPercentage;

                this.messages.push({
                  sender: "系統消息",
                  content: `ETH 因群內大佬買進突然暴漲 ${pumpPercentage.toFixed(
                    1
                  )}%，現價$${this.formatPrice(crypto.price)}`,
                  timestamp: Date.now(),
                  contentType: "text",
                  type: "system",
                });

                this.triggerRocketAnimation();

                if (this.recentPriceHistory["ETH"]) {
                  this.recentPriceHistory["ETH"].prices.push(newPrice);
                  if (this.recentPriceHistory["ETH"].prices.length > 10) {
                    this.recentPriceHistory["ETH"].prices.shift();
                  }
                  this.recentPriceHistory["ETH"].lastBigMove = Date.now();
                }

                this.pricePulse["ETH"] = true;
                setTimeout(() => {
                  this.pricePulse["ETH"] = false;
                }, 500);
              }
            }, 3000);
          }

          hasTriggeredResponse = true;
          break;
        }
      }

      // 檢查價格討論相關觸發條件
      if (
        lowerMsg.includes("價格") ||
        lowerMsg.includes("price") ||
        lowerMsg.includes("多少") ||
        lowerMsg.includes("漲到") ||
        lowerMsg.includes("跌到")
      ) {
        let discussedCrypto = null;
        for (const crypto of this.cryptoPrices) {
          if (lowerMsg.includes(crypto.symbol.toLowerCase())) {
            discussedCrypto = crypto;
            break;
          }
        }

        if (discussedCrypto) {
          setTimeout(() => {
            const priceResponses = [
              `${discussedCrypto.symbol} 現在交易價格是$${this.formatPrice(
                discussedCrypto.price
              )}，24小時內${
                discussedCrypto.change >= 0 ? "上漲" : "下跌"
              }了${Math.abs(discussedCrypto.change).toFixed(
                1
              )}%，敢不敢再補一波？`,
              `我跟你講，${discussedCrypto.symbol}目標價直逼$${this.formatPrice(
                discussedCrypto.price * (1 + (Math.random() * 0.5 + 0.5))
              )}，這波絕對能賺翻！`,
              `${discussedCrypto.symbol}最近走勢${
                discussedCrypto.change >= 0 ? "強勁" : "疲軟"
              }，可能因為${
                Math.random() > 0.5 ? "機構在進場" : "市場情緒變差"
              }，兄弟們小心點！`,
              `聽說大戶已經開始${
                discussedCrypto.change >= 0 ? "止盈" : "抄底"
              }${discussedCrypto.symbol}了，這波你跟不跟？`,
              `要不要看看技術分析？${discussedCrypto.symbol}的RSI指標顯示${
                Math.random() > 0.5 ? "超買" : "超賣"
              }狀態，幹，投資就是要抓住機會！`,
              `別他媽猶豫了，這價格數字看得我都想哭，快跟上這波行情！`,
            ];

            const responders = Object.keys(this.userAvatars).filter(
              (name) => name !== this.currentUser
            );
            const randomResponder =
              responders[Math.floor(Math.random() * responders.length)];
            const randomResponse =
              priceResponses[Math.floor(Math.random() * priceResponses.length)];

            this.messages.push({
              sender: randomResponder,
              content: randomResponse,
              timestamp: Date.now(),
              contentType: "text",
            });

            if (this.autoScroll) this.scrollToBottom();
            else this.hasUnreadMessages = true;
          }, 1000);

          hasTriggeredResponse = true;
        }
      }

      // 如果無特定觸發，則生成一般回應（更隨性、更像幣圈群友的對話）
      if (!hasTriggeredResponse) {
        setTimeout(() => {
          const responders = Object.keys(this.userAvatars).filter(
            (name) => name !== "系統消息" && name !== this.currentUser
          );

          const replies = [
            "靠北，這觀點有夠猛，真是聊得熱血沸騰！",
            "幹，你這想法不錯啊，投資就該這樣拼！",
            "老子看這行情，今天就直接全倉上車！",
            "市場這樣，只有割肉或暴賺兩條路，選哪個？",
            "別他媽猶豫了，幣圈就是這麼刺激，跟著買！",
            "操，這走勢讓我直接爆肝，衝啊兄弟！",
            "真他媽神奇，漲跌之間我都快嗨翻，幹，別錯過！",
            "唉，今天又是割肉的好日子，悲劇！",
            "幹，這波行情亂飛，幣圈兄弟要穩住，別慌！",
            "說真的，這市場有時候真是操蛋到爆，跟著走！",
            "哈哈，今天又有人瘋狂發帖，群友氣氛炸裂！",
            "幹，這消息聽得我熱血沸騰，馬上開盤！",
            "真他媽瘋狂，今天市場簡直像打了雞血，誰不爽？",
            "就這麼著，別想太多，跟著市場走，賺翻了！",
          ];
          const randomReply =
            replies[Math.floor(Math.random() * replies.length)];
          this.messages.push({
            sender: responders[Math.floor(Math.random() * responders.length)],
            content: randomReply,
            timestamp: Date.now(),
            contentType: "text",
          });

          if (this.autoScroll) this.scrollToBottom();
          else this.hasUnreadMessages = true;
        }, 1000 + Math.random() * 1000);
      }
    },

    // New method to simulate user joining and leaving
    simulateUserActivity() {
      setInterval(() => {
        const JOINING_PROBABILITY =
          this.marketSentiment === "bullish"
            ? 0.7
            : this.marketSentiment === "bearish"
            ? 0.3
            : 0.5;

        // More users join during bullish markets, more leave during bearish
        if (Math.random() < JOINING_PROBABILITY) {
          // User joins
          if (Math.random() < 0.7) {
            // 70% chance to actually show the message
            const newUser =
              randomUserNames[
                Math.floor(Math.random() * randomUserNames.length)
              ];
            if (!this.userAvatars[newUser]) {
              this.userAvatars[
                newUser
              ] = `https://api.dicebear.com/6.x/personas/svg?seed=${newUser}${Date.now()}`;
            }

            this.messages.push({
              sender: "系統消息",
              content: `用戶「${newUser}」加入群組`,
              timestamp: Date.now(),
              contentType: "text",
              type: "system",
            });

            // If market is bullish, sometimes the new user sends an excited message
            if (this.marketSentiment === "bullish" && Math.random() < 0.5) {
              setTimeout(() => {
                const excitedMessages = [
                  "大家好！今天行情大好啊！",
                  "剛入金10萬，準備梭哈了",
                  "有什麼推薦的幣嗎？感覺都在漲",
                  "牛市來了嗎？我要衝了！",
                  "我的天啊！太帥了，我的投資翻倍了",
                  "BTC要破10萬，快上車啊",
                  "ETH漲瘋了，我賺麻了",
                  "現在不買，過兩天哭去",
                  "這波暴漲，我要財富自由",
                  "兄弟們，all in吧，機會來了",
                  "剛抄底成功，爽到飛起",
                  "狗狗幣要上月球，誰跟我？",
                  "SHIB翻倍，我請全群吃飯",
                  "牛市氣息濃厚，快準備",
                  "我全倉進去，賺翻了",
                  "這行情太刺激，睡不著",
                  "昨天賺了50萬，太爽了",
                  "現在上車，下個月開豪車",
                  "暴漲那天，我要退休了",
                  "這波我必須贏，梭哈了",
                  "漲到懷疑人生，爽歪歪",
                  "牛市已確認，誰還不信？",
                  "剛賣房加倉，求好運",
                  "這幣要百倍，快跟上",
                  "我連續三天沒睡，盯盤中",
                  "財富密碼就在眼前，抓緊",
                  "漲起來誰敢不服？all in吧",
                  "昨天抄底，今天賺麻了",
                  "牛市來了，打工是不可能了",
                  "我的NFT賣了100萬，太爽",
                  "這波暴漲，我要上天了",
                  "兄弟們一起上車，發財去",
                  "漲成這樣，人生巔峰啊",
                  "剛借錢梭哈，求不爆倉",
                  "這行情太瘋狂，我愛幣圈",
                  "ETH要破萬，FOMO起來",
                  "現在不買，過年只能吃泡麵",
                  "BTC牛市領頭羊，快跟上",
                  "我全家都買幣了，賺翻",
                  "這波我賺了一套房，哈哈",
                  "暴漲爽到爆炸，誰還上班",
                  "剛入場就翻倍，太幸運了",
                  "牛市不等人，快衝啊",
                  "我的Pi幣要上線，準備暴富",
                  "這波漲勢，我要上月球",
                  "梭哈成功，財富自由了",
                  "昨天還在哭，今天笑瘋了",
                  "這行情太完美，all in吧",
                  "漲到手抖，我要買跑車",
                  "兄弟們，今天是我們的日子",
                ];

                this.messages.push({
                  sender: newUser,
                  content:
                    excitedMessages[
                      Math.floor(Math.random() * excitedMessages.length)
                    ],
                  timestamp: Date.now(),
                  contentType: "text",
                });
              }, 2000);
            }
          }

          // Increase group members
          this.groupMembers += 1;
        } else {
          // User leaves (only if we have more than 20 members to avoid empty group)
          if (this.groupMembers > 20) {
            this.groupMembers -= 1;

            // Only show leave message during bear markets or volatility with 30% chance
            if (
              (this.marketSentiment === "bearish" || this.isMarketVolatile) &&
              Math.random() < 0.3
            ) {
              const existingUsers = Object.keys(this.userAvatars).filter(
                (name) =>
                  name !== this.currentUser &&
                  !["系統消息", "BTC鯨魚", "ETH信徒", "分析師Mike"].includes(
                    name
                  )
              );
              if (existingUsers.length > 0) {
                const leavingUser =
                  existingUsers[
                    Math.floor(Math.random() * existingUsers.length)
                  ];
                this.messages.push({
                  sender: "系統消息",
                  content: `用戶「${leavingUser}」退出群組`,
                  timestamp: Date.now(),
                  contentType: "text",
                  type: "system",
                });
                // 清理頭像
                delete this.userAvatars[leavingUser];
              }
            }
          }
        }

        if (this.autoScroll) {
          this.scrollToBottom();
        } else {
          this.hasUnreadMessages = true;
        }
      }, 15000); // Check every 15 seconds for user activity
    },

    simulateIncomingMessages() {
      setInterval(
        () => {
          // 根據市場情緒和波動性調整消息頻率和機率
          const messageChance = this.isMarketVolatile
            ? 0.8
            : this.marketSentiment === "bullish"
            ? 0.7
            : this.marketSentiment === "bearish"
            ? 0.6
            : 0.5;

          if (Math.random() > messageChance) return;

          // 選擇回應者，排除當前用戶和系統消息
          const responders = Object.keys(this.userAvatars).filter(
            (name) => name !== this.currentUser && name !== "系統消息"
          );
          const randomResponder =
            responders[Math.floor(Math.random() * responders.length)];

          let randomMessage;

          // 根據市場狀態生成消息
          if (this.isMarketVolatile) {
            // 波動市場使用 volatileMessages
            randomMessage =
              this.volatileMessages[
                Math.floor(Math.random() * this.volatileMessages.length)
              ];
          } else if (this.marketSentiment === "bullish") {
            // 牛市使用擴展後的 bullishMessages
            const bullishMessages = [
              "牛市確認，準備發射🚀",
              "剛剛又買了1個BTC，感覺要起飛",
              "誰說加密貨幣是騙局的？現在臉腫了吧",
              "我的投資組合漲了30%，爽歪歪",
              "這才剛開始，還有更大的行情",
              "已經跟老闆提離職了，幣圈財富自由不是夢",
              "BTC今年目標十萬刀沒問題",
              "ETH即將超越BTC，大家準備好了嗎",
              "現在入場還不晚，牛市剛開始",
              "機構資金持續流入，這次不一樣",
              "BTC要破10萬，快上車啊",
              "ETH漲瘋了，我賺麻了",
              "現在不買，過兩天哭去",
              "這波暴漲，我要財富自由",
              "兄弟們，all in吧，機會來了",
              "剛抄底成功，爽到飛起",
              "狗狗幣要上月球，誰跟我？",
              "SHIB翻倍，我請全群吃飯",
              "牛市氣息濃厚，快準備",
              "我全倉進去，賺翻了",
              "這行情太刺激，睡不著",
              "昨天賺了50萬，太爽了",
              "現在上車，下個月開豪車",
              "暴漲那天，我要退休了",
              "這波我必須贏，梭哈了",
              "漲到懷疑人生，爽歪歪",
              "牛市已確認，誰還不信？",
              "剛賣房加倉，求好運",
              "這幣要百倍，快跟上",
              "我連續三天沒睡，盯盤中",
              "財富密碼就在眼前，抓緊",
              "漲起來誰敢不服？all in吧",
              "昨天抄底，今天賺麻了",
              "牛市來了，打工是不可能了",
              "我的NFT賣了100萬，太爽",
              "這波暴漲，我要上天了",
              "兄弟們一起上車，發財去",
              "漲成這樣，人生巔峰啊",
              "剛借錢梭哈，求不爆倉",
              "這行情太瘋狂，我愛幣圈",
              "ETH要破萬，FOMO起來",
              "現在不買，過年只能吃泡麵",
              "BTC牛市領頭羊，快跟上",
              "我全家都買幣了，賺翻",
              "這波我賺了一套房，哈哈",
              "暴漲爽到爆炸，誰還上班",
              "剛入場就翻倍，太幸運了",
              "牛市不等人，快衝啊",
              "我的Pi幣要上線，準備暴富",
              "這波漲勢，我要上月球",
            ];
            randomMessage =
              bullishMessages[
                Math.floor(Math.random() * bullishMessages.length)
              ];
          } else if (this.marketSentiment === "bearish") {
            // 熊市使用擴展後的 bearishMessages
            const bearishMessages = [
              "這波跌得有點嚴重啊",
              "誰還有資金抄底的？我已經彈盡糧絕",
              "熊市才是常態，別幻想暴富了",
              "慘，虧到只剩本金的10%",
              "堅持住，不虧不賣",
              "這是最後的拋售，準備抄底",
              "已經麻木了，不看行情了",
              "誰知道有什麼打工機會，我得去賺錢補倉",
              "這個項目還能活下來嗎？",
              "加密貨幣總是有週期，耐心等待",
              "這波我虧了一輛車",
              "剛抄底就暴跌，心態崩了",
              "我的帳戶歸零了，救命",
              "暴跌那天我還在睡覺",
              "誰救救我，我全倉沒了",
              "跌成這樣，只能吃泡麵了",
              "我套牢半年了，解不開",
              "這行情是地獄吧？",
              "剛加倉就跌，運氣真背",
              "這市場不讓人活啊",
              "我的幣跌到渣都不剩",
              "剛賣就漲，氣死我了",
              "抄底抄到山頂，崩潰了",
              "這波暴跌，我老婆跑了",
              "跌到懷疑人生，幣圈真難",
              "我連續三天盯盤，全虧了",
              "剛借錢買幣，全沒了",
              "這波割我太狠了，我要退圈",
              "跌成狗，我不玩了",
              "我的槓桿爆了，心累",
              "剛入場就崩，運氣背",
              "跌到賣腎都不夠還",
              "這行情太恐怖，我睡不著",
              "剛賺了又虧，救命",
              "熊市太慘，我要跳樓",
              "我的NFT賣不出去了",
              "這波過山車，我要下車",
              "誰能穩住我，我慌了",
              "交易所提不了幣，慌死了",
              "跌到我連泡麵都吃不起",
              "這波我的人生完了",
              "我全家買幣，全套牢",
              "剛抄底又插針，心態炸",
              "熊市無情，我要哭了",
              "我的幣一秒清零，太慘",
              "這行情耍我玩呢？",
              "誰有內幕，快告訴我",
              "跌成這樣，我不敢看手機",
              "這波熊市，我徹底麻了",
            ];
            randomMessage =
              bearishMessages[
                Math.floor(Math.random() * bearishMessages.length)
              ];
          } else {
            // 中立市場從 randomUserMessages 中隨機選擇
            randomMessage =
              randomUserMessages[
                Math.floor(Math.random() * randomUserMessages.length)
              ];
          }
          // 構建消息物件
          const incomingMsg = {
            sender: randomResponder,
            content: randomMessage,
            timestamp: Date.now(),
            contentType: "text",
          };
          this.messages.push(incomingMsg);

          // 更新未讀數量（假設已內部化）
          this.updateUnreadCount();

          // 處理滾動和未讀狀態
          if (!this.autoScroll) {
            this.hasUnreadMessages = true;
          } else {
            this.scrollToBottom();
          }
        },
        this.isMarketVolatile ? 4000 : 8000
      ); // 波動時每4秒，正常時每8秒
    },

    simulatePriceChanges() {
      setInterval(() => {
        // Market condition variables
        let bigMoveOccurred = false;
        let bullishCount = 0;
        let bearishCount = 0;

        // Randomly update 1-5 cryptocurrencies (more during volatile markets)
        const numUpdates = this.isMarketVolatile
          ? Math.floor(Math.random() * 5) + 3
          : Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numUpdates; i++) {
          const index = Math.floor(Math.random() * this.cryptoPrices.length);
          const crypto = this.cryptoPrices[index];

          // Generate more volatile price movements
          let volatilityFactor = 1;
          if (this.isMarketVolatile) {
            volatilityFactor = 5; // Increased for more dramatic changes
          } else if (this.marketSentiment === "bullish") {
            volatilityFactor = 3; // Increased for more noticeable movements
          } else if (this.marketSentiment === "bearish") {
            volatilityFactor = 3; // Increased for more noticeable movements
          }

          // Bias the price movement based on market sentiment
          let biasMultiplier;
          if (this.marketSentiment === "bullish") {
            biasMultiplier = Math.random() * 3 - 0.5; // More positive: -0.5 to 2.5
          } else if (this.marketSentiment === "bearish") {
            biasMultiplier = Math.random() * 3 - 2.5; // More negative: -2.5 to 0.5
          } else {
            biasMultiplier = Math.random() * 2 - 1; // Balanced: -1 to 1
          }

          const changeAmount =
            biasMultiplier * volatilityFactor * (crypto.price * 0.02);
          const newPrice = Math.max(0.000001, crypto.price + changeAmount);

          // Calculate percentage change
          const percentChange =
            ((newPrice - crypto.price) / crypto.price) * 100;

          // Update price history
          if (!this.recentPriceHistory[crypto.symbol]) {
            this.recentPriceHistory[crypto.symbol] = {
              prices: [crypto.price],
              lastBigMove: Date.now(),
            };
          }

          const history = this.recentPriceHistory[crypto.symbol];
          history.prices.push(newPrice);
          if (history.prices.length > 10) {
            history.prices.shift();
          }

          // Check for big price moves (>7% change)
          const isBigMove = Math.abs(percentChange) > 7;
          const timeSinceLastBigMove = Date.now() - history.lastBigMove;

          // Only trigger big move events if enough time has passed since the last one
          if (isBigMove && timeSinceLastBigMove > 45000) {
            // Reduced to 45 seconds for more frequent moves
            bigMoveOccurred = true;
            history.lastBigMove = Date.now();

            // Show price alert
            this.showPriceAlert = true;
            this.priceAlertData = {
              symbol: crypto.symbol,
              direction: percentChange > 0 ? "up" : "down",
              percentage: Math.abs(percentChange).toFixed(1),
              price: newPrice.toFixed(newPrice < 1 ? 6 : 2),
            };

            setTimeout(() => {
              this.showPriceAlert = false;
            }, 5000);

            // Add a system message about the big price move
            const direction = percentChange > 0 ? "暴漲" : "暴跌";
            const moveMsg = {
              sender: "系統消息",
              content: `${crypto.symbol} ${direction} ${Math.abs(
                percentChange
              ).toFixed(1)}%！現價：$${newPrice.toFixed(newPrice < 1 ? 6 : 2)}`,
              timestamp: Date.now(),
              contentType: "text",
              type: "system",
            };
            this.messages.push(moveMsg);

            // Save messages locally
            this.saveLocalMessages();

            // Add rocket animation for big pumps, fireworks for smaller pumps
            if (percentChange > 15) {
              this.triggerRocketAnimation();
            } else if (percentChange > 7) {
              this.triggerFireworksAnimation();
            } else if (percentChange < -15) {
              this.triggerWaterEffect();
            }

            // Generate excited responses for big moves
            setTimeout(() => {
              const responders = Object.keys(this.userAvatars).filter(
                (name) => name !== "系統消息" && name !== this.currentUser
              );

              // 3-6 people will comment on the big move (more people for bigger moves)
              const commentCount = Math.floor(Math.random() * 4) + 3;

              for (let j = 0; j < commentCount; j++) {
                const randomResponder =
                  responders[Math.floor(Math.random() * responders.length)];
                let comment;

                if (percentChange > 0) {
                  const bullishComments = [
                    `${crypto.symbol} 真的要起飛了！🚀🚀🚀`,
                    `我就說 ${crypto.symbol} 會回來的，誰還不信？`,
                    `剛好昨天抄底了一波 ${crypto.symbol} ，賺翻了`,
                    `${crypto.symbol} 才漲這麼點，目標價還遠著呢`,
                    `牛市來了， ${crypto.symbol} 領頭衝`,
                    `這不是泵就是真的要漲了`,
                    `有人知道 ${crypto.symbol} 為什麼突然暴漲嗎？`,
                    `${crypto.symbol} 這年底目標翻10倍！`,
                    `我已經 all in ${crypto.symbol} 了，財富自由不遠了`,
                    `${crypto.symbol} 這個價格還不買就是跟錢過不去了`,
                    `聽說機構在大量買入 ${crypto.symbol} ，知情人士透露的`,
                    `打工是不可能打工的，就靠 ${crypto.symbol} 發財了`,
                    `${crypto.symbol} 要上月球，現在上車還不晚`,
                    `昨天抄底 ${crypto.symbol} ，今天賺麻了`,
                    `${crypto.symbol} 牛市領頭羊，快跟上`,
                    `這波 ${crypto.symbol} 漲起來誰敢不服？`,
                    `${crypto.symbol} 翻倍那天，我請客`,
                    `現在不買 ${crypto.symbol} ，過兩天哭去`,
                    `${crypto.symbol} 是財富密碼，梭哈吧`,
                    `我全倉 ${crypto.symbol} ，準備暴富`,
                    `${crypto.symbol} 要破紀錄，FOMO起來`,
                    `${crypto.symbol} 漲到手抖，我要退休`,
                    `這波 ${crypto.symbol} 我賺了一套房`,
                    `${crypto.symbol} 是散戶的春天，快上車`,
                    `剛賣房買 ${crypto.symbol} ，求好運`,
                    `${crypto.symbol} 要百倍，誰跟我？`,
                    `我連續三天盯 ${crypto.symbol} ，要飛了`,
                    `${crypto.symbol} 牛市不等人，all in吧`,
                    `${crypto.symbol} 漲成這樣，人生巔峰`,
                    `剛借錢買 ${crypto.symbol} ，準備翻身`,
                    `${crypto.symbol} 要上火星，現在買啊`,
                    `${crypto.symbol} 暴漲那天，我要開party`,
                    `我全家買 ${crypto.symbol} ，賺翻了`,
                    `${crypto.symbol} 是下個BTC，信我`,
                    `昨天 ${crypto.symbol} 抄底，今天笑瘋了`,
                    `這波 ${crypto.symbol} 我要財富自由`,
                    `${crypto.symbol} 漲到懷疑人生，太爽`,
                    `現在買 ${crypto.symbol} ，下個月豪宅`,
                    `${crypto.symbol} 牛市已啟動，快衝`,
                    `我靠 ${crypto.symbol} 賺了100萬`,
                    `${crypto.symbol} 要破萬，誰還不買？`,
                    `剛入場 ${crypto.symbol} 就翻倍，運氣爆棚`,
                    `${crypto.symbol} 是我的信仰，梭哈了`,
                    `這波 ${crypto.symbol} 漲勢，我要上天`,
                    `${crypto.symbol} 目標10萬刀，快跟上`,
                    `我賣車買 ${crypto.symbol} ，不後悔`,
                    `${crypto.symbol} 暴漲爽到飛起，誰還上班`,
                    `昨天還在等，今天 ${crypto.symbol} 起飛了`,
                    `${crypto.symbol} 是幣圈之光，all in吧`,
                    `這波 ${crypto.symbol} ，我的人生圓滿了`,
                  ];
                  comment =
                    bullishComments[
                      Math.floor(Math.random() * bullishComments.length)
                    ];
                } else {
                  const bearishComments = [
                    `${crypto.symbol} 怎麼了？有壞消息嗎？😱`,
                    `慘，剛槓桿多了 ${crypto.symbol} 就暴跌`,
                    `別慌， ${crypto.symbol} 只是回調，長期看好`,
                    `有大戶在出貨，小心 ${crypto.symbol} 還會跌`,
                    `${crypto.symbol} 跌成這樣，是時候抄底了吧？`,
                    `套牢了，只能繼續持有 ${crypto.symbol} 了`,
                    `誰還敢買 ${crypto.symbol} ？我已經不敢看帳戶了`,
                    `${crypto.symbol} 這波我虧了一輛車..`,
                    `我的 ${crypto.symbol} 質押解鎖還有三個月，看來要歸零了`,
                    `${crypto.symbol} 割韭菜太狠了，我不玩了`,
                    `誰能告訴我為什麼 ${crypto.symbol} 每次我買就跌？`,
                    `${crypto.symbol} 現在是底部了嗎？還是等等再抄？`,
                    `${crypto.symbol} 跌到我賣腎都不夠還`,
                    `剛抄底 ${crypto.symbol} ，又插針了`,
                    `${crypto.symbol} 這波害我睡大街`,
                    `我全倉 ${crypto.symbol} ，現在血本無歸`,
                    `${crypto.symbol} 跌成狗，我要退圈`,
                    `這波 ${crypto.symbol} 暴跌，我老婆跑了`,
                    `剛買 ${crypto.symbol} 就崩，心態炸了`,
                    `${crypto.symbol} 跌到渣都不剩`,
                    `我套牢 ${crypto.symbol} 半年，救命`,
                    `${crypto.symbol} 這行情是地獄吧？`,
                    `剛加倉 ${crypto.symbol} ，直接爆倉`,
                    `誰還信 ${crypto.symbol} 能漲？我不信了`,
                    `${crypto.symbol} 跌到懷疑人生`,
                    `這波 ${crypto.symbol} 我虧了100萬`,
                    `${crypto.symbol} 是我的噩夢，救命`,
                    `剛賣房買 ${crypto.symbol} ，現在哭了`,
                    `${crypto.symbol} 跌成這樣，只能吃泡麵`,
                    `我連續三天盯 ${crypto.symbol} ，全虧了`,
                    `${crypto.symbol} 暴跌那天，我還在睡`,
                    `這波 ${crypto.symbol} 割我太狠了`,
                    `${crypto.symbol} 跌到0我都不意外`,
                    `剛抄底 ${crypto.symbol} ，又跌50%`,
                    `${crypto.symbol} 害我破產，心累`,
                    `誰救救我，我全倉 ${crypto.symbol} 沒了`,
                    `${crypto.symbol} 跌成這樣，我要賣腎`,
                    `這波 ${crypto.symbol} 我直接歸零`,
                    `${crypto.symbol} 每次我買就跌，詛咒嗎？`,
                    `我老婆不讓我碰 ${crypto.symbol} 了`,
                    `${crypto.symbol} 跌到我不敢看手機`,
                    `剛借錢買 ${crypto.symbol} ，全沒了`,
                    `${crypto.symbol} 是散戶的地獄啊`,
                    `這波 ${crypto.symbol} 暴跌，我要跳樓`,
                    `${crypto.symbol} 跌成渣，我心碎了`,
                    `我全家買 ${crypto.symbol} ，全套牢`,
                    `${crypto.symbol} 這行情太恐怖了`,
                    `剛入場 ${crypto.symbol} 就崩，運氣背`,
                    `${crypto.symbol} 跌到我連泡麵都吃不起`,
                    `這波 ${crypto.symbol} ，我的人生完了`,
                  ];
                  comment =
                    bearishComments[
                      Math.floor(Math.random() * bearishComments.length)
                    ];
                }

                setTimeout(() => {
                  this.messages.push({
                    sender: randomResponder,
                    content: comment,
                    timestamp: Date.now() + j * 1000,
                    contentType: "text",
                  });

                  if (this.autoScroll) {
                    this.scrollToBottom();
                  } else {
                    this.hasUnreadMessages = true;
                  }

                  // Save messages locally
                  this.saveLocalMessages();
                }, 1000 + j * 1500);
              }
            }, 2000);
          }

          // Update actual price and change values
          crypto.price = newPrice;
          crypto.change = parseFloat(percentChange.toFixed(2));

          // Count bullish/bearish moves for market sentiment
          if (percentChange > 0) bullishCount++;
          else if (percentChange < 0) bearishCount++;

          // Trigger animation for this price update
          this.pricePulse[crypto.symbol] = true;
          setTimeout(() => {
            this.pricePulse[crypto.symbol] = false;
          }, 800);

          // Update top coins after price changes
          this.updateTopCoins();
        }

        // Update market sentiment based on price changes
        if (bullishCount > bearishCount * 2) {
          this.marketSentiment = "bullish";
        } else if (bearishCount > bullishCount * 2) {
          this.marketSentiment = "bearish";
        } else {
          this.marketSentiment = "neutral";
        }

        // Update market volatility flag
        this.isMarketVolatile = bigMoveOccurred;

        // If big move occurred, scroll to bottom to show the messages
        if (bigMoveOccurred && this.autoScroll) {
          this.scrollToBottom();
        }
      }, 2000); // Update every 2 seconds instead of 3 for faster price changes
    },

    triggerRocketAnimation() {
      this.showRocket = true;
      setTimeout(() => {
        this.showRocket = false;
      }, 3000);
    },

    triggerFireworksAnimation() {
      this.showFireworks = true;
      // Generate 10-20 fireworks
      this.fireworks = [];
      const count = Math.floor(Math.random() * 10) + 10;
      for (let i = 0; i < count; i++) {
        this.fireworks.push({
          id: Date.now() + i,
          x: Math.random() * 100 + "%",
          y: Math.random() * 100 + "%",
          size: Math.random() * 50 + 20 + "px",
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        });
      }

      setTimeout(() => {
        this.showFireworks = false;
        this.fireworks = [];
      }, 2000);
    },

    triggerWaterEffect() {
      this.showWaterEffect = true;
      setTimeout(() => {
        this.showWaterEffect = false;
      }, 3000);
    },

    getUserAvatar(sender) {
      return (
        this.userAvatars[sender] ||
        `https://api.dicebear.com/6.x/personas/svg?seed=${sender}`
      );
    },

    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    formatCryptoMessage(content) {
      let formatted = content;
      for (const [symbol, emoji] of Object.entries(cryptoEmojis)) {
        // 移除 \b，直接全局匹配該關鍵字（注意可能會有過度匹配風險）
        const regex = new RegExp(`${symbol}`, "gi");
        formatted = formatted.replace(
          regex,
          `<span class="crypto-badge ${symbol}"><span  class="crypto-emoji"> ${emoji}</span> ${symbol.toUpperCase()}</span>`
        );
      }
      return formatted;
    },

    shouldShowAvatar(index) {
      if (index === 0) return true;
      const prevMsg = this.messages[index - 1];
      const currMsg = this.messages[index];
      return (
        prevMsg.sender !== currMsg.sender ||
        currMsg.timestamp - prevMsg.timestamp > 300000
      ); // 5 min gap
    },

    shouldShowName(index) {
      if (index === 0) return true;
      const prevMsg = this.messages[index - 1];
      const currMsg = this.messages[index];
      return (
        prevMsg.sender !== currMsg.sender ||
        currMsg.timestamp - prevMsg.timestamp > 300000
      ); // 5 min gap
    },

    togglePinnedMessage() {
      this.showPinnedMessage = !this.showPinnedMessage;
    },

    toggleMoreOptions() {
      this.showMoreOptions = !this.showMoreOptions;
    },

    toggleCallOptions() {
      this.showCallOptions = !this.showCallOptions;
    },

    viewImage(src) {
      this.selectedImage = src;
    },

    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.messageList) {
          this.$refs.messageList.scrollTop =
            this.$refs.messageList.scrollHeight;
        }
        this.hasUnreadMessages = false;
        this.autoScroll = true;
        this.lastReadIndex = this.messages.length - 1;
      });
    },

    handleScroll(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      this.autoScroll = scrollHeight - scrollTop - clientHeight < 10;
    },

    focusInput() {
      this.$refs.messageInput.focus();
      this.inputPlaceholder = false;
    },

    blurInput() {
      if (this.newMessage === "") {
        this.inputPlaceholder = true;
      }
    },

    updateCursorPosition() {
      this.cursorPosition = this.$refs.messageInput.selectionStart;
    },
  },
});

app.mount("#app");
