/**
 * 插件脚本，可以做一些拓展功能
 */
if (!CC_DEBUG) {
  console.log = function(...args) {};
}
CMath = {};
CMath.Clamp = function(val, max, min) {
  return Math.max(Math.min(val, max), min);
};

CMath.Distance = function(p1, p2) {
  return Math.sqrt(
    (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
  );
};

CMath.NumberFormat = function(val) {
  let strArr = val.toString().split(".");
  let strValArr = strArr[0].split("").reverse();
  let resStr = "";
  for (let i = 0; i < strValArr.length; i++) {
    resStr = strValArr[i] + resStr;
    if (i % 3 == 2 && i < strValArr.length - 1) {
      resStr = "," + resStr;
    }
  }
  resStr += "." + strArr[1];
  return resStr;
};

if (CC_DEBUG) {
  cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, event => {
    switch (event.keyCode) {
      case cc.macro.KEY.f11:
        if (cc.game.isPaused()) {
          cc.game.resume();
          console.log("------------------resume-----------------");
        } else {
          console.log("---------------------pause----------------------");
          cc.game.pause();
        }
        break;
      case cc.macro.KEY.f10:
        if (cc.game.isPaused()) {
          console.log(" -------------- step --------------------");
          cc.game.step();
        }
        break;
    }
  });
}

CAMERA_SHOW_ALL = false;
INVINCIBLE = false;
PXIEL = false;
GUIDE = false;
GESTURE = false;
