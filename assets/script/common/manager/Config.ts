export const Config = {//事件名称
    SCREENPOS: 'screenPos',//固定屏幕位置
    GOLD: "gold",
    GOLDOFFLINE: "goldOffline",//离线金币
    GOLDOFFLINECHANGE: "goldofflineChange",//离线金币改变
    LEVEL: "level",
    TIP: "tip",
    LOCKROOM: 'lockromm',//解锁房屋
    LOCKROOMCHANGE: "lockchange",//lockChange
    SUCCESS: 'success',
    SETPANEL: 'set',
    GOLDPOS: 'goldPos',
    INSTANTIATEGOLD: "instantiateGold",//生成金币
    SIGNIN: 'signIn',//签到奖励
    SIGNINCHANGE: 'signInChange',//签到改变
    SIGNRED: 'signRed',//签到小红点
    SIGNINTRUE: 'signInTrue',//签到展示
    SHOP: 'shop',//商店
    SELECTSHOP: 'selectshop',//选中商品
    SHOPCHANGE: 'shopChange',//商店数据改变
    SHOP_POS_CHANGE: 'shop_pos_change',//商店位置数据改变
    SHOP_POS: "shopPos",
    SHOP_POSFLAG: "shopFlag",

    RECRUIT: 'recruit',//招募
    APPITEM: 'appitem',//appItem
    BUILDINGSUP: 'buildingsup',//升级
    BUILDINGSAPP: 'buildingsApp',//外观
    APPSELECT: 'appSelect',//外观选中
    RECRUITCHANGE: 'recruitChange',//招募改变
    BUILDINGSDETAILS: 'buildingsDetails',//建筑物细节
    BUILDINGSSELECT: 'buildingsSelect',
    BUILDINGS: 'buildings',//建筑物
    BUILDINGSCHANGE: 'buildingsChane',
    BUILDINGSUPDATE: 'buildingsUpdate',//厕所解锁
    LOOTIME: 'lootime',//洗手池使用时间
    BLOCK: 'block',//block遮挡
    FALLINGRED: 'fallingRed',//掉落小红点
    FALLINGGOODS: 'fallingGoods',//掉落物品
    UPGRADE_BUILDINGS: 'upgrade_buildings',//保存当前建筑物是正在升级
    LEAVELOO: "leaveLoo",//离开洗手台
    LEAVETOILETONE: "leaveToiletone",
    LEAVETOILETTWO: "leaveToilettwo",
    LEAVETOILETTHERE: "leaveToiletthere",
    FIXLOO: 'fixloo',//维修洗手台
    WAREHOUSE: "warehouse",//仓库数据
    WAREHOUSECHNAGE: "warehouseChange",//仓库数据
    WAREHOUSEANIM: 'warehouseanim',//仓库动画
    APPEARANCE: "appearance",//外观Game中绑定
    APPEARANCECHANGE: "appearanceChange",
    PROPADDS: 'propAdds',//道具解锁
    // HIDEBUILDINGS: 'hidebuildings',//隐藏建筑
    HIDEALL: 'hideAll',//隐藏所有
    STOCKOUT: 'stockout', //缺货
    MAGNIFY: 'magnify',//放大
    GRAPHICS: "graphics",//画图
    CLEAN: "clean",//清洁
    NEWGUIDECON: 'newguidecon',//新手引导继续
    NEWGUID: 'newguid',//新手引导

    TTOVER: "ttover",//头条结束
    INFORM: 'inform',//通知
    ALLRED: "allred",//所有小红点
    HIDESHOP: 'hideshop',//隐藏商店按钮
    GARBAGEOPACITY: 'garbageopacity',//垃圾透明度
    OPPO: "oppo",//oppo原生
}
export const TipLab = {//提示语
    gold_not: "金币不足",
    lock: '当前关卡未解锁',
    comingsoon: "敬请期待",
    fail: "失败了",
    get_hint: '获得提示',
    not_reward: '亲,看完视频获得奖励哦',
    have_reward: '已经领取了哦',
    not_arrived_time: '时间未到,不要心急',
    use_buildings: '设备使用中，请稍后升级',
    upgrade_buildings: '设备正在升级中',
    levelCap: '已达上限',
    recruited: "被招募",
    dissmissal: "已解雇"
}
export const InformLab = {

}
//命名规则
//弹窗路径
let path: string = 'prefabs/'
export const PopupPath = {
    signIn: path + 'signIn',//签到
    shop: path + 'shop',//商城
    buildings: path + 'buildings',//建筑
    warehouse: path + 'warehouse',//仓库
    activity: path + 'activity',//活动
    task: path + 'task',//任务
    dial: path + 'dial',//转盘
    recruit: path + 'recruit',//招募
    tip: path + 'tip',
    loo: path + 'loo',//洗手间
    block: path + "block",
    ttrec: path + 'ttrec'
}
//存储区域
export interface In_Save_Shop
{
    ID: number,
    count: number
}
export interface In_Save_Apperance
{
    index: number,
    geta: boolean,
    gets: boolean
}
export interface In_Save_Buildings
{
    index: number,//下标
    dirty: number,//变脏值
    level: number,//等级
    upgrade: number,//当前是否正在升级，初始为0；
}
// export interface IN_Save_Warehouse
// {
//     ID: number,
//     count: number,
// }

