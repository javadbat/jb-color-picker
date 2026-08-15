import { registerDefaultVariables as e } from "jb-core/theme";
import "jb-number-input";
const t = .4;
function r(e, t, r) {
	return Math.min(r, Math.max(t, Number.isFinite(e) ? e : t));
}
function a(e) {
	const t = Number.isFinite(e) ? e % 360 : 0;
	return t < 0 ? t + 360 : t;
}
function i(e) {
	const i = r(e.alpha ?? 1, 0, 1);
	return "oklch" === e.colorSpace ? {
		colorSpace: "oklch",
		l: r(e.l, 0, 1),
		c: r(e.c, 0, t),
		h: a(e.h),
		alpha: i
	} : {
		colorSpace: "rgb",
		r: Math.round(r(e.r, 0, 255)),
		g: Math.round(r(e.g, 0, 255)),
		b: Math.round(r(e.b, 0, 255)),
		alpha: i
	};
}
function s({ r: e, g: t, b: r }) {
	const i = e / 255, s = t / 255, n = r / 255, l = Math.max(i, s, n), c = l - Math.min(i, s, n);
	let o = 0;
	return 0 !== c && (o = l === i ? (s - n) / c % 6 * 60 : l === s ? 60 * ((n - i) / c + 2) : 60 * ((i - s) / c + 4)), {
		h: a(o),
		s: 0 === l ? 0 : c / l,
		v: l
	};
}
function n(e, t, r, s = 1) {
	const n = a(e), l = r * t, c = l * (1 - Math.abs(n / 60 % 2 - 1)), o = r - l, h = Math.floor(n / 60), [u, d, p] = 0 === h ? [
		l,
		c,
		0
	] : 1 === h ? [
		c,
		l,
		0
	] : 2 === h ? [
		0,
		l,
		c
	] : 3 === h ? [
		0,
		c,
		l
	] : 4 === h ? [
		c,
		0,
		l
	] : [
		l,
		0,
		c
	];
	return i({
		colorSpace: "rgb",
		r: 255 * (u + o),
		g: 255 * (d + o),
		b: 255 * (p + o),
		alpha: s
	});
}
function l(e) {
	const t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
function c(e) {
	return r(255 * (e <= .0031308 ? 12.92 * e : 1.055 * e ** (1 / 2.4) - .055), 0, 255);
}
function o(e) {
	const t = l(e.r), r = l(e.g), a = l(e.b), s = .4122214708 * t + .5363325363 * r + .0514459929 * a, n = .2119034982 * t + .6806995451 * r + .1073969566 * a, c = .0883024619 * t + .2817188376 * r + .6299787005 * a, o = Math.cbrt(s), h = Math.cbrt(n), u = Math.cbrt(c), d = 1.9779984951 * o - 2.428592205 * h + .4505937099 * u, p = .0259040371 * o + .7827717662 * h - .808675766 * u;
	return i({
		colorSpace: "oklch",
		l: .2104542553 * o + .793617785 * h - .0040720468 * u,
		c: Math.sqrt(d * d + p * p),
		h: 180 * Math.atan2(p, d) / Math.PI,
		alpha: e.alpha
	});
}
function h(e) {
	const t = a(e.h) * Math.PI / 180, r = e.c * Math.cos(t), s = e.c * Math.sin(t), n = (e.l + .3963377774 * r + .2158037573 * s) ** 3, l = (e.l - .1055613458 * r - .0638541728 * s) ** 3, o = (e.l - .0894841775 * r - 1.291485548 * s) ** 3;
	return i({
		colorSpace: "rgb",
		r: c(4.0767416621 * n - 3.3077115913 * l + .2309699292 * o),
		g: c(-1.2684380046 * n + 2.6097574011 * l - .3413193965 * o),
		b: c(-.0041960863 * n - .7034186147 * l + 1.707614701 * o),
		alpha: e.alpha
	});
}
function u(e, t) {
	const r = i(e);
	return r.colorSpace === t ? r : "rgb" === r.colorSpace ? o(r) : h(r);
}
function d(e) {
	const t = i(e);
	return "rgb" === t.colorSpace ? `rgb(${t.r} ${t.g} ${t.b} / ${g(t.alpha)})` : `oklch(${g(t.l)} ${g(t.c)} ${g(t.h)} / ${g(t.alpha)})`;
}
function p(e) {
	const t = e.trim().toLowerCase();
	return t.startsWith("#") ? function(e) {
		const t = e.slice(1);
		if (![
			3,
			4,
			6,
			8
		].includes(t.length) || !/^[\da-f]+$/.test(t)) return null;
		const r = t.length <= 4 ? [...t].map((e) => e + e).join("") : t, a = 8 === r.length;
		return i({
			colorSpace: "rgb",
			r: Number.parseInt(r.slice(0, 2), 16),
			g: Number.parseInt(r.slice(2, 4), 16),
			b: Number.parseInt(r.slice(4, 6), 16),
			alpha: a ? Number.parseInt(r.slice(6, 8), 16) / 255 : 1
		});
	}(t) : /^rgba?\(/.test(t) ? function(e) {
		const t = e.match(/^rgba?\((.*)\)$/);
		if (!t) return null;
		const r = t[1].trim();
		let a, s;
		if (r.includes(",")) {
			const e = r.split(",").map((e) => e.trim());
			if (3 !== e.length && 4 !== e.length) return null;
			a = e.slice(0, 3), s = e[3];
		} else {
			const e = r.split("/").map((e) => e.trim());
			if (e.length > 2) return null;
			a = e[0].split(/\s+/), s = e[1];
		}
		if (3 !== a.length) return null;
		const n = a.map(b), l = void 0 === s ? 1 : m(s);
		return n.some((e) => null === e) || null === l ? null : i({
			colorSpace: "rgb",
			r: n[0],
			g: n[1],
			b: n[2],
			alpha: l
		});
	}(t) : t.startsWith("oklch(") ? function(e) {
		const t = e.match(/^oklch\((.*)\)$/);
		if (!t) return null;
		const r = t[1].trim().split("/").map((e) => e.trim());
		if (r.length > 2) return null;
		const a = r[0].split(/\s+/);
		if (3 !== a.length) return null;
		const s = function(e) {
			if (e.endsWith("%")) {
				const t = f(e.slice(0, -1));
				return null === t ? null : t / 100;
			}
			return f(e);
		}(a[0]), n = f(a[1]), l = function(e) {
			const t = e.match(/^([-+]?(?:\d+\.?\d*|\.\d+))(deg|grad|rad|turn)?$/);
			if (!t) return null;
			const r = Number(t[1]);
			return Number.isFinite(r) ? "grad" === t[2] ? .9 * r : "rad" === t[2] ? 180 * r / Math.PI : "turn" === t[2] ? 360 * r : r : null;
		}(a[2]), c = void 0 === r[1] ? 1 : m(r[1]);
		return null === s || null === n || null === l || null === c ? null : i({
			colorSpace: "oklch",
			l: s,
			c: n,
			h: l,
			alpha: c
		});
	}(t) : null;
}
function b(e) {
	if (e.endsWith("%")) {
		const t = f(e.slice(0, -1));
		return null === t ? null : t / 100 * 255;
	}
	return f(e);
}
function m(e) {
	if (e.endsWith("%")) {
		const t = f(e.slice(0, -1));
		return null === t ? null : t / 100;
	}
	return f(e);
}
function f(e) {
	if (!/^[-+]?(?:\d+\.?\d*|\.\d+)$/.test(e)) return null;
	const t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function g(e) {
	return String(Number(e.toFixed(3)));
}
const v = globalThis.HTMLElement ?? class {}, k = {
	rgb: [
		{
			key: "r",
			label: "R",
			min: 0,
			max: 255,
			step: 1,
			decimalPrecision: 0,
			acceptNegative: !1
		},
		{
			key: "g",
			label: "G",
			min: 0,
			max: 255,
			step: 1,
			decimalPrecision: 0,
			acceptNegative: !1
		},
		{
			key: "b",
			label: "B",
			min: 0,
			max: 255,
			step: 1,
			decimalPrecision: 0,
			acceptNegative: !1
		},
		{
			key: "alpha",
			label: "Alpha",
			min: 0,
			max: 1,
			step: .01,
			decimalPrecision: 2,
			acceptNegative: !1
		}
	],
	oklch: [
		{
			key: "l",
			label: "L",
			min: 0,
			max: 1,
			step: .01,
			decimalPrecision: 2,
			acceptNegative: !1
		},
		{
			key: "c",
			label: "C",
			min: 0,
			max: t,
			step: .001,
			decimalPrecision: 3,
			acceptNegative: !1
		},
		{
			key: "h",
			label: "H",
			min: 0,
			max: 360,
			step: 1,
			decimalPrecision: 0,
			acceptNegative: !1
		},
		{
			key: "alpha",
			label: "Alpha",
			min: 0,
			max: 1,
			step: .01,
			decimalPrecision: 2,
			acceptNegative: !1
		}
	]
};
var S = class extends v {
	static get observedAttributes() {
		return [
			"color-space",
			"alpha-disabled",
			"disabled"
		];
	}
	#e = {
		colorSpace: "rgb",
		r: 59,
		g: 102,
		b: 245,
		alpha: 1
	};
	#t = null;
	#r = s(this.#e).h;
	#a = !1;
	#i;
	constructor() {
		super(), "function" == typeof this.attachInternals && (this.#i = this.attachInternals(), this.#i.role = "group", this.#i.ariaLabel = "Color picker");
		const t = this.attachShadow({
			mode: "open",
			clonable: !0,
			serializable: !0
		});
		e();
		const r = document.createElement("template");
		r.innerHTML = "<style>:host{color:var(--picker-color);font-family:var(--picker-font-family);display:inline-block}*,:before,:after{box-sizing:border-box}button,input{font:inherit}.picker{width:var(--picker-width);background:var(--picker-background);border:1px solid var(--picker-border-color);border-radius:var(--picker-radius);gap:.75rem;padding:.75rem;display:grid}.space-switch{background:color-mix(in srgb, var(--picker-border-color), transparent 55%);border-radius:.5rem;grid-template-columns:1fr 1fr;gap:.25rem;padding:.2rem;display:grid}.space-switch[hidden]{display:none}.space-switch button{appearance:none;color:inherit;cursor:pointer;background:0 0;border:0;border-radius:.35rem;padding:.4rem}.space-switch button[aria-pressed=true]{color:#fff;background:var(--picker-accent)}.surface-wrap{aspect-ratio:4/3;touch-action:none;cursor:crosshair;border-radius:.5rem;width:100%;position:relative;overflow:hidden}.surface{width:100%;height:100%;display:block}.surface-cursor{pointer-events:none;border:2px solid #fff;border-radius:50%;width:.875rem;height:.875rem;position:absolute;translate:-50% -50%;box-shadow:0 0 0 1px #111,0 1px 3px #0008}.slider-row{grid-template-columns:3.5rem 1fr;align-items:center;gap:.5rem;font-size:.75rem;display:grid}.slider-row input{width:100%;accent-color:var(--picker-accent);margin:0}.hue{appearance:none;background:linear-gradient(90deg,red,#ff0,#0f0,#0ff,#00f,#f0f,red);border-radius:1rem;height:.65rem}.hue::-webkit-slider-thumb{appearance:none;background:0 0;border:2px solid #fff;border-radius:50%;width:1rem;height:1rem;box-shadow:0 0 0 1px #555}.alpha::-webkit-slider-thumb{appearance:none;background:0 0;border:2px solid #fff;border-radius:50%;width:1rem;height:1rem;box-shadow:0 0 0 1px #555}.alpha-track{background-color:#fff;background-image:conic-gradient(#ddd 25%, #fff 0 50%, #ddd 0 75%, #fff 0);background-size:.6rem .6rem;border-radius:1rem;padding:.15rem 0}.alpha{appearance:none;background:linear-gradient(to right, transparent, var(--selected-color));border-radius:1rem;height:.65rem;display:block}.fields{grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem;display:grid}.field{width:100%;min-width:0;font-size:.7rem;display:block}.result{align-items:center;gap:.5rem;min-width:0;display:flex}.preview{border:1px solid var(--picker-border-color);background:var(--selected-color);border-radius:.35rem;flex:none;width:1.75rem;height:1.75rem}.value-text{text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,monospace;font-size:.7rem;overflow:hidden}:host([alpha-disabled]) .alpha-row{display:none}:host([disabled]){opacity:.6;pointer-events:none}:host([disabled]) button,:host([disabled]) input{cursor:not-allowed} :host{--picker-width:var(--jb-color-picker-width,18rem);--picker-background:var(--jb-color-picker-background,var(--jb-surface,#fff));--picker-color:var(--jb-color-picker-color,var(--jb-content-primary,#202124));--picker-border-color:var(--jb-color-picker-border-color,var(--jb-border,#d9dce1));--picker-radius:var(--jb-color-picker-border-radius,.75rem);--picker-accent:var(--jb-color-picker-accent-color,var(--jb-primary,#3b66f5));--picker-font-family:var(--jb-color-picker-font-family,inherit)}</style>\n    <div class=\"picker\" part=\"wrapper\">\n      <div class=\"space-switch\" role=\"group\" aria-label=\"Color space\" part=\"space-switch\">\n        <button type=\"button\" data-space=\"rgb\" part=\"space-button\">RGB</button>\n        <button type=\"button\" data-space=\"oklch\" part=\"space-button\">OKLCH</button>\n      </div>\n      <div class=\"surface-wrap\" part=\"color-surface\">\n        <canvas class=\"surface\" width=\"256\" height=\"192\" aria-label=\"Color field\"></canvas>\n        <span class=\"surface-cursor\" aria-hidden=\"true\" part=\"surface-cursor\"></span>\n      </div>\n      <label class=\"slider-row hue-row\">\n        <span>Hue</span>\n        <input class=\"hue\" type=\"range\" min=\"0\" max=\"360\" step=\"1\" aria-label=\"Hue\" part=\"hue-slider\">\n      </label>\n      <label class=\"slider-row alpha-row\">\n        <span>Alpha</span>\n        <span class=\"alpha-track\">\n          <input class=\"alpha\" type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" aria-label=\"Alpha\" part=\"alpha-slider\">\n        </span>\n      </label>\n      <div class=\"fields\" part=\"fields\"></div>\n      <div class=\"result\" part=\"result\">\n        <span class=\"preview\" aria-hidden=\"true\" part=\"preview\"></span>\n        <output class=\"value-text\" aria-live=\"polite\" part=\"value-text\"></output>\n      </div>\n    </div>\n  ", t.appendChild(r.content.cloneNode(!0)), this.elements = {
			surface: t.querySelector(".surface"),
			surfaceCursor: t.querySelector(".surface-cursor"),
			hue: t.querySelector(".hue"),
			alpha: t.querySelector(".alpha"),
			alphaRow: t.querySelector(".alpha-row"),
			preview: t.querySelector(".preview"),
			spaceSwitch: t.querySelector(".space-switch"),
			spaceButtons: t.querySelectorAll("[data-space]"),
			fields: t.querySelector(".fields"),
			valueText: t.querySelector(".value-text")
		}, this.elements.surface.tabIndex = 0, this.elements.surface.setAttribute("role", "group"), this.#s();
	}
	connectedCallback() {
		const e = this.getAttribute("color-space");
		this.#t = "rgb" === e || "oklch" === e ? e : null, this.#t && this.#t !== this.#e.colorSpace && (this.#e = u(this.#e, this.#t), this.#n()), this.#l(), this.dispatchEvent(new CustomEvent("load", {
			bubbles: !0,
			composed: !0
		})), this.dispatchEvent(new CustomEvent("init", {
			bubbles: !0,
			composed: !0
		}));
	}
	attributeChangedCallback(e, t, r) {
		t !== r && ("color-space" === e && (this.#t = "rgb" === r || "oklch" === r ? r : null, this.#t && this.#t !== this.#e.colorSpace && (this.#e = u(this.#e, this.#t), this.#n())), this.#l());
	}
	get value() {
		return d(this.#e);
	}
	set value(e) {
		const t = "string" == typeof e ? p(e) : !e || "rgb" !== e.colorSpace && "oklch" !== e.colorSpace ? null : i(e);
		t && (this.#e = this.#t ? u(t, this.#t) : t, this.#n(), this.#l());
	}
	get valueObject() {
		return { ...this.#e };
	}
	get colorSpace() {
		return this.#t;
	}
	set colorSpace(e) {
		if (null === e) return this.#t = null, void (this.hasAttribute("color-space") ? this.removeAttribute("color-space") : this.#l());
		"rgb" !== e && "oklch" !== e || (this.#t = e, e !== this.#e.colorSpace && (this.#e = u(this.#e, e), this.#n()), this.getAttribute("color-space") !== e && this.setAttribute("color-space", e), this.#l());
	}
	get alphaEnabled() {
		return !this.hasAttribute("alpha-disabled");
	}
	set alphaEnabled(e) {
		this.toggleAttribute("alpha-disabled", !e);
	}
	get disabled() {
		return this.hasAttribute("disabled");
	}
	set disabled(e) {
		this.toggleAttribute("disabled", Boolean(e));
	}
	#s() {
		this.elements.spaceButtons.forEach((e) => {
			e.addEventListener("click", () => {
				if (this.disabled) return;
				const t = e.dataset.space;
				null === this.#t && t !== this.#e.colorSpace && (this.#e = u(this.#e, t), this.#n(), this.#l(), this.#c("input"), this.#c("change"));
			});
		}), this.elements.hue.addEventListener("input", () => {
			this.#o(Number(this.elements.hue.value)), this.#c("input");
		}), this.elements.hue.addEventListener("change", () => this.#c("change")), this.elements.alpha.addEventListener("input", () => {
			this.#h(Number(this.elements.alpha.value)), this.#c("input");
		}), this.elements.alpha.addEventListener("change", () => this.#c("change")), this.elements.surface.addEventListener("pointerdown", (e) => this.#u(e)), this.elements.surface.addEventListener("pointermove", (e) => this.#d(e)), this.elements.surface.addEventListener("pointerup", (e) => this.#p(e)), this.elements.surface.addEventListener("pointercancel", (e) => this.#p(e)), this.elements.surface.addEventListener("keydown", (e) => this.#b(e));
	}
	#u(e) {
		this.disabled || (this.#a = !0, this.elements.surface.setPointerCapture(e.pointerId), this.#m(e), this.#c("input"));
	}
	#d(e) {
		this.#a && !this.disabled && (this.#m(e), this.#c("input"));
	}
	#p(e) {
		this.#a && (this.#a = !1, this.elements.surface.hasPointerCapture(e.pointerId) && this.elements.surface.releasePointerCapture(e.pointerId), this.#c("change"));
	}
	#m(e) {
		const t = this.elements.surface.getBoundingClientRect(), r = Math.min(1, Math.max(0, (e.clientX - t.left) / t.width)), a = Math.min(1, Math.max(0, (e.clientY - t.top) / t.height));
		this.#f(r, a);
	}
	#b(e) {
		if (this.disabled || ![
			"ArrowLeft",
			"ArrowRight",
			"ArrowUp",
			"ArrowDown"
		].includes(e.key)) return;
		e.preventDefault();
		const t = e.shiftKey ? .1 : .01, r = this.#g(), a = r.x + ("ArrowRight" === e.key ? t : "ArrowLeft" === e.key ? -t : 0), i = r.y + ("ArrowDown" === e.key ? t : "ArrowUp" === e.key ? -t : 0);
		this.#f(Math.min(1, Math.max(0, a)), Math.min(1, Math.max(0, i))), this.#c("input"), this.#c("change");
	}
	#f(e, r) {
		"rgb" === this.#e.colorSpace ? this.#e = n(this.#r, e, 1 - r, this.#e.alpha) : this.#e = i({
			...this.#e,
			c: e * t,
			l: 1 - r
		}), this.#l(!1);
	}
	#o(e) {
		if ("rgb" === this.#e.colorSpace) {
			const t = s(this.#e);
			this.#r = e, this.#e = n(e, t.s, t.v, this.#e.alpha);
		} else this.#e = i({
			...this.#e,
			h: e
		});
		this.#l();
	}
	#h(e) {
		this.#e = i({
			...this.#e,
			alpha: e
		}), this.#l(!1);
	}
	#v(e) {
		const t = e.target.closest("jb-number-input[data-channel]");
		if (!t || this.disabled) return;
		const r = t.dataset.channel, a = Number(t.value);
		Number.isFinite(a) ? (this.#e = i({
			...this.#e,
			[r]: a
		}), this.#n(), this.#l(), this.#c("input"), this.#c("change")) : this.#k();
	}
	#n() {
		if ("rgb" === this.#e.colorSpace) {
			const e = s(this.#e);
			e.s > 0 && (this.#r = e.h);
		}
	}
	#l(e = !0) {
		if (!this.isConnected) return;
		const t = d(this.#e), r = d({
			...this.#e,
			alpha: 1
		});
		this.style.setProperty("--selected-color", t), this.elements.hue.value = String("rgb" === this.#e.colorSpace ? this.#r : this.#e.h), this.elements.alpha.value = String(this.#e.alpha), this.elements.alpha.disabled = this.disabled, this.elements.hue.disabled = this.disabled, this.elements.alpha.style.setProperty("--selected-color", r), this.elements.valueText.value = t, this.elements.valueText.textContent = t, this.elements.surface.tabIndex = this.disabled ? -1 : 0, this.elements.spaceSwitch.hidden = null !== this.#t, this.elements.spaceButtons.forEach((e) => {
			const t = e.dataset.space === this.#e.colorSpace;
			e.setAttribute("aria-pressed", String(t)), e.disabled = this.disabled;
		});
		const a = this.#g();
		this.elements.surfaceCursor.style.left = 100 * a.x + "%", this.elements.surfaceCursor.style.top = 100 * a.y + "%", this.elements.surface.setAttribute("aria-label", "rgb" === this.#e.colorSpace ? "Saturation and brightness" : "Chroma and lightness"), this.elements.surface.setAttribute("aria-description", t), this.#i && (this.#i.ariaDescription = t), this.#k(), e && this.#S();
	}
	#k() {
		const e = document.createDocumentFragment();
		for (const t of k[this.#e.colorSpace]) {
			if ("alpha" === t.key && !this.alphaEnabled) continue;
			const r = document.createElement("jb-number-input");
			r.className = "field", r.setAttribute("part", "field"), r.setAttribute("label", t.label), r.minValue = t.min, r.maxValue = t.max, r.step = t.step, r.decimalPrecision = t.decimalPrecision, r.acceptNegative = t.acceptNegative, r.showControlButton = !0, r.disabled = this.disabled, r.dataset.channel = t.key, r.value = String(Number(this.#e[t.key].toFixed("c" === t.key ? 3 : t.step < 1 ? 2 : 0))), r.setAttribute("aria-label", t.label), r.addEventListener("change", (e) => this.#v(e)), e.appendChild(r);
		}
		this.elements.fields.replaceChildren(e);
	}
	#g() {
		if ("rgb" === this.#e.colorSpace) {
			const e = s(this.#e);
			return {
				x: e.s,
				y: 1 - e.v
			};
		}
		return {
			x: this.#e.c / t,
			y: 1 - this.#e.l
		};
	}
	#S() {
		const e = this.elements.surface, r = e.getContext("2d");
		if (!r) return;
		const { width: a, height: i } = e, s = r.createImageData(a, i);
		for (let e = 0; e < i; e++) for (let r = 0; r < a; r++) {
			const l = r / (a - 1), c = e / (i - 1), o = "rgb" === this.#e.colorSpace ? n(this.#r, l, 1 - c) : h({
				colorSpace: "oklch",
				l: 1 - c,
				c: l * t,
				h: this.#e.h,
				alpha: 1
			}), u = 4 * (e * a + r);
			s.data[u] = o.r, s.data[u + 1] = o.g, s.data[u + 2] = o.b, s.data[u + 3] = 255;
		}
		r.putImageData(s, 0, 0);
	}
	#c(e) {
		const t = new CustomEvent(e, {
			detail: {
				value: this.value,
				valueObject: this.valueObject
			},
			bubbles: !0,
			composed: !0
		});
		this.dispatchEvent(t);
	}
};
customElements.get("jb-color-picker") || customElements.define("jb-color-picker", S);
export { S as JBColorPickerWebComponent, t as MAX_OKLCH_CHROMA, r as clamp, d as colorToCss, u as convertColor, n as hsvToRgb, i as normalizeColor, a as normalizeHue, h as oklchToRgb, p as parseColor, s as rgbToHsv, o as rgbToOklch };

//# sourceMappingURL=jb-color-picker.js.map