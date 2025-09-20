import Caches from "../manager/Caches";
import { Config } from "../manager/Config";
import DataManager from "../manager/DataManager";
import GameSys from "../manager/GameSys";
import Logger from "../manager/Log";
const { ccclass, property } = cc._decorator;
let BINDER_NAME = "xxszy_oppoapi";
@ccclass
export default class OppoApi
{
    constructor()
    {
        this.onLoad();
        GameSys.sdk.Instance = this;
        Logger.info("oppo环境----------");
        if (!Caches.get(Caches.oppoBanner))
        {
            Caches.set(Caches.oppoBanner, 1)
        }
        if (!Caches.get(Caches.oppoNatived))
        {
            Caches.set(Caches.oppoNatived, 1)
        }
        this.time = new Date().getTime();
        this.instantiationRewardAd();
        GameSys.sdk.xBind("createBanner", this.createBanner.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("hideBanner", this.hideBanner.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("destroyBanner", this.destroySelf.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("showInter", this.createInsertAd.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("showNativeAd", this.showNativeAd.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("shortcut", this.shortcut.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("hideNative", this.hideNativeAd.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("portalAd", this.createGameBannerAd.bind(this), BINDER_NAME);
    }

    banner_count: number;
    native_count: number;
    private time: number = 0;
    public async onLoad()
    {
    };

    // banner
    public isShowBanner: boolean = false;
    // public oldBannerAd: any = null;

    // public bannerPar: Array<string> = ["256662"];
    // public bannerIndex: number = 0;
    // public index: number = 0;
    private bannerAd: any = null;
    private createBanner()
    {
        if (this.banner_count >= 6)
        {
            return;
        }
        this.banner_count = Caches.get(Caches.oppoBanner)
        let self = this
        //开局小于1min，原生和banner广告也不展示
        if (new Date().getTime() - this.time < 60000)
            return;
        if (self.isShowBanner && self.bannerAd)
        {
            console.error("没能hide", self.isShowBanner, self.bannerAd)
            return;
        }
        let adUnitId: string = '272758'
        // 屏幕宽
        let screenWidth = qg.getSystemInfoSync().screenWidth;
        // 屏幕高
        let screenHeight = qg.getSystemInfoSync().screenHeight;


        // if (this.bannerAd)
        // {
        //     this.hideBanner();
        // }
        self.bannerAd = null;
        // style 四个参数都要填 width height不能为0
        self.bannerAd = qg.createBannerAd({
            adUnitId: adUnitId,
            style: {
                left: (screenWidth - 320) / 2,
                top: screenHeight - 100,
                width: screenWidth,
                height: 500
            }
        });
        self.bannerAd.onResize((size) =>
        {
            self.bannerAd.style.top = screenHeight - size.height - 10;
            self.bannerAd.show()
            self.isShowBanner = true;
            console.log("展示banner成功", self.isShowBanner)
        });
        self.bannerAd.onError((res) =>
        {
            cc.log("this.bannerAd   onError", res);
        });
        self.bannerAd.onHide(() =>
        {
            self.bannerAd.hide();
            self.bannerAd.destroy();
            self.bannerAd = null;
            self.isShowBanner = false;
            self.banner_count++;
            Caches.set(Caches.oppoBanner, self.banner_count)
            console.log('banner 广告隐藏', self.isShowBanner, self.bannerAd)
        })
    }

    showBanner()
    {
        // this.isShowBanner = true;

        // let bannerAd: any = this.oldBannerAd;
        // if (bannerAd)
        // {
        //     bannerAd.show()
        //     console.log('显示banner 广告加载成功')
        // }
    };

    hideBanner()
    {
        if (this.banner_count >= 6)
        {
            return;
        }
        console.log("进入隐藏banner", this.bannerAd);
        if (this.bannerAd)
        {
            // console.log("咋就没隐藏呢")
            this.bannerAd.hide();
            this.bannerAd.destroy();
            this.bannerAd = null;
            this.isShowBanner = false;
        }
    };

    destroySelf()
    {
        // let bannerAd: any = this.oldBannerAd;
        // if (bannerAd)
        // {
        //     bannerAd.destroy();
        //     this.oldBannerAd = {};
        // }
        // this.isShowBanner = false
    };

    // video
    public rewardedVideoAd: any = null;
    public videoNum: number = 0;
    private videoTime: number = 0;
    public videoAds: Array<string> = ["272764"];

    public isVoice: boolean = false;
    instantiationRewardAd()
    {
        console.log("视频实例化")
        this.rewardedVideoAd = qg.createRewardedVideoAd({
            adUnitId: this.videoAds[this.videoNum % this.videoAds.length]
        });
    }
    createRewardedVideoAd(_callBack: Function)
    {
        this.videoTime++;
        if (this.videoTime >= 3)
        {
            this.videoTime = 0;
            this.videoNum++;
            this.instantiationRewardAd();
        }

        this.rewardedVideoAd.onLoad(() =>
        {
            this.rewardedVideoAd.show();
        })

        this.rewardedVideoAd.onClose((res) =>
        {
            // videoAd.offLoad();
            // videoAd.offClose();
            // videoAd.offError()
            if (res.isEnded)
            {
                _callBack(true);
            } else
            {
                _callBack(false);
            }
        })

        this.rewardedVideoAd.onError((err) =>
        {
            console.log("视频广告加载失败", err);
            GameSys.game.xSet(Config.TIP, "广告正在准备中，请重启或稍后再试");
        })
        this.rewardedVideoAd.load();
    }

    // 插屏
    public createTime: number = 0;
    public static createNum: number = 0;

    private createInsertAd()
    {
        //OPPO又双叒叕的关闭了

        // this.nativeAd();//调用一下原生试试看
        return;
        if (GameSys.game.xGet("dial"))
        {
            return;//因为这个页面有banner
        }
        console.log("插屏展示")
        let now: Date = new Date();
        let ms: number = 60 * 1000;
        if (now.getTime() - this.createTime < ms || OppoApi.createNum >= 8)
        {
            Logger.info("60s内不能重复展示插屏");
            return;
        }
        let insertAd = qg.createInsertAd({
            posId: '181216'
        })
        insertAd.onLoad(() =>
        {
            insertAd.show();
        })
        this.createTime = now.getTime();
        OppoApi.createNum++;
        insertAd.onShow(() =>
        {
            insertAd.offLoad();
            insertAd.offError();
            insertAd.offShow()
        })

        insertAd.onError((err) =>
        {
            console.log("插屏展示失败", err)
        })
        insertAd.load();
        this.hideBanner()
    }

    // 图片
    public static async createImage(_url: string)
    {
        return new Promise(resolve =>
        {
            let tex = new cc.Texture2D();
            var img = new Image();
            img.onload = function ()
            {

            }
            img.src = _url;
            tex.initWithElement(img);
            resolve(new cc.SpriteFrame(tex));
        })
    }

    // 跳转小程序
    private navigateToMiniProgram(_pkName: string)
    {
        qg.navigateToMiniGame({
            pkgName: _pkName,
            success: function ()
            {
            },
            fail: function (res)
            {
                Logger.error(JSON.stringify(res));
            }
        });
    }
    //添加至桌面
    shortcut()
    {
        //判断是否已经创建
        qg.hasShortcutInstalled({
            success: function (res)
            {
                // 判断图标未存在时，创建图标
                if (res == false)
                {
                    qg.installShortcut({
                        success: function ()
                        {
                            // 执行用户创建图标奖励

                        },
                        fail: function (err)
                        {
                            qg.installShortcut({
                                success: function (res)
                                {
                                    console.log("创建成功")
                                },
                                fail: function (err)
                                {
                                    console.log("创建失败")
                                },
                                complete: function () { }
                            })
                        },
                        complete: function () { }
                    })
                }
            },
            fail: function (err) { },
            complete: function () { }
        })
    }
    //原生
    // nativeAd()
    // {
    //     let adList: any
    //     var nativeAd = qg.createNativeAd({
    //         adUnitId: '256716'
    //     })
    //     nativeAd.load();
    //     nativeAd.onLoad(function (res)
    //     {
    //         console.log('原生广告成功', res.adList)
    //         adList = res.adList;
    //         console.log(adList[0].adId)
    //     })
    //     nativeAd.reportAdShow({
    //         adId: adList[0].adId
    //     })
    //     nativeAd.reportAdClick({
    //         adId: adList[0].adId
    //     })
    //     nativeAd.onError(function (err)
    //     {
    //         Logger.warn("原生广告出错", JSON.stringify(err));
    //     })
    //     nativeAd.offLoad(function (err)
    //     {
    //         Logger.warn("移除广告加载成功回调", JSON.stringify(err));
    //     })
    // }

    private nativeAd: any = null;

    /**
 * 显示原生广告
 * @param callFusc 
 */
    public showNativeAd()
    {
        console.error("=====", DataManager.getInstance().oppoNatived)
        if (this.native_count >= 6)
        {
            return;
        }
        this.native_count = Caches.get(Caches.oppoNatived)
        //开局小于1min，原生和banner广告也不展示
        if (new Date().getTime() - this.time < 60000)
        {
            console.log("开局一分钟")
            return;
        }

        let adUnitId: string = '272766';
        console.log("====showNativeAd===", adUnitId);

        let self = this;
        self.nativeAd = null;
        if (self.nativeAd == null)
        {
            self.nativeAd = qg.createNativeAd({
                adUnitId: adUnitId
            });

            console.log("===showNativeAd===", self.nativeAd);
            if (self.nativeAd == null || self.nativeAd == undefined)
            {
                return
            }

            // 失败监听
            self.nativeAd.onError((res) =>
            {
                console.error("===showNativeAd=onError:", res);
                self.hideNativeAd()
            });

            // 设置广告加载成功回调
            self.nativeAd.onLoad((res) =>
            {

                console.error("===showNativeAd=onLoad:", res);
                let nativeCurrentAd = null;
                if (res && res.adList)
                {
                    nativeCurrentAd = res.adList.pop();
                }

                if (nativeCurrentAd == null || nativeCurrentAd == undefined)
                {
                    self.hideNativeAd()
                    return
                }

                const element = nativeCurrentAd;
                self.nativeAd.reportAdShow({
                    adId: element.adId
                })
                console.log("查看", element)
                cc.loader.load({ url: element.iconUrlList[0], type: "png" }, function (error, texture)
                {
                    if (error)
                    {
                        console.error("showNativeAd element.icon：", error);
                    }
                    else
                    {
                        console.error("-----kongkong++++")
                        let btnNode: cc.Node = DataManager.getInstance().oppoNatived;
                        if (!btnNode)
                        {
                            console.error("=====kongkong=====")
                            return
                        }
                        console.error("+++kongkong++++", btnNode.getComponent(cc.Sprite))

                        let sprite = btnNode.getComponent(cc.Sprite)
                        console.error("--------", sprite)
                        if (sprite)
                        {
                            sprite.spriteFrame = new cc.SpriteFrame(texture)
                        }
                        console.error("+++sprite++++", sprite)

                        btnNode.on(cc.Node.EventType.TOUCH_END, () =>
                        {
                            console.error("btnNode TOUCH_END:", element.adId);
                            self.nativeAd.reportAdClick({
                                adId: element.adId
                            })
                        }, self)

                        // btnNode.parent.addComponent(cc.BlockInputEvents);

                        // btnNode.getChildByName("titleLabel").getComponent(cc.Label).string = element.title
                        btnNode.getChildByName("ad").getComponent(cc.Label).string = '广告'
                        // console.log("找到了title", btnNode.getChildByName("titleLabel").getComponent(cc.Label))
                        console.log("找到了ad", btnNode.getChildByName("ad").getComponent(cc.Label))
                        let close: cc.Node = btnNode.getChildByName("close")
                        let circle: cc.Node = btnNode.getChildByName('circle');
                        close.active = true;
                        circle.active = true;
                        console.log('找到了Close', close)
                        close.on(cc.Node.EventType.TOUCH_END, () =>
                        {
                            // console.log("点击关闭")
                            let value: number = Math.random()
                            console.log("关闭原生概率", value)
                            if (value < 0.9)
                            {
                                btnNode.parent.destroy();
                                console.log('natived 广告隐藏', self.native_count, self.nativeAd)
                                self.native_count++;
                                Caches.set(Caches.oppoNatived, self.native_count)
                                if (self.nativeAd)
                                {
                                    self.nativeAd = null
                                }
                            }
                        }, self)
                        // let layout = parent.getComponent(cc.Layout)
                        // if (layout)
                        // {
                        //     layout.updateLayout()
                        // }

                    }
                });

            })
        }
        self.nativeAd.load()
    }
    hideNativeAd()
    {
        console.log("点击监听")
        if (this.nativeAd != null)
        {
            this.nativeAd.destroy()
            this.nativeAd = null
        }
    }
    createGameBannerAd()
    {
        return
        console.log("九宫格盒子广告", qg.getSystemInfoSync().platformVersionCode)
        if (qg.getSystemInfoSync().platformVersionCode >= 1076)
        {
            var gamePortalAd = qg.createGamePortalAd({
                adUnitId: '269418'
            })
            gamePortalAd.load().then(function ()
            {
                console.log('load success')
            }).catch(function (error)
            {
                console.log('load fail with:' + error.errCode + ',' + error.errMsg)
            })
            gamePortalAd.onLoad(function ()
            {
                console.log('互推盒子横幅广告加载成功')
                gamePortalAd.show().then(function ()
                {
                    console.log('show success')
                }).catch(function (error)
                {
                    console.log('show fail with:' + error.errCode + ',' + error.errMsg)
                })
            })
            gamePortalAd.onError(function (err)
            {
                console.error("互推盒子加载失败", JSON.stringify(err))
            })
            gamePortalAd.onClose(function ()
            {
                console.log('互推盒子九宫格广告关闭')
                gamePortalAd.destroy().then(function ()
                {
                    console.log('destroy success')
                }).catch(function (error)
                {
                    console.log('destroy fail with:' + error.errCode + ',' + error.errMsg)
                })

            })
        } else
        {
            console.log('快应用平台版本号低于1076，暂不支持互推盒子相关 API')
        }
    }
}

