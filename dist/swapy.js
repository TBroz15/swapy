var Ot = Object.defineProperty;
var Dt = (r, t, e) => t in r ? Ot(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var E = (r, t, e) => Dt(r, typeof t != "symbol" ? t + "" : t, e);
function Ct(r, t) {
  if (r.size !== t.size)
    return !1;
  for (let [e, i] of r)
    if (!t.has(e) || t.get(e) !== i)
      return !1;
  return !0;
}
let Wt = 0;
function qt() {
  return Wt++ + "";
}
var Ut = Object.defineProperty, Ht = (r, t, e) => t in r ? Ut(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, a = (r, t, e) => Ht(r, typeof t != "symbol" ? t + "" : t, e);
class K {
  constructor(t) {
    a(this, "x"), a(this, "y"), a(this, "target"), this.x = t.x, this.y = t.y, this.target = t.target;
  }
}
class Lt extends K {
}
class nt extends K {
}
class rt extends K {
}
class at extends K {
}
class Nt {
  constructor(t) {
    a(this, "pluginId"), a(this, "pluginName"), a(this, "viewName"), a(this, "dataName"), a(this, "dataValue"), this.event = t, this.pluginId = t.pluginId, this.pluginName = t.pluginName, this.viewName = t.viewName, this.dataName = t.dataName, this.dataValue = t.dataValue;
  }
}
function Yt(r) {
  return r.replace(/(?:^\w|[A-Z]|\b\w)/g, function(t, e) {
    return e === 0 ? t.toLowerCase() : t.toUpperCase();
  }).replace(/\s+/g, "").replace(/-+/g, "");
}
function yt(r) {
  return r.split("").map((t, e) => t.toUpperCase() === t ? `${e !== 0 ? "-" : ""}${t.toLowerCase()}` : t).join("");
}
class Y {
  constructor(t) {
    a(this, "node"), this.node = t.node;
  }
}
class Q {
  constructor(t) {
    a(this, "node"), this.node = t.node;
  }
}
class jt {
  constructor(t) {
    a(this, "_eventBus"), a(this, "_observer"), this._eventBus = t, this._observer = new MutationObserver(this._handler.bind(this)), this._observer.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeOldValue: !0
    });
  }
  _handler(t) {
    t.forEach((e) => {
      e.addedNodes.forEach((s) => {
        if (!(s instanceof HTMLElement) || s.dataset.velViewId || s.parentElement && typeof s.parentElement.dataset.velAdded < "u")
          return;
        let n = s;
        if (s.dataset.velView || (n = s.querySelector("[data-vel-view][data-vel-plugin]")), !n) return;
        this._eventBus.emitEvent(Y, { node: n });
        const o = n.querySelectorAll("[data-vel-plugin]");
        o.length && o.forEach((l) => {
          this._eventBus.emitEvent(Y, { node: l });
        });
      }), e.removedNodes.forEach((s) => {
        if (!(s instanceof HTMLElement) || typeof s.dataset.velProcessing < "u") return;
        const n = s.querySelectorAll("[data-vel-plugin]");
        n.length && n.forEach((o) => {
          this._eventBus.emitEvent(Q, { node: o });
        }), this._eventBus.emitEvent(Q, { node: s });
      });
      const i = e.attributeName;
      if (i === "data-vel-view" && this._eventBus.emitEvent(Y, {
        node: e.target
      }), i && /data-vel-data-.+/gi.test(i)) {
        const s = e.target, n = s.dataset.velPluginId || "", o = s.dataset.velPlugin || "", l = s.dataset.velView || "", h = s.getAttribute(i);
        if (h && h !== e.oldValue) {
          const g = Yt(
            i.replace("data-vel-data-", "")
          );
          this._eventBus.emitEvent(Nt, {
            pluginId: n,
            pluginName: o,
            viewName: l,
            dataName: g,
            dataValue: h
          });
        }
      }
    });
  }
}
class Xt {
  execute(t) {
    this.call(t);
  }
}
class Vt extends Xt {
  constructor(t) {
    super(), a(this, "_handler"), this._handler = t;
  }
  getHandler() {
    return this._handler;
  }
  call(t) {
    this._handler(t);
  }
}
class tt {
  constructor() {
    a(this, "_listeners", /* @__PURE__ */ new Map()), a(this, "_keyedListeners", /* @__PURE__ */ new Map());
  }
  subscribeToEvent(t, e, i) {
    if (i) {
      this._subscribeToKeyedEvent(t, e, i);
      return;
    }
    let s = this._listeners.get(t);
    s || (s = [], this._listeners.set(t, s)), s.push(new Vt(e));
  }
  removeEventListener(t, e, i) {
    if (i) {
      this._removeKeyedEventListener(t, e, i);
      return;
    }
    let s = this._listeners.get(t);
    s && (s = s.filter(
      (n) => n.getHandler() !== e
    ), this._listeners.set(t, s));
  }
  _subscribeToKeyedEvent(t, e, i) {
    let s = this._keyedListeners.get(t);
    s || (s = /* @__PURE__ */ new Map(), this._keyedListeners.set(t, s));
    let n = s.get(i);
    n || (n = [], s.set(i, n)), n.push(new Vt(e));
  }
  _removeKeyedEventListener(t, e, i) {
    let s = this._keyedListeners.get(t);
    if (!s)
      return;
    let n = s.get(i);
    n && (n = n.filter(
      (o) => o.getHandler() !== e
    ), s.set(i, n));
  }
  emitEvent(t, e, i) {
    if (i) {
      this._emitKeyedEvent(t, e, i);
      return;
    }
    const s = this._listeners.get(t);
    s && s.forEach((n) => {
      n.execute(e);
    });
  }
  _emitKeyedEvent(t, e, i) {
    const s = this._keyedListeners.get(t);
    if (!s) return;
    const n = s.get(i);
    n && n.forEach((o) => {
      o.execute(e);
    });
  }
  _convertListener(t) {
    return (e) => t(e);
  }
  subscribeToPluginReadyEvent(t, e, i = !1) {
    if (i) {
      this.subscribeToEvent(
        It,
        this._convertListener(t),
        e
      );
      return;
    }
    this.subscribeToEvent(
      Tt,
      this._convertListener(t),
      e
    );
  }
  emitPluginReadyEvent(t, e, i = !1) {
    if (i) {
      this.emitEvent(
        It,
        e,
        t
      );
      return;
    }
    this.emitEvent(
      Tt,
      e,
      t
    );
  }
  reset() {
    this._listeners.clear();
  }
}
let Kt = 0;
function St() {
  return Kt++ + "";
}
class Bt {
  constructor(t, e, i, s, n, o, l) {
    a(this, "_registry"), a(this, "_eventBus"), a(this, "_appEventBus"), a(this, "_internalEventBus"), a(this, "_initialized", !1), a(this, "_config"), a(this, "_pluginFactory"), a(this, "_pluginName"), a(this, "_id"), a(this, "_pluginKey"), a(this, "_layoutIdViewMapWaitingToEnter"), a(this, "_apiData"), a(this, "_isReady", !1), this._id = St(), this._pluginFactory = t, this._pluginName = e, this._registry = i, this._eventBus = s, this._appEventBus = n, this._internalEventBus = new tt(), this._config = o, this._layoutIdViewMapWaitingToEnter = /* @__PURE__ */ new Map(), this._pluginKey = l, this._apiData = {}, this._appEventBus.subscribeToPluginReadyEvent(
      () => {
        this._isReady = !0;
      },
      this._pluginName,
      !0
    );
  }
  get api() {
    return this._apiData;
  }
  _setApi(t) {
    this._apiData = t;
  }
  get pluginName() {
    return this._pluginName;
  }
  get pluginFactory() {
    return this._pluginFactory;
  }
  get pluginKey() {
    return this._pluginKey;
  }
  get id() {
    return this._id;
  }
  get config() {
    return { ...this._config };
  }
  getViews(t) {
    return t ? this._registry.getViewsByNameForPlugin(this, t) : this._registry.getViewsForPlugin(this);
  }
  getView(t) {
    return t ? this._registry.getViewsByNameForPlugin(this, t)[0] : this._registry.getViewsForPlugin(this)[0];
  }
  getViewById(t) {
    return this._registry.getViewById(t);
  }
  addView(t) {
    this._registry.assignViewToPlugin(t, this);
  }
  setInternalEventBus(t) {
    this._internalEventBus = t;
  }
  get internalBusEvent() {
    return this._internalEventBus;
  }
  emit(t, e) {
    this._internalEventBus.emitEvent(t, e, this.pluginKey);
  }
  on(t, e) {
    this._internalEventBus.subscribeToEvent(t, e, this.pluginKey);
  }
  removeListener(t, e) {
    this._internalEventBus.removeEventListener(t, e);
  }
  useEventPlugin(t, e = {}) {
    const i = this._registry.createPlugin(
      t,
      this._eventBus,
      e
    );
    return this._registry.associateEventPluginWithPlugin(this.id, i.id), i;
  }
  notifyAboutDataChanged(t) {
    this.onDataChanged(t);
  }
  // @ts-ignore
  onDataChanged(t) {
  }
  removeView(t) {
    t.onRemoveCallback ? this._invokeRemoveCallback(t) : this._deleteView(t), this.onViewRemoved(t);
  }
  _invokeRemoveCallback(t) {
    const e = this._createTemporaryView(t);
    requestAnimationFrame(() => {
      var i;
      (i = e.onRemoveCallback) == null || i.call(e, e, () => {
        var s, n;
        if ((s = t.onAddCallbacks) != null && s.afterRemoved && t.layoutId) {
          const o = this._layoutIdViewMapWaitingToEnter.get(
            t.layoutId
          );
          (n = o == null ? void 0 : o.onAddCallbacks) == null || n.afterEnter(o), this._layoutIdViewMapWaitingToEnter.delete(t.layoutId);
        }
        this._deleteView(e, !0);
      }), setTimeout(() => {
        e.element.parentElement && this._deleteView(e, !0);
      }, 1e4);
    });
  }
  _deleteView(t, e = !1) {
    (e || !t.layoutId) && (this._registry.removeViewById(t.id, this.id), t.element.remove());
  }
  // This is a temporary view for deleted view. We need to create it
  // to show it again so the user can animate it before it disappears.
  _createTemporaryView(t) {
    const e = t.previousRect.viewportOffset, i = t.previousRect.size, s = t.rotation.degrees < 0 ? 0 : Math.sin(t.rotation.radians) * i.height * t.scale.y, n = t.rotation.degrees > 0 ? 0 : Math.sin(t.rotation.radians) * i.width * t.scale.y, o = t.element.cloneNode(!0);
    t.element.remove(), o.style.cssText = "", o.style.position = "absolute", o.style.left = `${e.left + s}px`, o.style.top = `${e.top - n}px`, o.style.width = `${i.width}px`, o.style.height = `${i.height}px`, o.style.transform = `
      scale3d(${t.scale.x}, ${t.scale.y}, 1) rotate(${t.rotation.degrees}deg)
    `, o.style.pointerEvents = "none", o.dataset.velRemoved = "", document.body.appendChild(o);
    const l = this._registry.createView(o, t.name);
    return l.setAsTemporaryView(), l.styles.position = "absolute", l.styles.left = `${e.left + s}px`, l.styles.top = `${e.top - n}px`, l.rotation.setDegrees(t.rotation.degrees, !1), l.scale.set({ x: t.scale.x, y: t.scale.y }, !1), l.size.set(
      { width: t._localWidth, height: t._localHeight },
      !1
    ), t._copyAnimatorsToAnotherView(l), t.onRemoveCallback && l.onRemove(t.onRemoveCallback), l;
  }
  // @ts-ignore
  onViewRemoved(t) {
  }
  notifyAboutViewAdded(t) {
    this.onViewAdded(t), this._invokeAddCallbacks(t);
  }
  _invokeAddCallbacks(t) {
    var e, i, s;
    !((e = t.onAddCallbacks) != null && e.onInitialLoad) && !this._initialized || ((i = t.onAddCallbacks) == null || i.beforeEnter(t), !((s = t.onAddCallbacks) != null && s.afterRemoved) || !this._initialized ? requestAnimationFrame(() => {
      var n;
      (n = t.onAddCallbacks) == null || n.afterEnter(t);
    }) : t.layoutId && this._layoutIdViewMapWaitingToEnter.set(t.layoutId, t));
  }
  // @ts-ignore
  onViewAdded(t) {
  }
  init() {
    !this._initialized && this._isReady && (this.setup(), this._initialized = !0);
  }
  setup() {
  }
  // @ts-ignore
  subscribeToEvents(t) {
  }
}
class Gt extends Bt {
  isRenderable() {
    return !0;
  }
  isInitialized() {
    return this._initialized;
  }
  get initialized() {
    return this._initialized;
  }
  // @ts-ignore
  update(t, e) {
  }
  render() {
  }
  addView(t) {
    t.setPluginId(this.id), super.addView(t);
  }
}
class ot extends Bt {
  isRenderable() {
    return !1;
  }
}
class Zt {
  constructor(t) {
    a(this, "_plugin"), this._plugin = t;
  }
  get initialized() {
    return this._plugin.isInitialized();
  }
  get config() {
    return this._plugin.config;
  }
  setup(t) {
    this._plugin.setup = t;
  }
  api(t) {
    this._plugin._setApi(t);
  }
  update(t) {
    this._plugin.update = t;
  }
  render(t) {
    this._plugin.render = t;
  }
  getViews(t) {
    return this._plugin.getViews(t);
  }
  getView(t) {
    return this._plugin.getView(t);
  }
  getViewById(t) {
    return this._plugin.getViewById(t);
  }
  useEventPlugin(t, e = {}) {
    return this._plugin.useEventPlugin(t, e);
  }
  emit(t, e) {
    this._plugin.emit(t, e);
  }
  on(t, e) {
    this._plugin.on(t, e);
  }
  onDataChanged(t) {
    this._plugin.onDataChanged = t;
  }
  onViewRemoved(t) {
    this._plugin.onViewRemoved = t;
  }
  onViewAdded(t) {
    this._plugin.onViewAdded = t;
  }
  subscribeToEvents(t) {
    this._plugin.subscribeToEvents = t;
  }
}
function Z(r, t, e, i, s, n) {
  if (Jt(r))
    return new r(
      r,
      r.pluginName,
      t,
      e,
      i,
      s,
      n
    );
  const o = new Gt(
    r,
    r.pluginName,
    t,
    e,
    i,
    s,
    n
  ), l = new Zt(o);
  return r(l), o;
}
function Jt(r) {
  var t;
  return ((t = r.prototype) == null ? void 0 : t.constructor.toString().indexOf("class ")) === 0;
}
class u {
  constructor(t, e) {
    a(this, "x"), a(this, "y"), this.x = t, this.y = e;
  }
  get magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }
  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  get unitVector() {
    const t = new u(0, 0), e = this.magnitude;
    return e !== 0 && (t.x = this.x / e, t.y = this.y / e), t;
  }
  add(t) {
    this.x += t.x, this.y += t.y;
  }
  sub(t) {
    this.x -= t.x, this.y -= t.y;
  }
  scale(t) {
    this.x *= t, this.y *= t;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  clone() {
    return new u(this.x, this.y);
  }
  static scale(t, e) {
    return new u(t.x * e, t.y * e);
  }
  static sub(t, e) {
    return new u(t.x - e.x, t.y - e.y);
  }
  static add(t, e) {
    return new u(t.x + e.x, t.y + e.y);
  }
}
class Qt {
  constructor(t) {
    a(this, "_element"), a(this, "_callback"), this._element = t, this._observe();
  }
  setElement(t) {
    this._element = t, this._observe();
  }
  _observe() {
    var t;
    const e = new MutationObserver(() => {
      var n;
      (n = this._callback) == null || n.call(this, !1);
    }), i = {
      attributes: !0,
      childList: !0,
      attributeOldValue: !0
    };
    e.observe(this._element, i), new ResizeObserver(() => {
      var n;
      (n = this._callback) == null || n.call(this, !0);
    }).observe(this._element);
    function s(n, o) {
      let l, h = !0;
      return function() {
        h && (n(), h = !1), clearTimeout(l), l = setTimeout(() => {
          n(), h = !0;
        }, o);
      };
    }
    (t = this._element.parentElement) == null || t.addEventListener(
      "scroll",
      s(() => {
        var n;
        (n = this._callback) == null || n.call(this, !0);
      }, 30)
    ), window.addEventListener(
      "scroll",
      s(() => {
        var n;
        (n = this._callback) == null || n.call(this, !0);
      }, 30)
    ), window.addEventListener(
      "resize",
      s(() => {
        var n;
        (n = this._callback) == null || n.call(this, !0);
      }, 30)
    );
  }
  onChange(t) {
    this._callback = t;
  }
}
function te(r) {
  return new Qt(r);
}
function ee(r, t) {
  const e = t.x - r.x, i = t.y - r.y;
  return Math.sqrt(e * e + i * i);
}
function _(r, t) {
  const e = r - t;
  return Math.abs(e) <= 0.01;
}
function b(r) {
  let t = r.match(/^([\d.]+)([a-zA-Z%]*)$/);
  t || (t = "0px".match(/^([\d.]+)([a-zA-Z%]*)$/));
  const e = parseFloat(t[1]), i = t[2];
  return { value: e, unit: i, valueWithUnit: r };
}
function ie(r, t, e = !1) {
  if (r === t) return !0;
  if (r.length !== t.length) return !1;
  for (let i = 0; i < r.length; i++)
    if (e && !_(r[i].value, t[i].value) || r[i].value !== t[i].value)
      return !1;
  return !0;
}
function bt(r, t) {
  return ie(r, t, !0);
}
class z {
  constructor(t, e, i, s) {
    a(this, "_topLeft"), a(this, "_topRight"), a(this, "_bottomLeft"), a(this, "_bottomRight"), this._topLeft = t, this._topRight = e, this._bottomLeft = i, this._bottomRight = s;
  }
  get value() {
    return {
      topLeft: this._topLeft,
      topRight: this._topRight,
      bottomRight: this._bottomRight,
      bottomLeft: this._bottomLeft
    };
  }
  equals(t) {
    return _(this.value.topLeft.value, t.value.topLeft.value) && _(this.value.topRight.value, t.value.topRight.value) && _(this.value.bottomRight.value, t.value.bottomRight.value) && _(this.value.bottomLeft.value, t.value.bottomLeft.value);
  }
  toCssPercentageForNewSize(t) {
    const e = this._convertToPercentage(this._topLeft, t), i = this._convertToPercentage(this._topRight, t), s = this._convertToPercentage(this._bottomLeft, t), n = this._convertToPercentage(this._bottomRight, t);
    return `${e.h} ${i.h} ${n.h} ${s.h} / ${e.v} ${i.v} ${n.v} ${s.v}`;
  }
  _convertToPercentage(t, e) {
    if (t.unit === "%")
      return { h: `${t.value}%`, v: `${t.value}%` };
    const i = t.value / e.width * 100, s = t.value / e.height * 100;
    return { h: `${i}%`, v: `${s}%` };
  }
}
function et(r) {
  const t = r.split(" ").map((i) => b(i)), e = {
    value: 0,
    unit: "",
    valueWithUnit: "0"
  };
  switch (t.length) {
    case 1:
      return new z(t[0], t[0], t[0], t[0]);
    case 2:
      return new z(t[0], t[1], t[0], t[1]);
    case 3:
      return new z(t[0], t[1], t[2], t[1]);
    case 4:
      return new z(t[0], t[1], t[3], t[2]);
    default:
      return new z(
        e,
        e,
        e,
        e
      );
  }
}
function se(r, t) {
  const e = o(r.topLeft, t), i = o(r.topRight, t), s = o(r.bottomLeft, t), n = o(r.bottomRight, t);
  return {
    v: {
      topLeft: e.v,
      topRight: i.v,
      bottomRight: n.v,
      bottomLeft: s.v
    },
    h: {
      topLeft: e.h,
      topRight: i.h,
      bottomRight: n.h,
      bottomLeft: s.h
    }
  };
  function o(l, h) {
    if (l.unit === "%")
      return {
        h: b(`${l.value}%`),
        v: b(`${l.value}%`)
      };
    const g = l.value / h.width * 100, d = l.value / h.height * 100;
    return { h: b(`${g}%`), v: b(`${d}%`) };
  }
}
function Pt(r, t) {
  return _(r.topLeft.value, t.topLeft.value) && _(r.topRight.value, t.topRight.value) && _(r.bottomRight.value, t.bottomRight.value) && _(r.bottomLeft.value, t.bottomLeft.value);
}
class ne {
  constructor(t) {
    a(this, "_value"), this._value = t;
  }
  get value() {
    return this._value;
  }
  equals(t) {
    return _(this.value, t.value);
  }
}
function re(r) {
  return new ne(parseFloat(r));
}
class ae {
  constructor(t, e) {
    a(this, "_x"), a(this, "_y"), this._x = t, this._y = e;
  }
  get value() {
    return new u(this._x, this._y);
  }
}
function oe(r, t) {
  const [e, i] = r.split(" "), s = b(e), n = b(i);
  return new ae(
    s.value / t.width,
    n.value / t.height
  );
}
function Et(r, t) {
  const e = le(r), i = r.offsetWidth, s = r.offsetHeight;
  return {
    viewportOffset: {
      left: Math.round(e.left),
      top: Math.round(e.top),
      right: Math.round(e.right),
      bottom: Math.round(e.bottom)
    },
    pageOffset: t.read({
      width: i,
      height: s
    }),
    size: {
      width: i,
      height: s
    }
  };
}
function le(r) {
  const t = r.getBoundingClientRect();
  return {
    left: t.left,
    top: t.top,
    right: t.right,
    bottom: t.bottom,
    width: t.width,
    height: t.height
  };
}
function Rt(r) {
  let t = r, e = 0, i = 0;
  for (; t; )
    e += t.offsetTop, i += t.offsetLeft, t = t.offsetParent;
  return { top: e, left: i };
}
class he {
  constructor(t) {
    a(this, "_currentPageRect"), a(this, "_view"), a(this, "_element"), a(this, "_offsetLeft"), a(this, "_offsetTop"), a(this, "_width"), a(this, "_height"), a(this, "_parentWidth"), a(this, "_parentHeight"), a(this, "_parentEl"), a(this, "_isSvg"), a(this, "_invalid"), this._invalid = !0, this._view = t, this._element = t.element, this._isSvg = !!this._element.closest("svg"), this._offsetLeft = 0, this._offsetTop = 0, this._width = 0, this._height = 0, this._parentWidth = 0, this._parentHeight = 0, this._offsetLeft = 0, this._parentEl = this._element.parentElement, window.addEventListener("resize", () => {
      this.invalidate();
    });
  }
  invalidate() {
    this._invalid = !0;
  }
  read(t) {
    if (this._isSvg)
      return this._currentPageRect || (this._currentPageRect = Rt(this._element)), this._currentPageRect;
    const e = this._element.parentElement, i = this._element.offsetLeft, s = this._element.offsetTop, n = t.width, o = t.height, l = (e == null ? void 0 : e.offsetWidth) || 0, h = (e == null ? void 0 : e.offsetHeight) || 0;
    return (this._offsetLeft !== i || this._offsetTop !== s || !_(this._width, n) || !_(this._height, o)) && this._view._children.forEach(
      (g) => g.elementReader.invalidatePageRect()
    ), !this._invalid && this._currentPageRect && this._offsetLeft === i && this._offsetTop === s && _(this._width, n) && _(this._height, o) && _(this._parentWidth, l) && _(this._parentHeight, h) && this._parentEl === e ? this._currentPageRect : (this._offsetLeft = i, this._offsetTop = s, this._width = n, this._height = o, this._parentWidth = l, this._parentHeight = h, this._parentEl = e, this._currentPageRect = Rt(this._element), this._invalid = !1, this._currentPageRect);
  }
}
function ue(r) {
  return new he(r);
}
class ce {
  constructor(t) {
    a(this, "_element"), a(this, "_rect"), a(this, "_computedStyle"), a(this, "_pageRectReader"), a(this, "_scroll"), this._element = t.element, this._pageRectReader = ue(t), this._rect = Et(this._element, this._pageRectReader), this._computedStyle = getComputedStyle(this._element), this._scroll = this._calculateScroll();
  }
  invalidatePageRect() {
    this._pageRectReader.invalidate();
  }
  update(t = !1) {
    this._rect = Et(this._element, this._pageRectReader), this._computedStyle = getComputedStyle(this._element), t && (this._scroll = this._calculateScroll());
  }
  get rect() {
    return this._rect;
  }
  get opacity() {
    return re(this._computedStyle.opacity);
  }
  get borderRadius() {
    return et(this._computedStyle.borderRadius);
  }
  get origin() {
    return oe(
      this._computedStyle.transformOrigin,
      this._rect.size
    );
  }
  _calculateScroll() {
    let t = this._element, e = 0, i = 0;
    for (; t; )
      e += t.scrollTop, i += t.scrollLeft, t = t.offsetParent;
    return i += window.scrollX, e += window.scrollY, { y: e, x: i };
  }
  get scroll() {
    return this._scroll;
  }
}
function xt(r) {
  return new ce(r);
}
function it(r, t) {
  const e = {
    set: (i, s, n) => (typeof i[s] == "object" && i[s] !== null ? i[s] = it(n, t) : (t(), i[s] = n), !0),
    get: (i, s) => typeof i[s] == "object" && i[s] !== null ? it(i[s], t) : i[s]
  };
  return new Proxy(r, e);
}
const j = 0.01, lt = {
  speed: 15
};
class ht {
  constructor(t) {
    a(this, "name", "dynamic"), a(this, "_config"), this._config = t;
  }
  get config() {
    return this._config;
  }
}
class de extends ht {
  update({ animatorProp: t, current: e, target: i, dt: s }) {
    const n = u.sub(i, e), o = u.scale(n, this._config.speed);
    let l = u.add(e, u.scale(o, s));
    return this._shouldFinish(i, e, o) && (l = i, requestAnimationFrame(() => {
      t.callCompleteCallback();
    })), t.callUpdateCallback(), l;
  }
  _shouldFinish(t, e, i) {
    return u.sub(t, e).magnitude < j && i.magnitude < j;
  }
}
class ge extends ht {
  update({ animatorProp: t, current: e, target: i, dt: s }) {
    const n = (i - e) * this._config.speed;
    let o = e + n * s;
    return _(o, i) && (o = i, requestAnimationFrame(() => {
      t.callCompleteCallback();
    })), t.callUpdateCallback(), o;
  }
}
class pe extends ht {
  update({ animatorProp: t, current: e, target: i, dt: s }) {
    return i.map((n, o) => {
      const l = e[o], h = n.value === 0 ? l.unit : n.unit, g = (n.value - l.value) * this._config.speed, d = l.value + g * s;
      let p = b(`${d}${h}`);
      return this._shouldFinish(n.value, l.value, g) && (p = n, requestAnimationFrame(() => {
        t.callCompleteCallback();
      })), t.callUpdateCallback(), p;
    });
  }
  _shouldFinish(t, e, i) {
    return Math.abs(t - e) < j && Math.abs(i) < j;
  }
}
class ut {
  constructor() {
    a(this, "name", "instant"), a(this, "_config", {});
  }
  get config() {
    return this._config;
  }
  update(t) {
    return requestAnimationFrame(() => {
      t.animatorProp.callCompleteCallback();
    }), t.target;
  }
}
const ct = {
  stiffness: 0.5,
  damping: 0.75,
  speed: 10
}, X = 0.01;
class dt {
  constructor(t) {
    a(this, "name", "spring"), a(this, "_config"), this._config = t;
  }
  get config() {
    return this._config;
  }
}
class _e extends dt {
  constructor() {
    super(...arguments), a(this, "_velocity", new u(0, 0));
  }
  update({ animatorProp: t, current: e, target: i, dt: s }) {
    const n = u.scale(
      u.scale(u.sub(e, i), -1),
      this._config.stiffness
    );
    this._velocity = u.add(this._velocity, n), this._velocity = u.scale(this._velocity, this._config.damping);
    let o = u.add(
      e,
      u.scale(this._velocity, s * this._config.speed)
    );
    return this._shouldFinish(i, e) && (o = i, requestAnimationFrame(() => {
      t.callCompleteCallback();
    })), o;
  }
  _shouldFinish(t, e) {
    return u.sub(t, e).magnitude < X && this._velocity.magnitude < X;
  }
}
class me extends dt {
  constructor() {
    super(...arguments), a(this, "_velocity", 0);
  }
  update({ animatorProp: t, current: e, target: i, dt: s }) {
    const n = -(e - i) * this._config.stiffness;
    this._velocity += n, this._velocity *= this._config.damping;
    let o = e + this._velocity * s * this._config.speed;
    return _(o, i) && (o = i, requestAnimationFrame(() => {
      t.callCompleteCallback();
    })), o;
  }
}
class ve extends dt {
  constructor() {
    super(...arguments), a(this, "_velocity", 0);
  }
  update({ animatorProp: t, current: e, target: i, dt: s }) {
    return i.map((n, o) => {
      const l = e[o], h = n.value === 0 ? l.unit : n.unit, g = -(l.value - n.value) * this._config.stiffness;
      this._velocity += g, this._velocity *= this._config.damping;
      const d = l.value + this._velocity * s * this._config.speed;
      let p = b(`${d}${h}`);
      return this._shouldFinish(n.value, l.value) && (p = n, requestAnimationFrame(() => {
        t.callCompleteCallback();
      })), p;
    });
  }
  _shouldFinish(t, e) {
    return Math.abs(t - e) < X && Math.abs(this._velocity) < X;
  }
}
function fe(r) {
  return r;
}
const gt = {
  duration: 350,
  ease: fe
};
class pt {
  constructor(t) {
    a(this, "name", "tween"), a(this, "_config"), a(this, "_startTime"), this._config = t;
  }
  get config() {
    return this._config;
  }
  reset() {
    this._startTime = void 0;
  }
}
class we extends pt {
  update({ animatorProp: t, initial: e, target: i, ts: s }) {
    this._startTime || (this._startTime = s);
    const n = Math.min(1, (s - this._startTime) / this._config.duration);
    return _(n, 1) ? (requestAnimationFrame(() => {
      t.callCompleteCallback();
    }), i) : u.add(
      e,
      u.scale(u.sub(i, e), this._config.ease(n))
    );
  }
}
class ye extends pt {
  update({ animatorProp: t, initial: e, target: i, ts: s }) {
    this._startTime || (this._startTime = s);
    const n = Math.min(1, (s - this._startTime) / this._config.duration);
    return _(n, 1) ? (requestAnimationFrame(() => {
      t.callCompleteCallback();
    }), i) : e.map((o, l) => {
      const h = i[l], g = h.value === 0 ? o.unit : h.unit, d = o.value + this._config.ease(n) * (i[l].value - o.value);
      return b(`${d}${g}`);
    });
  }
}
class Ve extends pt {
  update({ animatorProp: t, initial: e, target: i, ts: s }) {
    this._startTime || (this._startTime = s);
    const n = Math.min(1, (s - this._startTime) / this._config.duration);
    return _(n, 1) ? (requestAnimationFrame(() => {
      t.callCompleteCallback();
    }), i) : e + (i - e) * this._config.ease(n);
  }
}
class _t {
  createAnimatorByName(t, e) {
    switch (t) {
      case "instant":
        return this.createInstantAnimator();
      case "dynamic":
        return this.createDynamicAnimator(e);
      case "tween":
        return this.createTweenAnimator(e);
      case "spring":
        return this.createSpringAnimator(e);
    }
    return this.createInstantAnimator();
  }
}
class H extends _t {
  createInstantAnimator() {
    return new ut();
  }
  createTweenAnimator(t) {
    return new we({ ...gt, ...t });
  }
  createDynamicAnimator(t) {
    return new de({ ...lt, ...t });
  }
  createSpringAnimator(t) {
    return new _e({ ...ct, ...t });
  }
}
class be extends _t {
  createInstantAnimator() {
    return new ut();
  }
  createTweenAnimator(t) {
    return new ye({ ...gt, ...t });
  }
  createDynamicAnimator(t) {
    return new pe({
      ...lt,
      ...t
    });
  }
  createSpringAnimator(t) {
    return new ve({ ...ct, ...t });
  }
}
class At extends _t {
  createInstantAnimator() {
    return new ut();
  }
  createDynamicAnimator(t) {
    return new ge({ ...lt, ...t });
  }
  createTweenAnimator(t) {
    return new Ve({ ...gt, ...t });
  }
  createSpringAnimator(t) {
    return new me({ ...ct, ...t });
  }
}
function O(r) {
  return structuredClone(r);
}
class Pe {
  constructor(t) {
    a(this, "_viewProp"), a(this, "_completeCallback"), a(this, "_updateCallback"), a(this, "_isAnimating"), this._viewProp = t, this._isAnimating = !1;
  }
  set(t, e) {
    this._viewProp.setAnimator(t, e);
  }
  get name() {
    return this._viewProp.getAnimator().name;
  }
  onComplete(t) {
    this._completeCallback = t;
  }
  get isAnimating() {
    return this._isAnimating;
  }
  markAsAnimating() {
    this._isAnimating = !0;
  }
  callCompleteCallback() {
    var t;
    (t = this._completeCallback) == null || t.call(this), this._isAnimating = !1;
  }
  onUpdate(t) {
    this._updateCallback = t;
  }
  callUpdateCallback() {
    var t;
    (t = this._updateCallback) == null || t.call(this);
  }
}
class C {
  constructor(t, e, i) {
    a(this, "_animatorProp"), a(this, "_animator"), a(this, "_initialValue"), a(this, "_previousValue"), a(this, "_targetValue"), a(this, "_currentValue"), a(this, "_hasChanged"), a(this, "_view"), a(this, "_animatorFactory"), a(this, "_previousRenderValue"), this._animatorProp = new Pe(this), this._animatorFactory = t, this._initialValue = O(e), this._previousValue = O(e), this._targetValue = O(e), this._currentValue = O(e), this._hasChanged = !1, this._previousRenderValue = void 0, this._view = i, this._animator = this._animatorFactory.createInstantAnimator();
  }
  get shouldRender() {
    return !0;
  }
  get isAnimating() {
    return this.animator.isAnimating;
  }
  getAnimator() {
    return this._animator;
  }
  get animator() {
    return this._animatorProp;
  }
  get _rect() {
    return this._view.rect;
  }
  get _previousRect() {
    return this._view.previousRect;
  }
  setAnimator(t, e) {
    this._animator = this._animatorFactory.createAnimatorByName(
      t,
      e
    );
  }
  _setTarget(t, e = !0) {
    var i, s;
    this._previousValue = O(this._currentValue), this._targetValue = t, e ? ((s = (i = this._animator).reset) == null || s.call(i), this.animator.markAsAnimating()) : this._currentValue = t, this._hasChanged = !0;
  }
  hasChanged() {
    return this._hasChanged;
  }
  destroy() {
    this._hasChanged = !1;
  }
  // @ts-ignore
  update(t, e) {
  }
}
class Ee extends C {
  constructor() {
    super(...arguments), a(this, "_invertedBorderRadius"), a(this, "_forceStyleUpdateThisFrame", !1), a(this, "_updateWithScale", !1);
  }
  setFromElementPropValue(t) {
    this._setTarget(
      [
        t.value.topLeft,
        t.value.topRight,
        t.value.bottomRight,
        t.value.bottomLeft
      ],
      !0
    );
  }
  enableUpdateWithScale() {
    this._updateWithScale = !0;
  }
  disableUpdateWithScale() {
    this._updateWithScale = !1;
  }
  get value() {
    return {
      topLeft: this._currentValue[0],
      topRight: this._currentValue[1],
      bottomRight: this._currentValue[2],
      bottomLeft: this._currentValue[3]
    };
  }
  get invertedBorderRadius() {
    return this._invertedBorderRadius;
  }
  set(t, e = !0) {
    let i;
    if (typeof t == "string") {
      const h = et(t.trim());
      i = {
        topLeft: h.value.topLeft.valueWithUnit,
        topRight: h.value.topRight.valueWithUnit,
        bottomRight: h.value.bottomRight.valueWithUnit,
        bottomLeft: h.value.bottomLeft.valueWithUnit
      };
    } else
      i = t;
    const s = i.topLeft ? b(i.topLeft) : this._currentValue[0], n = i.topRight ? b(i.topRight) : this._currentValue[1], o = i.bottomRight ? b(i.bottomRight) : this._currentValue[2], l = i.bottomLeft ? b(i.bottomLeft) : this._currentValue[3];
    this._setTarget([s, n, o, l], e);
  }
  reset(t = !0) {
    this._setTarget(this._initialValue, t);
  }
  update(t, e) {
    if (this._forceStyleUpdateThisFrame)
      this._hasChanged = !0, this._forceStyleUpdateThisFrame = !1;
    else if (this._view.scale.isAnimating && this._updateWithScale)
      this._hasChanged = !0;
    else if (bt(this._targetValue, this._currentValue)) {
      this._hasChanged = !bt(
        this._targetValue,
        this._initialValue
      );
      return;
    }
    this._currentValue = this._animator.update({
      animatorProp: this._animatorProp,
      current: this._currentValue,
      target: this._targetValue,
      initial: this._previousValue,
      ts: t,
      dt: e
    }), this._updateWithScale && this._applyScaleInverse();
  }
  applyScaleInverse() {
    this._updateWithScale && (this._forceStyleUpdateThisFrame = !0);
  }
  _applyScaleInverse() {
    if (_(this._view.scale.x, 1) && _(this._view.scale.y, 1))
      return;
    const t = this._rect.size.width * this._view.scale.x, e = this._rect.size.height * this._view.scale.y;
    this._invertedBorderRadius = se(
      et(
        `${this._currentValue[0].valueWithUnit} ${this._currentValue[1].valueWithUnit} ${this._currentValue[2].valueWithUnit} ${this._currentValue[3].valueWithUnit}`
      ).value,
      {
        width: t,
        height: e
      }
    );
  }
  get shouldRender() {
    return this._hasChanged ? this._previousRenderValue ? !(Pt(
      this.renderValue.v,
      this._previousRenderValue.v
    ) && Pt(this.renderValue.h, this._previousRenderValue.h)) : !0 : !1;
  }
  get renderValue() {
    return this.invertedBorderRadius ? {
      v: {
        topLeft: this.invertedBorderRadius.v.topLeft,
        topRight: this.invertedBorderRadius.v.topRight,
        bottomLeft: this.invertedBorderRadius.v.bottomLeft,
        bottomRight: this.invertedBorderRadius.v.bottomRight
      },
      h: {
        topLeft: this.invertedBorderRadius.h.topLeft,
        topRight: this.invertedBorderRadius.h.topRight,
        bottomLeft: this.invertedBorderRadius.h.bottomLeft,
        bottomRight: this.invertedBorderRadius.h.bottomRight
      }
    } : {
      v: {
        topLeft: this.value.topLeft,
        topRight: this.value.topRight,
        bottomLeft: this.value.bottomLeft,
        bottomRight: this.value.bottomRight
      },
      h: {
        topLeft: this.value.topLeft,
        topRight: this.value.topRight,
        bottomLeft: this.value.bottomLeft,
        bottomRight: this.value.bottomRight
      }
    };
  }
  projectStyles() {
    const t = this.renderValue, e = `border-radius: ${t.h.topLeft.valueWithUnit} ${t.h.topRight.valueWithUnit} ${t.h.bottomRight.valueWithUnit} ${t.h.bottomLeft.valueWithUnit} / ${t.v.topLeft.valueWithUnit} ${t.v.topRight.valueWithUnit} ${t.v.bottomRight.valueWithUnit} ${t.v.bottomLeft.valueWithUnit};`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !1;
  }
}
class Re extends C {
  setFromElementPropValue(t) {
    this._setTarget(t.value, !0);
  }
  get value() {
    return this._currentValue;
  }
  set(t, e = !0) {
    this._setTarget(t, e);
  }
  reset(t = !0) {
    this._setTarget(1, t);
  }
  update(t, e) {
    if (_(this._targetValue, this._currentValue)) {
      this._hasChanged = !_(this._targetValue, this._initialValue);
      return;
    }
    this._currentValue = this._animator.update({
      animatorProp: this._animatorProp,
      current: this._currentValue,
      target: this._targetValue,
      initial: this._previousValue,
      ts: t,
      dt: e
    });
  }
  get shouldRender() {
    return this._hasChanged ? typeof this._previousRenderValue > "u" ? !0 : this.renderValue !== this._previousRenderValue : !1;
  }
  get renderValue() {
    return this.value;
  }
  projectStyles() {
    const t = this.renderValue, e = `opacity: ${t};`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !1;
  }
}
class xe extends C {
  get x() {
    return this._currentValue.x;
  }
  get y() {
    return this._currentValue.y;
  }
  set(t) {
    const e = { x: this.x, y: this.y, ...t };
    if (e.x < 0 || e.x > 1) {
      console.log(
        `%c WARNING: ${this._view.name}.origin.x property can only be a value from 0 to 1`,
        "background: #885500"
      );
      return;
    }
    if (e.y < 0 || e.y > 1) {
      console.log(
        `%c WARNING: ${this._view.name}.origin.y property can only be a value from 0 to 1`,
        "background: #885500"
      );
      return;
    }
    this._setTarget(new u(e.x, e.y), !1);
  }
  reset() {
    this._setTarget(this._initialValue, !1);
  }
  get shouldRender() {
    if (!this._hasChanged)
      return !1;
    if (!this._previousRenderValue)
      return !0;
    const t = this.renderValue;
    return !(_(t.x, this._previousRenderValue.x) && _(t.y, this._previousRenderValue.y));
  }
  get renderValue() {
    return new u(this.x * 100, this.y * 100);
  }
  projectStyles() {
    const t = this.renderValue, e = `transform-origin: ${t.x}% ${t.y}%;`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !1;
  }
}
class Ae extends C {
  constructor() {
    super(...arguments), a(this, "_animateLayoutUpdateNextFrame", !1), a(this, "_parentScaleInverse", new u(1, 1));
  }
  get _parentDiff() {
    let t = this._view._parent, e = 0, i = 0;
    if (t) {
      const s = t.rect.pageOffset, n = t.getScroll(), o = {
        left: t.previousRect.viewportOffset.left + n.x,
        top: t.previousRect.viewportOffset.top + n.y
      };
      e = o.left - s.left, i = o.top - s.top;
    }
    return { parentDx: e, parentDy: i };
  }
  get x() {
    return this._currentValue.x + this._rect.pageOffset.left + this._parentDiff.parentDx;
  }
  get y() {
    return this._currentValue.y + this._rect.pageOffset.top + this._parentDiff.parentDy;
  }
  get initialX() {
    return this._rect.pageOffset.left;
  }
  get initialY() {
    return this._rect.pageOffset.top;
  }
  progressTo(t) {
    const e = typeof t.x > "u" ? this.initialX : t.x, i = typeof t.y > "u" ? this.initialY : t.y, s = new u(e, i), n = new u(this.initialX, this.initialY), o = new u(this.x, this.y), l = u.sub(o, n), h = u.sub(s, n);
    return 1 - u.sub(h, l).magnitude / h.magnitude;
  }
  set(t, e = !0) {
    const i = { x: this.x, y: this.y, ...t };
    this._setTarget(
      new u(
        i.x - this._rect.pageOffset.left,
        i.y - this._rect.pageOffset.top
      ),
      e
    );
  }
  reset(t = !0) {
    this._setTarget(new u(0, 0), t);
  }
  update(t, e) {
    if ((this._view.isInverseEffectEnabled || this._view.isLayoutTransitionEnabled) && !this._view.isTemporaryView && this._runLayoutTransition(), this._view.isInverseEffectEnabled) {
      const h = this._view._parent, g = h ? h.scale.x : 1, d = h ? h.scale.y : 1;
      this._parentScaleInverse = new u(1 / g, 1 / d), this._parentScaleInverse.equals(new u(1, 1)) || (this._hasChanged = !0);
    }
    if (this._targetValue.x === this._currentValue.x && this._targetValue.y === this._currentValue.y)
      return;
    const i = this._view._parent, s = i ? i.scale.x : 1, n = i ? i.scale.y : 1, o = i ? i.scale._previousValue.x : 1, l = i ? i.scale._previousValue.y : 1;
    this._currentValue = this._animator.update({
      animatorProp: this._animatorProp,
      current: new u(
        this._currentValue.x * s,
        this._currentValue.y * n
      ),
      target: this._targetValue,
      initial: new u(
        this._previousValue.x * o,
        this._previousValue.y * l
      ),
      ts: t,
      dt: e
    }), this._currentValue = new u(
      this._currentValue.x / s,
      this._currentValue.y / n
    );
  }
  _runLayoutTransition() {
    const t = !(this._targetValue.x === this._currentValue.x && this._targetValue.y === this._currentValue.y), e = !(this._view.scale._targetValue.x === this._view.scale._currentValue.x && this._view.scale._targetValue.y === this._view.scale._currentValue.y), i = t || e, s = this._rect.pageOffset.left - this._previousRect.pageOffset.left, n = this._rect.pageOffset.top - this._previousRect.pageOffset.top, o = this._previousRect.size.width / this._rect.size.width, l = this._previousRect.size.height / this._rect.size.height;
    let h = !1;
    if (s !== 0 || n !== 0 || !Number.isNaN(o) && o !== 1 || !Number.isNaN(l) && l !== 1 ? h = !0 : h = (() => {
      const g = this._view._parents;
      for (let d = 0; d < g.length; d++) {
        const p = g[d], w = p.previousRect.size.width / p.rect.size.width, v = p.previousRect.size.height / p.rect.size.height;
        if (w !== 1 || v !== 1)
          return !0;
      }
      return !1;
    })(), h) {
      if (this._currentValue.x !== 0 || this._currentValue.y !== 0 || this._view.scale._currentValue.x !== 1 || this._view.scale._currentValue.y !== 1) {
        if (!i) {
          const W = this._rect.pageOffset.left - this._previousRect.pageOffset.left, q = this._rect.pageOffset.top - this._previousRect.pageOffset.top;
          this._setTarget(
            new u(this._currentValue.x - W, this._currentValue.y - q),
            !1
          );
          return;
        }
        const c = this._view._parent, f = this._rect.pageOffset, m = this._view.getScroll(), R = {
          left: this._previousRect.viewportOffset.left + m.x,
          top: this._previousRect.viewportOffset.top + m.y
        }, T = R.left - f.left, F = R.top - f.top;
        let k = 0, x = 0, $ = 0, vt = 0;
        if (c) {
          const W = c.rect.pageOffset, q = c.getScroll(), U = {
            left: c.previousRect.viewportOffset.left + q.x,
            top: c.previousRect.viewportOffset.top + q.y
          };
          k = U.left - W.left, x = U.top - W.top;
          const ft = R.top - U.top, wt = R.left - U.left, $t = c.scale.y * ft;
          $ = (ft - $t) / c.scale.y;
          const zt = c.scale.x * wt;
          vt = (wt - zt) / c.scale.x;
        }
        this._setTarget(
          new u(T - k + vt, F - x + $),
          !1
        ), i && (this._animateLayoutUpdateNextFrame = !0);
        return;
      }
      this._animateLayoutUpdateNextFrame = !0;
      const g = this._previousRect, d = this._rect, p = this._view._parent;
      let w = 0, v = 0;
      p && (w = p.previousRect.viewportOffset.left - p.rect.viewportOffset.left), p && (v = p.previousRect.viewportOffset.top - p.rect.viewportOffset.top);
      let y = 1, V = 1;
      p && (y = p.previousRect.size.width / p.rect.size.width, V = p.previousRect.size.height / p.rect.size.height);
      const P = p ? p.previousRect.viewportOffset.left : 0, S = p ? p.previousRect.viewportOffset.top : 0, B = g.viewportOffset.left - P, M = g.viewportOffset.top - S, G = B / y - B, D = M / V - M;
      let A = g.viewportOffset.left - d.viewportOffset.left - w + G, L = g.viewportOffset.top - d.viewportOffset.top - v + D;
      A = Number.isFinite(A) ? A : 0, L = Number.isFinite(L) ? L : 0, this._setTarget(new u(A, L), !1);
    } else this._animateLayoutUpdateNextFrame && (this._setTarget(this._initialValue, !0), this._animateLayoutUpdateNextFrame = !1);
  }
  get shouldRender() {
    if (!this._hasChanged)
      return !1;
    if (!this._previousRenderValue)
      return !0;
    const t = this.renderValue;
    return !(_(t.x, this._previousRenderValue.x) && _(t.y, this._previousRenderValue.y));
  }
  get renderValue() {
    let t = 0, e = 0;
    return (this._view.isInverseEffectEnabled || this._view.isLayoutTransitionEnabled) && (t = (this._rect.size.width * this._parentScaleInverse.x * this._view.scale.x - this._rect.size.width) * this._view.origin.x, e = (this._rect.size.height * this._parentScaleInverse.y * this._view.scale.y - this._rect.size.height) * this._view.origin.y), new u(
      this._currentValue.x + t,
      this._currentValue.y + e
    );
  }
  projectStyles() {
    const t = this.renderValue, e = `translate3d(${t.x}px, ${t.y}px, 0px)`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !0;
  }
}
class Te extends C {
  constructor() {
    super(...arguments), a(this, "_unit", "deg");
  }
  get degrees() {
    let t = this._currentValue;
    return this._unit === "rad" && (t = t * (180 / Math.PI)), t;
  }
  get radians() {
    let t = this._currentValue;
    return this._unit === "deg" && (t = t * (Math.PI / 180)), t;
  }
  setDegrees(t, e = !0) {
    this._unit = "deg", this._setTarget(t, e);
  }
  setRadians(t, e = !0) {
    this._unit = "rad", this._setTarget(t, e);
  }
  reset(t = !0) {
    this._setTarget(0, t);
  }
  update(t, e) {
    this._targetValue !== this._currentValue && (this._currentValue = this._animator.update({
      animatorProp: this._animatorProp,
      current: this._currentValue,
      target: this._targetValue,
      initial: this._previousValue,
      ts: t,
      dt: e
    }));
  }
  get shouldRender() {
    if (!this._hasChanged)
      return !1;
    if (typeof this._previousRenderValue > "u")
      return !0;
    const t = this.renderValue;
    return !_(t, this._previousRenderValue);
  }
  get renderValue() {
    return this._currentValue;
  }
  projectStyles() {
    const t = this.renderValue, e = `rotate(${t}${this._unit})`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !0;
  }
}
class Ie extends C {
  constructor() {
    super(...arguments), a(this, "_animateLayoutUpdateNextFrame", !1);
  }
  get x() {
    return this._currentValue.x;
  }
  get y() {
    return this._currentValue.y;
  }
  set(t, e = !0) {
    const i = { x: this._currentValue.x, y: this._currentValue.y, ...typeof t == "number" ? { x: t, y: t } : t };
    this._setTarget(new u(i.x, i.y), e);
  }
  setWithSize(t, e = !0) {
    let i = this._currentValue.x, s = this._currentValue.y;
    t.width && (i = t.width / this._rect.size.width), t.height && (s = t.height / this._rect.size.height), !t.width && t.height && (i = s), !t.height && t.width && (s = i);
    const n = { x: i, y: s };
    this._setTarget(new u(n.x, n.y), e);
  }
  reset(t = !0) {
    this._setTarget(new u(1, 1), t);
  }
  update(t, e) {
    if (this._view.layoutOption !== "position") {
      if ((this._view.isInverseEffectEnabled || this._view.isLayoutTransitionEnabled) && !this._view.isTemporaryView && this._runLayoutTransition(), this._view.isInverseEffectEnabled) {
        const i = this._view._parent, s = i ? i.scale.x : 1, n = i ? i.scale.y : 1;
        this._hasChanged = s !== 1 || n !== 1;
      }
      this._targetValue.x === this._currentValue.x && this._targetValue.y === this._currentValue.y || (this._currentValue = this._animator.update({
        animatorProp: this._animatorProp,
        current: this._currentValue,
        target: this._targetValue,
        initial: new u(this._previousValue.x, this._previousValue.y),
        ts: t,
        dt: e
      }));
    }
  }
  _runLayoutTransition() {
    const t = !(this._targetValue.x === this._currentValue.x && this._targetValue.y === this._currentValue.y), e = this._previousRect.size.width / this._rect.size.width, i = this._previousRect.size.height / this._rect.size.height;
    let s = !1;
    if ((!Number.isNaN(e) && e !== 1 || !Number.isNaN(i) && i !== 1) && (s = !0), s) {
      if (this._currentValue.x !== 1 || this._currentValue.y !== 1) {
        const g = this._view.previousRect.size.width / this._view.rect.size.width, d = this._view.previousRect.size.height / this._view.rect.size.height;
        this._setTarget(
          new u(this._currentValue.x * g, this._currentValue.y * d),
          !1
        ), t && (this._animateLayoutUpdateNextFrame = !0);
        return;
      }
      const n = this._previousRect.size.width / this._rect.size.width, o = this._previousRect.size.height / this._rect.size.height, l = n, h = o;
      this._view.viewProps.borderRadius.applyScaleInverse(), this._setTarget(new u(l, h), !1), this._animateLayoutUpdateNextFrame = !0;
    } else this._animateLayoutUpdateNextFrame && (this._setTarget(this._initialValue, !0), this._animateLayoutUpdateNextFrame = !1);
  }
  get shouldRender() {
    if (!this._hasChanged)
      return !1;
    if (!this._previousRenderValue)
      return !0;
    const t = this.renderValue;
    return !(_(t.x, this._previousRenderValue.x) && _(t.y, this._previousRenderValue.y));
  }
  get renderValue() {
    const t = this._view._parent ? this._view._parent.scale.x : 1, e = this._view._parent ? this._view._parent.scale.y : 1, i = this._currentValue.x / t, s = this._currentValue.y / e;
    return new u(i, s);
  }
  projectStyles() {
    const t = this.renderValue, e = `scale3d(${t.x}, ${t.y}, 1)`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !0;
  }
}
class Ce extends C {
  get width() {
    return this._view.rect.size.width;
  }
  get height() {
    return this._view.rect.size.height;
  }
  get localWidth() {
    return this._currentValue.x;
  }
  get localHeight() {
    return this._currentValue.y;
  }
  get widthAfterScale() {
    const t = this._view.scale.x;
    return this.localWidth * t;
  }
  get heightAfterScale() {
    const t = this._view.scale.y;
    return this.localHeight * t;
  }
  get initialWidth() {
    return this._initialValue.x;
  }
  get initialHeight() {
    return this._initialValue.y;
  }
  set(t, e = !0) {
    const i = { width: this._currentValue.x, height: this._currentValue.y, ...t };
    this._setTarget(new u(i.width, i.height), e);
  }
  setWidth(t, e = !0) {
    const i = { width: this._currentValue.x, height: this._currentValue.y, width: t };
    this._setTarget(new u(i.width, i.height), e);
  }
  setHeight(t, e = !0) {
    const i = { width: this._currentValue.x, height: this._currentValue.y, height: t };
    this._setTarget(new u(i.width, i.height), e);
  }
  reset(t = !0) {
    this._setTarget(
      new u(this.initialWidth, this.initialHeight),
      t
    );
  }
  update(t, e) {
    this._targetValue.x === this._currentValue.x && this._targetValue.y === this._currentValue.y || (this._currentValue = this._animator.update({
      animatorProp: this._animatorProp,
      current: this._currentValue,
      target: this._targetValue,
      initial: this._previousValue,
      ts: t,
      dt: e
    }));
  }
  get shouldRender() {
    if (!this._hasChanged)
      return !1;
    if (!this._previousRenderValue)
      return !0;
    const t = this.renderValue;
    return !(_(t.x, this._previousRenderValue.x) && _(t.y, this._previousRenderValue.y));
  }
  get renderValue() {
    return new u(this._currentValue.x, this._currentValue.y);
  }
  projectStyles() {
    const t = this.renderValue, e = `width: ${t.x}px; height: ${t.y}px;`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !1;
  }
}
class Le {
  constructor(t) {
    a(this, "_props", /* @__PURE__ */ new Map()), this._props.set(
      "position",
      new Ae(new H(), new u(0, 0), t)
    ), this._props.set(
      "scale",
      new Ie(new H(), new u(1, 1), t)
    ), this._props.set(
      "rotation",
      new Te(new At(), 0, t)
    ), this._props.set(
      "size",
      new Ce(
        new H(),
        new u(t.rect.size.width, t.rect.size.height),
        t
      )
    ), this._props.set(
      "opacity",
      new Re(
        new At(),
        t.elementReader.opacity.value,
        t
      )
    ), this._props.set(
      "borderRadius",
      new Ee(
        new be(),
        [
          t.elementReader.borderRadius.value.topLeft,
          t.elementReader.borderRadius.value.topRight,
          t.elementReader.borderRadius.value.bottomRight,
          t.elementReader.borderRadius.value.bottomLeft
        ],
        t
      )
    ), this._props.set(
      "origin",
      new xe(
        new H(),
        t.elementReader.origin.value,
        t
      )
    );
  }
  allProps() {
    return Array.from(this._props.values());
  }
  allPropNames() {
    return Array.from(this._props.keys());
  }
  getPropByName(t) {
    return this._props.get(t);
  }
  get position() {
    return this._props.get("position");
  }
  get scale() {
    return this._props.get("scale");
  }
  get rotation() {
    return this._props.get("rotation");
  }
  get size() {
    return this._props.get("size");
  }
  get opacity() {
    return this._props.get("opacity");
  }
  get borderRadius() {
    return this._props.get("borderRadius");
  }
  get origin() {
    return this._props.get("origin");
  }
}
class Ne {
  constructor(t, e, i, s) {
    a(this, "id"), a(this, "name"), a(this, "element"), a(this, "styles", {}), a(this, "_viewProps"), a(this, "_previousRect"), a(this, "_onAddCallbacks"), a(this, "_onRemoveCallback"), a(this, "_skipFirstRenderFrame"), a(this, "_layoutTransition"), a(this, "_registry"), a(this, "_layoutId"), a(this, "_elementReader"), a(this, "_viewParents"), a(this, "_temporaryView"), a(this, "_inverseEffect"), a(this, "_renderNextTick"), a(this, "_layoutOption"), a(this, "_elementObserver"), a(this, "_hasReadElement"), a(this, "_shouldReadRect"), a(this, "_readWithScroll"), a(this, "_externalUserStyles"), this._registry = i, this.id = St(), this.name = e, this.element = t, this.element.dataset.velViewId = this.id, this._elementReader = xt(this), this._viewParents = this._getParents(), this._previousRect = this._elementReader.rect, this._viewProps = new Le(this), this._skipFirstRenderFrame = !0, this._layoutId = s, this._layoutTransition = !1, this._temporaryView = !1, this.styles = it(this.styles, () => {
      this._renderNextTick = !0;
    }), this._externalUserStyles = this._getExternalUserStyles(), this._renderNextTick = !1, this._layoutOption = this._getLayoutOption(), this._hasReadElement = !1, this._shouldReadRect = !1, this._readWithScroll = !1, this._elementObserver = te(t), this._elementObserver.onChange((n) => {
      if (this._hasReadElement) {
        this._shouldReadRect = !1;
        return;
      }
      this._externalUserStyles = this._getExternalUserStyles(), this._shouldReadRect = !0, this._readWithScroll = n;
    });
  }
  destroy() {
    this._viewProps.allProps().forEach((t) => t.destroy()), this.element.removeAttribute("data-vel-view-id"), this.element.removeAttribute("data-vel-plugin-id"), this._renderNextTick = !0;
  }
  get elementReader() {
    return this._elementReader;
  }
  get layoutOption() {
    return this._layoutOption;
  }
  _getLayoutOption() {
    return this.element.closest("[data-vel-layout-position]") ? "position" : this.element.closest("[data-vel-layout-size]") ? "size" : "all";
  }
  setElement(t) {
    this.element = t, this._elementReader = xt(this), this.element.dataset.velViewId = this.id, this._elementObserver.setElement(t), this._viewParents = this._getParents();
  }
  get layoutId() {
    return this._layoutId;
  }
  get position() {
    return this._viewProps.position;
  }
  get scale() {
    return this._viewProps.scale;
  }
  get _children() {
    const t = this.element.querySelectorAll("*");
    return Array.from(t).map((e) => e.dataset.velViewId).filter((e) => e && typeof e == "string").map((e) => this._registry.getViewById(e)).filter((e) => !!e);
  }
  get _parent() {
    return this._parents[0];
  }
  get _parents() {
    return this._viewParents;
  }
  _getParents() {
    var t;
    const e = [];
    let i = this.element.parentElement;
    if (!i) return e;
    for (i = i.closest("[data-vel-view-id]"); i; ) {
      const s = i.dataset.velViewId;
      if (s) {
        const n = this._registry.getViewById(s);
        n && e.push(n);
      }
      i = (t = i.parentElement) == null ? void 0 : t.closest(
        "[data-vel-view-id]"
      );
    }
    return e;
  }
  get rotation() {
    return this._viewProps.rotation;
  }
  get size() {
    return this._viewProps.size;
  }
  get _localWidth() {
    return this._viewProps.size.localWidth;
  }
  get _localHeight() {
    return this._viewProps.size.localHeight;
  }
  get opacity() {
    return this._viewProps.opacity;
  }
  get borderRadius() {
    return this._viewProps.borderRadius;
  }
  get origin() {
    return this._viewProps.origin;
  }
  get data() {
    const t = this.element.dataset;
    return Object.keys(t).filter((e) => e.includes("velData")).map((e) => e.replace("velData", "")).map((e) => `${e[0].toLowerCase()}${e.slice(1)}`).reduce((e, i) => {
      const s = t[`velData${i[0].toUpperCase()}${i.slice(1)}`];
      return !e[i] && s && (e[i] = s), e;
    }, {});
  }
  get onAddCallbacks() {
    return this._onAddCallbacks;
  }
  get onRemoveCallback() {
    return this._onRemoveCallback;
  }
  get isLayoutTransitionEnabled() {
    return this._layoutTransition;
  }
  get hasLayoutTransitionEnabledForParents() {
    return this._parents.some((t) => t.isLayoutTransitionEnabled);
  }
  get isInverseEffectEnabled() {
    let t = !1;
    for (let e = 0; e < this._parents.length; e++) {
      const i = this._parents[e];
      if (typeof i._inverseEffect < "u") {
        t = i._inverseEffect;
        break;
      }
    }
    return t;
  }
  layoutTransition(t) {
    this._layoutTransition = t, this.inverseEffect(t);
  }
  inverseEffect(t) {
    this._inverseEffect = t, t && this._children.forEach((e) => {
      if (e.position.animator.name === "instant") {
        const i = this.viewProps.position.getAnimator();
        e.position.setAnimator(
          i.name,
          i.config
        );
      }
      if (e.scale.animator.name === "instant") {
        const i = this.viewProps.scale.getAnimator();
        e.scale.setAnimator(i.name, i.config);
      }
    });
  }
  setAnimatorsFromParent() {
    let t = this._parent;
    for (; t && !t._inverseEffect; )
      t = t._parent;
    if (t) {
      if (this.position.animator.name === "instant") {
        const e = t.viewProps.position.getAnimator();
        this.position.setAnimator(e.name, e.config);
      }
      if (this.scale.animator.name === "instant") {
        const e = t.viewProps.scale.getAnimator();
        this.scale.setAnimator(e.name, e.config);
      }
    }
  }
  get _isRemoved() {
    return !this._registry.getViewById(this.id);
  }
  setPluginId(t) {
    this.element.dataset.velPluginId = t;
  }
  hasElement(t) {
    return this.element.contains(t);
  }
  getScroll() {
    return this._elementReader.scroll;
  }
  intersects(t, e) {
    const i = this.element.getBoundingClientRect(), s = {
      x: i.left,
      y: i.top
    };
    return t >= s.x && t <= s.x + i.width && e >= s.y && e <= s.y + i.height;
  }
  // Using AABB collision detection
  overlapsWith(t) {
    const e = t._localWidth * t.scale.x, i = t._localHeight * t.scale.y, s = this._localWidth * this.scale.x, n = this._localHeight * this.scale.y;
    return this.position.x < t.position.x + e && this.position.x + s > t.position.x && this.position.y < t.position.y + i && this.position.y + n > t.position.y;
  }
  distanceTo(t) {
    const e = new u(this.position.x, this.position.y), i = new u(t.position.x, t.position.y);
    return u.sub(i, e).magnitude;
  }
  read() {
    this._shouldReadRect && (this._elementReader.update(this._readWithScroll), this._children.forEach((t) => {
      t.setHasReadElement(!0), t.elementReader.update(this._readWithScroll);
    }), this._shouldReadRect = !1, this._readWithScroll = !1), this.setHasReadElement(!1);
  }
  setHasReadElement(t) {
    this._hasReadElement = t;
  }
  get rect() {
    return this._elementReader.rect;
  }
  get previousRect() {
    return this._previousRect;
  }
  update(t, e) {
    this._viewProps.allProps().forEach((i) => i.update(t, e));
  }
  _updatePreviousRect() {
    this._previousRect = this._elementReader.rect;
  }
  setAsTemporaryView() {
    this._temporaryView = !0;
  }
  get isTemporaryView() {
    return this._temporaryView;
  }
  get shouldRender() {
    return this._renderNextTick || this._viewProps.allProps().some((t) => t.shouldRender);
  }
  _cleanCssText(t) {
    const e = /* @__PURE__ */ new Map(), i = /([-\w]+)\s*:\s*([^;]+)\s*;?/g;
    let s;
    for (; (s = i.exec(t)) !== null; ) {
      const [n, o, l] = s;
      if (!l.trim()) continue;
      const h = o.replace(/^-\w+-/, "");
      (!e.has(h) || !o.startsWith("-")) && e.set(
        h,
        `${h}: ${l.trim()}`
      );
    }
    return Array.from(e.values()).join("; ");
  }
  render() {
    if (!this.shouldRender)
      return;
    if (this._isRemoved && this._skipFirstRenderFrame) {
      this._skipFirstRenderFrame = !1;
      return;
    }
    let t = "";
    const e = this._viewProps.allProps(), i = e.filter((n) => n.isTransform()), s = e.filter((n) => !n.isTransform());
    if (i.some((n) => n.hasChanged())) {
      const n = i.reduce((o, l, h) => (o += l.projectStyles(), h < i.length - 1 && (o += " "), h === i.length - 1 && (o += ";"), o), "transform: ");
      t += n;
    }
    s.forEach((n) => {
      n.hasChanged() && (t += n.projectStyles());
    }), t += this._getUserStyles(), this._cleanCssText(this.element.style.cssText) !== this._cleanCssText(t) && (this.element.style.cssText = t), this._renderNextTick = !1;
  }
  _getExternalUserStyles() {
    const t = this.element.style.cssText, e = this.styles;
    if (t.length === 0)
      return "";
    const i = [
      "transform",
      "transform-origin",
      "opacity",
      "width",
      "height",
      "border-radius"
    ], s = {};
    for (const n in e)
      e.hasOwnProperty(n) && (s[yt(n)] = e[n]);
    return t.split(";").map((n) => n.trim()).filter(Boolean).filter((n) => {
      const o = n.indexOf(":");
      if (o === -1) return !1;
      const l = n.slice(0, o).trim();
      return !s.hasOwnProperty(l) && !i.includes(l);
    }).join("; ");
  }
  _getUserStyles() {
    return Object.keys(this.styles).reduce((t, e) => {
      if (!e) return t;
      const i = yt(e).replace("webkit", "-webkit").replace("moz", "-moz");
      return t + `${i}: ${this.styles[e]}; `;
    }, this._externalUserStyles);
  }
  markAsAdded() {
    delete this.element.dataset.velProcessing;
  }
  onAdd(t) {
    this._onAddCallbacks = t;
  }
  onRemove(t) {
    this._onRemoveCallback = t;
  }
  get viewProps() {
    return this._viewProps;
  }
  getPropByName(t) {
    return this._viewProps.getPropByName(t);
  }
  _copyAnimatorsToAnotherView(t) {
    t.viewProps.allPropNames().forEach((e) => {
      var i, s;
      const n = (i = this.viewProps.getPropByName(e)) == null ? void 0 : i.getAnimator();
      n && ((s = t.viewProps.getPropByName(e)) == null || s.setAnimator(n.name, n.config));
    });
  }
  getChildren(t) {
    const e = this.element.querySelectorAll("*"), i = Array.from(e).filter((s) => {
      const n = s;
      return typeof n.dataset.velViewId < "u" && n.dataset.velView === t;
    }).map((s) => s.dataset.velViewId);
    return this._registry.getViewsById(i);
  }
  getChild(t) {
    return this.getChildren(t)[0];
  }
  getParent(t) {
    const e = this.element.closest(
      `[data-vel-view="${t}"]`
    );
    if (!e) return;
    const i = e.dataset.velViewId;
    if (i)
      return this._registry.getViewById(i);
  }
}
class Se {
  constructor(t, e) {
    a(this, "_appEventBus"), a(this, "_eventBus"), a(this, "_plugins", []), a(this, "_views", []), a(this, "_viewsPerPlugin", /* @__PURE__ */ new Map()), a(this, "_viewsToBeCreated", []), a(this, "_viewsToBeRemoved", []), a(this, "_viewsCreatedInPreviousFrame", []), a(this, "_layoutIdToViewMap", /* @__PURE__ */ new Map()), a(this, "_eventPluginsPerPlugin", /* @__PURE__ */ new Map()), a(this, "_pluginNameToPluginFactoryMap", /* @__PURE__ */ new Map()), a(this, "_pluginNameToPluginConfigMap", /* @__PURE__ */ new Map()), this._appEventBus = t, this._eventBus = e;
  }
  update() {
    this._handleRemovedViews(), this._handleAddedViews();
  }
  associateEventPluginWithPlugin(t, e) {
    let i = this._eventPluginsPerPlugin.get(t);
    i || (i = [], this._eventPluginsPerPlugin.set(t, i)), i.push(e);
  }
  _handleRemovedViews() {
    const t = this._viewsToBeRemoved.filter((e) => e.dataset.velViewId);
    t.length && (t.forEach((e) => {
      const i = e.dataset.velViewId;
      i && this._handleRemoveView(i);
    }), this._viewsToBeRemoved = []);
  }
  _getPluginNameForElement(t) {
    const e = t.dataset.velPlugin;
    if (e && e.length > 0) return e;
    const i = t.closest("[data-vel-plugin]");
    if (i)
      return i.dataset.velPlugin;
  }
  _getPluginIdForElement(t) {
    const e = this._getPluginNameForElement(t);
    if (!e)
      return;
    const i = t.closest("[data-vel-plugin-id]");
    if (i)
      return i.dataset.velPluginId;
    const s = this.getPluginByName(e);
    if (s)
      return s.id;
  }
  _isScopedElement(t) {
    const e = this._getPluginNameForElement(t);
    if (!e)
      return !1;
    const i = this._pluginNameToPluginFactoryMap.get(e), s = i == null ? void 0 : i.scope;
    return t.dataset.velView === s;
  }
  _removeElementsWithParent(t) {
    const e = new Set(t);
    return t.filter((i) => {
      let s = i.parentElement;
      for (; s; ) {
        if (e.has(s))
          return !1;
        s = s.parentElement;
      }
      return !0;
    });
  }
  _handleAddedViews() {
    this._viewsCreatedInPreviousFrame.forEach((n) => {
      n.markAsAdded();
    }), this._viewsCreatedInPreviousFrame = [];
    const t = this._removeElementsWithParent(
      this._viewsToBeCreated
    ), e = Array.from(
      new Set(
        t.filter(
          (n) => this._isScopedElement(n) && !this._isElementIgnored(n)
        )
      )
    ), i = t.filter(
      (n) => !this._isScopedElement(n) && !this._isElementIgnored(n)
    );
    this._viewsToBeCreated = [], e.forEach((n) => {
      const o = this._getPluginNameForElement(n), l = this._pluginNameToPluginFactoryMap.get(o), h = this._pluginNameToPluginConfigMap.get(o), g = n.dataset.velPluginKey, d = Z(
        l,
        this,
        this._eventBus,
        this._appEventBus,
        h,
        g
      );
      this._plugins.push(d);
      const p = n.dataset.velView, w = this._createNewView(n, p, d);
      w.isInverseEffectEnabled && w.setAnimatorsFromParent(), d.notifyAboutViewAdded(w);
    });
    const s = i.filter((n) => !!this._getPluginIdForElement(n));
    s.length !== 0 && s.forEach((n) => {
      const o = this._getPluginIdForElement(n), l = n.dataset.velView;
      if (!l || !o) return;
      const h = this._getPluginById(o);
      if (!h)
        return;
      const g = this._getLayoutIdForElement(n, h);
      let d;
      g && this._layoutIdToViewMap.has(g) ? (d = this._layoutIdToViewMap.get(g), d.setElement(n), d.setPluginId(h.id), this._createChildrenForView(d, h)) : d = this._createNewView(n, l, h), d.isInverseEffectEnabled && d.setAnimatorsFromParent(), h.notifyAboutViewAdded(d);
    });
  }
  _getLayoutIdForElement(t, e) {
    const i = t.dataset.velLayoutId;
    if (i)
      return `${i}-${e.id}`;
  }
  _createNewView(t, e, i) {
    const s = this._getLayoutIdForElement(t, i), n = this.createView(t, e, s);
    return i.addView(n), n.layoutId && this._layoutIdToViewMap.set(n.layoutId, n), this._createChildrenForView(n, i), this._appEventBus.emitPluginReadyEvent(i.pluginName, i.api, !0), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._appEventBus.emitPluginReadyEvent(i.pluginName, i.api);
      });
    }), n;
  }
  _createChildrenForView(t, e) {
    const i = t.element.querySelectorAll("*");
    if (i.length) {
      if (Array.from(i).some(
        (s) => this._getPluginNameForElement(s) !== e.pluginName
      )) {
        console.log(
          `%c WARNING: The plugin "${e.pluginName}" has view(s) created for a different plugin. Make sure all views inside that plugin don't have data-vel-plugin set or the pluginName is set to "${e.pluginName}"`,
          "background: #885500"
        );
        return;
      }
      Array.from(i).filter((s) => !this._isElementIgnored(s)).forEach((s) => {
        const n = s, o = n.dataset.velView ? n.dataset.velView : `${t.name}-child`, l = this._getLayoutIdForElement(n, e), h = this.createView(n, o, l);
        l && !this._layoutIdToViewMap.has(l) && this._layoutIdToViewMap.set(l, h), e.addView(h), e.notifyAboutViewAdded(h);
      });
    }
  }
  _handleRemoveView(t) {
    this._plugins.forEach((e) => {
      if (!this._viewsPerPlugin.get(e.id)) return;
      const i = this._getPluginViewById(e, t);
      i && e.removeView(i);
    });
  }
  removeViewById(t, e) {
    this._unassignViewFromPlugin(t, e), this._views = this._views.filter((i) => i.id !== t);
  }
  _unassignViewFromPlugin(t, e) {
    const i = this._viewsPerPlugin.get(e);
    if (!i) return;
    const s = i.indexOf(t);
    s !== -1 && i.splice(s, 1);
  }
  getViewById(t) {
    return this._views.find((e) => e.id === t);
  }
  getViewsById(t) {
    return this._views.filter((e) => t.includes(e.id));
  }
  _getPluginById(t) {
    return this._plugins.find((e) => e.id === t);
  }
  _getPluginViewById(t, e) {
    return this.getViewsForPlugin(t).find((i) => i.id === e);
  }
  destroy(t, e) {
    if (!t) {
      this._destroyAll(e);
      return;
    }
    let i = [];
    if (t && t.length > 0) {
      const s = this.getPluginByName(t);
      if (s) {
        const n = (this._eventPluginsPerPlugin.get(s.id) || []).map((o) => this._getPluginById(o)).filter((o) => typeof o < "u");
        i.push(s), i.push(...n);
      }
    } else
      i = this._plugins;
    i.forEach((s) => {
      this._destroyPlugin(s);
    }), requestAnimationFrame(() => {
      e == null || e();
    });
  }
  _destroyPlugin(t) {
    const e = this.getViewsForPlugin(t);
    e.forEach((i) => {
      i.layoutId && this._layoutIdToViewMap.delete(i.layoutId), i.destroy();
    }), this._views = this._views.filter(
      (i) => !e.find((s) => s.id === i.id)
    ), this._viewsPerPlugin.delete(t.id), this._plugins = this._plugins.filter((i) => i.id !== t.id);
  }
  _destroyAll(t) {
    this._views.forEach((e) => e.destroy()), requestAnimationFrame(() => {
      this._plugins = [], this._views = [], this._viewsPerPlugin.clear(), this._viewsToBeCreated = [], this._viewsToBeRemoved = [], this._viewsCreatedInPreviousFrame = [], this._layoutIdToViewMap.clear(), this._eventPluginsPerPlugin.clear(), t == null || t();
    });
  }
  reset(t, e) {
    let i = [];
    if (t && t.length > 0) {
      const s = this.getPluginByName(t);
      if (s) {
        const n = (this._eventPluginsPerPlugin.get(s.id) || []).map((o) => this._getPluginById(o)).filter((o) => typeof o < "u");
        i.push(s), i.push(...n);
      }
    } else
      i = this._plugins;
    requestAnimationFrame(() => {
      i.forEach((s) => {
        this._resetPlugin(s);
      }), requestAnimationFrame(() => {
        e == null || e();
      });
    });
  }
  _resetPlugin(t) {
    const e = t.config, i = t.pluginFactory, s = t.internalBusEvent, n = !t.isRenderable(), o = this.getViewsForPlugin(t);
    o.forEach((l) => {
      l.layoutId && this._layoutIdToViewMap.delete(l.layoutId), l.destroy();
    }), this._views = this._views.filter(
      (l) => !o.find((h) => h.id === l.id)
    ), this._viewsPerPlugin.delete(t.id), this._plugins = this._plugins.filter((l) => l.id !== t.id), n || requestAnimationFrame(() => {
      this.createPlugin(
        i,
        this._eventBus,
        e
      ).setInternalEventBus(s);
    });
  }
  queueNodeToBeCreated(t) {
    this._viewsToBeCreated.push(t);
  }
  queueNodeToBeRemoved(t) {
    this._viewsToBeRemoved.push(t);
  }
  notifyPluginAboutDataChange(t) {
    const e = this._plugins.filter(
      (i) => i.id === t.pluginId
    );
    !e || !e.length || e.forEach((i) => {
      i.notifyAboutDataChanged({
        dataName: t.dataName,
        dataValue: t.dataValue,
        viewName: t.viewName
      });
    });
  }
  getPlugins() {
    return this._plugins;
  }
  getRenderablePlugins() {
    function t(e) {
      return e.isRenderable();
    }
    return this._plugins.filter(t);
  }
  getPluginByName(t, e) {
    return this._plugins.find((i) => e ? i.pluginKey === e && i.pluginName === t : i.pluginName === t);
  }
  getPluginsByName(t, e) {
    return this._plugins.filter((i) => e ? i.pluginKey === e && i.pluginName === t : i.pluginName === t);
  }
  hasPlugin(t) {
    return t.pluginName ? !!this.getPluginByName(t.pluginName) : !1;
  }
  createPlugin(t, e, i = {}, s = !1) {
    if (!t.pluginName)
      throw Error(
        `Plugin ${t.name} must contain a pluginName field`
      );
    let n = [];
    if (t.scope) {
      const h = s ? `[data-vel-plugin=${t.pluginName}][data-vel-view=${t.scope}]:not([data-vel-plugin-id])` : `[data-vel-plugin=${t.pluginName}][data-vel-view=${t.scope}]`, g = document.querySelectorAll(h);
      this._pluginNameToPluginFactoryMap.has(t.pluginName) || this._pluginNameToPluginFactoryMap.set(
        t.pluginName,
        t
      ), this._pluginNameToPluginConfigMap.has(t.pluginName) || this._pluginNameToPluginConfigMap.set(t.pluginName, i), g ? n = Array.from(g) : n = [document.documentElement];
    } else
      n = [document.documentElement];
    const o = n.map((h) => {
      const g = h.dataset.velPluginKey, d = Z(
        t,
        this,
        e,
        this._appEventBus,
        i,
        g
      );
      this._plugins.push(d);
      let p = [];
      h !== document.documentElement && p.push(h);
      const w = h.querySelectorAll(
        `[data-vel-plugin=${d.pluginName}]`
      );
      p = [...p, ...w];
      const v = p.filter((y) => {
        if (this._isElementIgnored(y))
          return !1;
        if (!y.parentElement)
          return !0;
        const V = this._getPluginNameForElement(y.parentElement);
        return !(V && V.length > 0);
      });
      return v.length && v.forEach((y) => {
        const V = y.dataset.velView;
        if (!V) return;
        const P = this._createNewView(y, V, d);
        d.notifyAboutViewAdded(P);
      }), d;
    });
    if (o && o.length > 0)
      return o[0];
    const l = Z(
      t,
      this,
      e,
      this._appEventBus,
      i
    );
    return t.scope || console.log(
      `%c WARNING: The plugin "${l.pluginName}" is created but there are no elements using it on the page`,
      "background: #885500"
    ), l;
  }
  updatePlugin(t, e, i = {}) {
    return this.createPlugin(t, e, i, !0);
  }
  getViews() {
    return this._views;
  }
  createView(t, e, i) {
    const s = new Ne(t, e, this, i);
    return this._views.push(s), this._viewsCreatedInPreviousFrame.push(s), s;
  }
  _isElementIgnored(t) {
    return t.closest("[data-vel-ignore]");
  }
  assignViewToPlugin(t, e) {
    this._viewsPerPlugin.has(e.id) || this._viewsPerPlugin.set(e.id, []);
    const i = this._viewsPerPlugin.get(e.id);
    i.includes(t.id) || i.push(t.id);
  }
  getViewsForPlugin(t) {
    const e = this._viewsPerPlugin.get(t.id);
    return e ? e.map((i) => this._views.find((s) => s.id === i)).filter((i) => !!i) : [];
  }
  getViewsByNameForPlugin(t, e) {
    return this.getViewsForPlugin(t).filter(
      (i) => i.name === e
    );
  }
}
class Tt {
  constructor(t) {
    a(this, "pluginApi"), this.pluginApi = t.pluginApi;
  }
}
class It {
  constructor(t) {
    a(this, "pluginApi"), this.pluginApi = t.pluginApi;
  }
}
class mt {
  constructor() {
    a(this, "previousTime", 0), a(this, "registry"), a(this, "eventBus"), a(this, "appEventBus"), this.eventBus = new tt(), this.appEventBus = new tt(), this.registry = new Se(this.appEventBus, this.eventBus), new jt(this.eventBus);
  }
  static create() {
    return new mt();
  }
  addPlugin(t, e = {}) {
    this.registry.hasPlugin(t) || this.registry.createPlugin(t, this.eventBus, e);
  }
  updatePlugin(t, e = {}) {
    this.registry.hasPlugin(t) && this.registry.updatePlugin(t, this.eventBus, e);
  }
  reset(t, e) {
    this.registry.reset(t, e);
  }
  destroy(t, e) {
    this.registry.destroy(t, e);
  }
  getPlugin(t, e) {
    let i = typeof t == "string" ? t : t.pluginName;
    const s = this.registry.getPluginByName(i, e);
    if (!s)
      throw new Error(
        `You can't call getPlugin for ${i} with key: ${e} because it does not exist in your app`
      );
    return s.api;
  }
  getPlugins(t, e) {
    let i = typeof t == "string" ? t : t.pluginName;
    const s = this.registry.getPluginsByName(i, e);
    if (s.length === 0)
      throw new Error(
        `You can't call getPlugins for ${i} with key: ${e} because they don't exist in your app`
      );
    return s.map((n) => n.api);
  }
  onPluginEvent(t, e, i, s) {
    requestAnimationFrame(() => {
      const n = this.registry.getPluginByName(
        t.pluginName,
        s
      );
      n && n.on(e, i);
    });
  }
  removePluginEventListener(t, e, i) {
    const s = this.registry.getPluginByName(t.pluginName);
    s && s.removeListener(e, i);
  }
  run() {
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", this.start.bind(this)) : this.start();
  }
  start() {
    this.setup(), requestAnimationFrame(this.tick.bind(this));
  }
  setup() {
    this.listenToNativeEvents(), this.subscribeToEvents();
  }
  listenToNativeEvents() {
    document.addEventListener("click", (t) => {
      this.eventBus.emitEvent(Lt, {
        x: t.clientX,
        y: t.clientY,
        target: t.target
      });
    }), document.addEventListener("pointermove", (t) => {
      this.eventBus.emitEvent(nt, {
        x: t.clientX,
        y: t.clientY,
        target: t.target
      });
    }), document.addEventListener("pointerdown", (t) => {
      this.eventBus.emitEvent(rt, {
        x: t.clientX,
        y: t.clientY,
        target: t.target
      });
    }), document.addEventListener("pointerup", (t) => {
      this.eventBus.emitEvent(at, {
        x: t.clientX,
        y: t.clientY,
        target: t.target
      });
    });
  }
  tick(t) {
    let e = (t - this.previousTime) / 1e3;
    e > 0.016 && (e = 1 / 60), this.previousTime = t, this.eventBus.reset(), this.subscribeToEvents(), this.read(), this.update(t, e), this.render(), requestAnimationFrame(this.tick.bind(this));
  }
  subscribeToEvents() {
    this.eventBus.subscribeToEvent(Y, this.onNodeAdded.bind(this)), this.eventBus.subscribeToEvent(
      Q,
      this.onNodeRemoved.bind(this)
    ), this.eventBus.subscribeToEvent(
      Nt,
      this.onDataChanged.bind(this)
    ), this.registry.getPlugins().forEach((t) => {
      t.subscribeToEvents(this.eventBus);
    });
  }
  onNodeAdded({ node: t }) {
    this.registry.queueNodeToBeCreated(t);
  }
  onNodeRemoved({ node: t }) {
    this.registry.queueNodeToBeRemoved(t);
  }
  onDataChanged(t) {
    this.registry.notifyPluginAboutDataChange(t);
  }
  read() {
    this.registry.getViews().forEach((t) => {
      t.read();
    });
  }
  update(t, e) {
    this.registry.update(), this.registry.getPlugins().slice().reverse().forEach((i) => {
      i.init();
    }), this.registry.getRenderablePlugins().forEach((i) => {
      i.update(t, e);
    }), this.registry.getViews().forEach((i) => {
      i.update(t, e);
    }), this.registry.getViews().forEach((i) => {
      i._updatePreviousRect();
    });
  }
  render() {
    this.registry.getRenderablePlugins().forEach((t) => {
      t.render();
    }), this.registry.getViews().forEach((t) => {
      t.render();
    });
  }
}
function Be() {
  return mt.create();
}
class Mt {
  constructor(t) {
    a(this, "view"), a(this, "previousX"), a(this, "previousY"), a(this, "x"), a(this, "y"), a(this, "pointerX"), a(this, "pointerY"), a(this, "isDragging"), a(this, "target"), a(this, "directions", []), a(this, "width"), a(this, "height"), a(this, "distance"), a(this, "stopped"), this.props = t, this.previousX = t.previousX, this.previousY = t.previousY, this.x = t.x, this.y = t.y, this.pointerX = t.pointerX, this.pointerY = t.pointerY, this.width = t.width, this.height = t.height, this.distance = t.distance, this.view = t.view, this.isDragging = t.isDragging, this.stopped = t.stopped, this.target = t.target, this.directions = t.directions;
  }
}
class Ft extends ot {
  constructor() {
    super(...arguments), a(this, "_pointerX", 0), a(this, "_pointerY", 0), a(this, "_initialPointer", new u(0, 0)), a(this, "_initialPointerPerView", /* @__PURE__ */ new Map()), a(this, "_pointerDownPerView", /* @__PURE__ */ new Map()), a(this, "_viewPointerPositionLog", /* @__PURE__ */ new Map()), a(this, "_stopTimer", 0);
  }
  setup() {
    document.addEventListener("selectstart", this.onSelect.bind(this));
  }
  onSelect(t) {
    this._isDragging && t.preventDefault();
  }
  get _isDragging() {
    return Array.from(this._pointerDownPerView.values()).some(
      (t) => !!t
    );
  }
  subscribeToEvents(t) {
    t.subscribeToEvent(rt, ({ x: e, y: i }) => {
      this._initialPointer = new u(e, i), this.getViews().forEach((s) => {
        this._pointerDownPerView.set(s.id, s.intersects(e, i));
        const n = s.isLayoutTransitionEnabled ? s.position.initialX : s.position.x, o = s.isLayoutTransitionEnabled ? s.position.initialY : s.position.y, l = new u(e - n, i - o);
        this._pointerX = e, this._pointerY = i, this._initialPointerPerView.set(s.id, l);
      });
    }), t.subscribeToEvent(at, () => {
      this.getViews().forEach((e) => {
        this._pointerDownPerView.get(e.id) && this._initialPointerPerView.get(e.id) && (this._pointerDownPerView.set(e.id, !1), this._emitEvent(e, []));
      });
    }), t.subscribeToEvent(nt, ({ x: e, y: i }) => {
      this._pointerX = e, this._pointerY = i, this.getViews().forEach((s) => {
        if (this._pointerDownPerView.get(s.id) && this._initialPointerPerView.get(s.id)) {
          this._viewPointerPositionLog.has(s.id) || this._viewPointerPositionLog.set(s.id, []);
          const n = new u(e, i), o = this._viewPointerPositionLog.get(s.id);
          o && o.push(new u(e, i));
          const l = o && o.length >= 2 ? o[o.length - 2] : n.clone(), h = this._calculateDirections(
            l,
            n
          );
          this._emitEvent(s, h), clearTimeout(this._stopTimer), this._stopTimer = setTimeout(() => {
            this._emitEvent(s, h, !0);
          }, 120);
        }
      });
    });
  }
  _emitEvent(t, e, i = !1) {
    const s = this._viewPointerPositionLog.get(t.id), n = s && s.length >= 2 ? s[s.length - 2] : null, o = this._pointerX - this._initialPointerPerView.get(t.id).x, l = this._pointerY - this._initialPointerPerView.get(t.id).y, h = this._pointerX, g = this._pointerY, d = n ? n.x - this._initialPointerPerView.get(t.id).x : o, p = n ? n.y - this._initialPointerPerView.get(t.id).y : l, w = this._pointerY - this._initialPointer.y, v = this._pointerX - this._initialPointer.x, y = ee(this._initialPointer, {
      x: this._pointerX,
      y: this._pointerY
    }), V = this._pointerDownPerView.get(t.id) === !0;
    V || this._viewPointerPositionLog.clear();
    const P = {
      view: t,
      target: t.element,
      previousX: d,
      previousY: p,
      x: o,
      y: l,
      pointerX: h,
      pointerY: g,
      distance: y,
      width: v,
      height: w,
      isDragging: V,
      directions: e,
      stopped: i
    };
    this.emit(Mt, P);
  }
  _calculateDirections(t, e) {
    const i = {
      up: u.sub(new u(t.x, t.y - 1), t),
      down: u.sub(new u(t.x, t.y + 1), t),
      left: u.sub(new u(t.x - 1, t.y), t),
      right: u.sub(new u(t.x + 1, t.y), t)
    }, s = u.sub(e, t).unitVector;
    return [
      { direction: "up", projection: s.dot(i.up) },
      {
        direction: "down",
        projection: s.dot(i.down)
      },
      {
        direction: "left",
        projection: s.dot(i.left)
      },
      {
        direction: "right",
        projection: s.dot(i.right)
      }
    ].filter(
      (n) => n.projection > 0
    ).map(
      (n) => n.direction
    );
  }
}
a(Ft, "pluginName", "DragEventPlugin");
class Me {
  constructor(t) {
    a(this, "view"), a(this, "direction"), this.props = t, this.view = t.view, this.direction = t.direction;
  }
}
class Fe extends ot {
  constructor() {
    super(...arguments), a(this, "_viewIsPointerDownMap", /* @__PURE__ */ new Map()), a(this, "_viewPointerPositionLog", /* @__PURE__ */ new Map()), a(this, "_targetPerView", /* @__PURE__ */ new Map());
  }
  subscribeToEvents(t) {
    t.subscribeToEvent(rt, ({ x: e, y: i, target: s }) => {
      this.getViews().forEach((n) => {
        this._targetPerView.set(n.id, s), n.intersects(e, i) && this._viewIsPointerDownMap.set(n.id, !0);
      });
    }), t.subscribeToEvent(nt, ({ x: e, y: i }) => {
      this.getViews().forEach((s) => {
        this._viewIsPointerDownMap.get(s.id) && (this._viewPointerPositionLog.has(s.id) || this._viewPointerPositionLog.set(s.id, []), this._viewPointerPositionLog.get(s.id).push(new u(e, i)));
      });
    }), t.subscribeToEvent(at, ({ x: e, y: i }) => {
      this.getViews().forEach((n) => {
        if (!this._viewIsPointerDownMap.get(n.id) || !this._viewPointerPositionLog.has(n.id))
          return;
        const o = new u(e, i), l = this._viewPointerPositionLog.get(n.id), h = l[l.length - 2] || o.clone(), g = this._targetPerView.get(n.id), d = s(h, o);
        g && n.hasElement(g) && d.hasSwiped && this.emit(Me, {
          view: n,
          direction: d.direction
        }), this._viewPointerPositionLog.set(n.id, []), this._viewIsPointerDownMap.set(n.id, !1);
      });
      function s(n, o) {
        const l = {
          up: u.sub(new u(n.x, n.y - 1), n),
          down: u.sub(new u(n.x, n.y + 1), n),
          left: u.sub(new u(n.x - 1, n.y), n),
          right: u.sub(new u(n.x + 1, n.y), n)
        }, h = u.sub(o, n).unitVector, g = [
          "up",
          "down",
          "left",
          "right"
        ], d = [
          h.dot(l.up),
          h.dot(l.down),
          h.dot(l.left),
          h.dot(l.right)
        ], p = Math.max(...d), w = d.indexOf(p), v = g[w], y = u.sub(o, n).magnitude;
        return {
          hasSwiped: h.dot(l[v]) * y > 30,
          direction: v
        };
      }
    });
  }
}
a(Fe, "pluginName", "SwipeEventPlugin");
class ke {
  constructor(t) {
    a(this, "view"), this.props = t, this.view = t.view;
  }
}
class $e extends ot {
  subscribeToEvents(t) {
    t.subscribeToEvent(Lt, ({ x: e, y: i, target: s }) => {
      this.getViews().forEach((n) => {
        const o = s, l = n.element === o || n.element.contains(o);
        n.intersects(e, i) && l && this.emit(ke, {
          view: n
        });
      });
    });
  }
}
a($e, "pluginName", "ClickEventPlugin");
class st {
  constructor(t) {
    E(this, "data");
    this.data = t.data;
  }
}
class kt {
  constructor(t) {
    E(this, "data");
    this.data = t.data;
  }
}
function J(r) {
  return {
    map: new Map(r),
    array: Array.from(r).map(([e, i]) => ({ slotId: e, itemId: i })),
    object: Array.from(r).reduce(
      (e, [i, s]) => (e[i] = s, e),
      {}
    )
  };
}
function ze(r) {
  if (r.map)
    return {
      map: new Map(r.map),
      array: Array.from(r.map).map(([e, i]) => ({
        slotId: e,
        itemId: i
      })),
      object: Array.from(r.map).reduce(
        (e, [i, s]) => (e[i] = s, e),
        {}
      )
    };
  if (r.object) {
    const t = { ...r.object };
    return {
      map: new Map(Object.entries(t)),
      array: Object.entries(t).map(([e, i]) => ({
        slotId: e,
        itemId: i
      })),
      object: t
    };
  } else {
    const t = [...r.array];
    return {
      map: new Map(t.map(({ slotId: e, itemId: i }) => [e, i])),
      array: t,
      object: t.reduce((e, { slotId: i, itemId: s }) => (e[i] = s, e), {})
    };
  }
}
const N = (r) => {
  const t = r.useEventPlugin(Ft);
  t.on(Mt, L);
  let e, i, s, n, o = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), h, g, d, p, w = !0, v, y, V, P;
  r.api({
    setEnabled(c) {
      w = c;
    },
    setData(c) {
      const f = ze(c);
      o = new Map(f.map), l = new Map(o);
    }
  });
  function S() {
    return {
      animation: e.data.configAnimation,
      continuousMode: typeof e.data.configContinuousMode < "u",
      manualSwap: typeof e.data.configManualSwap < "u"
    };
  }
  function B() {
    const c = S().animation;
    return c === "dynamic" ? {
      animator: "dynamic",
      config: {}
    } : c === "spring" ? {
      animator: "spring",
      config: {
        damping: 0.7,
        stiffness: 0.62
      }
    } : c === "none" ? {
      animator: "instant",
      config: {}
    } : {
      animator: "instant",
      config: {}
    };
  }
  r.setup(() => {
    e = r.getView("root"), i = r.getViews("slot"), s = r.getViews("item"), y = S().continuousMode, V = S().manualSwap, i.forEach((c) => {
      M(c);
    }), D(), l = new Map(o), requestAnimationFrame(() => {
      r.emit(kt, { data: J(o) });
    });
  });
  function M(c) {
    const f = c.getChild("item");
    f && G(f), o.set(
      c.element.dataset.swapySlot,
      f ? f.element.dataset.swapyItem : null
    );
  }
  function G(c) {
    const f = B();
    c.styles.position = "relative", c.styles.userSelect = "none", c.styles.webkitUserSelect = "none", c.position.setAnimator(f.animator, f.config), c.scale.setAnimator(f.animator, f.config), c.layoutTransition(!0), requestAnimationFrame(() => {
      const m = c.getChild("handle");
      m ? (t.addView(m), m.styles.touchAction = "none") : (t.addView(c), c.styles.touchAction = "none");
    });
  }
  r.onViewAdded((c) => {
    if (r.initialized)
      if (c.name === "item") {
        s = r.getViews("item");
        const f = c.getParent("slot");
        M(f), D(), l = new Map(o), r.emit(st, { data: J(o) });
      } else c.name === "slot" && (i = r.getViews("slot"));
  });
  function D() {
    const c = B();
    r.getViews("root-child").forEach((m) => {
      m.position.setAnimator(c.animator, c.config), m.scale.setAnimator(c.animator, c.config), m.layoutTransition(!0);
    });
  }
  function A() {
    if (!v) return;
    if (!h || !g) {
      const T = n.getScroll();
      h = v.pointerX - n.position.x + T.x, g = v.pointerY - n.position.y + T.y;
    }
    (!d || !p) && (d = n.size.width, p = n.size.height);
    const c = n.size.width / d, f = n.size.height / p, m = h * (c - 1), R = g * (f - 1);
    n.position.set(
      {
        x: v.x - m,
        y: v.y - R
      },
      n.scale.x !== 1 || n.scale.y !== 1
    );
  }
  function L(c) {
    if (!w) return;
    n = c.view.name === "handle" ? c.view.getParent("item") : c.view, P || (P = n.getParent("slot")), c.isDragging ? (v = c, A(), i.forEach((m) => {
      var $;
      if (!m.intersects(c.pointerX, c.pointerY)) {
        m !== P && m.element.removeAttribute("data-swapy-highlighted");
        return;
      }
      if (typeof m.element.dataset.swapyHighlighted > "u" && (m.element.dataset.swapyHighlighted = ""), !P || !c.stopped && !y)
        return;
      const R = m.element.dataset.swapySlot, T = ($ = m.getChild("item")) == null ? void 0 : $.element.dataset.swapyItem, F = P.element.dataset.swapySlot, k = n.element.dataset.swapyItem;
      if (!R || !F || !k)
        return;
      const x = new Map(o);
      x.set(R, k), T ? x.set(F, T) : x.set(F, null), Ct(x, l) || (V || (o = x, l = new Map(o)), P = null, r.emit(st, { data: J(x) }));
    }), s.forEach((m) => {
      m.styles.zIndex = m === n ? "2" : "";
    })) : (i.forEach((m) => {
      m.element.removeAttribute("data-swapy-highlighted");
    }), n.position.reset(), P = null, h = null, g = null, d = null, p = null, v = null), requestAnimationFrame(() => {
      A();
    });
  }
};
N.pluginName = "Swapy";
N.scope = "root";
let I;
function Oe() {
  return I ? (I.updatePlugin(N), I) : (I = Be(), I.addPlugin(N), I.run(), I);
}
const De = {
  animation: "dynamic",
  continuousMode: !0,
  manualSwap: !1
};
function We(r) {
  let t = !0;
  const e = r.querySelectorAll("[data-swapy-slot]");
  return e.length === 0 && (console.error("There are no slots defined in your root element:", r), t = !1), e.forEach((i) => {
    const s = i, n = s.dataset.swapySlot;
    (!n || n.length === 0) && (console.error(i, "does not contain a slotId using data-swapy-slot"), t = !1);
    const o = s.children;
    o.length > 1 && (console.error(
      "slot:",
      `"${n}"`,
      "cannot contain more than one element"
    ), t = !1);
    const l = o[0];
    l && (!l.dataset.swapyItem || l.dataset.swapyItem.length === 0) && (console.error(
      "slot:",
      `"${n}"`,
      "does not contain an element with item id using data-swapy-item"
    ), t = !1);
  }), t;
}
function qe(r, t = {}) {
  const e = qt();
  return r.dataset.velPluginKey = e, r.dataset.velPlugin = "Swapy", r.dataset.velView = "root", r.dataset.velDataConfigAnimation = t.animation, t.continuousMode && (r.dataset.velDataConfigContinuousMode = "true"), t.manualSwap && (r.dataset.velDataConfigManualSwap = "true"), Array.from(
    r.querySelectorAll("[data-swapy-slot]")
  ).forEach((l) => {
    l.dataset.velView = "slot";
  }), Array.from(
    r.querySelectorAll("[data-swapy-item]")
  ).forEach((l) => {
    l.dataset.velView = "item", l.dataset.velLayoutId = l.dataset.swapyItem;
    const h = l.querySelector("[data-swapy-handle]");
    h && (h.dataset.velView = "handle");
  }), Array.from(
    r.querySelectorAll("[data-swapy-text]")
  ).forEach((l) => {
    l.dataset.velLayoutPosition = "";
  }), Array.from(
    r.querySelectorAll("[data-swapy-exclude]")
  ).forEach((l) => {
    l.dataset.velIgnore = "";
  }), e;
}
function Ue(r) {
  const t = Array.from(
    r.querySelectorAll("[data-swapy-slot]:not([data-vel-view])")
  );
  t.forEach((i) => {
    i.dataset.velView = "slot";
  });
  const e = Array.from(
    r.querySelectorAll("[data-swapy-item]:not([data-vel-view]")
  );
  return e.forEach((i) => {
    i.dataset.velView = "item", i.dataset.velLayoutId = i.dataset.swapyItem;
    const s = i.querySelector("[data-swapy-handle]");
    s && (s.dataset.velView = "handle"), Array.from(
      i.querySelectorAll("[data-swapy-text]")
    ).forEach((l) => {
      l.dataset.velLayoutPosition = "";
    }), Array.from(
      i.querySelectorAll("[data-swapy-exclude]")
    ).forEach((l) => {
      l.dataset.velIgnore = "";
    });
  }), e.length > 0 || t.length > 0;
}
function je(r, t = {}) {
  if (!r)
    throw new Error(
      "Cannot create a Swapy instance because the element you provided does not exist on the page!"
    );
  const e = { ...De, ...t }, i = r;
  if (!We(i))
    throw new Error(
      "Cannot create a Swapy instance because your HTML structure is invalid. Fix all above errors and then try!"
    );
  const s = qe(i, e), n = new He(i, s, e);
  return {
    onSwap(o) {
      n.setSwapCallback(o);
    },
    enable(o) {
      n.setEnabled(o);
    },
    destroy() {
      n.destroy();
    },
    setData(o) {
      n.setData(o);
    }
  };
}
class He {
  constructor(t, e, i) {
    E(this, "_rootEl");
    E(this, "_veloxiApp");
    E(this, "_slotElMap");
    E(this, "_itemElMap");
    E(this, "_swapCallback");
    E(this, "_previousMap");
    E(this, "_pluginKey");
    this._rootEl = t, this._veloxiApp = Oe(), this._slotElMap = this._createSlotElMap(), this._itemElMap = this._createItemElMap(), this._pluginKey = e, this._veloxiApp.onPluginEvent(
      N,
      kt,
      ({ data: s }) => {
        this._previousMap = s.map;
      },
      e
    ), this._veloxiApp.onPluginEvent(
      N,
      st,
      (s) => {
        var n;
        this._previousMap && Ct(this._previousMap, s.data.map) || (i.manualSwap || this._applyOrder(s.data.map), this._previousMap = s.data.map, (n = this._swapCallback) == null || n.call(this, s));
      },
      e
    ), this.setupMutationObserver();
  }
  setupMutationObserver() {
    new MutationObserver((e) => {
      e.some((i) => i.type === "childList") && Ue(this._rootEl) && (this._slotElMap = this._createSlotElMap(), this._itemElMap = this._createItemElMap());
    }).observe(this._rootEl, {
      childList: !0,
      subtree: !0
    });
  }
  setData(t) {
    try {
      this._veloxiApp.getPlugin(
        "Swapy",
        this._pluginKey
      ).setData(t);
    } catch {
    }
  }
  destroy() {
    this._veloxiApp.destroy("Swapy");
  }
  setEnabled(t) {
    try {
      this._veloxiApp.getPlugin(
        "Swapy",
        this._pluginKey
      ).setEnabled(t);
    } catch {
    }
  }
  setSwapCallback(t) {
    this._swapCallback = t;
  }
  _applyOrder(t) {
    Array.from(t.keys()).forEach((e) => {
      var o;
      if (t.get(e) === ((o = this._previousMap) == null ? void 0 : o.get(e)))
        return;
      const i = t.get(e);
      if (!i) return;
      const s = this._slotElMap.get(e), n = this._itemElMap.get(i);
      !s || !n || (s.innerHTML = "", s.appendChild(n));
    });
  }
  _createSlotElMap() {
    return Array.from(
      this._rootEl.querySelectorAll("[data-swapy-slot]")
    ).reduce((t, e) => (t.set(e.dataset.swapySlot, e), t), /* @__PURE__ */ new Map());
  }
  _createItemElMap() {
    return Array.from(
      this._rootEl.querySelectorAll("[data-swapy-item]")
    ).reduce((t, e) => (t.set(e.dataset.swapyItem, e), t), /* @__PURE__ */ new Map());
  }
}
export {
  je as createSwapy
};
