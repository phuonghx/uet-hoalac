var is_touch_device = false;
function Sound() {
  backgroundSound();
  //  Overs()
}

function backgroundSound() {
  $(".sound").click(function () {
    if ($(this).is("#sound")) {
      if ($(this).hasClass("active")) {
        getKrpano().call("resumesound(music);"), $(this).removeClass("active");
      } else {
        $(this).addClass("active");
      }
      //Do stuff
    } else {
      if ($(this).hasClass("active")) {
        loadMusic(),
          $(this).removeClass("active"),
          $(".sound").attr("id", "sound");
      } else {
        $(this).addClass("active");
      }
    }
  });
}

function Overs() {
  $(".guide").click(function () {
    $(this).hasClass("active")
      ? ($(this).removeClass("active"),
        updateTitle(".guide", window.lang.translate("Bật thuyết minh")),
        $(".guide").attr("title", "Bật thuyết minh"),
        getKrpano().call("pause_voice()"))
      : ($(this).addClass("active"),
        updateTitle(".guide", window.lang.translate("Tắt thuyết minh")),
        $(".guide").attr("title", "Tắt thuyết minh"),
        getKrpano().call("resume_voice()"));
  });
}

function setAudioClass(t) {
  $(".currentOver").val(t),
    getKrpano().call("stopOversSound()"),
    $(".guide").hasClass("active") || getKrpano().call(t + "()");
}
function MobileMenu() {
  (menuRight = "-100%"),
    "sm" === currentBootstrapBreakPoint && (menuRight = "-50%"),
    $(".menu_btn").click(function () {
      $(this).hasClass("show")
        ? ($(".menu_bg").css({
            right: menuRight,
            opacity: 0,
          }),
          $(this).removeClass("show"),
          $(".sub_menu_mobile_bg").slideUp(380))
        : ($(".menu_bg").css({
            right: 0,
            opacity: 1,
          }),
          $(this).addClass("show"),
          $(".menu_item_bg.active").find(".sub_menu_mobile_bg").slideDown(380));
    }),
    $(".menu_item").click(function () {
      (menu = $(this).parent(".menu_item_bg")),
        menu.hasClass("active")
          ? ($(".sub_menu_mobile_bg").slideUp(380),
            $(".menu_item_bg").removeClass("active"))
          : ($(".sub_menu_mobile_bg").slideUp(380),
            $(".menu_item_bg").removeClass("active"),
            menu.children(".sub_menu_mobile_bg").slideDown(380, function () {
              menu.addClass("active");
            }));
    }),
    $(".sub_menu_item").click(function () {
      $(".menu_bg").css({
        right: menuRight,
        opacity: 0,
      }),
        $(".menu_btn").removeClass("show");
    });
}

function MenuThumb() {
  $(".hover_thumb").each(function (t, n) {
    $(this).css({
      backgroundImage: "url(" + $(".active_thumb").eq(t).attr("src") + ")",
    });
  });
}
function close_submenu() {
  window.onclick = function (event) {
    if (
      !$(event.target).hasClass("menu_item") &&
      !$(event.target).parents().hasClass("sub_menu_bg") &&
      event.target.id !== "info"
    ) {
      $(".sub_menu_bg").stop().fadeOut();
      $(".menu_item_bg").removeClass("active");
    }
    const check_click_toogle = $(event.target).parent().children().toArray();
    check_click_toogle.forEach((e) => {
      try {
        if (
          e.className == "sub_menu_bg mega_menu" &&
          e.attributes[1].value === "display: block;"
        ) {
          $(".sub_menu_bg").stop().fadeOut();
          $(".menu_item_bg").removeClass("active");
        } else if (
          e.id == "info" &&
          e.attributes[2].value === "opacity: 1; display: block;" &&
          event.target.id !== "info"
        ) {
          $(".sub_menu_bg").stop().fadeOut();
          $(".menu_item_bg").removeClass("active");
        }
      } catch (error) {
        console.error(error);
      }
    });
  };
}
function MainMenu() {
  // $(".menu_item_bg").hover((function() {
  // 	$(this).find(".sub_menu_bg").stop().fadeIn()
  // }), (function() {
  // 	$(this).find(".sub_menu_bg").stop().fadeOut()
  // }))

  $(".menu_item_bg")
    .stop()
    .click(function (e) {
      if (!$(this).hasClass("active")) {
        $(".menu_item_bg").removeClass("active");
        $(this).find(".sub_menu_bg").stop().fadeIn();
        $(this).addClass("active");
        $(".sub_menu_bg")
          .not($(this).find(".sub_menu_bg"))
          .stop()
          .fadeOut(function () {
            $(this).parent(".menu_item_bg").removeClass("active");
          });
      } else {
        $(this)
          .has("#info")
          .find(".sub_menu_bg")
          .stop()
          .fadeOut(function () {
            $(this).parent(".menu_item_bg").removeClass("active");
          });
      }
    });
}

