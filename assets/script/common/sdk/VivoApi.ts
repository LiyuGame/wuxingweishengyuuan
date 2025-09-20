import GameSys from "../manager/GameSys";
import Logger from "../manager/Log";

// const ad = require('@service.ad')
const { ccclass, property } = cc._decorator;
let BINDER_NAME = "tzxxs_vivoapi";

@ccclass
export default class VIVOApi
{
    constructor()
    {
        GameSys.sdk.Instance = this;
        console.log("进入vivo环境");
        GameSys.sdk.xBind("createBanner", this.createBanner.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("hideBanner", this.hideBanner.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("destroyBanner", this.destroySelf.bind(this), BINDER_NAME);
        // GameSys.sdk.xBind("showInter", this.createInsertAd.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("shortcut", this.shortCut.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("showNativeAd", this.showNativeAd.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("hideNative", this.hideNativeAd.bind(this), BINDER_NAME);
        // this.onOff = GameSys.sdk.config.switch;
    }


    public onOff: boolean = true;

    public clickTime: number = 0;
    public isShow: boolean = false;
    public oldBannerAd: any = null;
    public bannerIndex: number = 0;
    public index: number = 0;
    public bannerPar: Array<string> = ["94521699ab834cc487bd41ac0b4f1316"]

    private bannerTime: number = 0;
    private createBanner()
    {
        if (!this.onOff)
        {
            return;
        }
        let code = qg.getSystemInfoSync().platformVersionCode;
        if (code < 1031)
        {
            return;
        }
        // this.bannerIndex++;
        // if (this.bannerIndex % 3 == 0)
        // {
        //     this.index++;
        // }
        // let posId: string = this.bannerPar[this.bannerIndex % this.bannerPar.length];
        if (new Date().getTime() - this.bannerTime < 10000)
        {
            //小于10秒不改变
            return;
        }
        if (this.isShow)
        {
            this.hideBanner();
        }
        let posId: string = "94521699ab834cc487bd41ac0b4f1316"
        let bannerAd: any = qg.createBannerAd({
            posId: posId,
            style: {}
        });
        console.log(posId);
        this.oldBannerAd = bannerAd;
        this.showBanner();
    }

    private showBanner()
    {
        let bannerAd: any = this.oldBannerAd;
        console.log("展示banner", bannerAd);
        if (bannerAd)
        {
            bannerAd.onError(err =>
            {
                console.log("banner广告加载失败", err);
            });

            bannerAd.show().then(() =>
            {
                this.isShow = true;
                this.bannerTime = new Date().getTime();
                console.log('banner广告展示完成');
            }).catch((err) =>
            {
                console.log('banner广告展示失败', JSON.stringify(err));
            })
        }
    };
    private hideBanner()
    {
        if (!this.onOff)
        {
            return;
        }
        if (new Date().getTime() - this.bannerTime < 10000)
        {
            //小于10秒不改变
            return;
        }
        if (!this.isShow) return;
        Logger.info("进入banner隐藏");
        this.isShow = false;
        let bannerAd: any = this.oldBannerAd;
        if (bannerAd)
        {
            bannerAd.hide();
            this.oldBannerAd = null;
            // var adhide = bannerAd.hide();
            // // 调用then和catch之前需要对hide的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
            // adhide && adhide.then(() =>
            // {
            //     console.log("banner广告隐藏成功");
            // }).catch(err =>
            // {
            //     console.log("banner广告隐藏失败", err);
            // });
        }
    };

    private destroySelf()
    {
        let bannerAd: any = this.oldBannerAd;
        if (bannerAd)
        {
            //bannerAd.destroy();
            var addestroy = bannerAd.destroy();
            // 调用then和catch之前需要对show的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
            addestroy && addestroy.then(() =>
            {
                console.log("banner广告销毁成功");
            }).catch(err =>
            {
                console.log("banner广告销毁失败", err);
            });
            this.oldBannerAd = null;
        }
    };
    // video
    public isVoice: boolean = false;
    private videoTime: number = 0;
    public videoAds: Array<string> = ["8efae17c032e4d748c2406be950ac7f7"];
    createRewardedVideoAd(_callback: Function)
    {
        if (!this.onOff)
        {
            GameSys.game.xSet("tip", "功能未开放");
            return;
        }
        let bgmVolume = GameSys.audio.xGet("bgmVolume");
        console.log("声音判断", bgmVolume);
        let code = qg.getSystemInfoSync().platformVersionCode;
        if (code < 1041)
        {
            GameSys.game.xSet("tip", "更新平台即可使用该功能哦");
            return;
        }
        let videoAd: any = null;
        this.videoTime++;
        videoAd = qg.createRewardedVideoAd({
            adUnitId: this.videoAds[this.videoTime % this.videoAds.length]
        });
        if ((new Date().getTime() - this.clickTime) < 60000)
        {
            Logger.info("时间小于1分钟");

            GameSys.game.xSet("tip", "广告请求频繁请稍后重试")
            return;
        }
        videoAd.onLoad(() =>
        {
            if (bgmVolume == 1)
            {
                GameSys.audio.pauseAll();
            }

            this.clickTime = new Date().getTime();
            videoAd.show();
            var adshow = videoAd.show();
            // 调用then和catch之前需要对show的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
            adshow && adshow.then(() =>
            {
                console.log("激励视频广告显示成功");
            }).catch(err =>
            {
                console.log("激励视频广告显示失败", err);
            });
        })

        videoAd.onClose((res) =>
        {
            console.log("声音处理", bgmVolume)
            if (bgmVolume == 1)
            {
                GameSys.audio.resumeAll();
            }
            videoAd.offLoad();
            videoAd.offClose();
            videoAd.offError()
            if (res.isEnded)
            {
                _callback(true);
            } else
            {
                _callback(false);
            }
        })

        videoAd.onError((err) =>
        {
            // console.log(err);
        })

        videoAd.load();
        var adload = videoAd.load();
        // 调用then和catch之前需要对load的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
        adload && adload.then(() =>
        {
            console.log("激励视频广告加载成功");
        }).catch(err =>
        {
            console.log("激励视频广告加载失败", err);
        });
    }

    // insertAd
    private createInsertAd()
    {
        if (!this.onOff)
        {
            console.log("插屏广告申请中")
            return;
        }
        if (new Date().getTime() - this.interTime < 10000)
        {
            return;
        }
        let interstitialAd: any = qg.createInterstitialAd({
            posId: "c3698282b75d4f17bec5355d1d5c0a0f"
        });

        console.log("插屏数据", interstitialAd)
        // 调用then和catch之前需要对show的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
        interstitialAd.onError(err =>
        {
            console.log("插屏广告加载失败", err);
        });

        interstitialAd.show().then(() =>
        {
            console.log('插屏广告展示完成');
            this.interTime = new Date().getTime()
        }).catch((err) =>
        {
            console.log('插屏广告展示失败', JSON.stringify(err));
        })
    }
    public shareAppMessage()
    {
        qg.share();
    }

    //创建桌面图标
    isInstall: boolean = false;
    shortCut()
    {
        qg.hasShortcutInstalled({
            success: function (status)
            {
                if (status)
                {
                    console.log('已创建');
                    this.isInstall = true;
                } else
                {
                    this.isInstall = false;
                }
            },
        })
        if (!this.isInstall)
        {
            qg.installShortcut({
                success: function ()
                {
                    console.log('创建成功');
                },
                fail: function ()
                {
                    console.log("创建失败");
                }
            })
        }
    }

    private interTime: number = null;
    private nativeTime: number = null;
    private nativeAd: any = null;
    /**
    * 显示原生广告
    * @param callFusc 
    */
    public showNativeAd(nativeNode: cc.Node)
    {
        let adUnitId: string = '28802d29fd314872b5ec2d28aef3ef7c';
        console.log("====showNativeAd===", adUnitId);

        // if (this.isShowNativeAd)
        // {
        //     return;
        // }
        if (new Date().getTime() - this.nativeTime < 10000)
        {
            //10秒内去拉去插屏
            nativeNode.parent.destroy();
            this.createInsertAd()
            return;
        }
        let self = this;
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
                // cc.assetManager.loadRemote(element.imgUrlList[0], (error, texture) =>
                cc.assetManager.loadRemote(element.imgUrlList[0], (error, texture: cc.Texture2D) =>
                {
                    console.log(texture)
                    if (error)
                    {
                        self.createInsertAd()
                        nativeNode.parent.destroy();
                        console.error("showNativeAd element.icon：", error);
                    }
                    else
                    {
                        self.nativeTime = new Date().getTime();//记录时间
                        // self.hideBanner()
                        let btnNode: cc.Node = nativeNode;
                        // btnNode.setPosition(cc.v2(0, 0));
                        // btnNode.opacity = 255
                        // data.parent.addChild(btnNode)

                        let size = btnNode.getContentSize()
                        let sprite = btnNode.getComponent(cc.Sprite)
                        if (sprite)
                        {
                            sprite.spriteFrame = new cc.SpriteFrame(texture)
                        }
                        btnNode.parent.getComponent(cc.BlockInputEvents).enabled = true;
                        btnNode.setContentSize(size)
                        btnNode.on(cc.Node.EventType.TOUCH_END, () =>
                        {
                            console.error("btnNode TOUCH_END:", element.adId);
                            self.nativeAd.reportAdClick({
                                adId: element.adId
                            })
                        }, self)

                        let titleLabel = btnNode.getChildByName("titleLabel").getComponent(cc.Label)
                        let ad = btnNode.getChildByName("ad").getComponent(cc.Label)
                        ad.string = '广告'
                        titleLabel.string = element.title

                        let close: cc.Node = btnNode.getChildByName("close")
                        close.active = true;
                        console.log('找到了Close', close)
                        close.on(cc.Node.EventType.TOUCH_END, () =>
                        {
                            // console.log("点击关闭")
                            let value: number = Math.random()
                            console.log("关闭原生概率", value)
                            if (value < 0.1)
                            {
                                btnNode.parent.destroy();
                                if (this.nativeAd != null)
                                {
                                    // this.nativeAd.destroy()
                                    this.nativeAd = null
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
            // this.nativeAd.destroy()
            this.nativeAd = null
        }
    }
}
