// 国家/地区数据
export const COUNTRIES = {
  asia: {
    name: "🌏 亚洲",
    countries: [
      { code: "CN", flag: "🇨🇳", name: "中国", en: "China" },
      { code: "HK", flag: "🇭🇰", name: "中国香港", en: "Hong Kong" },
      { code: "MO", flag: "🇲🇴", name: "中国澳门", en: "Macau" },
      { code: "TW", flag: "🇹🇼", name: "中国台湾", en: "Taiwan" },
      { code: "JP", flag: "🇯🇵", name: "日本", en: "Japan" },
      { code: "KR", flag: "🇰🇷", name: "韩国", en: "South Korea" },
      { code: "KP", flag: "🇰🇵", name: "朝鲜", en: "North Korea" },
      { code: "MN", flag: "🇲🇳", name: "蒙古", en: "Mongolia" },
      { code: "VN", flag: "🇻🇳", name: "越南", en: "Vietnam" },
      { code: "LA", flag: "🇱🇦", name: "老挝", en: "Laos" },
      { code: "KH", flag: "🇰🇭", name: "柬埔寨", en: "Cambodia" },
      { code: "TH", flag: "🇹🇭", name: "泰国", en: "Thailand" },
      { code: "MM", flag: "🇲🇲", name: "缅甸", en: "Myanmar" },
      { code: "MY", flag: "🇲🇾", name: "马来西亚", en: "Malaysia" },
      { code: "SG", flag: "🇸🇬", name: "新加坡", en: "Singapore" },
      { code: "ID", flag: "🇮🇩", name: "印度尼西亚", en: "Indonesia" },
      { code: "PH", flag: "🇵🇭", name: "菲律宾", en: "Philippines" },
      { code: "BN", flag: "🇧🇳", name: "文莱", en: "Brunei" },
      { code: "TL", flag: "🇹🇱", name: "东帝汶", en: "Timor-Leste" },
      { code: "IN", flag: "🇮🇳", name: "印度", en: "India" },
      { code: "PK", flag: "🇵🇰", name: "巴基斯坦", en: "Pakistan" },
      { code: "BD", flag: "🇧🇩", name: "孟加拉国", en: "Bangladesh" },
      { code: "LK", flag: "🇱🇰", name: "斯里兰卡", en: "Sri Lanka" },
      { code: "NP", flag: "🇳🇵", name: "尼泊尔", en: "Nepal" },
      { code: "BT", flag: "🇧🇹", name: "不丹", en: "Bhutan" },
      { code: "MV", flag: "🇲🇻", name: "马尔代夫", en: "Maldives" },
      { code: "AF", flag: "🇦🇫", name: "阿富汗", en: "Afghanistan" },
      { code: "KZ", flag: "🇰🇿", name: "哈萨克斯坦", en: "Kazakhstan" },
      { code: "UZ", flag: "🇺🇿", name: "乌兹别克斯坦", en: "Uzbekistan" },
      { code: "TM", flag: "🇹🇲", name: "土库曼斯坦", en: "Turkmenistan" },
      { code: "KG", flag: "🇰🇬", name: "吉尔吉斯斯坦", en: "Kyrgyzstan" },
      { code: "TJ", flag: "🇹🇯", name: "塔吉克斯坦", en: "Tajikistan" },
    ]
  },
  middleEast: {
    name: "🕌 中东",
    countries: [
      { code: "IR", flag: "🇮🇷", name: "伊朗", en: "Iran" },
      { code: "IQ", flag: "🇮🇶", name: "伊拉克", en: "Iraq" },
      { code: "SY", flag: "🇸🇾", name: "叙利亚", en: "Syria" },
      { code: "LB", flag: "🇱🇧", name: "黎巴嫩", en: "Lebanon" },
      { code: "JO", flag: "🇯🇴", name: "约旦", en: "Jordan" },
      { code: "IL", flag: "🇮🇱", name: "以色列", en: "Israel" },
      { code: "PS", flag: "🇵🇸", name: "巴勒斯坦", en: "Palestine" },
      { code: "SA", flag: "🇸🇦", name: "沙特阿拉伯", en: "Saudi Arabia" },
      { code: "AE", flag: "🇦🇪", name: "阿联酋", en: "UAE" },
      { code: "QA", flag: "🇶🇦", name: "卡塔尔", en: "Qatar" },
      { code: "KW", flag: "🇰🇼", name: "科威特", en: "Kuwait" },
      { code: "BH", flag: "🇧🇭", name: "巴林", en: "Bahrain" },
      { code: "OM", flag: "🇴🇲", name: "阿曼", en: "Oman" },
      { code: "YE", flag: "🇾🇪", name: "也门", en: "Yemen" },
      { code: "TR", flag: "🇹🇷", name: "土耳其", en: "Turkey" },
      { code: "CY", flag: "🇨🇾", name: "塞浦路斯", en: "Cyprus" },
      { code: "GE", flag: "🇬🇪", name: "格鲁吉亚", en: "Georgia" },
      { code: "AM", flag: "🇦🇲", name: "亚美尼亚", en: "Armenia" },
      { code: "AZ", flag: "🇦🇿", name: "阿塞拜疆", en: "Azerbaijan" },
    ]
  },
  europe: {
    name: "🏰 欧洲",
    countries: [
      { code: "RU", flag: "🇷🇺", name: "俄罗斯", en: "Russia" },
      { code: "UA", flag: "🇺🇦", name: "乌克兰", en: "Ukraine" },
      { code: "BY", flag: "🇧🇾", name: "白俄罗斯", en: "Belarus" },
      { code: "MD", flag: "🇲🇩", name: "摩尔多瓦", en: "Moldova" },
      { code: "PL", flag: "🇵🇱", name: "波兰", en: "Poland" },
      { code: "DE", flag: "🇩🇪", name: "德国", en: "Germany" },
      { code: "FR", flag: "🇫🇷", name: "法国", en: "France" },
      { code: "GB", flag: "🇬🇧", name: "英国", en: "United Kingdom" },
      { code: "IT", flag: "🇮🇹", name: "意大利", en: "Italy" },
      { code: "ES", flag: "🇪🇸", name: "西班牙", en: "Spain" },
      { code: "PT", flag: "🇵🇹", name: "葡萄牙", en: "Portugal" },
      { code: "NL", flag: "🇳🇱", name: "荷兰", en: "Netherlands" },
      { code: "BE", flag: "🇧🇪", name: "比利时", en: "Belgium" },
      { code: "LU", flag: "🇱🇺", name: "卢森堡", en: "Luxembourg" },
      { code: "CH", flag: "🇨🇭", name: "瑞士", en: "Switzerland" },
      { code: "AT", flag: "🇦🇹", name: "奥地利", en: "Austria" },
      { code: "CZ", flag: "🇨🇿", name: "捷克", en: "Czech Republic" },
      { code: "SK", flag: "🇸🇰", name: "斯洛伐克", en: "Slovakia" },
      { code: "HU", flag: "🇭🇺", name: "匈牙利", en: "Hungary" },
      { code: "RO", flag: "🇷🇴", name: "罗马尼亚", en: "Romania" },
      { code: "BG", flag: "🇧🇬", name: "保加利亚", en: "Bulgaria" },
      { code: "GR", flag: "🇬🇷", name: "希腊", en: "Greece" },
      { code: "RS", flag: "🇷🇸", name: "塞尔维亚", en: "Serbia" },
      { code: "HR", flag: "🇭🇷", name: "克罗地亚", en: "Croatia" },
      { code: "SI", flag: "🇸🇮", name: "斯洛文尼亚", en: "Slovenia" },
      { code: "BA", flag: "🇧🇦", name: "波黑", en: "Bosnia" },
      { code: "ME", flag: "🇲🇪", name: "黑山", en: "Montenegro" },
      { code: "MK", flag: "🇲🇰", name: "北马其顿", en: "North Macedonia" },
      { code: "AL", flag: "🇦🇱", name: "阿尔巴尼亚", en: "Albania" },
      { code: "XK", flag: "🇽🇰", name: "科索沃", en: "Kosovo" },
      { code: "DK", flag: "🇩🇰", name: "丹麦", en: "Denmark" },
      { code: "SE", flag: "🇸🇪", name: "瑞典", en: "Sweden" },
      { code: "NO", flag: "🇳🇴", name: "挪威", en: "Norway" },
      { code: "FI", flag: "🇫🇮", name: "芬兰", en: "Finland" },
      { code: "IS", flag: "🇮🇸", name: "冰岛", en: "Iceland" },
      { code: "IE", flag: "🇮🇪", name: "爱尔兰", en: "Ireland" },
      { code: "EE", flag: "🇪🇪", name: "爱沙尼亚", en: "Estonia" },
      { code: "LV", flag: "🇱🇻", name: "拉脱维亚", en: "Latvia" },
      { code: "LT", flag: "🇱🇹", name: "立陶宛", en: "Lithuania" },
      { code: "MT", flag: "🇲🇹", name: "马耳他", en: "Malta" },
      { code: "MC", flag: "🇲🇨", name: "摩纳哥", en: "Monaco" },
      { code: "AD", flag: "🇦🇩", name: "安道尔", en: "Andorra" },
      { code: "LI", flag: "🇱🇮", name: "列支敦士登", en: "Liechtenstein" },
      { code: "SM", flag: "🇸🇲", name: "圣马力诺", en: "San Marino" },
      { code: "VA", flag: "🇻🇦", name: "梵蒂冈", en: "Vatican" },
    ]
  },
  africa: {
    name: "🌍 非洲",
    countries: [
      { code: "EG", flag: "🇪🇬", name: "埃及", en: "Egypt" },
      { code: "LY", flag: "🇱🇾", name: "利比亚", en: "Libya" },
      { code: "TN", flag: "🇹🇳", name: "突尼斯", en: "Tunisia" },
      { code: "DZ", flag: "🇩🇿", name: "阿尔及利亚", en: "Algeria" },
      { code: "MA", flag: "🇲🇦", name: "摩洛哥", en: "Morocco" },
      { code: "SD", flag: "🇸🇩", name: "苏丹", en: "Sudan" },
      { code: "SS", flag: "🇸🇸", name: "南苏丹", en: "South Sudan" },
      { code: "ET", flag: "🇪🇹", name: "埃塞俄比亚", en: "Ethiopia" },
      { code: "ER", flag: "🇪🇷", name: "厄立特里亚", en: "Eritrea" },
      { code: "DJ", flag: "🇩🇯", name: "吉布提", en: "Djibouti" },
      { code: "SO", flag: "🇸🇴", name: "索马里", en: "Somalia" },
      { code: "KE", flag: "🇰🇪", name: "肯尼亚", en: "Kenya" },
      { code: "UG", flag: "🇺🇬", name: "乌干达", en: "Uganda" },
      { code: "TZ", flag: "🇹🇿", name: "坦桑尼亚", en: "Tanzania" },
      { code: "RW", flag: "🇷🇼", name: "卢旺达", en: "Rwanda" },
      { code: "BI", flag: "🇧🇮", name: "布隆迪", en: "Burundi" },
      { code: "CD", flag: "🇨🇩", name: "刚果(金)", en: "DR Congo" },
      { code: "CG", flag: "🇨🇬", name: "刚果(布)", en: "Congo" },
      { code: "CF", flag: "🇨🇫", name: "中非", en: "Central African Republic" },
      { code: "CM", flag: "🇨🇲", name: "喀麦隆", en: "Cameroon" },
      { code: "GA", flag: "🇬🇦", name: "加蓬", en: "Gabon" },
      { code: "GQ", flag: "🇬🇶", name: "赤道几内亚", en: "Equatorial Guinea" },
      { code: "TD", flag: "🇹🇩", name: "乍得", en: "Chad" },
      { code: "NE", flag: "🇳🇪", name: "尼日尔", en: "Niger" },
      { code: "NG", flag: "🇳🇬", name: "尼日利亚", en: "Nigeria" },
      { code: "BJ", flag: "🇧🇯", name: "贝宁", en: "Benin" },
      { code: "TG", flag: "🇹🇬", name: "多哥", en: "Togo" },
      { code: "GH", flag: "🇬🇭", name: "加纳", en: "Ghana" },
      { code: "CI", flag: "🇨🇮", name: "科特迪瓦", en: "Ivory Coast" },
      { code: "BF", flag: "🇧🇫", name: "布基纳法索", en: "Burkina Faso" },
      { code: "ML", flag: "🇲🇱", name: "马里", en: "Mali" },
      { code: "MR", flag: "🇲🇷", name: "毛里塔尼亚", en: "Mauritania" },
      { code: "SN", flag: "🇸🇳", name: "塞内加尔", en: "Senegal" },
      { code: "GM", flag: "🇬🇲", name: "冈比亚", en: "Gambia" },
      { code: "GW", flag: "🇬🇼", name: "几内亚比绍", en: "Guinea-Bissau" },
      { code: "GN", flag: "🇬🇳", name: "几内亚", en: "Guinea" },
      { code: "SL", flag: "🇸🇱", name: "塞拉利昂", en: "Sierra Leone" },
      { code: "LR", flag: "🇱🇷", name: "利比里亚", en: "Liberia" },
      { code: "CV", flag: "🇨🇻", name: "佛得角", en: "Cape Verde" },
      { code: "ZA", flag: "🇿🇦", name: "南非", en: "South Africa" },
      { code: "NA", flag: "🇳🇦", name: "纳米比亚", en: "Namibia" },
      { code: "BW", flag: "🇧🇼", name: "博茨瓦纳", en: "Botswana" },
      { code: "ZW", flag: "🇿🇼", name: "津巴布韦", en: "Zimbabwe" },
      { code: "ZM", flag: "🇿🇲", name: "赞比亚", en: "Zambia" },
      { code: "MW", flag: "🇲🇼", name: "马拉维", en: "Malawi" },
      { code: "MZ", flag: "🇲🇿", name: "莫桑比克", en: "Mozambique" },
      { code: "AO", flag: "🇦🇴", name: "安哥拉", en: "Angola" },
      { code: "SZ", flag: "🇸🇿", name: "斯威士兰", en: "Eswatini" },
      { code: "LS", flag: "🇱🇸", name: "莱索托", en: "Lesotho" },
      { code: "MG", flag: "🇲🇬", name: "马达加斯加", en: "Madagascar" },
      { code: "MU", flag: "🇲🇺", name: "毛里求斯", en: "Mauritius" },
      { code: "KM", flag: "🇰🇲", name: "科摩罗", en: "Comoros" },
      { code: "SC", flag: "🇸🇨", name: "塞舌尔", en: "Seychelles" },
      { code: "ST", flag: "🇸🇹", name: "圣多美和普林西比", en: "Sao Tome" },
    ]
  },
  northAmerica: {
    name: "🗽 北美洲",
    countries: [
      { code: "US", flag: "🇺🇸", name: "美国", en: "United States" },
      { code: "CA", flag: "🇨🇦", name: "加拿大", en: "Canada" },
      { code: "MX", flag: "🇲🇽", name: "墨西哥", en: "Mexico" },
      { code: "GT", flag: "🇬🇹", name: "危地马拉", en: "Guatemala" },
      { code: "BZ", flag: "🇧🇿", name: "伯利兹", en: "Belize" },
      { code: "SV", flag: "🇸🇻", name: "萨尔瓦多", en: "El Salvador" },
      { code: "HN", flag: "🇭🇳", name: "洪都拉斯", en: "Honduras" },
      { code: "NI", flag: "🇳🇮", name: "尼加拉瓜", en: "Nicaragua" },
      { code: "CR", flag: "🇨🇷", name: "哥斯达黎加", en: "Costa Rica" },
      { code: "PA", flag: "🇵🇦", name: "巴拿马", en: "Panama" },
      { code: "CU", flag: "🇨🇺", name: "古巴", en: "Cuba" },
      { code: "JM", flag: "🇯🇲", name: "牙买加", en: "Jamaica" },
      { code: "HT", flag: "🇭🇹", name: "海地", en: "Haiti" },
      { code: "DO", flag: "🇩🇴", name: "多米尼加", en: "Dominican Republic" },
      { code: "PR", flag: "🇵🇷", name: "波多黎各", en: "Puerto Rico" },
      { code: "BS", flag: "🇧🇸", name: "巴哈马", en: "Bahamas" },
      { code: "TT", flag: "🇹🇹", name: "特立尼达和多巴哥", en: "Trinidad and Tobago" },
      { code: "BB", flag: "🇧🇧", name: "巴巴多斯", en: "Barbados" },
      { code: "LC", flag: "🇱🇨", name: "圣卢西亚", en: "Saint Lucia" },
      { code: "GD", flag: "🇬🇩", name: "格林纳达", en: "Grenada" },
      { code: "VC", flag: "🇻🇨", name: "圣文森特", en: "Saint Vincent" },
      { code: "AG", flag: "🇦🇬", name: "安提瓜和巴布达", en: "Antigua and Barbuda" },
      { code: "DM", flag: "🇩🇲", name: "多米尼克", en: "Dominica" },
      { code: "KN", flag: "🇰🇳", name: "圣基茨和尼维斯", en: "Saint Kitts and Nevis" },
      { code: "GL", flag: "🇬🇱", name: "格陵兰", en: "Greenland" },
      { code: "BM", flag: "🇧🇲", name: "百慕大", en: "Bermuda" },
      { code: "KY", flag: "🇰🇾", name: "开曼群岛", en: "Cayman Islands" },
      { code: "VG", flag: "🇻🇬", name: "英属维尔京群岛", en: "British Virgin Islands" },
      { code: "VI", flag: "🇻🇮", name: "美属维尔京群岛", en: "US Virgin Islands" },
      { code: "AW", flag: "🇦🇼", name: "阿鲁巴", en: "Aruba" },
      { code: "CW", flag: "🇨🇼", name: "库拉索", en: "Curacao" },
    ]
  },
  southAmerica: {
    name: "🌎 南美洲",
    countries: [
      { code: "BR", flag: "🇧🇷", name: "巴西", en: "Brazil" },
      { code: "AR", flag: "🇦🇷", name: "阿根廷", en: "Argentina" },
      { code: "CL", flag: "🇨🇱", name: "智利", en: "Chile" },
      { code: "PE", flag: "🇵🇪", name: "秘鲁", en: "Peru" },
      { code: "CO", flag: "🇨🇴", name: "哥伦比亚", en: "Colombia" },
      { code: "VE", flag: "🇻🇪", name: "委内瑞拉", en: "Venezuela" },
      { code: "EC", flag: "🇪🇨", name: "厄瓜多尔", en: "Ecuador" },
      { code: "BO", flag: "🇧🇴", name: "玻利维亚", en: "Bolivia" },
      { code: "PY", flag: "🇵🇾", name: "巴拉圭", en: "Paraguay" },
      { code: "UY", flag: "🇺🇾", name: "乌拉圭", en: "Uruguay" },
      { code: "GY", flag: "🇬🇾", name: "圭亚那", en: "Guyana" },
      { code: "SR", flag: "🇸🇷", name: "苏里南", en: "Suriname" },
      { code: "GF", flag: "🇬🇫", name: "法属圭亚那", en: "French Guiana" },
      { code: "FK", flag: "🇫🇰", name: "福克兰群岛", en: "Falkland Islands" },
    ]
  },
  oceania: {
    name: "🏝️ 大洋洲",
    countries: [
      { code: "AU", flag: "🇦🇺", name: "澳大利亚", en: "Australia" },
      { code: "NZ", flag: "🇳🇿", name: "新西兰", en: "New Zealand" },
      { code: "PG", flag: "🇵🇬", name: "巴布亚新几内亚", en: "Papua New Guinea" },
      { code: "FJ", flag: "🇫🇯", name: "斐济", en: "Fiji" },
      { code: "SB", flag: "🇸🇧", name: "所罗门群岛", en: "Solomon Islands" },
      { code: "VU", flag: "🇻🇺", name: "瓦努阿图", en: "Vanuatu" },
      { code: "NC", flag: "🇳🇨", name: "新喀里多尼亚", en: "New Caledonia" },
      { code: "PF", flag: "🇵🇫", name: "法属波利尼西亚", en: "French Polynesia" },
      { code: "WS", flag: "🇼🇸", name: "萨摩亚", en: "Samoa" },
      { code: "TO", flag: "🇹🇴", name: "汤加", en: "Tonga" },
      { code: "KI", flag: "🇰🇮", name: "基里巴斯", en: "Kiribati" },
      { code: "FM", flag: "🇫🇲", name: "密克罗尼西亚", en: "Micronesia" },
      { code: "MH", flag: "🇲🇭", name: "马绍尔群岛", en: "Marshall Islands" },
      { code: "PW", flag: "🇵🇼", name: "帕劳", en: "Palau" },
      { code: "NR", flag: "🇳🇷", name: "瑙鲁", en: "Nauru" },
      { code: "TV", flag: "🇹🇻", name: "图瓦卢", en: "Tuvalu" },
      { code: "GU", flag: "🇬🇺", name: "关岛", en: "Guam" },
      { code: "AS", flag: "🇦🇸", name: "美属萨摩亚", en: "American Samoa" },
      { code: "CK", flag: "🇨🇰", name: "库克群岛", en: "Cook Islands" },
      { code: "NU", flag: "🇳🇺", name: "纽埃", en: "Niue" },
      { code: "TK", flag: "🇹🇰", name: "托克劳", en: "Tokelau" },
      { code: "WF", flag: "🇼🇫", name: "瓦利斯和富图纳", en: "Wallis and Futuna" },
    ]
  },
};