function MenuHover() {
  $(".sub_menu_item")
    .stop()
    .hover(
      function () {
        (hth = $(this).parents(".sub_menu_bg").find(".hover_thumb")),
          (act = $(this)
            .parents(".sub_menu_bg")
            .find(".active_thumb")
            .attr("src")),
          (img = $(this).attr("data-thumb")),
          hth.css({
            backgroundImage: "url(" + img + ")",
          });
      },
      function () {
        hth.css({
          backgroundImage: "url(" + act + ")",
        });
      }
    );
}

function MenuActive() {
  $(".sub_menu_item").click(function () {
    loadpano($(this).attr("id"), $(this).attr("lookat"));
  });
  if (is_touch_device) {
    if (
      currentBootstrapBreakPoint === "xs" ||
      currentBootstrapBreakPoint === "sm"
    ) {
      $(".sub_menu_bg").addClass("sub_menu_mobile_bg");
      $(".sub_menu_bg").removeClass("sub_menu_bg");
    }
    $(".menu_item_bg")
      .stop()
      .click(function () {
        if (!$(this).hasClass("showSub")) {
          $(this).find(".sub_menu_bg").stop().fadeIn();
          $(this).addClass("showSub");
          $(this).addClass("showSpan");
          $(".sub_menu_bg")
            .not($(this).find(".sub_menu_bg"))
            .stop()
            .fadeOut(function () {
              $(this).parent(".menu_item_bg").removeClass("showSub");
              $(this).parent(".menu_item_bg").removeClass("showSpan");
            });
        } else {
          $(this)
            .find(".sub_menu_bg")
            .stop()
            .fadeOut(function () {
              $(".menu_item_bg").removeClass("showSub");
              $(".menu_item_bg").removeClass("showSpan");
            });
        }
      });
    $(document).click(function (e) {
      if ($(e.target).is(".menu_item_bg, .menu_item_bg *")) return;
      onTourFocus();
    });
  } else {
    $(".menu_item").click(function () {
      menu = $(this).parent(".menu_item_bg");
      // Tự chọn phần tử con đầu tiên trong calss sub_menu_item
      // menu.find('.sub_menu_item:first-child').click()
    });
  }
}
// Cách 2 để highlight class được click vào để chuyển scene
// function MenuActive() {
// 	$(".sub_menu_item").click((function() {

// 		$(".sub_menu_item").removeClass("active"),
// 		$(".menu_item_bg").removeClass("active"),
// 		$(this).addClass("active"),
// 		$(this).parents(".menu_item_bg").addClass("active"),

// 		loadpano($(this).attr("id"))
// 	})), is_touch_device ? ("xs" !== currentBootstrapBreakPoint && "sm" !== currentBootstrapBreakPoint || $(".sub_menu_bg").addClass("sub_menu_mobile_bg", (function() {
// 		$(this).removeClass("sub_menu_bg")
// 	})), $(".menu_item_bg").stop().click((function() {
// 		$(this).hasClass("showSub") ? $(this).find(".sub_menu_bg").stop().fadeOut((function() {
// 			$(".menu_item_bg").removeClass("showSub"), $(".menu_item_bg").removeClass("showSpan")
// 		})) : ($(this).find(".sub_menu_bg").stop().fadeIn(), $(this).addClass("showSub"), $(this).addClass("showSpan"), $(".sub_menu_bg").not($(this).find(".sub_menu_bg")).stop().fadeOut((function() {
// 			$(this).parent(".menu_item_bg").removeClass("showSub"), $(this).parent(".menu_item_bg").removeClass("showSpan")
// 		})))
// 	})), $(document).click((function(t) {
// 		$(t.target).is(".menu_item_bg, .menu_item_bg *") || onTourFocus()
// 	}))) : $(".menu_item").click((function() {
// 		menu = $(this).parent(".menu_item_bg"), menu.find(".sub_menu_item:first-child").click()
// 	}))
// }
function onTourFocus() {
  $(".sub_menu_bg").fadeOut(),
    $(".menu_item_bg.showSub").removeClass("showSpan");
}

