var tourLanguage,
  krpano = null,
  debug = !1,
  krpanoLoaded = !1,
  pluginLoaded = new ktools.Map(),
  isTourStarted = !1,
  kolorFullscreen = null,
  kolorBrowserDetect = null,
  kolorStartIndex = 4e3,
  crossDomainTargetUrl = "";
function krPanoFullscreenEnter() {
  null !== getKrpano() &&
    getKrpano().call("enterFullScreenFallback");
}
function krPanoFullscreenExit() {
  var e = getKrpano();
  null !== e && e.call("exitFullScreenFallback");
}
function krpanoFullscreenChange(e) {
  null !== getKrpano() &&
    (e
      ? getKrpano().call("enterFullScreenChangeEvent")
      : getKrpano().call("exitFullScreenChangeEvent"));
}
function krPanoFullscreenResize() {
  null !== getKrpano() &&
    getKrpano().call("resizeFullScreenEvent");
}
function setFullscreen(e) {
  var n;
  (n = "string" == typeof e ? "true" == e.toLowerCase() : Boolean(e)),
    kolorFullscreen && (n ? kolorFullscreen.request() : kolorFullscreen.exit());
}
function getKrpano() {
  return (
    null == krpano && (krpano = document.getElementById("krpanoSWFObject")),
    krpano
  );
}
function invokeKrFunction(e) {
  for (
    var n = [].slice.call(arguments, 1), o = e + "(", t = 0, a = n.length;
    t < a;
    t++
  )
    (o += n[t]), t != a - 1 && (o += ", ");
  (o += ");"), null !== getKrpano() && getKrpano().call(o);
}
function getKrValue(e, n) {
  if (void 0 === e) return e;
  if (null === getKrpano()) return null;
  if (null == getKrpano().get(e)) return null;
  switch (n) {
    case "int":
      return parseInt(getKrpano().get(e));
    case "float":
      return parseFloat(getKrpano().get(e));
    case "string":
      return String(getKrpano().get(e));
    case "bool":
      return Boolean(
        "true" === getKrpano().get(e) ||
          1 === parseInt(getKrpano().get(e)) ||
          "yes" === getKrpano().get(e) ||
          "on" === getKrpano().get(e)
      );
    default:
      return getKrpano().get(e);
  }
}
function invokePluginFunction(e, n) {
  debug && console.log("invokePluginFunction(" + e + ", " + n + ")");
  var o = ktools.KolorPluginList.getInstance().getPlugin(e);
  if (null == o)
    return (
      debug &&
        console.log("invokePluginFunction: plugin instance doesn't exist"),
      pluginLoaded && pluginLoaded.item(e)
        ? pluginLoaded.update(e, arguments)
        : pluginLoaded.add(e, arguments),
      !1
    );
  var t = o.getRegistered();
  if (null == t)
    return (
      debug && console.log("invokePluginFunction: plugin isn't registered"),
      pluginLoaded && pluginLoaded.item(e)
        ? pluginLoaded.update(e, arguments)
        : pluginLoaded.add(e, arguments),
      !1
    );
  var a = [].slice.call(arguments, 2);
  return t[n](a);
}
function eventKrpanoLoaded(e) {
  if ((debug && console.log("krpano is loaded"), krpanoLoaded)) return !1;
  void 0 === (tourLanguage = getKrValue("tour_language", "string")) &&
    (tourLanguage = "vi"),
    ktools.I18N.getInstance().initLanguage(
      tourLanguage,
      crossDomainTargetUrl + "data/messages_",
      ".xml"
    ),
    (krpanoLoaded = !0);
}
function eventUnloadPlugins() {
  resetValuesForPlugins(),
    deleteKolorMap("panotourmaps"),
    deleteKolorArea("panotourmapsArea");
}
function resetValuesForPlugins() {
  (krpano = null),
    (krpanoLoaded = !1),
    (isTourStarted = !1),
    (pluginLoaded = new ktools.Map()),
    (kolorStartIndex = 4e3);
}
function eventTourStarted() {
  debug && console.log("tour is started"), (isTourStarted = !0);
}
function eventTourChangeLanguage(e) {
  debug && console.log("change tour language : " + e),
    ktools.I18N.getInstance().initLanguage(
      e,
      crossDomainTargetUrl + "data/messages_",
      ".xml"
    );
}
debug && "undefined" == typeof console && (console = { log: function (e) {} }),
  jQuery(document).ready(function () {
    (kolorBrowserDetect = new ktools.BrowserDetect()).init(),
      (kolorFullscreen = new ktools.Fullscreen(
        document.getElementById("tourDIV")
      )).supportsFullscreen(),
      kolorFullscreen.setExternal({
        enter: krPanoFullscreenEnter,
        exit: krPanoFullscreenExit,
        change: krpanoFullscreenChange,
        resize: krPanoFullscreenResize,
      });
  });
