import Logger from "../manager/Log";
import GameSys from "../manager/GameSys";


/******************************************************************
 * Copyright(C)
 *
 * 音乐
 *
 *
 ******************************************************************/
const { ccclass, property } = cc._decorator;
@ccclass
export default class XBGM extends cc.Component
{
	@property({
		type: cc.AudioClip,
		displayName: "背景音乐"
	})
	bgmAudio: cc.AudioClip = null;

	@property({
		displayName: "静默播放"
	})
	slientPlay: boolean = false;

	@property({
		type: cc.Float,
		displayName: "音量比"
	})
	volumeRate: number = 0.8;

	start()
	{
		if (!this.bgmAudio)
		{
			Logger.error("没有添加背景音乐");
			GameSys.audio.stopBGM();
			return;
		}

		var vol = GameSys.audio.xGet("bgmVolume");
		if (vol <= 0.001 && !this.slientPlay)
		{
			Logger.info("音量太小或没有允许播放", vol);
			return;
		}

		// 播放
		this.scheduleOnce(() =>
		{
			Logger.info("开始播放音乐", this.bgmAudio);
			GameSys.audio.playBGM(this.bgmAudio, this.volumeRate);
		}, 0.05);
	}
}
