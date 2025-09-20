import PopupBase from "./common/component/popups/PopupBase";

const { ccclass, property } = cc._decorator;

/** 测试弹窗 */
@ccclass
export default class TestPopup extends PopupBase<string>{

    static get path() { return 'prefabs/testPopup' }

}