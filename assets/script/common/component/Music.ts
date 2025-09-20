import GameSys from "../manager/GameSys";
import StateManager from "../manager/StateManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Music extends cc.Component
{

    @property(StateManager)
    state: StateManager = null;

    onEnable()
    {
        let bgmVolume = GameSys.audio.xGet("bgmVolume");
        let sfxVolume = GameSys.audio.xGet("sfxVolume");
        this.state.stateChange(bgmVolume);
        console.log("音乐", bgmVolume)
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchMusic.bind(this))
    }
    onTouchMusic()
    {
        if (this.state.nowState == 0)
        {
            this.state.stateChange(1);
            GameSys.audio.recoverBGM();
            GameSys.audio.recoverSFX();
            GameSys.audio.playBGM("audios/bgm");
        }
        else if (this.state.nowState == 1)
        {
            this.state.stateChange(0);
            GameSys.audio.slientBgm();
            GameSys.audio.slientSFX();
        }
    }
}
