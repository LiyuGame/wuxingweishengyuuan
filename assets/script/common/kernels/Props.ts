import Logger from "../manager/Log";
import UtilsManager from "../manager/UtilsManager";

/******************************************************************
 * Copyright(C) 2019
 *
 * 属性集合
 *
 *
 ******************************************************************/


export default class Props
{
	public flag: string = "";
	public props: any = {};

	public destroy()
	{
		this.vclear();
	}

	public xflag(_flag: string)
	{
		this.flag = _flag;
	}

	public xSet(key: string, value: any = null, notify: boolean = true)
	{
		if (key == "")
		{
			return false;
		}

		let p: any = this.props[key];
		if (p != null)
		{
			p.v = value;
		} else
		{
			this.props[key] = { v: value, v2: value, t: [] };
		}

		if (notify)
		{
			this._notify(this.props[key]);
		}

		if (value)
		{
			this.props[key].v2 = UtilsManager.clone(value);
		}

		return true;
	}

	public xGet(key: string, def: any = null)
	{
		let p: any = this._query(key);
		return p ? p.v : def;
	}

	public xBind(key: string, callback: Function, tag: string = "")
	{
		if (tag == "")
		{
			return false;
		}

		let p: any = this._query(key);

		if (p == null)
		{
			return false;
		}

		for (let i: number = 0; i < p.t.length; i++)
		{
			let cb: Function = p.t[i];
			if (cb == callback)
			{
				return false;
			}
		}

		p.t.push({ cb: callback, tag: tag });

		return true;
	}

	public _query(_key: string)
	{
		if (_key == "")
		{
			return null;
		}

		let p: any = this.props[_key];
		if (typeof p == "undefined")
		{
			return null;
		}

		return p;
	}

	public _notify(_prop: any)
	{
		for (let i in _prop.t)
		{
			let t: any = _prop.t[i];
			if (t && typeof t.cb == "function")
			{
				t.cb(_prop.v, _prop.v2);
			}

		}
	}

	public xUnbind(tag: string)
	{
		if (tag == "")
		{
			return false;
		}

		let count = 0;
		for (let k in this.props)
		{
			let p = this.props[k];
			for (let i = p.t.length - 1; i >= 0; i--)
			{
				let t = p.t[i];
				if (t && t.tag == tag)
				{
					p.t.splice(i, 1);
					count++;
				}
			}
		}
		// Logger.info("解除绑定", tag)
		return true;
	}

	public vclear()
	{
		this.props = {};
	}




}