//JSON表区域
export interface In_RECRUIT
{
    ID: number,
    name: string,
    efficiency: number,
    time: number,
    price: number,
    level: number,
    color: string
}
export const LOCK_ROOM: number[] = [0, 0, 2, 18]
export interface In_BUILDINGS
{
    ID: number, name: string, TIPS: string, level: number, icon: string, upgrade_time: number, gold: number, earnings: number
    max_dirty: number, change_dirty: number, use_time: number, lock: number, index: number

}
export const RECRUIT: In_RECRUIT[] = [
    { "ID": 1, "name": "小太白", "efficiency": 30, "time": 30, "price": 50, "level": 1, "color": "#b7d2b5" },
    { "ID": 2, "name": "小灵宝", "efficiency": 28, "time": 30, "price": 300, "level": 2, "color": "#ecae7d" },
    { "ID": 3, "name": "小太保", "efficiency": 26, "time": 26, "price": 1800, "level": 3, "color": "#a8b9d1" },
    { "ID": 4, "name": "小日月", "efficiency": 26, "time": 26, "price": 10000, "level": 3, "color": "#a8b9d1" },
    { "ID": 5, "name": "小乐乐", "efficiency": 24, "time": 22, "price": 50000, "level": 4, "color": "#d7c3e6" },
    { "ID": 6, "name": "小土豆", "efficiency": 24, "time": 22, "price": 135000, "level": 4, "color": "#d7c3e6" },
    { "ID": 7, "name": "小灵丹", "efficiency": 20, "time": 15, "price": 420000, "level": 5, "color": "#eed37" },
    { "ID": 8, "name": "小沙子", "efficiency": 20, "time": 15, "price": 1000000, "level": 5, "color": "#eed37" },

]
export const BUILDINGS: In_BUILDINGS[] = [
    { "ID": 1, "name": "洗手池", "TIPS": "", "level": 1, "icon": "loo_1", "upgrade_time": 10, "gold": 0, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 8, "lock": 0, "index": 0 },
    { "ID": 2, "name": "洗手池", "TIPS": "", "level": 2, "icon": "loo_2", "upgrade_time": 10, "gold": 140000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 6, "lock": 6, "index": 0 },
    { "ID": 3, "name": "洗手池", "TIPS": "", "level": 3, "icon": "loo_3", "upgrade_time": 10, "gold": 2770000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 3, "lock": 12, "index": 0 },
    { "ID": 4, "name": "洗手池", "TIPS": "", "level": 1, "icon": "loo_1", "upgrade_time": 10, "gold": 2300, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 8, "lock": 2, "index": 1 },
    { "ID": 5, "name": "洗手池", "TIPS": "", "level": 2, "icon": "loo_2", "upgrade_time": 10, "gold": 480000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 6, "lock": 8, "index": 1 },
    { "ID": 6, "name": "洗手池", "TIPS": "", "level": 3, "icon": "loo_3", "upgrade_time": 10, "gold": 5400000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 3, "lock": 14, "index": 1 },
    { "ID": 7, "name": "洗手池", "TIPS": "", "level": 1, "icon": "loo_1", "upgrade_time": 10, "gold": 20000, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 8, "lock": 4, "index": 2 },
    { "ID": 8, "name": "洗手池", "TIPS": "", "level": 2, "icon": "loo_2", "upgrade_time": 10, "gold": 1260000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 6, "lock": 10, "index": 2 },
    { "ID": 9, "name": "洗手池", "TIPS": "", "level": 3, "icon": "loo_3", "upgrade_time": 10, "gold": 9620000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 3, "lock": 16, "index": 2 },
    { "ID": 10, "name": "卫生间", "TIPS": "", "level": 1, "icon": "bay_1", "upgrade_time": 10, "gold": 0, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 5, "lock": 0, "index": 3 },
    { "ID": 11, "name": "卫生间", "TIPS": "", "level": 2, "icon": "bay_2", "upgrade_time": 10, "gold": 120000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 4, "lock": 6, "index": 3 },
    { "ID": 12, "name": "卫生间", "TIPS": "", "level": 3, "icon": "bay_3", "upgrade_time": 10, "gold": 2370000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 2, "lock": 12, "index": 3 },
    { "ID": 13, "name": "卫生间", "TIPS": "", "level": 1, "icon": "bay_1", "upgrade_time": 10, "gold": 100, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 5, "lock": 1, "index": 4 },
    { "ID": 14, "name": "卫生间", "TIPS": "", "level": 2, "icon": "bay_2", "upgrade_time": 10, "gold": 410000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 4, "lock": 8, "index": 4 },
    { "ID": 15, "name": "卫生间", "TIPS": "", "level": 3, "icon": "bay_3", "upgrade_time": 10, "gold": 4630000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 2, "lock": 14, "index": 4 },
    { "ID": 16, "name": "卫生间", "TIPS": "", "level": 1, "icon": "bay_1", "upgrade_time": 10, "gold": 10000, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 5, "lock": 3, "index": 5 },
    { "ID": 17, "name": "卫生间", "TIPS": "", "level": 2, "icon": "bay_2", "upgrade_time": 10, "gold": 1080000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 4, "lock": 10, "index": 5 },
    { "ID": 18, "name": "卫生间", "TIPS": "", "level": 3, "icon": "bay_3", "upgrade_time": 10, "gold": 8250000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 2, "lock": 16, "index": 5 },
    { "ID": 19, "name": "卫生间", "TIPS": "", "level": 1, "icon": "bay_1", "upgrade_time": 10, "gold": 0, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 5, "lock": 2, "index": 6 },
    { "ID": 20, "name": "卫生间", "TIPS": "", "level": 2, "icon": "bay_2", "upgrade_time": 10, "gold": 270000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 4, "lock": 7, "index": 6 },
    { "ID": 21, "name": "卫生间", "TIPS": "", "level": 3, "icon": "bay_3", "upgrade_time": 10, "gold": 3920000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 2, "lock": 13, "index": 6 },
    { "ID": 22, "name": "卫生间", "TIPS": "", "level": 1, "icon": "bay_1", "upgrade_time": 10, "gold": 20000, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 5, "lock": 4, "index": 7 },
    { "ID": 23, "name": "卫生间", "TIPS": "", "level": 2, "icon": "bay_2", "upgrade_time": 10, "gold": 800000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 4, "lock": 9, "index": 7 },
    { "ID": 24, "name": "卫生间", "TIPS": "", "level": 3, "icon": "bay_3", "upgrade_time": 10, "gold": 7280000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 2, "lock": 15, "index": 7 },
    { "ID": 25, "name": "卫生间", "TIPS": "", "level": 1, "icon": "bay_1", "upgrade_time": 10, "gold": 60000, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 5, "lock": 5, "index": 8 },
    { "ID": 26, "name": "卫生间", "TIPS": "", "level": 2, "icon": "bay_2", "upgrade_time": 10, "gold": 1900000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 4, "lock": 11, "index": 8 },
    { "ID": 27, "name": "卫生间", "TIPS": "", "level": 3, "icon": "bay_3", "upgrade_time": 10, "gold": 12510000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 2, "lock": 17, "index": 8 },
    { "ID": 28, "name": "卫生间", "TIPS": "", "level": 1, "icon": "bay_1", "upgrade_time": 10, "gold": 16020000, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 5, "lock": 18, "index": 9 },
    { "ID": 29, "name": "卫生间", "TIPS": "", "level": 2, "icon": "bay_2", "upgrade_time": 10, "gold": 25280000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 4, "lock": 20, "index": 9 },
    { "ID": 30, "name": "卫生间", "TIPS": "", "level": 3, "icon": "bay_3", "upgrade_time": 10, "gold": 66440000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 2, "lock": 25, "index": 9 },
    { "ID": 31, "name": "卫生间", "TIPS": "", "level": 1, "icon": "bay_1", "upgrade_time": 10, "gold": 16020000, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 5, "lock": 18, "index": 10 },
    { "ID": 32, "name": "卫生间", "TIPS": "", "level": 2, "icon": "bay_2", "upgrade_time": 10, "gold": 25280000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 4, "lock": 20, "index": 10 },
    { "ID": 33, "name": "卫生间", "TIPS": "", "level": 3, "icon": "bay_3", "upgrade_time": 10, "gold": 66440000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 2, "lock": 25, "index": 10 },
    { "ID": 34, "name": "卫生间", "TIPS": "", "level": 1, "icon": "bay_1", "upgrade_time": 10, "gold": 16020000, "earnings": 0, "max_dirty": 200, "change_dirty": 10, "use_time": 5, "lock": 18, "index": 11 },
    { "ID": 35, "name": "卫生间", "TIPS": "", "level": 2, "icon": "bay_2", "upgrade_time": 10, "gold": 25280000, "earnings": 0, "max_dirty": 500, "change_dirty": 9, "use_time": 4, "lock": 20, "index": 11 },
    { "ID": 36, "name": "卫生间", "TIPS": "", "level": 3, "icon": "bay_3", "upgrade_time": 10, "gold": 66440000, "earnings": 0, "max_dirty": 1000, "change_dirty": 8, "use_time": 2, "lock": 25, "index": 11 },

]
export interface In_SHOP
{
    ID: number,
    name: string,
    lock: number,
    buy: number,
    overlay: number,
    sell: number,
    room: number
    use_time: number,
    clean: number,
    jiesuan: number
}
export const SHOP: In_SHOP[] = [
    { "ID": 1, "name": "手纸", "lock": 0, "buy": 2, "overlay": 200, "sell": 10, "room": 0, "use_time": -1, "clean": 0, "jiesuan": 0 },
    { "ID": 2, "name": "高级纸巾", "lock": 0, "buy": 5, "overlay": 100, "sell": 25, "room": 0, "use_time": 1, "clean": 0, "jiesuan": 0.05 },
    { "ID": 3, "name": "牛奶", "lock": 0, "buy": 3, "overlay": 100, "sell": 100, "room": 2, "use_time": 0, "clean": 0.2, "jiesuan": 0.05 },
    { "ID": 4, "name": "速干毛巾", "lock": 1, "buy": 3, "overlay": 100, "sell": 15, "room": 1, "use_time": 1, "clean": 0, "jiesuan": 0 },
    { "ID": 5, "name": "洗手液", "lock": 2, "buy": 7, "overlay": 100, "sell": 35, "room": 1, "use_time": 0, "clean": 0, "jiesuan": 0.05 },
    { "ID": 6, "name": "快乐果冻", "lock": 3, "buy": 10, "overlay": 50, "sell": 80, "room": 0, "use_time": 0, "clean": -0.3, "jiesuan": 0.1 },
    { "ID": 7, "name": "梳子", "lock": 4, "buy": 15, "overlay": 100, "sell": 75, "room": 1, "use_time": 1, "clean": 0, "jiesuan": 0.2 },
    { "ID": 8, "name": "衣服", "lock": 5, "buy": 50, "overlay": 10, "sell": 300, "room": 0, "use_time": 0, "clean": -1, "jiesuan": 0.2 },
    { "ID": 9, "name": "快乐水", "lock": 5, "buy": 8, "overlay": 100, "sell": 80, "room": 2, "use_time": 0, "clean": 0.2, "jiesuan": 0.1 },
    { "ID": 10, "name": "发胶", "lock": 6, "buy": 55, "overlay": 30, "sell": 600, "room": 1, "use_time": 0, "clean": 0, "jiesuan": 0.2 },
    { "ID": 11, "name": "泻药", "lock": 7, "buy": 100, "overlay": 5, "sell": 500, "room": 0, "use_time": 3, "clean": 0, "jiesuan": 1 },
    { "ID": 12, "name": "熏香纸巾", "lock": 8, "buy": 115, "overlay": 10, "sell": 1500, "room": 1, "use_time": 0, "clean": -0.5, "jiesuan": 0.3 },
    { "ID": 13, "name": "碳酸饮料", "lock": 10, "buy": 8, "overlay": 100, "sell": 80, "room": 2, "use_time": 0, "clean": 0.2, "jiesuan": 0.1 },

]
export interface In_Client
{
    ID: number, lock: number, tip: number, prop: string, odds: number
}
export const CLIENT: In_Client[] = [
    { "ID": 0, "lock": 0, "tip": 0, "prop": "手纸", "odds": 10000 },
    { "ID": 1, "lock": 0, "tip": 0, "prop": "高级纸巾", "odds": 10000 },
    { "ID": 2, "lock": 0, "tip": 0, "prop": "牛奶", "odds": 10000 },
    { "ID": 3, "lock": 1, "tip": 0, "prop": "速干毛巾", "odds": 8573.75 },
    { "ID": 4, "lock": 2, "tip": 0, "prop": "洗手液", "odds": 7350.918906 },
    { "ID": 5, "lock": 3, "tip": 0, "prop": "快乐果冻", "odds": 6634.204313 },
    { "ID": 6, "lock": 4, "tip": 0, "prop": "梳子", "odds": 9500 },
    { "ID": 7, "lock": 5, "tip": 0, "prop": "衣服", "odds": 9025 },
    { "ID": 8, "lock": 5, "tip": 0, "prop": "快乐水", "odds": 8145.0625 },
    { "ID": 9, "lock": 6, "tip": 0, "prop": "发胶", "odds": 6983.372961 },
    { "ID": 10, "lock": 7, "tip": 0, "prop": "泻药", "odds": 6302.494097 },
    { "ID": 11, "lock": 8, "tip": 0, "prop": "熏香纸巾", "odds": 7737.809375 },
    { "ID": 12, "lock": 10, "tip": 0, "prop": "碳酸饮料", "odds": 5987.369392 },
]
//清洁脏物
export interface In_CLEANGARBAGE
{
    name: string, TOILET: number, pool: number,
    item_id1: number, item_model1: string, item_tips1: string, transparency1: number,
    item_id2: number, item_model2: string, item_tips2: string, transparency2: number,
    item_id3: number, item_model3: string, item_tips3: string, transparency3: number
}
export const CLEANGARBAGE: In_CLEANGARBAGE[] = [
    { "name": "墙污渍", "TOILET": 1, "pool": 1, "item_id1": 8, "item_model1": "高效去污器", "item_tips1": "请使用[高效去污器]进行基本处理", "transparency1": 0.2, "item_id2": 4, "item_model2": "清洁剂", "item_tips2": "再使用[清洁剂]进行细致处理", "transparency2": 0.2, "item_id3": 2, "item_model3": "刷子", "item_tips3": "现在赶快使用[刷子]进行最后的处理吧", "transparency3": 0.6 },
    { "name": "污物", "TOILET": 1, "pool": 1, "item_id1": 5, "item_model1": "除味剂", "item_tips1": "请使用[除味剂]进行基本处理", "transparency1": 0.2, "item_id2": 4, "item_model2": "清洁剂", "item_tips2": "再使用[清洁剂]进行细致处理", "transparency2": 0.2, "item_id3": 1, "item_model3": "抹布", "item_tips3": "现在赶快使用[抹布]进行最后的处理吧", "transparency3": 0.6 },
    { "name": "废纸", "TOILET": 1, "pool": 1, "item_id1": 3, "item_model1": "马桶塞", "item_tips1": "请使用[马桶塞]进行基本处理", "transparency1": 0.4, "item_id2": 6, "item_model2": "清新剂", "item_tips2": "再使用[清新剂]进行细致处理", "transparency2": 0.2, "item_id3": 2, "item_model3": "刷子", "item_tips3": "现在赶快使用[刷子]进行最后的处理吧", "transparency3": 0.4 },
    { "name": "水渍", "TOILET": 1, "pool": 1, "item_id1": 4, "item_model1": "清洁剂", "item_tips1": "请使用[清洁剂]进行基本处理", "transparency1": 0.2, "item_id2": 1, "item_model2": "抹布", "item_tips2": "再使用[抹布]进行细致处理", "transparency2": 0.2, "item_id3": 10, "item_model3": "吹风机", "item_tips3": "现在赶快使用[吹风机]进行最后的处理吧", "transparency3": 0.6 },
    { "name": "手纸", "TOILET": 1, "pool": 1, "item_id1": 5, "item_model1": "除味剂", "item_tips1": "请使用[除味剂]进行基本处理", "transparency1": 0.2, "item_id2": 2, "item_model2": "刷子", "item_tips2": "再使用[刷子]进行细致处理", "transparency2": 0.2, "item_id3": 1, "item_model3": "抹布", "item_tips3": "现在赶快使用[抹布]进行最后的处理吧", "transparency3": 0.6 },
    { "name": "口红污渍", "TOILET": 0, "pool": 1, "item_id1": 8, "item_model1": "高效去污器", "item_tips1": "请使用[高效去污器]进行基本处理", "transparency1": 0.2, "item_id2": 4, "item_model2": "清洁剂", "item_tips2": "再使用[清洁剂]进行细致处理", "transparency2": 0.2, "item_id3": 1, "item_model3": "抹布", "item_tips3": "现在赶快使用[抹布]进行最后的处理吧", "transparency3": 0.6 },
    { "name": "不明液体", "TOILET": 1, "pool": 1, "item_id1": 8, "item_model1": "高效去污器", "item_tips1": "请使用[高效去污器]进行基本处理", "transparency1": 0.2, "item_id2": 5, "item_model2": "除味剂", "item_tips2": "再使用[除味剂]进行细致处理", "transparency2": 0.2, "item_id3": 10, "item_model3": "吹风机", "item_tips3": "现在赶快使用[吹风机]进行最后的处理吧", "transparency3": 0.6 },

]
//脏物
export interface In_Garbage
{
    ID: number, name: string, room: string, chance: number
}
export const Garbage: In_Garbage[] = [
    { "ID": 0, "name": "无", "room": "卫生间", "chance": 15000 },
    { "ID": 1, "name": "墙污渍", "room": "卫生间", "chance": 100 },
    { "ID": 2, "name": "污物", "room": "卫生间", "chance": 100 },
    { "ID": 3, "name": "废纸", "room": "卫生间", "chance": 100 },
    { "ID": 4, "name": "水渍", "room": "洗手池", "chance": 100 },
    { "ID": 5, "name": "手纸", "room": "洗手池", "chance": 100 },
    { "ID": 6, "name": "不明液体", "room": "洗手池", "chance": 100 },
    { "ID": 7, "name": "口红污渍", "room": "洗手池", "chance": 100 },

]
//遗留物品
export interface In_Hand_Down
{
    ID: number, name: string, chance: number, price: number, percentage: number, room: string
}
export const HandDown: In_Hand_Down[] = [
    { "ID": 0, "name": "空", "chance": 3000, "price": 1, "percentage": 0, "room": "卫生间" },
    { "ID": 1, "name": "手机", "chance": 6, "price": 75, "percentage": 0.15, "room": "卫生间" },
    { "ID": 2, "name": "钥匙", "chance": 91, "price": 5, "percentage": 0.15, "room": "卫生间" },
    { "ID": 3, "name": "钱包", "chance": 6, "price": 70, "percentage": 0.15, "room": "卫生间" },
    { "ID": 4, "name": "戒指", "chance": 6, "price": 80, "percentage": 0.15, "room": "洗手池" },
    { "ID": 5, "name": "手表", "chance": 11, "price": 40, "percentage": 0.15, "room": "洗手池" },
    { "ID": 6, "name": "帽子", "chance": 9, "price": 50, "percentage": 0.15, "room": "洗手池" },
    { "ID": 7, "name": "眼镜", "chance": 45, "price": 10, "percentage": 0.15, "room": "洗手池" },
    { "ID": 8, "name": "耳机", "chance": 18, "price": 25, "percentage": 0.15, "room": "洗手池" },
    { "ID": 9, "name": "围巾", "chance": 5, "price": 100, "percentage": 0.15, "room": "卫生间" },

]
//仓库
export interface IN_Warehouse
{
    ID: number, name: string, buy: number, lock: number, room: string, result_1: number, result_2: number, result_3: number
}
export const WAREHOUSE: IN_Warehouse[] = [
    { "ID": 1, "name": "抹布", "buy": 15, "lock": 1, "room": "洗手池", "result_1": 0.3, "result_2": 0.1, "result_3": 0.01 },
    { "ID": 2, "name": "刷子", "buy": 20, "lock": 1, "room": "卫生间", "result_1": 0.5, "result_2": 0.1, "result_3": 0.01 },
    { "ID": 3, "name": "马桶塞", "buy": 400, "lock": 2, "room": "卫生间", "result_1": 0.8, "result_2": 0.2, "result_3": 0.02 },
    { "ID": 4, "name": "清洁剂", "buy": 2000, "lock": 3, "room": "洗手池", "result_1": 1.1, "result_2": 0.3, "result_3": 0.02 },
    { "ID": 5, "name": "除味剂", "buy": 6500, "lock": 4, "room": "卫生间", "result_1": 1.3, "result_2": 0.5, "result_3": 0.03 },
    { "ID": 6, "name": "清新剂", "buy": 18000, "lock": 5, "room": "洗手池", "result_1": 1.5, "result_2": 0.5, "result_3": 0.03 },
    { "ID": 7, "name": "转转椅", "buy": 140000, "lock": 8, "room": "洗手池", "result_1": 1.8, "result_2": 0.7, "result_3": 0.03 },
    { "ID": 8, "name": "高效去污器", "buy": 800000, "lock": 12, "room": "卫生间", "result_1": 2, "result_2": 0.7, "result_3": 0.04 },
    { "ID": 9, "name": "烘干机", "buy": 2000000, "lock": 15, "room": "洗手池", "result_1": 2.3, "result_2": 1, "result_3": 0.04 },
    { "ID": 10, "name": "吹风机", "buy": 5000000, "lock": 18, "room": "洗手池", "result_1": 2.5, "result_2": 1, "result_3": 0.05 },

]
export interface IN_Apparance
{
    ID: number, name: string, lock_A: number, gold_A: number, lock_S: number, gold_S: number
}
export const APPEARANCE: IN_Apparance[] = [
    { "ID": 0, "name": "入口", "lock_A": 1, "gold_A": 500, "lock_S": 2, "gold_S": 115000 },
    { "ID": 1, "name": "地面", "lock_A": 0, "gold_A": 0, "lock_S": 2, "gold_S": 205000 },
    { "ID": 2, "name": "墙面", "lock_A": 1, "gold_A": 10200, "lock_S": 2, "gold_S": 341400 },
    { "ID": 3, "name": "楼梯", "lock_A": 1, "gold_A": 26800, "lock_S": 2, "gold_S": 538800 },
    { "ID": 4, "name": "相框", "lock_A": 1, "gold_A": 59000, "lock_S": 2, "gold_S": 814000 },
    { "ID": 5, "name": "地毯", "lock_A": 1, "gold_A": 115000, "lock_S": 2, "gold_S": 1186500 },
    { "ID": 6, "name": "地面", "lock_A": 1, "gold_A": 10200, "lock_S": 2, "gold_S": 341400 },
    { "ID": 7, "name": "墙壁", "lock_A": 1, "gold_A": 59000, "lock_S": 2, "gold_S": 814000 },
    { "ID": 8, "name": "冷藏柜", "lock_A": 1, "gold_A": 205000, "lock_S": 2, "gold_S": 1677900 },
    { "ID": 9, "name": "收银台", "lock_A": 1, "gold_A": 538800, "lock_S": 2, "gold_S": 3118000 },
    { "ID": 10, "name": "货架", "lock_A": 1, "gold_A": 1186500, "lock_S": 2, "gold_S": 5361000 },
    { "ID": 11, "name": "地面", "lock_A": 1, "gold_A": 2900, "lock_S": 2, "gold_S": 205000 },
    { "ID": 12, "name": "墙壁", "lock_A": 1, "gold_A": 26800, "lock_S": 2, "gold_S": 538800 },
    { "ID": 13, "name": "货架", "lock_A": 1, "gold_A": 115000, "lock_S": 2, "gold_S": 1186500 },
    { "ID": 14, "name": "储物柜", "lock_A": 1, "gold_A": 341400, "lock_S": 2, "gold_S": 2312800 },
    { "ID": 15, "name": "楼梯", "lock_A": 1, "gold_A": 814000, "lock_S": 2, "gold_S": 4123300 },
    { "ID": 16, "name": "地面", "lock_A": 1, "gold_A": 26800, "lock_S": 2, "gold_S": 538800 },
    { "ID": 17, "name": "墙壁", "lock_A": 1, "gold_A": 205000, "lock_S": 2, "gold_S": 1677900 },
    { "ID": 18, "name": "机械", "lock_A": 1, "gold_A": 538800, "lock_S": 2, "gold_S": 3118000 },
    { "ID": 19, "name": "地面", "lock_A": 1, "gold_A": 2900, "lock_S": 2, "gold_S": 205000 },
    { "ID": 20, "name": "墙壁", "lock_A": 1, "gold_A": 10200, "lock_S": 2, "gold_S": 341400 },
    { "ID": 21, "name": "左地毯", "lock_A": 1, "gold_A": 10000000000000000000, "lock_S": 2, "gold_S": 10000000000000000000 },
    { "ID": 22, "name": "右地毯", "lock_A": 1, "gold_A": 10000000000000000000, "lock_S": 2, "gold_S": 10000000000000000000 },
    { "ID": 23, "name": "防水地毯", "lock_A": 1, "gold_A": 26800, "lock_S": 2, "gold_S": 538800 },
    { "ID": 24, "name": "地面", "lock_A": 1, "gold_A": 2900, "lock_S": 2, "gold_S": 205000 },
    { "ID": 25, "name": "墙壁", "lock_A": 1, "gold_A": 10200, "lock_S": 2, "gold_S": 341400 },
    { "ID": 26, "name": "栅栏", "lock_A": 1, "gold_A": 26800, "lock_S": 2, "gold_S": 538800 },
    { "ID": 27, "name": "地毯", "lock_A": 1, "gold_A": 59000, "lock_S": 2, "gold_S": 814000 },
    { "ID": 28, "name": "地板", "lock_A": 1, "gold_A": 10200, "lock_S": 2, "gold_S": 341400 },
    { "ID": 29, "name": "墙壁", "lock_A": 1, "gold_A": 26800, "lock_S": 2, "gold_S": 538800 },
    { "ID": 30, "name": "栅栏", "lock_A": 1, "gold_A": 59000, "lock_S": 2, "gold_S": 814000 },
    { "ID": 31, "name": "地板", "lock_A": 1, "gold_A": 115000, "lock_S": 2, "gold_S": 1186500 },
    { "ID": 32, "name": "墙壁", "lock_A": 1, "gold_A": 205000, "lock_S": 2, "gold_S": 1677900 },
    { "ID": 33, "name": "栅栏", "lock_A": 1, "gold_A": 341400, "lock_S": 2, "gold_S": 2312800 },

]
export interface In_Earnings
{
    build_earnings: number,
    level_earnings: number,
}
export const EARNINGS: In_Earnings[] = [
    { "build_earnings": 0, "level_earnings": 0 },
    { "build_earnings": 0, "level_earnings": 0 },
    { "build_earnings": 2.158456473, "level_earnings": 1.5 },
    { "build_earnings": 3.385357929, "level_earnings": 2.1 },
    { "build_earnings": 4.658934346, "level_earnings": 2.8 },
    { "build_earnings": 5.968383277, "level_earnings": 3.6 },
    { "build_earnings": 7.307147735, "level_earnings": 4.5 },
    { "build_earnings": 8.670793122, "level_earnings": 5.5 },
    { "build_earnings": 10.056107, "level_earnings": 6.6 },
    { "build_earnings": 11.46064831, "level_earnings": 7.8 },
    { "build_earnings": 12.88249552, "level_earnings": 9.1 },
    { "build_earnings": 14.32009439, "level_earnings": 10.5 },
    { "build_earnings": 15.77216033, "level_earnings": 12 },
    { "build_earnings": 17.2376128, "level_earnings": 13.6 },
    { "build_earnings": 18.71552954, "level_earnings": 15.3 },
    { "build_earnings": 20.20511365, "level_earnings": 17.1 },
    { "build_earnings": 21.70566924, "level_earnings": 19 },
    { "build_earnings": 23.21658309, "level_earnings": 21 },
    { "build_earnings": 24.73731052, "level_earnings": 23.1 },
    { "build_earnings": 26.26736428, "level_earnings": 25.3 },
    { "build_earnings": 27.80630584, "level_earnings": 27.6 },
    { "build_earnings": 29.35373824, "level_earnings": 30 },
    { "build_earnings": 30.90930042, "level_earnings": 32.5 },
    { "build_earnings": 32.47266244, "level_earnings": 35.1 },
    { "build_earnings": 34.04352155, "level_earnings": 37.8 },
    { "build_earnings": 35.62159894, "level_earnings": 40.6 },
    { "build_earnings": 37.20663692, "level_earnings": 43.5 },
    { "build_earnings": 38.79839661, "level_earnings": 46.5 },
    { "build_earnings": 40.39665588, "level_earnings": 49.6 },
    { "build_earnings": 42.00120764, "level_earnings": 52.8 },

]
export interface In_Level
{
    level: number,
    gold: number,
}
export const LEVELLOCK: In_Level[] = [
    { "level": 1, "gold": 84 },
    { "level": 2, "gold": 444.17 },
    { "level": 3, "gold": 2448.45 },
    { "level": 4, "gold": 8220.23 },
    { "level": 5, "gold": 31547.59 },
    { "level": 6, "gold": 67970.31 },
    { "level": 7, "gold": 130066.44 },
    { "level": 8, "gold": 228197.74 },
    { "level": 9, "gold": 374682.55 },
    { "level": 10, "gold": 778468.85 },
    { "level": 11, "gold": 1162798.44 },
    { "level": 12, "gold": 1677236.42 },
    { "level": 13, "gold": 2349323.11 },
    { "level": 14, "gold": 3209521.34 },
    { "level": 15, "gold": 5364082.53 },
    { "level": 16, "gold": 7038763.57 },
    { "level": 17, "gold": 9085340.52 },
    { "level": 18, "gold": 11557090.04 },
    { "level": 19, "gold": 14511219.47 },
    { "level": 20, "gold": 21610697.2 },
    { "level": 21, "gold": 26538460.59 },
    { "level": 22, "gold": 32279885.29 },
    { "level": 23, "gold": 38923034.04 },
    { "level": 24, "gold": 46560949.06 },
    { "level": 25, "gold": 64506981.84 },
    { "level": 26, "gold": 76088159.84 },
    { "level": 27, "gold": 89190938.38 },
    { "level": 28, "gold": 103947631.5 },
    { "level": 29, "gold": 120496617.9 },
    { "level": 30, "gold": 138982387.7 },
    { "level": 31, "gold": 159555587.4 },
    { "level": 32, "gold": 182373064.1 },
    { "level": 33, "gold": 207597908.1 },
    { "level": 34, "gold": 235399495 },
    { "level": 35, "gold": 265953526.1 },
    { "level": 36, "gold": 299442068.6 },
    { "level": 37, "gold": 336053594 },
    { "level": 38, "gold": 375983016.4 },
    { "level": 39, "gold": 419431729.9 },

]
//商店结账位置
export const SETTLE: cc.Vec2 = cc.v2(23, 12)
//商店随机给位置
export const SHOP_POS: cc.Vec2[] = [
    cc.v2(24, 12), cc.v2(25, 12), cc.v2(26, 12), cc.v2(27, 12), cc.v2(28, 12),
    cc.v2(23, 11), cc.v2(24, 11), cc.v2(25, 11), cc.v2(26, 11), cc.v2(27, 11), cc.v2(28, 11),
    cc.v2(24, 13), cc.v2(25, 13), cc.v2(26, 13), cc.v2(27, 13),
    cc.v2(25, 14),

]
export const CLEAN_POS: cc.Vec2[] = [
    cc.v2(15, 18), cc.v2(17, 19), cc.v2(20, 21),
    cc.v2(5, 17), cc.v2(8, 19), cc.v2(10, 20),
    cc.v2(26, 22), cc.v2(28, 23), cc.v2(30, 24),
    cc.v2(38, 20), cc.v2(41, 18), cc.v2(42, 17)
]
//最终离开的位置
export const LEAVE_POS: cc.Vec2 = cc.v2(17, 0)
//出门时再次确认
export const SHOP_AGAIN: cc.Vec2[] = [cc.v2(18, 8), cc.v2(17, 8)]
//卫生间位置
export const TOILET_POS_1: cc.Vec2[] = [cc.v2(5, 17), cc.v2(8, 19), cc.v2(10, 20)]
export const TOILET_POS_2: cc.Vec2[] = [cc.v2(26, 22), cc.v2(28, 23), cc.v2(30, 24)]
export const TOILET_POS_3: cc.Vec2[] = [cc.v2(38, 20), cc.v2(41, 18), cc.v2(42, 17)]
//洗手间位置
export const LOO_POS: cc.Vec2[] = [cc.v2(15, 18), cc.v2(17, 19), cc.v2(20, 21)]