// 获取所有国家的扁平列表
export const getAllCountries = () => {
  return Object.values(COUNTRIES).flatMap(region => region.countries);
};

// 国家选择器组件
export const CountrySelector = () => (
  <div id="country_selector" class="ml-7 p-4 border rounded-lg bg-gray-50 hidden">
    <div class="mb-3">
      <input 
        type="text" 
        id="country_search" 
        placeholder="🔍 搜索国家/地区..." 
        class="w-full border border-gray-300 p-2 rounded-lg text-sm"
      />
    </div>
    <div class="flex gap-2 mb-3">
      <button type="button" id="select_all_countries" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">全选</button>
      <button type="button" id="deselect_all_countries" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">取消全选</button>
      <span id="selected_count" class="text-xs text-gray-500 ml-auto self-center">已选: 0</span>
    </div>
    <div class="max-h-96 overflow-y-auto space-y-4" id="country_list">
      {Object.entries(COUNTRIES).map(([key, region]) => (
        <div class="country-group">
          <h4 class="font-medium text-sm text-gray-700 mb-2 sticky top-0 bg-gray-50 py-1">{region.name}</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {region.countries.map(country => (
              <label 
                class="country-item flex items-center gap-2 cursor-pointer" 
                data-name={`${country.name} ${country.en} ${country.code}`}
              >
                <input type="checkbox" name="blocked_countries" value={country.code} class="w-3 h-3 rounded" />
                <span>{country.flag} {country.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 国家选择器的 JavaScript 逻辑
export const CountrySelectorScript = () => (
  <script>
    {`
      // 切换国家选择器显示
      document.getElementById('block_countries_toggle').addEventListener('change', function() {
        document.getElementById('country_selector').classList.toggle('hidden', !this.checked);
      });

      // 搜索功能
      document.getElementById('country_search').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        document.querySelectorAll('.country-item').forEach(item => {
          const name = item.dataset.name.toLowerCase();
          item.style.display = name.includes(query) ? '' : 'none';
        });
        // 隐藏空的分组
        document.querySelectorAll('.country-group').forEach(group => {
          const visibleItems = group.querySelectorAll('.country-item[style=""], .country-item:not([style])');
          group.style.display = visibleItems.length > 0 ? '' : 'none';
        });
      });

      // 更新选中计数
      function updateSelectedCount() {
        const count = document.querySelectorAll('input[name="blocked_countries"]:checked').length;
        document.getElementById('selected_count').textContent = '已选: ' + count;
      }

      // 全选
      document.getElementById('select_all_countries').addEventListener('click', function() {
        document.querySelectorAll('.country-item:not([style*="none"]) input[name="blocked_countries"]').forEach(cb => cb.checked = true);
        updateSelectedCount();
      });

      // 取消全选
      document.getElementById('deselect_all_countries').addEventListener('click', function() {
        document.querySelectorAll('input[name="blocked_countries"]').forEach(cb => cb.checked = false);
        updateSelectedCount();
      });

      // 监听复选框变化
      document.getElementById('country_list').addEventListener('change', updateSelectedCount);
    `}
  </script>
);