function Fullscreen() {
  $(".fullscreen")
    .stop()
    .mousedown(function () {
      screenfull.enabled && screenfull.toggle();
    }),
    $(".autotour_control.exit_fullscreen")
      .stop()
      .mousedown(function () {
        screenfull.enabled && screenfull.toggle();
      });
}

function Autorotate() {
  $(".auto_rotation").click(function () {
    $(this).hasClass("active")
      ? (getKrpano().call("startautotour();"),
        $(this).removeClass("active"),
        $(".auto_rotation").attr("title", "Tắt tham quan tự động"))
      : (getKrpano().call("stopautotour();"),
        $(this).addClass("active"),
        $(".auto_rotation").attr("title", "Bật tham quan tự động"));
  });
}

function ShowHelp(t) {
  try {
    $(t).fancybox({
      width: "auto",
      height: "auto",
      autoScale: !0,
      padding: 0,
      scrolling: "no",
      fitToView: !0,
      type: "image",
      helpers: {
        title: {
          type: "inside",
        },
      },
    });
  } catch (t) {}
}

function ShowInfo(t) {
  try {
    $(t).fancybox({
      width: "700",
      height: "460",
      autoScale: !0,
      padding: 0,
      scrolling: "no",
      fitToView: !0,
      type: "iframe",
      title: "",
    });
  } catch (t) {}
}

function navigationBar() {
  $(".navigation").click(function () {
    $(this).hasClass("active")
      ? ($(".navigation_bg").fadeOut(), $(this).removeClass("active"))
      : ($(".navigation_bg").fadeIn(), $(this).addClass("active"));
  }),
    $(".zoom_in")
      .stop()
      .mousedown(function () {
        getKrpano().call("set(fov_moveforce, -0.25)");
      }),
    $(".zoom_in")
      .stop()
      .mouseup(function () {
        getKrpano().call("set(fov_moveforce, 0)");
      }),
    $(".zoom_out")
      .stop()
      .mousedown(function () {
        getKrpano().call("set(fov_moveforce, +0.25)");
      }),
    $(".zoom_out")
      .stop()
      .mouseup(function () {
        getKrpano().call("set(fov_moveforce, 0)");
      }),
    $(".down")
      .stop()
      .mousedown(function () {
        getKrpano().call("set(vlookat_moveforce, +0.25)");
      }),
    $(".down")
      .stop()
      .mouseup(function () {
        getKrpano().call("set(vlookat_moveforce, 0)");
      }),
    $(".up")
      .stop()
      .mousedown(function () {
        getKrpano().call("set(vlookat_moveforce, -0.25)");
      }),
    $(".up")
      .stop()
      .mouseup(function () {
        getKrpano().call("set(vlookat_moveforce, 0)");
      }),
    $(".right")
      .stop()
      .mousedown(function () {
        getKrpano().call("set(hlookat_moveforce, +0.25)");
      }),
    $(".right")
      .stop()
      .mouseup(function () {
        getKrpano().call("set(hlookat_moveforce, 0)");
      }),
    $(".left")
      .stop()
      .mousedown(function () {
        getKrpano().call("set(hlookat_moveforce, -0.25)");
      }),
    $(".left")
      .stop()
      .mouseup(function () {
        getKrpano().call("set(hlookat_moveforce, 0)");
      });
}

function loadpano(a, b) {
  getKrpano().call(
    "loadscene(" + a + ", null, MERGE, OPENBLEND(1.0, -0.5, 0.3, 0.8, linear))"
  );
  getKrpano().call(`lookat(${b})`);
  setTitle();
}

function setTitle() {
  currentScene = getKrpano().get("xml.scene");
  const currentSceneTitle = getKrpano().get("scene[get(xml.scene)].title");

  // $(".pano_title").text(currentSceneTitle);
  setMenuActive();
}
// Click hamburger = TOGGLE mo/dong menu drawer.
function showhide() {
  let x = document.getElementById("menu_bg");
  if (window.innerWidth < 992) {
    if (x.style.opacity == "1") {
      // dang mo -> dong
      document.getElementById("header_bar").style.backgroundColor = "unset";
      document.getElementById("header_bg").style.width = "10px";
      x.style.opacity = "0";
      x.style.right = "-100vw";
      x.style.margin = "0px";
    } else {
      // dang dong -> mo
      getKrpano().call("hide_m()");
      document.getElementById("header_bar").style.backgroundColor = "#b56528";
      document.getElementById("header_bg").style.width = "100%";
      x.style.opacity = "1";
      x.style.right = "0px";
      x.style.margin = "0px";
    }
  }
}