export const LOO_LOOKON: cc.Vec2 = cc.v2(17, 15)
export const TOILET_1_LOOKON: cc.Vec2 = cc.v2(13, 15)
export const TOILET_2_LOOKON: cc.Vec2 = cc.v2(23, 20)
export const TOILET_3_LOOKON: cc.Vec2 = cc.v2(17, 15)

export const STAIRS: cc.Vec2 = cc.v2(17, 10)
//洗手间排队位置
export const LOO_QUEUE: cc.Vec2[] = [
    cc.v2(16, 17), cc.v2(17, 18), cc.v2(18, 18), cc.v2(19, 19), cc.v2(20, 19), cc.v2(21, 19), cc.v2(21, 20), cc.v2(22, 20)
]
//厕所排队位置
export const TOILET_QUEUE_1: cc.Vec2[] = [
    cc.v2(6, 18), cc.v2(7, 18), cc.v2(8, 18), cc.v2(9, 18), cc.v2(10, 18)
]
export const TOILET_QUEUE_2: cc.Vec2[] = [
    cc.v2(28, 21), cc.v2(29, 22), cc.v2(30, 23), cc.v2(31, 23), cc.v2(31, 24), cc.v2(32, 24)
]
export const TOILET_QUEUE_3: cc.Vec2[] = [
    cc.v2(37, 20), cc.v2(36, 19), cc.v2(37, 19), cc.v2(38, 19), cc.v2(39, 19), cc.v2(39, 18),
    cc.v2(40, 18), cc.v2(41, 17)
]
//门口排队位置
export const SHOP_QUEUE: cc.Vec2[] = [
    cc.v2(20, 6),
    cc.v2(21, 5), cc.v2(22, 5), cc.v2(23, 5),
    cc.v2(22, 4), cc.v2(23, 4), cc.v2(24, 4),
    cc.v2(23, 3), cc.v2(24, 3), cc.v2(25, 3),
    cc.v2(24, 2), cc.v2(25, 2), cc.v2(26, 2),
]
//职员移动位置
export const STAFF_MOVE_TOILET_2: cc.Vec2[] = [
    cc.v2(26, 21), cc.v2(30, 22), cc.v2(33, 24), cc.v2(33, 23),
]
export const STAFF_MOVE_TOILET_1: cc.Vec2[] = [
    cc.v2(6, 16), cc.v2(7, 16), cc.v2(11, 16),
    cc.v2(7, 17), cc.v2(8, 17), cc.v2(9, 17), cc.v2(10, 17),
]
export const STAFF_MOVE_TOILET_3: cc.Vec2[] = [
    cc.v2(37, 18), cc.v2(42, 17)
]
export const STAFF_MOVE_LOO: cc.Vec2[] = [
    cc.v2(13, 15), cc.v2(16, 15),
    cc.v2(15, 16), cc.v2(17, 16),
    cc.v2(18, 17), cc.v2(20, 18), cc.v2(22, 20)
]
export const STAFF_MOVE_WAREHOUSE: cc.Vec2[] = [
    cc.v2(3, 8), cc.v2(4, 8), cc.v2(5, 8), cc.v2(6, 8),
    cc.v2(6, 9), cc.v2(7, 9), cc.v2(8, 9), cc.v2(14, 9), cc.v2(15, 9), cc.v2(16, 9), cc.v2(17, 9), cc.v2(18, 9),
    cc.v2(8, 10), cc.v2(9, 10), cc.v2(10, 10), cc.v2(11, 10), cc.v2(12, 10), cc.v2(20, 10), cc.v2(21, 10),
    cc.v2(12, 11), cc.v2(22, 11),
    cc.v2(23, 12),
    cc.v2(13, 15), cc.v2(14, 15), cc.v2(15, 15), cc.v2(16, 15),
    cc.v2(6, 16), cc.v2(7, 16), cc.v2(8, 16), cc.v2(11, 16), cc.v2(6, 16), cc.v2(14, 16), cc.v2(15, 16), cc.v2(16, 16), cc.v2(17, 16),
    cc.v2(5, 17), cc.v2(6, 17), cc.v2(7, 17), cc.v2(8, 17), cc.v2(9, 17), cc.v2(10, 17), cc.v2(11, 17), cc.v2(15, 17),
]
export const Pre_Toilet: cc.Vec3[] = [
    cc.v3(0, 0, 0), cc.v3(0, 0, 0), cc.v3(0, 0, 0),
    cc.v3(205.953, 785.201, 0), cc.v3(305.493, 841.352, 0), cc.v3(409.861, 895.985, 0),
    cc.v3(1035.883, 975.73, 0), cc.v3(1141.342, 1033.577, 0), cc.v3(1242.796, 1089.199, 0),
    cc.v3(1707.631, 899.63, 0), cc.v3(1809.773, 843.365, 0), cc.v3(1904.125, 787.966, 0),]