var KolorMapApiProviders = new Object();
(KolorMapApiProviders.Type = {
  googlev3: "googlev3",
  openlayersv2: "openlayersv2",
  microsoftv7: "microsoftv7",
  yandexv2: "yandexv2",
}),
  (KolorMapApiProviders.Url = {
    googlev3: "//maps.googleapis.com/maps/api/js?callback=handleApiReady",
    openlayersv2:
      "//cdnjs.cloudflare.com/ajax/libs/openlayers/2.12/OpenLayers.js",
    microsoftv7: "//www.bing.com/api/maps/mapcontrol/?callback=handleApiReady",
    yandexv2:
      "//api-maps.yandex.ru/2.0-stable/?load=package.full&lang=ru-RU&onload=handleApiReady",
  }),
  (KolorMapApiProviders.Key = {
    googlev3: "&key=",
    openlayersv2: "",
    microsoftv7: "",
    yandexv2: "&key=",
  }),
  (KolorMapApiProviders.Script = {
    googlev3: "mxn.googlev3.core.js",
    openlayersv2: "mxn.openlayersv2.core.js",
    microsoftv7: "mxn.microsoftv7.core.js",
    yandexv2: "mxn.yandexv2.core.js",
  });
var mapLoaded = new ktools.Map(),
  mapLoadedCounter = new ktools.Map(),
  mapPluginApiReadyCheck = new Array(),
  mapMarkerDefault = new ktools.Map(),
  mapInstance = new ktools.Map(),
  mapInitCounter = new ktools.Map(),
  refreshIE = "";
if ("Microsoft Internet Explorer" == navigator.appName) {
  var timestamp = new Date().getTime();
  refreshIE = "?v=" + timestamp;
}
var microsoftv7_key = "";
function handleApiReady() {
  var e = mapPluginApiReadyCheck[0];
  if (
    (debug && console.log("Proprietary map API is loaded for " + e), null != e)
  ) {
    var n = mapLoadedCounter.item(e) - 1;
    mapLoadedCounter.update(e, n),
      n <= 0 && mapLoaded.update(e, !0),
      mapPluginApiReadyCheck.shift();
  }
}
function addKolorArea(e) {
  if (void 0 === ktools.KolorPluginList.getInstance().getPlugin(e)) {
    var n = new ktools.CssStyle(
        "KolorAreaCSS",
        crossDomainTargetUrl + "BenNhaRongdata/graphics/KolorArea/kolorArea.css"
      ),
      o = new ktools.Script(
        "KolorAreaJS",
        crossDomainTargetUrl +
          "BenNhaRongdata/graphics/KolorArea/KolorArea.min.js",
        [],
        !0
      ),
      t = new ktools.KolorPlugin(e);
    t.addScript(o),
      t.addCss(n),
      ktools.KolorPluginList.getInstance().addPlugin(t.getPluginName(), t, !0);
  }
}
function showKolorArea(e, n) {
  if (
    (debug && console.log("showKolorArea " + e),
    !ktools.KolorPluginList.getInstance().getPlugin(e).isInitialized() ||
      "undefined" == typeof KolorArea)
  )
    return (
      (err = "KolorArea JS is not loaded !"),
      debug && console.log(err),
      void setTimeout(function () {
        showKolorArea(e, n);
      }, 100)
    );
  null == ktools.KolorPluginList.getInstance().getPlugin(e).getRegistered() &&
    ktools.KolorPluginList.getInstance()
      .getPlugin(e)
      .register(new KolorArea(e, "panoDIV"));
  var o = ktools.KolorPluginList.getInstance().getPlugin(e).getRegistered();
  if (!o.isReady()) {
    for (
      var t = [],
        a = "",
        r = "",
        l = parseInt(
          getKrpano().get(
            "ptplugin[" + e + "].settings[0].option.count"
          )
        ),
        s = 0;
      s < l;
      s++
    )
      (r =
        "zorder" ==
        (a = getKrValue(
          "ptplugin[" + e + "].settings[0].option[" + s + "].name",
          "string"
        ))
          ? kolorStartIndex +
            getKrValue(
              "ptplugin[" + e + "].settings[0].option[" + s + "].value",
              getKrValue(
                "ptplugin[" + e + "].settings[0].option[" + s + "].type",
                "string"
              )
            )
          : getKrValue(
              "ptplugin[" + e + "].settings[0].option[" + s + "].value",
              getKrValue(
                "ptplugin[" + e + "].settings[0].option[" + s + "].type",
                "string"
              )
            )),
        (t[a] = r);
    (t.device = getKrValue("vrtourdevice", "string")),
      o.setKolorAreaOptions(t),
      o.setReady(!0),
      invokeKrFunction("kolorAreaJsReady_" + e);
  }
  o.setKolorAreaContent(n),
    o.openKolorArea(),
    pluginLoaded &&
      pluginLoaded.item(e) &&
      (invokePluginFunction.apply(null, pluginLoaded.item(e).funcArgs),
      pluginLoaded.remove(e));
}
function deleteKolorArea(e) {
  ktools.KolorPluginList.getInstance().getPlugin(e) &&
    ktools.KolorPluginList.getInstance().removePlugin(e);
  var n = document.getElementById("panoDIV"),
    o = document.getElementById(e);
  n && o && n.removeChild(o);
}
