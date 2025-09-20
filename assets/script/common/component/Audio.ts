import Props from "../kernels/Props";
import Caches from "../manager/Caches";
import Logger from "../manager/Log";
import UtilsManager from "../manager/UtilsManager";

/******************************************************************
 * Copyright(C)
 *
 * 声音管理
 *
 *
 ******************************************************************/
const { ccclass, property } = cc._decorator;
@ccclass
export default class Audio extends Props
{
	public bgmHandle: number = -1; // 正在播放的音乐
	// 初始化
	constructor()
	{
		super();
		this.xSet("bgmVolume", Caches.getFloat(Caches.bgmVolume, 1.0));
		this.xSet("sfxVolume", Caches.getFloat(Caches.sfxVolume, 1.0));
		Logger.info("初始化声音管理成功!");
	}

	// 播放背景音乐
	public playBGM(clip: any, scale: number = 1.0)
	{
		if (!clip || clip.length == 0)
		{
			return;
		}
		this.stopBGM();
		let vol: number = this.xGet("bgmVolume");
		vol *= scale;

		if (typeof clip != "string")
		{
			this.bgmHandle = cc.audioEngine.play(clip, true, vol);
			return;
		}
		if (vol > 0.001)
		{
			cc.loader.loadRes(clip, cc.AudioClip, (err, asset) =>
			{
				this.bgmHandle = cc.audioEngine.play(asset, true, vol);
			});
		}
	}

	// 关闭背景音乐
	public stopBGM()
	{
		console.log(this.bgmHandle)
		if (this.bgmHandle != -1)
		{
			cc.audioEngine.stop(this.bgmHandle);
			this.bgmHandle = -1;
		}
	}

	// 恢复背景音乐音量
	public recoverBGM()
	{
		this.setBGMVolume(1);

	}

	// 静音背景音乐
	public slientBgm()
	{
		this.stopBGM();
		this.setBGMVolume(0);
	}

	// 播放音效
	// @ 路径直传
	public async playSFX(path: any, loop: boolean = false)
	{
		if (!path || path.length == 0)
		{
			return;
		}

		if (typeof path != "string")
		{
			let vol: number = this.xGet("sfxVolume");
			cc.audioEngine.play(path, false, vol);
			return;
		}

		// path = cc.url.raw(path);

		var vol = this.xGet("sfxVolume");
		if (vol > 0.001)
		{
			let clip: any = await UtilsManager.loadAudioClip(path)
			cc.audioEngine.play(clip, false, vol);
		}
	}

	public slientSFX()
	{
		this.setSFXVolume(0);
	}

	public recoverSFX()
	{
		this.setSFXVolume(1);
	}

	// 设置背景音量
	public setBGMVolume(v: number)
	{
		Caches.set(Caches.bgmVolume, v);
		this.xSet("bgmVolume", v);

		if (this.bgmHandle != -1)
		{
			cc.audioEngine.setVolume(this.bgmHandle, v);
		}
	}

	// 设置音效音量
	public setSFXVolume(v: number)
	{
		Caches.set(Caches.sfxVolume, v);
		this.xSet("sfxVolume", v);

		if (this.bgmHandle != -1)
		{
			cc.audioEngine.setEffectsVolume(v);
		}
	}

	// 暂停
	public pauseAll()
	{
		Logger.info("声音暂停");
		cc.audioEngine.pauseAll();
	}

	// 恢复
	public resumeAll()
	{
		Logger.info("声音恢复");
		cc.audioEngine.resumeAll();
	}

	// 全部关闭
	public stopAll()
	{
		Logger.info("声音关闭");
		cc.audioEngine.stopAll();
	}

	// 停止播放所有音效
	public stopAllEffects()
	{
		Logger.info("音效关闭");
		cc.audioEngine.stopAllEffects();
	}
}