export const Finally_Toilet: cc.Vec3[] = [
    cc.v3(0, 0, 0), cc.v3(0, 0, 0), cc.v3(0, 0, 0),
    cc.v3(174.749, 814.762, 0), cc.v3(280.876, 865.653, 0), cc.v3(385.201, 923.08, 0),
    cc.v3(1013.618, 1008.418, 0), cc.v3(1117.742, 1065.82, 0), cc.v3(1221.866, 1120.552, 0),
    cc.v3(1729.797, 922.619, 0), cc.v3(1829.471, 868.332, 0), cc.v3(1934.357, 813.096, 0),
]










// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
//一些路径  
export const JSON_PATH: number[][] = [
    // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4],
    // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
    // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]
export const WUPIN: cc.Vec2[][] = [
    [],
    [cc.v2(40, -18)],//手机
    [cc.v2(75, -34)],//钥匙
    [cc.v2(6, -60)],//钱包
    [cc.v2(30, 5)],//戒指
    [cc.v2(30, 5)],//手表
    [cc.v2(30, 5)],//帽子
    [cc.v2(30, 5)],//眼镜
    [cc.v2(30, 5)],//耳机
    [cc.v2(-80, 36)]//围巾
]
export interface IN_WUZI
{
    pos: cc.Vec2,
    scale: number,
    color: cc.Color
}
export const WUZI: cc.Vec2[][] = [
    [],
    [cc.v2(-41, 41)],//墙污渍
    [cc.v2(85, -36)],//污物
    [cc.v2(70, -96)],//废纸
    [cc.v2(81, -83)],//水啧
    [cc.v2(22, -58)],//手纸
    [cc.v2(-18, -90)],//不明液体
    [cc.v2(-25, -56)]//口红污渍
]
