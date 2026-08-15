"use client";
import e, { useCallback as r, useEffect as n, useImperativeHandle as t, useRef as c } from "react";
import "jb-color-picker";
function o(e, t, c, o = !1) {
	const a = r(((r) => {
		e.current && "function" == typeof c && c(r);
	}), [e, c]);
	n((() => {
		const r = e.current;
		return r && r.addEventListener(t, a, {
			passive: o,
			capture: !1
		}), function() {
			r && r.removeEventListener(t, a, {
				passive: o,
				capture: !1
			});
		};
	}), [
		e,
		t,
		c,
		o
	]);
}
const a = e.forwardRef(((r, a) => {
	const u = c(null);
	t(a, (() => u.current), []);
	const { value: i, colorSpace: l, alphaEnabled: p, disabled: s, onInput: d, onChange: v, ...f } = r;
	return n((() => {
		u.current && void 0 !== i && (u.current.value = i);
	}), [i]), n((() => {
		u.current && void 0 !== l && (u.current.colorSpace = l);
	}), [l]), n((() => {
		u.current && void 0 !== p && (u.current.alphaEnabled = p);
	}), [p]), n((() => {
		u.current && void 0 !== s && (u.current.disabled = s);
	}), [s]), o(u, "input", d), o(u, "change", v), e.createElement("jb-color-picker", {
		ref: u,
		...f
	});
}));
a.displayName = "JBColorPicker";
export { a as JBColorPicker };

//# sourceMappingURL=JBColorPicker.js.map