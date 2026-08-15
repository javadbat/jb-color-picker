"use client";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var e = Object.create, r = Object.defineProperty, t = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, c = Object.getPrototypeOf, o = Object.prototype.hasOwnProperty;
let u = require("react");
var a, l, i;
function f(e, r, t, n = !1) {
	const c = (0, u.useCallback)(((r) => {
		e.current && "function" == typeof t && t(r);
	}), [e, t]);
	(0, u.useEffect)((() => {
		const t = e.current;
		return t && t.addEventListener(r, c, {
			passive: n,
			capture: !1
		}), function() {
			t && t.removeEventListener(r, c, {
				passive: n,
				capture: !1
			});
		};
	}), [
		e,
		r,
		t,
		n
	]);
}
l = 1, i = null != (a = u) ? e(c(a)) : {}, u = ((e, c, u, a) => {
	if (c && "object" == typeof c || "function" == typeof c) for (var l, i = n(c), f = 0, s = i.length; f < s; f++) l = i[f], o.call(e, l) || l === u || r(e, l, {
		get: ((e) => c[e]).bind(null, l),
		enumerable: !(a = t(c, l)) || a.enumerable
	});
	return e;
})(!l && a && a.__esModule ? i : r(i, "default", {
	value: a,
	enumerable: !0
}), a), require("jb-color-picker");
const s = u.default.forwardRef(((e, r) => {
	const t = (0, u.useRef)(null);
	(0, u.useImperativeHandle)(r, (() => t.current), []);
	const { value: n, colorSpace: c, alphaEnabled: o, disabled: a, onInput: l, onChange: i, ...s } = e;
	return (0, u.useEffect)((() => {
		t.current && void 0 !== n && (t.current.value = n);
	}), [n]), (0, u.useEffect)((() => {
		t.current && void 0 !== c && (t.current.colorSpace = c);
	}), [c]), (0, u.useEffect)((() => {
		t.current && void 0 !== o && (t.current.alphaEnabled = o);
	}), [o]), (0, u.useEffect)((() => {
		t.current && void 0 !== a && (t.current.disabled = a);
	}), [a]), f(t, "input", l), f(t, "change", i), u.default.createElement("jb-color-picker", {
		ref: t,
		...s
	});
}));
s.displayName = "JBColorPicker", exports.JBColorPicker = s;

//# sourceMappingURL=JBColorPicker.cjs.js.map