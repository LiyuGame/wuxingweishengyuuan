import GameSys from "../manager/GameSys";

/******************************************************************
 * Copyright(C)
 *
 * 按钮
 *
 *
 ******************************************************************/
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("按钮组件/XButton")
export default class XButton extends cc.Component
{
	@property({
		type: cc.AudioClip,
		displayName: "触摸音"
	})
	public touchAudio: cc.AudioClip = null;

	@property({
		displayName: "触摸动画"
	})
	public touchAnim: boolean = false;

	@property({
		type: cc.Float,
		displayName: "点击间隔"
	})
	public clickInterval: number = 0.4;

	@property({
		type: cc.Component.EventHandler,
		displayName: "触摸回调"
	})
	public touchEvents: Array<cc.Component.EventHandler> = [];

	public touchStartEvents: Array<cc.Component.EventHandler> = [];
	public touchCancelEvents: Array<cc.Component.EventHandler> = [];

	public isDown: boolean = false;
	public rawScale: number = 0;
	public clickTime: any = null;

	onLoad()
	{
		this.rawScale = this.node.scale;
		// if (this.touchAnim == true)
		// {
		// 	this.node.runAction(
		// 		cc.sequence(
		// 			cc.scaleTo(0.5, 0.95),
		// 			cc.scaleTo(0.5, 1),
		// 			cc.callFunc(() =>
		// 			{
		// 			})
		// 		).repeatForever()
		// 	);
		// }
		// 按钮绑定
		this.node.on("touchstart", this.touchStart.bind(this), this.node);
		this.node.on("touchend", this.touchEnd.bind(this), this.node);
		this.node.on("touchcancel", this.touchCancel.bind(this), this.node);
	}

	public initScale: number = 1;
	touchStart(event)
	{
		if (this.enabled == false || this.isDown)
		{
			return;
		}
		this.initScale = this.node.scale;

		this.isDown = true;

		if (this.touchAudio)
		{
			GameSys.audio.playSFX(this.touchAudio);
		}
		else
		{
			GameSys.audio.playSFX("audios/close");
		}

		if (this.touchAnim)
		{
			this.node.stopAllActions();
			this.node.runAction(
				cc.sequence(
					cc.scaleTo(0.1, 1.1),
					cc.callFunc(() =>
					{
					})
				).repeatForever()
			);
		}

		if (this.touchStartEvents.length > 0)
		{
			cc.Component.EventHandler.emitEvents(this.touchStartEvents);
		}
	}

	touchEnd(event)
	{
		if (this.enabled == false)
		{
			return;
		}

		if (this.touchAnim)
		{
			this.node.stopAllActions();
			this.node.runAction(
				cc.sequence(
					cc.scaleTo(0.1, this.initScale),
					cc.callFunc(() =>
					{
						this.isDown = false;
					})
				)
			);
		} else
		{
			this.isDown = false;
		}

		let now: any = new Date();
		let ms: number = this.clickInterval * 1000;
		if (now.getTime() - this.clickTime < ms)
		{
			return;
		}



		this.clickTime = now.getTime();
		if (this.touchEvents.length > 0)
		{
			cc.Component.EventHandler.emitEvents(this.touchEvents);
		}
	}

	touchCancel(event)
	{
		if (this.enabled == false)
		{
			return;
		}

		if (this.touchAnim)
		{
			if (this.touchAnim)
			{
				this.node.stopAllActions();
				this.node.runAction(
					cc.sequence(
						cc.scaleTo(0.1, 1),
						cc.callFunc(() =>
						{
							this.isDown = false;
						})
					)
				);
			} else
			{
				this.isDown = false;
			}
		}


		if (this.touchCancelEvents.length > 0)
		{
			cc.Component.EventHandler.emitEvents(this.touchCancelEvents);
		}

	}

	addTouchStartEvent(_targetNode: cc.Node, _componentName: string, _handlerName: string, _customEventData: any = "")
	{
		let handler = new cc.Component.EventHandler();
		handler.target = _targetNode;
		handler.component = _componentName;
		handler.customEventData = _customEventData + "";
		handler.handler = _handlerName;
		this.touchStartEvents.push(handler);
	}

	addTouchEvent(_targetNode: cc.Node, _componentName: string, _handlerName: string, _customEventData: any = "")
	{
		let handler = new cc.Component.EventHandler();
		handler.target = _targetNode;
		handler.component = _componentName;
		handler.customEventData = _customEventData + "";
		handler.handler = _handlerName;
		this.touchEvents.push(handler);
	}

	addTouchCancelEvent(_targetNode: cc.Node, _componentName: string, _handlerName: string, _customEventData: any = "")
	{
		let handler = new cc.Component.EventHandler();
		handler.target = _targetNode;
		handler.component = _componentName;
		handler.customEventData = _customEventData + "";
		handler.handler = _handlerName;
		this.touchCancelEvents.push(handler);
	}

}
