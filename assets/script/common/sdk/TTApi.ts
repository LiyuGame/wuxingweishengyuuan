import Logger from "../manager/Log";
import GameSys from "../manager/GameSys";
import { Config } from "../manager/Config";


const { ccclass, property } = cc._decorator;

let BINDER_NAME = "ttapi";

@ccclass
export default class TTAPI
{
    constructor()
    {
        Logger.info("头条环境------");
        GameSys.sdk.Instance = this;
        this.onLoad();
        this.instantiationRewardAd();
        GameSys.sdk.xBind("createBanner", this.createBanner.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("destroyBanner", this.destroySelf.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("hideBanner", this.hideBanner.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("startRec", this.startRec.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("stopRec", this.stopRec.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("moreGames", this.onMoreGames.bind(this), BINDER_NAME);
        GameSys.sdk.xBind("showInter", this.inter.bind(this), BINDER_NAME);
    }

    onLoad()
    {
        console.log("头条环境")
        tt.showShareMenu({
            withShareTicket: true
        });
        tt.onShareAppMessage(function (res)
        {
            console.log(res.channel);
            return {
                templateId: "88dhenci58lli6bp9p",
                success()
                {
                    console.log('分享成功')
                },
                fail(e)
                {
                    console.log('分享失败', e)
                }

            }
        });
        this.screenRec = tt.getGameRecorderManager()
    }
    public screenRec: any = null;

    public isShowBanner: boolean = false;
    public bAdUnit: string = "";
    public oldBannerAd: any = null;
    public showTime: number = 0;

    public bannerPar: Array<string> = ["e2fci6b80fi42lbhek"];
    public bannerIndex: number = 0;
    public index: number = 0;
    createBanner()
    {
        this.bannerIndex++;
        // if (this.bannerIndex % 3 == 0)
        // {
        //     this.index++;
        //     this.oldBannerAd = null;
        // }
        let _adUnitId: string = this.bannerPar[this.index % this.bannerPar.length];
        if (this.oldBannerAd)
        {
            if (!this.isShowBanner)
            {
                this.showBanner();
            }
            else
            {
                this.hideBanner();
            }
        }
        else
        {
            // let screenWidth = tt.getSystemInfoSync().screenWidth;
            // let screenHeight = tt.getSystemInfoSync().screenHeight;

            const { windowWidth, windowHeight } = tt.getSystemInfoSync();

            // Logger.info("width,height:", screenWidth, screenHeight);

            var targetBannerAdWidth = 200;

            let bannerAd = tt.createBannerAd({
                adUnitId: _adUnitId,
                style: {
                    width: targetBannerAdWidth,
                    top: windowHeight - (targetBannerAdWidth / 16) * 9,
                },
            });
            // 也可以手动修改属性以调整广告尺寸
            bannerAd.style.left = (windowWidth - targetBannerAdWidth) / 2;

            // if (tt.getSystemInfoSync().appName == 'XiGua' || tt.getSystemInfoSync().platform == "devtools")
            // {
            //     bannerAd.style.top = screenHeight - (targetBannerAdWidth / 16 * 9) + 200;
            // } else
            // {
            //     bannerAd.style.top = screenHeight - (targetBannerAdWidth / 16 * 9);
            // }
            // 也可以手动修改属性以调整广告尺寸
            bannerAd.style.left = (windowWidth - targetBannerAdWidth) / 2;

            // 尺寸调整时会触发回调，通过回调拿到的广告真实宽高再进行定位适配处理
            // 注意：如果在回调里再次调整尺寸，要确保不要触发死循环！！！
            bannerAd.onResize((size) =>
            {
                // good
                if (targetBannerAdWidth != size.width)
                {
                    targetBannerAdWidth = size.width;
                    bannerAd.style.top = windowHeight - size.height;
                    bannerAd.style.left = (windowWidth - size.width) / 2;
                }

                // console.log(size.width, size.height);
                // bannerAd.style.top = windowHeight - size.height;
                // bannerAd.style.left = (windowWidth - size.width) / 2;

                // bad，会触发死循环
                // bannerAd.style.width++;
            });

            // bannerAd.onResize(size =>
            // {
            //     console.log(size.width, size.height);

            //     if (targetBannerAdWidth != size.width)
            //     {
            //         targetBannerAdWidth = size.width;
            //         bannerAd.style.top = screenHeight - size.height;
            //         bannerAd.style.left = (screenWidth - size.width) / 2;
            //     }
            // });

            this.oldBannerAd = bannerAd;

            bannerAd.onLoad((res) =>
            {
                if (this.oldBannerAd)
                {
                    this.oldBannerAd.hide();
                }

                if (!this.isShowBanner)
                {
                    this.showBanner();
                }
                else
                {
                    this.hideBanner();
                }
            })

            bannerAd.onError(err =>
            {
                console.log(err);
            })
        }
    }

    showBanner()
    {
        this.isShowBanner = true

        let bannerAd: any = this.oldBannerAd;
        if (bannerAd)
        {
            bannerAd.show();
        }
    };

    hideBanner()
    {
        this.isShowBanner = false

        let bannerAd: any = this.oldBannerAd;
        if (bannerAd)
        {
            bannerAd.hide()
        }
    };

    destroySelf()
    {
        let bannerAd: any = this.oldBannerAd;
        if (bannerAd)
        {
            bannerAd.destroy();
            this.oldBannerAd = null;
        }
        this.isShowBanner = false
    };

    instantiationRewardAd()
    {
        console.log("视频实例化")
        this.rewardedVideoAd = tt.createRewardedVideoAd({
            adUnitId: this.videoAds[this.videoNum % this.videoAds.length]
        });
    }
    public videoNum: number = 0;
    public rewardedVideoAd: any = null;
    public isVoice: boolean = false;
    private videoTime: number = 0;
    public videoAds: Array<string> = ["2784honbplhp2eb164"];
    public createRewardedVideoAd(_callback: Function)
    {
        this.videoTime++;
        if (this.videoTime >= 3)
        {
            this.videoTime = 0;
            this.videoNum++;
            this.instantiationRewardAd();
        }

        let onClose = (res) =>
        {
            if (res.isEnded)//if ((res && res.isEnded) || res === undefined)
            {
                _callback(true);
            } else
            {
                _callback(false);
            }
            this.rewardedVideoAd.offClose(onClose);
            this.rewardedVideoAd.offError(onError);
        };

        let onError = (res) =>
        {
            console.log("rewardad" + res.errCode + " : " + res.errMsg);
            //_callback(false);
            GameSys.game.xSet(Config.TIP, "广告正在准备中，请重启或稍后再试");
            this.rewardedVideoAd.offError(onError);
        };

        this.rewardedVideoAd.load()
            .then(() => this.rewardedVideoAd.show())
            .catch(err => console.log(err.errMsg));


        this.rewardedVideoAd.onClose(onClose);
        this.rewardedVideoAd.onError(onError);
    }
    public recordTime = 0;
    private startRec()
    {
        this.screenRec.onStart(res =>
        {
            this.recordTime = new Date().getTime();
        })
        this.screenRec.start({
            duration: 300,
        })
    }

    public issueSuc: boolean = false;
    public videoPath = null;
    private stopRec()
    {
        if (this.screenRec)
        {
            this.screenRec.onStop(res =>
            {
                this.recordTime = new Date().getTime() - this.recordTime;
                this.videoPath = res.videoPath
            })
            this.screenRec.stop();
        }
    }

    public issueVideo(_callback: Function)
    {
        if (this.recordTime <= 3000)
        {
            GameSys.game.xSet(Config.TIP, "视频小于3s无法分享啊");
            return;
        }

        if (this.videoPath)
        {
            tt.shareAppMessage({
                channel: "video",
                templateId: "88dhenci58lli6bp9p",
                extra: {
                    videoPath: this.videoPath,
                    videoTopics: ['五星卫生院', '2020我们一起跨过']
                },
                success()
                {
                    this.issueSuc = true;
                    this.videoPath = null;
                    _callback(true)
                },
                fail(e)
                {
                    _callback(false);
                }
            })
        } else
        {
            console.log(this.videoPath);
        }
    }

    public static clickTime: number = 0;
    shareTimes: number = 0;
    shareAppMessage(_callback: Function)
    {
        tt.shareAppMessage({
            templateId: "88dhenci58lli6bp9p",
            success()
            {
                _callback(true);
            },
            fail(e)
            {
                _callback(false);
            }
        });

        return;
        return new Promise(resolve =>
        {
            TTAPI.clickTime = new Date().getTime();
            tt.offHide();
            tt.onHide(() =>
            {
                tt.offShow();
                tt.onShow(() =>
                {
                    let space: number = Math.ceil((new Date().getTime() - TTAPI.clickTime) / 1000);
                    console.log("返回了前台 中间间隔：", space);
                    if (space >= 5)
                    {
                        _callback(true);

                    } else
                    {
                        _callback(false);
                    }
                });
            });
            tt.shareAppMessage({
                desc: "超萌小猫咪正在等你领养",
                title: "听说只有智商120才能通关，你能顺利帮助猫猫脱险吗？",
                imageUrl: GameSys.imageUrl,
            });
        })

    }

    private onMoreGames()
    {
        // 监听弹窗关闭
        if (tt.navigateToMiniProgram)
        {
            tt.navigateToMiniProgram()
        }
        else
        {
            tt.showModal({
                title: '提示',
                content: '当前客户端版本过低，无法使用该功能，请升级客户端或关闭后重启更新。'
            })
        }

        tt.onMoreGamesModalClose(function (res)
        {
            console.log('modal closed', res)
        })
        // 监听小游戏跳转
        tt.onNavigateToMiniProgram(function (res)
        {
            console.log(res.errCode)
            console.log(res.errMsg)
        })

        const systemInfo = tt.getSystemInfoSync()
        // iOS 不支持，建议先检测再使用
        if (systemInfo.platform !== 'ios')
        {
            // 打开互跳弹窗
            tt.showMoreGamesModal({
                appLaunchOptions: [
                    // {...}
                ],
                success(res)
                {
                    console.log('success', res.errMsg)
                },
                fail(res)
                {
                    console.log('fail', res.errMsg)
                }
            })
        }
        else
        {
            GameSys.game.xSet(Config.TIP, "功能未开放");
        }

    }
    static interNum0: number = 0;
    static interNum2: number = 0;
    public inter()//0结算，1返回主页面，2重置
    {
        // if (_pos == 0)
        // {
        //     TTAPI.interNum0++
        //     if (TTAPI.interNum0 % 3 != 0)
        //     {
        //         return;
        //     }
        // }
        // else if (_pos == 2)
        // {
        //     TTAPI.interNum2++
        //     if (TTAPI.interNum2 % 3 != 0)
        //     {
        //         return;
        //     }
        // }

        // GameSys.statistical("insert", "插屏展示", 8);
        console.log(tt.getSystemInfoSync().appName)
        if (tt.getSystemInfoSync().appName == "Toutiao" || tt.getSystemInfoSync().appName == "Douyin")
        {
            // 插屏广告支持今日头条和抖音客户端
            console.log("插屏展示")
            const interstitialAd = tt.createInterstitialAd({
                adUnitId: "9676je1jdfsff4camw",
            });

            interstitialAd.onLoad(() =>
            {
                Logger.info("加载插屏");
            })

            interstitialAd.onError(err =>
            {
                Logger.warn("插屏有误", JSON.stringify(err));
            })

            interstitialAd.onClose(err =>
            {
                Logger.warn("插屏关闭", JSON.stringify(err));
                interstitialAd.destroy();
            })
            interstitialAd.show().catch(err =>
            {
                Logger.warn("插屏", JSON.stringify(err));
                interstitialAd.show();
            })

        }
    }
}
