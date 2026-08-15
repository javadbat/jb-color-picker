"use client";
(function(e, t) {
	"object" == typeof exports && "undefined" != typeof module ? t(exports, require("react"), require("jb-color-picker")) : "function" == typeof define && define.amd ? define([
		"exports",
		"react",
		"jb-color-picker"
	], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).JBColorPickerReact = {}, e.React, e.JBColorPicker);
})(this, (function(e, t, r) {
	Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
	var n, o, c, u = Object.create, a = Object.defineProperty, l = Object.getOwnPropertyDescriptor, i = Object.getOwnPropertyNames, f = Object.getPrototypeOf, p = Object.prototype.hasOwnProperty;
	function s(e, r, n, o = !1) {
		const c = (0, t.useCallback)(((t) => {
			e.current && "function" == typeof n && n(t);
		}), [e, n]);
		(0, t.useEffect)((() => {
			const t = e.current;
			return t && t.addEventListener(r, c, {
				passive: o,
				capture: !1
			}), function() {
				t && t.removeEventListener(r, c, {
					passive: o,
					capture: !1
				});
			};
		}), [
			e,
			r,
			n,
			o
		]);
	}
	o = 1, c = null != (n = t) ? u(f(n)) : {};
	const d = (t = ((e, t, r, n) => {
		if (t && "object" == typeof t || "function" == typeof t) for (var o, c = i(t), u = 0, f = c.length; u < f; u++) o = c[u], p.call(e, o) || o === r || a(e, o, {
			get: ((e) => t[e]).bind(null, o),
			enumerable: !(n = l(t, o)) || n.enumerable
		});
		return e;
	})(!o && n && n.__esModule ? c : a(c, "default", {
		value: n,
		enumerable: !0
	}), n)).default.forwardRef(((e, r) => {
		const n = (0, t.useRef)(null);
		(0, t.useImperativeHandle)(r, (() => n.current), []);
		const { value: o, colorSpace: c, alphaEnabled: u, disabled: a, onInput: l, onChange: i, ...f } = e;
		return (0, t.useEffect)((() => {
			n.current && void 0 !== o && (n.current.value = o);
		}), [o]), (0, t.useEffect)((() => {
			n.current && void 0 !== c && (n.current.colorSpace = c);
		}), [c]), (0, t.useEffect)((() => {
			n.current && void 0 !== u && (n.current.alphaEnabled = u);
		}), [u]), (0, t.useEffect)((() => {
			n.current && void 0 !== a && (n.current.disabled = a);
		}), [a]), s(n, "input", l), s(n, "change", i), t.default.createElement("jb-color-picker", {
			ref: n,
			...f
		});
	}));
	d.displayName = "JBColorPicker", e.JBColorPicker = d;
}));

//# sourceMappingURL=JBColorPicker.umd.js.map