// Resize = dua menu ve dung trang thai theo width, KHONG toggle. Ban cu dung
// chung ham toggle voi click va bind vao resize -> moi lan resize menu lat
// trang thai (mo o mobile roi resize len desktop thi nav bi opacity:0; resize
// ve mobile thi menu ket mo). Tach rieng, bind MOT lan (ban cu moi click lai
// them 1 listener -> ro ri).
function menuResetOnResize() {
  let x = document.getElementById("menu_bg");
  if (!x) return;
  // Xoa mau nen cam ma showhide() dat khi mo menu, de CSS kiem soat lai.
  // Neu khong, mo menu o mobile roi resize len desktop thi header_bar van cam.
  var hbar = document.getElementById("header_bar");
  if (hbar) hbar.style.backgroundColor = "";
  if (window.innerWidth < 992) {
    document.getElementById("header_bg").style.width = "10px";
    x.style.opacity = "0";
    x.style.right = "-100vw";
    x.style.margin = "0px";
  } else {
    document.getElementById("header_bg").style.width = "50%";
    x.style.opacity = "1";
    x.style.right = "0px";
    x.style.margin = "0px";
  }
  $(".menu_btn").removeClass("show");
}
window.addEventListener("resize", menuResetOnResize);
function setMenuActive() {
  $(".sub_menu_item").each(function (t) {
    $(this).attr("id") === currentScene &&
      ($(".sub_menu_item").removeClass("active"),
      $(".menu_item_bg").removeClass("active"),
      $(this).addClass("active"),
      $(this).parents(".menu_item_bg").addClass("active"),
      MobileMenuActive(this));
  });
}

function MobileMenuActive(t) {
  if (
    currentBootstrapBreakPoint === "xs" ||
    currentBootstrapBreakPoint === "sm"
  ) {
    menuRight = "-100%";
    if (currentBootstrapBreakPoint === "sm") menuRight = "-50%";
    $(".menu_bg").css({
      right: menuRight,
      opacity: 0,
    });
    $(".menu_btn").removeClass("show");
    $(".sub_menu_mobile_bg").slideUp(180, function () {});
  }
}

function toggleFullScreen() {
  document.fullscreenElement
    ? document.exitFullscreen && document.exitFullscreen()
    : document.documentElement.requestFullscreen();
}

function autorotate() {
  getKrpano().call("switch(autorotate.enabled);");
}

function switchsound() {
  getKrpano().call("pausesoundtoggle(music);");
}
function loadMusic() {
  getKrpano().call("resumesound(music);");
}

function go_tour() {
  getKrpano().call("hide_bgintro();");
}
$(document).ready(function () {
  if ("ontouchstart" in window || navigator.msMaxTouchPoints) {
    is_touch_device = true;
    if (
      currentBootstrapBreakPoint === "xs" ||
      currentBootstrapBreakPoint === "sm"
    ) {
      MobileMenu();
    }
    // setTimeout('getKrPanoInstance().call("playBgSound()");', 12000)
  } else {
    is_touch_device = false;
    MainMenu();
  }
  Fullscreen(),
    Autorotate(),
    Sound(),
    navigationBar(),
    MenuThumb(),
    MenuHover(),
    MenuActive(),
    close_submenu();
});

// $(document).ready((function() {
// 	"ontouchstart" in window || navigator.msMaxTouchPoints ?
// 	(is_touch_device = !0, "xs" !== currentBootstrapBreakPoint && "sm" !== currentBootstrapBreakPoint || MobileMenu()) : (is_touch_device = !1, MainMenu()), Fullscreen(), Autorotate(),Sound(), navigationBar(), MenuThumb(), MenuHover(), MenuActive()
// })),
$(window).bind("fullscreen-on", function (t) {
  $(".fullscreen").attr("title", "Thoát toàn màn hình");
}),
  $(window).bind("fullscreen-off", function (t) {
    $(".fullscreen").removeClass("active"),
      $(".fullscreen").attr("title", "Xem toàn màn hình");
  }),
  (String.prototype.replaceAll = function (t, n) {
    for (var e = this, o = e.indexOf(t); -1 != o; )
      o = (e = e.replace(t, n)).indexOf(t);
    return e;
  });
