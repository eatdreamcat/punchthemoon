window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AudioController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e558ctwViNCeaIBGBAYeN3x", "AudioController");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var HashMap_1 = require("../Utils/HashMap");
    var EventManager_1 = require("../Event/EventManager");
    var AudioController = function() {
      function AudioController() {
        this.clips = new HashMap_1.HashMap();
      }
      Object.defineProperty(AudioController, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new AudioController();
        },
        enumerable: true,
        configurable: true
      });
      AudioController.prototype.init = function(callback) {
        var self = this;
        cc.loader.loadResDir("AudioClip", cc.AudioClip, function(err, clips, urls) {
          if (err) console.error(err); else {
            for (var _i = 0, clips_1 = clips; _i < clips_1.length; _i++) {
              var clip = clips_1[_i];
              self.clips.add(clip.name, clip);
            }
            self.initEvent();
            callback && callback();
          }
        });
      };
      AudioController.prototype.initEvent = function() {
        EventManager_1.gEventMgr.targetOff(this);
      };
      AudioController.prototype.stop = function(clipName, audioID) {
        if (AudioController.canPlay) cc.audioEngine.stop(audioID); else for (var _i = 0, _a = AudioController.PlayedList; _i < _a.length; _i++) {
          var clipItem = _a[_i];
          clipItem.skip = clipItem.clipName == clipName;
        }
      };
      AudioController.prototype.play = function(clipName, loop, volume) {
        void 0 === volume && (volume = 1);
        if (!AudioController.canPlay && !AudioController.hasBindTouch) {
          AudioController.hasBindTouch = true;
          var self_1 = this;
          var playFunc_1 = function() {
            cc.game.canvas.removeEventListener("touchstart", playFunc_1);
            AudioController.canPlay = true;
            var item;
            while ((item = AudioController.PlayedList.pop()) && self_1.clips.get(item.clipName) && !item.skip) {
              var audioID = cc.audioEngine.play(self_1.clips.get(item.clipName), item.loop, item.volume);
              cc.audioEngine.setCurrentTime(audioID, (Date.now() - item.supTime) / 1e3);
            }
          };
          cc.game.canvas.addEventListener("touchstart", playFunc_1);
        }
        if (!this.clips.get(clipName)) return -1;
        if (AudioController.canPlay) return cc.audioEngine.play(this.clips.get(clipName), loop, volume);
        AudioController.PlayedList.push({
          clipName: clipName,
          loop: loop,
          volume: volume,
          supTime: Date.now(),
          skip: false
        });
        return -2;
      };
      AudioController.PlayedList = [];
      AudioController.canPlay = cc.sys.os.toLowerCase() != cc.sys.OS_IOS.toLowerCase();
      AudioController.hasBindTouch = false;
      return AudioController;
    }();
    exports.gAudio = AudioController.inst;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Utils/HashMap": "HashMap"
  } ],
  Base: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7744a1YYZVMsL0N3JZWWKL+", "Base");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Base = function(_super) {
      __extends(Base, _super);
      function Base() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.minScale = .03;
        _this.heightLimit = 5 * cc.winSize.height;
        _this.moveFactor = 0;
        _this.speedY = 0;
        _this.baseBg = null;
        return _this;
      }
      Base.prototype.onLoad = function() {
        this.node.opacity = 255;
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.SCALE_SCENE, this.scaleScene, this);
      };
      Base.prototype.scaleScene = function(speed, height, maxHeight) {
        this.speedY = this.moveFactor * speed;
        var scale = Math.max(0, 1 - height / this.heightLimit);
        var minScale = this.minScale;
        if (scale < this.minScale && this.node.opacity <= 70) {
          this.node.scale -= 3e-5;
          minScale = 0;
        } else this.node.scale = scale;
        var opacityFactor = Math.max(cc.winSize.height, height - 3 * cc.winSize.height);
        this.node.opacity = 255 * cc.winSize.height / opacityFactor;
        this.node.scale = CMath.Clamp(this.node.scale, 1, minScale);
        this.baseBg.opacity = this.node.opacity;
      };
      Base.prototype.start = function() {};
      Base.prototype.update = function(dt) {
        this.node.y += this.speedY * dt;
      };
      __decorate([ property(cc.Node) ], Base.prototype, "baseBg", void 0);
      Base = __decorate([ ccclass ], Base);
      return Base;
    }(cc.Component);
    exports.default = Base;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName"
  } ],
  ButterFlySpring: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "00ebeNacGtCZYnQZk+sHqkH", "ButterFlySpring");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ButterflySpring = function(_super) {
      __extends(ButterflySpring, _super);
      function ButterflySpring() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.material = new ShaderManager_1.ButterflySpringMaterial();
        _this.time = 0;
        return _this;
      }
      ButterflySpring.prototype.onLoad = function() {
        var sprite = this.getComponent(cc.Sprite);
        if (!sprite) return;
        sprite["_spriteMaterial"] = this.material;
        sprite["_activateMaterial"]();
      };
      ButterflySpring.prototype.start = function() {};
      ButterflySpring.prototype.update = function(dt) {
        this.time += 10 * dt;
      };
      ButterflySpring = __decorate([ ccclass ], ButterflySpring);
      return ButterflySpring;
    }(cc.Component);
    exports.default = ButterflySpring;
    cc._RF.pop();
  }, {
    "./ShaderManager": "ShaderManager"
  } ],
  CameraController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f6d660an69HtZK2e/g3qrOR", "CameraController");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CameraController = function() {
      function CameraController() {
        this.minZoomRatio = .03;
        this.maxMoveYRatio = 10;
        this.disabled = false;
        this.zoomRatioSense = 1;
        this.isEnableCameraZoom = true;
        this.MainCamera = null;
        this.UICamera = null;
        this.target = null;
        this.enableFollow = true;
        this.canZoomOut = true;
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.lateUpdate.bind(this), this);
      }
      Object.defineProperty(CameraController, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new CameraController();
        },
        enumerable: true,
        configurable: true
      });
      CameraController.prototype.shake = function() {
        var shakeRange = .5;
        var moveY = cc.sequence(cc.moveBy(.03, cc.v2(0, 50 * shakeRange)), cc.moveBy(.06, cc.v2(0, -100 * shakeRange)), cc.moveBy(.03, cc.v2(0, 50 * shakeRange)));
        var shakeUpDown = cc.repeat(moveY, 5);
        this.MainCamera.node.runAction(shakeUpDown);
      };
      CameraController.prototype.initCamera = function() {
        this.enableFollow = true;
        if (!this.MainCamera || !this.MainCamera.node) return;
        if (CAMERA_SHOW_ALL) {
          this.MainCamera.node.y = 360;
          this.MainCamera.zoomRatio = .5;
        } else {
          this.MainCamera.node.y = 0;
          this.MainCamera.zoomRatio = 1;
        }
      };
      CameraController.prototype.zoomIn = function() {
        this.enableFollow = false;
        this.MainCamera.node.stopActionByTag(101);
        var zoomIn = cc.moveTo(.4, cc.v2(0, 360));
        zoomIn.setTag(100);
        this.MainCamera.node.runAction(zoomIn);
      };
      CameraController.prototype.zoomOut = function() {
        if (!this.canZoomOut || CAMERA_SHOW_ALL) return;
        var zoomOut = cc.moveTo(.2, cc.v2(0, 0));
        zoomOut.setTag(101);
        this.MainCamera.node.stopActionByTag(100);
        this.MainCamera.node.runAction(zoomOut);
        this.enableFollow = true;
      };
      CameraController.prototype.bindUICamera = function(camera) {
        this.UICamera = camera;
      };
      CameraController.prototype.bindMainCamera = function(camera) {
        this.MainCamera = camera;
      };
      CameraController.prototype.setTarget = function(newTarget) {
        if (CAMERA_SHOW_ALL) return;
        this.target = newTarget;
        this.target || this.readyRocket(false);
      };
      CameraController.prototype.readyRocket = function(isReady) {
        if (CAMERA_SHOW_ALL) return;
        if (this.enableFollow == !isReady) return;
        console.log("enable follow:" + this.enableFollow);
        isReady ? this.zoomIn() : this.zoomOut();
      };
      CameraController.prototype.lateUpdate = function() {
        if (this.disabled) return;
        if (!this.MainCamera || !this.MainCamera.node || !this.UICamera || !this.UICamera.node) return;
        if (CAMERA_SHOW_ALL || !this.enableFollow) {
          if (this.MainCamera.zoomRatio > .5) {
            this.MainCamera.zoomRatio -= .03;
            this.MainCamera.zoomRatio = this.MainCamera.zoomRatio < .5 ? .5 : this.MainCamera.zoomRatio;
          }
          return;
        }
        if (!this.target || !this.target.isValid) {
          this.MainCamera.zoomRatio < 1 ? this.MainCamera.zoomRatio += .05 : this.MainCamera.zoomRatio > 1 && (this.MainCamera.zoomRatio -= .05);
          this.MainCamera.zoomRatio = CMath.Clamp(this.MainCamera.zoomRatio, 1, 0);
          return;
        }
        this.target.y > .25 * cc.winSize.height * 1.2 && (this.MainCamera.node.y = this.target.y - .25 * cc.winSize.height * 1.2);
      };
      return CameraController;
    }();
    exports.gCamera = CameraController.inst;
    (true, true) && (window["gCamera"] = exports.gCamera);
    cc._RF.pop();
  }, {} ],
  Config: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eb447veLk1FD49yF65cvqPa", "Config");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Config = {
      GameID: 216437,
      AppKey: "bc7b7fd603714d888deff0986e24f742#C",
      Secret: "6f86c9c856504b5d917dd06585553a3f",
      CocosAppID: "619821021",
      channel: "Matchvs",
      platform: "alpha",
      gameVersion: 1,
      DeviceID: "1",
      MaxPlayer: 2,
      isMultiPlayer: false,
      FPS: 60,
      AUTO_TOSS: true
    };
    cc._RF.pop();
  }, {} ],
  Enemy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "956e6Rq+CNAdoMYMuFS51KT", "Enemy");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var CameraController_1 = require("../Controller/CameraController");
    var Config_1 = require("../Config/Config");
    var GameMgr_1 = require("./GameMgr");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Enemy = function(_super) {
      __extends(Enemy, _super);
      function Enemy() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.startHeight = 0;
        _this.tossRange = 100;
        _this.y = 0;
        _this.x = 0;
        _this.diePoint = -500;
        _this.staticFrame = null;
        _this.upFrame = null;
        _this.downFrame = null;
        _this.gravity = cc.v2(0, 0);
        _this.minScale = .2;
        _this.speed = cc.v2(0, 0);
        _this.sprite = null;
        return _this;
      }
      Object.defineProperty(Enemy.prototype, "Sptite", {
        get: function() {
          return this.sprite ? this.sprite : this.sprite = this.getComponent(cc.Sprite);
        },
        enumerable: true,
        configurable: true
      });
      Enemy.prototype.onLoad = function() {
        this.startHeight = this.node.y;
        this.y = this.node.y;
        this.x = this.node.x;
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PUNCH, this.toss, this);
        CameraController_1.gCamera.setTarget(this.node);
        this.Sptite.spriteFrame = this.staticFrame;
      };
      Enemy.prototype.addSpeed = function(applySpeed) {
        this.speed.addSelf(applySpeed);
      };
      Enemy.prototype.applySpeed = function(speed) {
        this.speed = speed;
      };
      Enemy.prototype.start = function() {};
      Enemy.prototype.toss = function() {
        var offset = this.y - this.startHeight;
        if (Math.abs(this.speed.y) < .01) this.speed.y = 3e3; else {
          if (!(this.speed.y < 0 && offset < this.tossRange)) return;
          this.speed.mulSelf(-2);
        }
        EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.TOSS);
        GameMgr_1.Game.maxHeight = Math.abs(this.speed.y * this.speed.y / (2 * this.gravity.y));
      };
      Enemy.prototype.updateLogic = function(dt) {
        var offset = this.speed.mul(dt).add(this.gravity.mul(.5 * dt * dt));
        this.x += offset.x;
        this.y += offset.y;
        this.speed.addSelf(this.gravity.mul(dt));
      };
      Enemy.prototype.update = function(dt) {
        var i = 20;
        var curHeight = 0;
        while (i-- > 0) {
          this.updateLogic(dt / 20);
          Config_1.Config.AUTO_TOSS && this.toss();
          this.y <= this.diePoint && (this.y = this.diePoint);
          curHeight = Math.floor(this.y - this.startHeight);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.UPDATE_HEIGHT, (this.y - this.startHeight) / GameMgr_1.Game.maxHeight * 100, curHeight, this.speed.y);
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.SCALE_SCENE, this.speed.y, this.y, GameMgr_1.Game.maxHeight);
          this.speed.y > 0 ? this.Sptite.spriteFrame = this.upFrame : this.speed.y < 0 ? this.Sptite.spriteFrame = this.downFrame : this.Sptite.spriteFrame = this.staticFrame;
        }
        this.node.y = this.y;
        if (this.node.y <= this.diePoint) {
          this.node.y = this.diePoint;
          this.applySpeed(cc.v2(0, 0));
        }
        this.node.scale = 1 - (this.y - this.startHeight) / (5 * cc.winSize.height);
        this.node.scale = CMath.Clamp(this.node.scale, 1, this.minScale);
        this.node.y >= cc.winSize.height / 2 && (this.node.y = cc.winSize.height / 2);
      };
      __decorate([ property(cc.SpriteFrame) ], Enemy.prototype, "staticFrame", void 0);
      __decorate([ property(cc.SpriteFrame) ], Enemy.prototype, "upFrame", void 0);
      __decorate([ property(cc.SpriteFrame) ], Enemy.prototype, "downFrame", void 0);
      __decorate([ property(cc.Vec2) ], Enemy.prototype, "gravity", void 0);
      __decorate([ property(cc.Float) ], Enemy.prototype, "minScale", void 0);
      Enemy = __decorate([ ccclass ], Enemy);
      return Enemy;
    }(cc.Component);
    exports.default = Enemy;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../Controller/CameraController": "CameraController",
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "./GameMgr": "GameMgr"
  } ],
  EventManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "08087AgT2lFU4a4ivbGEBGM", "EventManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager = function() {
      function EventManager() {
        this.eventTarget = new cc.EventTarget();
      }
      Object.defineProperty(EventManager, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new EventManager();
        },
        enumerable: true,
        configurable: true
      });
      EventManager.prototype.emit = function(type, arg1, arg2, arg3, arg4, arg5) {
        this.eventTarget.emit(type.toString(), arg1, arg2, arg3, arg4, arg5);
      };
      EventManager.prototype.on = function(type, callback, target, useCapture) {
        return this.eventTarget.on(type.toString(), callback, target, useCapture);
      };
      EventManager.prototype.once = function(type, callback, target) {
        this.eventTarget.once(type.toString(), callback, target);
      };
      EventManager.prototype.dispatchEvent = function(event) {
        this.eventTarget.dispatchEvent(event);
      };
      EventManager.prototype.off = function(type, callback, target) {
        this.eventTarget.off(type.toString(), callback, target);
      };
      EventManager.prototype.hasEventListener = function(type) {
        return this.eventTarget.hasEventListener(type.toString());
      };
      EventManager.prototype.targetOff = function(target) {
        this.eventTarget.targetOff(target);
      };
      return EventManager;
    }();
    exports.gEventMgr = EventManager.inst;
    cc._RF.pop();
  }, {} ],
  EventName: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1adc6DjmVtFpaWu1lI0FvRv", "EventName");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GlobalEvent;
    (function(GlobalEvent) {
      GlobalEvent[GlobalEvent["PXIEL_ENABLE"] = 0] = "PXIEL_ENABLE";
      GlobalEvent[GlobalEvent["PUNCH"] = 1] = "PUNCH";
      GlobalEvent[GlobalEvent["UPDATE_HEIGHT"] = 2] = "UPDATE_HEIGHT";
      GlobalEvent[GlobalEvent["SCALE_SCENE"] = 3] = "SCALE_SCENE";
      GlobalEvent[GlobalEvent["TOSS"] = 4] = "TOSS";
    })(GlobalEvent = exports.GlobalEvent || (exports.GlobalEvent = {}));
    cc._RF.pop();
  }, {} ],
  GameBinder: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d22de/N1yxMwpFKClwORumF", "GameBinder");
    cc._RF.pop();
  }, {} ],
  GameFactory: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3779bGiGolJfqHjyLy/0qU/", "GameFactory");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TableMgr_1 = require("../TableMgr");
    var HashMap_1 = require("../Utils/HashMap");
    var ObjPool = function() {
      function ObjPool(template, initSize, poolHandlerComps) {
        this._pool = [];
        this.poolHandlerComps = [];
        this.poolHandlerComps = poolHandlerComps;
        this.template = template;
        this.initPool(initSize);
      }
      ObjPool.prototype.initPool = function(size) {
        for (var i = 0; i < size; ++i) {
          var newNode = cc.instantiate(this.template);
          this.put(newNode);
        }
      };
      ObjPool.prototype.size = function() {
        return this._pool.length;
      };
      ObjPool.prototype.clear = function() {
        var count = this._pool.length;
        for (var i = 0; i < count; ++i) this._pool[i].destroy && this._pool[i].destroy();
        this._pool.length = 0;
      };
      ObjPool.prototype.put = function(obj) {
        if (obj && -1 === this._pool.indexOf(obj)) {
          obj.removeFromParent(false);
          if (this.poolHandlerComps) {
            var handlers = this.poolHandlerComps;
            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
              var handler = handlers_1[_i];
              var comp = obj.getComponent(handler);
              comp && comp.unuse && comp.unuse.apply(comp);
            }
          } else {
            var handlers = obj.getComponents(cc.Component);
            for (var _a = 0, handlers_2 = handlers; _a < handlers_2.length; _a++) {
              var handler = handlers_2[_a];
              handler && handler.unuse && handler.unuse.apply(handler);
            }
          }
          this._pool.push(obj);
        }
      };
      ObjPool.prototype.get = function() {
        var _ = [];
        for (var _i = 0; _i < arguments.length; _i++) _[_i] = arguments[_i];
        var last = this._pool.length - 1;
        if (last < 0) {
          console.warn(" last < 0 ");
          this.initPool(10);
        }
        last = this._pool.length - 1;
        var obj = this._pool[last];
        this._pool.length = last;
        if (this.poolHandlerComps) {
          var handlers = this.poolHandlerComps;
          for (var _a = 0, handlers_3 = handlers; _a < handlers_3.length; _a++) {
            var handler = handlers_3[_a];
            var comp = obj.getComponent(handler);
            comp && comp.reuse && comp.reuse.apply(comp, arguments);
          }
        } else {
          var handlers = obj.getComponents(cc.Component);
          for (var _b = 0, handlers_4 = handlers; _b < handlers_4.length; _b++) {
            var handler = handlers_4[_b];
            handler && handler.reuse && handler.reuse.apply(handler, arguments);
          }
        }
        return obj;
      };
      return ObjPool;
    }();
    var Step;
    (function(Step) {
      Step[Step["INIT"] = 0] = "INIT";
      Step[Step["MONSTER"] = 2] = "MONSTER";
      Step[Step["BALL"] = 4] = "BALL";
      Step[Step["BACKGROUND"] = 8] = "BACKGROUND";
      Step[Step["ITEM"] = 16] = "ITEM";
      Step[Step["DONE"] = 30] = "DONE";
    })(Step || (Step = {}));
    var GameFactory = function() {
      function GameFactory() {
        this.step = Step.INIT;
        this.monstersPool = new HashMap_1.HashMap();
        this.ballPool = new HashMap_1.HashMap();
        this.scenePool = new HashMap_1.HashMap();
        this.itemPool = new HashMap_1.HashMap();
      }
      Object.defineProperty(GameFactory, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new GameFactory();
        },
        enumerable: true,
        configurable: true
      });
      GameFactory.prototype.init = function(callback) {
        this.doneCallback = callback;
        this.doneCallback();
      };
      GameFactory.prototype.nextStep = function(step) {
        this.step |= step;
        console.log("Factory Step:" + Step[step]);
        this.step >= Step.DONE && this.doneCallback && this.doneCallback();
      };
      GameFactory.prototype.initMonsters = function() {
        var monsters = TableMgr_1.TableMgr.inst.getAll_Monster_ball__monster_Data();
        var self = this;
        var count = 0;
        var total = 0;
        for (var id in monsters) total++;
        var _loop_1 = function(id) {
          var url = "Prefabs/Monster/Monster-" + monsters[id].mod;
          cc.loader.loadRes(url, cc.Prefab, function(err, prefab) {
            if (err) console.error(err); else {
              var monsterNode = cc.instantiate(prefab);
              self.monstersPool.add(id, new ObjPool(monsterNode, 10));
              count++;
              count >= total && self.nextStep(Step.MONSTER);
            }
          });
        };
        for (var id in monsters) _loop_1(id);
      };
      GameFactory.prototype.initBalls = function() {
        var balls = TableMgr_1.TableMgr.inst.getAll_Monster_ball_ball_Data();
        console.log(balls);
        var self = this;
        var count = 0;
        var total = 0;
        for (var id in balls) total++;
        var _loop_2 = function(id) {
          var url = "Prefabs/Ball/Ball-" + id;
          cc.loader.loadRes(url, cc.Prefab, function(err, prefab) {
            if (err) console.error(err); else {
              var ball = cc.instantiate(prefab);
              self.ballPool.add(id, new ObjPool(ball, 10));
              count++;
              count >= total && self.nextStep(Step.BALL);
            }
          });
        };
        for (var id in balls) _loop_2(id);
      };
      GameFactory.prototype.initBackground = function() {
        var scenes = TableMgr_1.TableMgr.inst.getAll_Monster_ball_scene_Data();
        var self = this;
        var count = 0;
        var total = 0;
        for (var id in scenes) total++;
        var _loop_3 = function(id) {
          var url = "Prefabs/Background/Background-" + id;
          cc.loader.loadRes(url, cc.Prefab, function(err, prefab) {
            if (err) console.error(err); else {
              var scene = cc.instantiate(prefab);
              self.scenePool.add(id, new ObjPool(scene, 1));
              count++;
              count >= total && self.nextStep(Step.BACKGROUND);
            }
          });
        };
        for (var id in scenes) _loop_3(id);
      };
      GameFactory.prototype.initItems = function() {
        var items = TableMgr_1.TableMgr.inst.getAll_Monster_ball_prop_Data();
        var self = this;
        var count = 0;
        var total = 0;
        for (var id in items) total++;
        var _loop_4 = function(id) {
          var url = "Prefabs/Item/Item-" + id;
          cc.loader.loadRes(url, cc.Prefab, function(err, prefab) {
            if (err) console.error(err); else {
              var item = cc.instantiate(prefab);
              self.itemPool.add(id, new ObjPool(item, 10));
              count++;
              count >= total && self.nextStep(Step.ITEM);
            }
          });
        };
        for (var id in items) _loop_4(id);
      };
      GameFactory.prototype.getMonster = function(monsterID) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        return this.monstersPool.get(monsterID).get(args);
      };
      GameFactory.prototype.getBall = function(ballID) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        return this.ballPool.get(ballID).get(args);
      };
      GameFactory.prototype.putMonster = function(monsterID, monster) {
        this.monstersPool.get(monsterID).put(monster);
      };
      GameFactory.prototype.putBall = function(ballID, ball) {
        this.ballPool.get(ballID).put(ball);
      };
      GameFactory.prototype.getBackground = function(sceneID) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        return this.scenePool.get(sceneID).get(args);
      };
      GameFactory.prototype.putBackground = function(sceneID, scene) {
        this.scenePool.get(sceneID).put(scene);
      };
      GameFactory.prototype.getItems = function(itemID) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        console.log(itemID);
        return this.itemPool.get(itemID).get(args);
      };
      GameFactory.prototype.puItems = function(itemID, item) {
        this.itemPool.get(itemID).put(item);
      };
      return GameFactory;
    }();
    exports.gFactory = GameFactory.inst;
    cc._RF.pop();
  }, {
    "../TableMgr": "TableMgr",
    "../Utils/HashMap": "HashMap"
  } ],
  GameMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "487faakth9CkaTeb6IvpVyK", "GameMgr");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameMgr = function() {
      function GameMgr() {
        this.maxHeight = 0;
      }
      Object.defineProperty(GameMgr, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new GameMgr();
        },
        enumerable: true,
        configurable: true
      });
      return GameMgr;
    }();
    exports.Game = GameMgr.inst;
    true, window["Game"] = exports.Game;
    cc._RF.pop();
  }, {} ],
  GameScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c17413XIeBGRbTZZ+mY6f8C", "GameScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CameraController_1 = require("../Controller/CameraController");
    var UIManager_1 = require("../Controller/UIManager");
    var fguiMainUI_1 = require("../UI/export/Game/fguiMainUI");
    var MainUI_1 = require("../UI/MainUI");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Game = function(_super) {
      __extends(Game, _super);
      function Game() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.UICamera = null;
        _this.MainCamera = null;
        return _this;
      }
      Game.prototype.onLoad = function() {
        this.node.setScale(1, 1);
        CameraController_1.gCamera.bindMainCamera(this.MainCamera);
        CameraController_1.gCamera.bindUICamera(this.UICamera);
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
      };
      Game.prototype.start = function() {
        UIManager_1.UIMgr.openGUI(fguiMainUI_1.default, MainUI_1.default);
      };
      __decorate([ property(cc.Camera) ], Game.prototype, "UICamera", void 0);
      __decorate([ property(cc.Camera) ], Game.prototype, "MainCamera", void 0);
      Game = __decorate([ ccclass ], Game);
      return Game;
    }(cc.Component);
    exports.default = Game;
    cc._RF.pop();
  }, {
    "../Controller/CameraController": "CameraController",
    "../Controller/UIManager": "UIManager",
    "../UI/MainUI": "MainUI",
    "../UI/export/Game/fguiMainUI": "fguiMainUI"
  } ],
  HashMap: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7c7b206TJdKHLPT8OttWnGJ", "HashMap");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var HashMap = function() {
      function HashMap() {
        this._list = new Array();
        this.clear();
      }
      HashMap.prototype.getIndexByKey = function(key) {
        var count = this._list.length;
        for (var index = 0; index < count; index++) {
          var element = this._list[index];
          if (element.key == key) return index;
        }
        return -1;
      };
      Object.defineProperty(HashMap.prototype, "keys", {
        get: function() {
          var keys = new Array();
          for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
            var element = _a[_i];
            element && keys.push(element.key);
          }
          return keys;
        },
        enumerable: true,
        configurable: true
      });
      HashMap.prototype.add = function(key, value) {
        var data = {
          key: key,
          value: value
        };
        var index = this.getIndexByKey(key);
        -1 != index ? this._list[index] = data : this._list.push(data);
      };
      Object.defineProperty(HashMap.prototype, "values", {
        get: function() {
          return this._list;
        },
        enumerable: true,
        configurable: true
      });
      HashMap.prototype.remove = function(key) {
        var index = this.getIndexByKey(key);
        if (-1 != index) {
          var data = this._list[index];
          this._list.splice(index, 1);
          return data;
        }
        return null;
      };
      HashMap.prototype.has = function(key) {
        var index = this.getIndexByKey(key);
        return -1 != index;
      };
      HashMap.prototype.get = function(key) {
        var index = this.getIndexByKey(key);
        if (-1 != index) {
          var data = this._list[index];
          return data.value;
        }
        return null;
      };
      Object.defineProperty(HashMap.prototype, "length", {
        get: function() {
          return this._list.length;
        },
        enumerable: true,
        configurable: true
      });
      HashMap.prototype.sort = function(compare) {
        this._list.sort(compare);
      };
      HashMap.prototype.forEachKeyValue = function(f) {
        var count = this._list.length;
        for (var index = 0; index < count; index++) {
          var element = this._list[index];
          f(element);
        }
      };
      HashMap.prototype.forEach = function(f) {
        var count = this._list.length;
        for (var index = 0; index < count; index++) {
          var element = this._list[index];
          f(element.key, element.value);
        }
      };
      HashMap.prototype.clear = function() {
        this._list = [];
      };
      return HashMap;
    }();
    exports.HashMap = HashMap;
    cc._RF.pop();
  }, {} ],
  MainUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8bab8ACSRpOXJccC9/XWJhm", "MainUI");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UIManager_1 = require("../Controller/UIManager");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MainUI = function(_super) {
      __extends(MainUI, _super);
      function MainUI() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.uiView = null;
        _this.curMaxHeight = 0;
        _this.minRecordLineY = -600;
        return _this;
      }
      MainUI.prototype.register = function(view) {
        this.uiView = view;
        this.init();
        return this;
      };
      MainUI.prototype.init = function() {
        this.uiView.m_altitudeSlider.value = 0;
        this.uiView.m_altitudeLabel.title = "";
        this.uiView.m_Record.getChild("label").asLabel.title = this.curMaxHeight.toFixed(2) + "m";
        this.uiView.m_Record.setPosition(0, this.minRecordLineY);
        this.uiView.onClick(function() {
          EventManager_1.gEventMgr.emit(EventName_1.GlobalEvent.PUNCH);
        }, this);
        this.uiView.m_punch.visible = false;
        this.uiView.m_altitudeSlider.touchable = false;
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.UPDATE_HEIGHT, this.updateCurHeight, this);
      };
      MainUI.prototype.updateCurHeight = function(value, curHeight, speed) {
        this.uiView.m_altitudeSlider.value = value;
        curHeight = Math.max(curHeight, 0);
        var heightTitle = CMath.NumberFormat(curHeight.toFixed(2)) + "m";
        this.uiView.m_altitudeLabel.title = heightTitle;
        if (curHeight >= this.curMaxHeight) {
          this.curMaxHeight = curHeight;
          this.uiView.m_Record.getChild("label").asLabel.title = heightTitle;
        }
        0 == this.curMaxHeight && (this.curMaxHeight = 1);
        this.uiView.m_Record.y = this.minRecordLineY * (1 - curHeight / this.curMaxHeight);
        this.uiView.m_Record.y = CMath.Clamp(this.uiView.m_Record.y, 0, this.minRecordLineY);
      };
      MainUI.prototype.update = function(dt) {};
      MainUI = __decorate([ ccclass ], MainUI);
      return MainUI;
    }(UIManager_1.BaseUI);
    exports.default = MainUI;
    cc._RF.pop();
  }, {
    "../Controller/UIManager": "UIManager",
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName"
  } ],
  PixelSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2b15abBxSNPNrI23Xj19DUq", "PixelSprite");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PixelSprite = function(_super) {
      __extends(PixelSprite, _super);
      function PixelSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.material = new ShaderManager_1.PixelStyleMaterial();
        _this.spineMaterial = new ShaderManager_1.PixelSpineMaterial();
        _this.oldMaterial = null;
        _this.oldSpineMaterial = null;
        _this.sampleCount = 800;
        return _this;
      }
      PixelSprite.prototype.onLoad = function() {
        var _this = this;
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.PXIEL_ENABLE, function() {
          PXIEL ? _this.init() : _this.reset();
        }, this);
        PXIEL ? this.init() : this.reset();
      };
      PixelSprite.prototype.init = function() {
        if (!PXIEL) return;
        var sprite = this.getComponent(cc.Sprite);
        var spine = this.getComponent(sp.Skeleton);
        var label = this.getComponent(cc.Label);
        this.material.setDefine("disableColor", false);
        this.spineMaterial.setDefine("disableColor", false);
        this.material.setProperty("sampleCount", this.sampleCount);
        this.spineMaterial.setProperty("sampleCount", this.sampleCount);
        if (sprite) {
          this.oldMaterial = sprite["_spriteMaterial"];
          sprite["_spriteMaterial"] = this.material;
          sprite["_activateMaterial"]();
        }
        if (label) {
          this.oldMaterial = label["_material"];
          label["_frame"] && label["_frame"]["_texture"] && (this.material.texture = label["_frame"]["_texture"]);
          label["_material"] = this.material;
          label["_activateMaterial"]();
        }
        if (spine) {
          this.oldSpineMaterial = spine["_material"];
          spine["_updateMaterial"](this.spineMaterial);
        }
      };
      PixelSprite.prototype.reset = function() {
        var sprite = this.getComponent(cc.Sprite);
        var spine = this.getComponent(sp.Skeleton);
        var label = this.getComponent(cc.Label);
        if (sprite && this.oldMaterial) {
          sprite["_spriteMaterial"] = this.oldMaterial;
          sprite["_activateMaterial"]();
        }
        if (label && this.oldMaterial) {
          label["_material"] = this.oldMaterial;
          label["_activateMaterial"]();
        }
        spine && this.oldSpineMaterial && spine["_updateMaterial"](this.oldSpineMaterial);
      };
      __decorate([ property(cc.Integer) ], PixelSprite.prototype, "sampleCount", void 0);
      PixelSprite = __decorate([ ccclass ], PixelSprite);
      return PixelSprite;
    }(cc.Component);
    exports.default = PixelSprite;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName",
    "./ShaderManager": "ShaderManager"
  } ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0b2b8UA771NAq1r4Ezauy2i", "Player");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventName_1 = require("../Event/EventName");
    var EventManager_1 = require("../Event/EventManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Player = function(_super) {
      __extends(Player, _super);
      function Player() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Player.prototype.onLoad = function() {
        var _this = this;
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.TOSS, function() {
          _this.getComponent(cc.Animation).play("toss");
        }, this);
      };
      Player.prototype.start = function() {};
      Player.prototype.update = function(dt) {};
      Player = __decorate([ ccclass ], Player);
      return Player;
    }(cc.Component);
    exports.default = Player;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName"
  } ],
  PointWave: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "24b0dt3YqhEQqqnV84jUdhq", "PointWave");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PointWaveSprite = function(_super) {
      __extends(PointWaveSprite, _super);
      function PointWaveSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.material = new ShaderManager_1.PointWaveMaterial();
        _this.time = 0;
        _this.waveRange = .01;
        return _this;
      }
      PointWaveSprite.prototype.onLoad = function() {
        var _this = this;
        console.log(this.node);
        var sprite = this.getComponent(cc.Sprite);
        if (!sprite) return;
        sprite["_spriteMaterial"] = this.material;
        sprite["_activateMaterial"]();
        this.material.setProperty("range", .01);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
          var location = _this.node.convertToNodeSpace(event.getLocation());
          location.x /= _this.node.getContentSize().width;
          location.y /= _this.node.getContentSize().height;
          location.y = 1 - location.y;
          _this.time = 0;
          _this.waveRange = .01;
          _this.material.setProperty("time", _this.time);
          _this.material.setProperty("range", _this.waveRange);
          _this.material.setProperty("point", location);
        }, this);
      };
      PointWaveSprite.prototype.start = function() {};
      PointWaveSprite.prototype.update = function(dt) {
        this.material.setProperty("range", this.waveRange);
        this.material.setProperty("time", this.time);
        this.material.setProperty("deltaTime", dt);
        this.time += dt / 2;
        this.waveRange > .1 && (this.waveRange = .1);
      };
      PointWaveSprite = __decorate([ ccclass ], PointWaveSprite);
      return PointWaveSprite;
    }(cc.Component);
    exports.default = PointWaveSprite;
    cc._RF.pop();
  }, {
    "./ShaderManager": "ShaderManager"
  } ],
  Record: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "25052x4q7BLRJgn5I6NP8v1", "Record");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Record = function(_super) {
      __extends(Record, _super);
      function Record() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Record.createInstanceSync = function() {
        fgui.UIObjectFactory.setExtension("ui://vmvonsvyhxexrh", Record);
        return fgui.UIPackage.createObject("Game", "Record");
      };
      Record.createInstance = function(complete) {
        fgui.UIPackage.loadPackage("UI/dync/Game", function(err) {
          err ? console.error("load package error:", err) : complete(fgui.UIPackage.createObject("Game", "Record").asCom);
        });
      };
      Record.releaseInstance = function() {
        fgui.UIPackage.removePackage("Game");
      };
      Record.prototype.onConstruct = function() {
        this.m_line = this.getChild("line");
        this.m_label = this.getChild("label");
      };
      Record.URL = "ui://vmvonsvyhxexrh";
      return Record;
    }(fgui.GComponent);
    exports.default = Record;
    cc._RF.pop();
  }, {} ],
  ShaderManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "33f74kNXkxB/K9XULryyDE2", "ShaderManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderTemplate_1 = require("./ShaderTemplate");
    var renderEngine = cc.renderer.renderEngine;
    var Material = renderEngine.Material;
    var renderer = renderEngine.renderer;
    var gfx = renderEngine.gfx;
    var ShaderManager = function() {
      function ShaderManager() {
        var programLib = cc.renderer["_forward"]["_programLib"];
        if (!programLib) {
          console.error("programLib not exist!");
          return;
        }
        for (var _i = 0, templates_1 = ShaderTemplate_1.templates; _i < templates_1.length; _i++) {
          var template = templates_1[_i];
          programLib._templates[template.name] || programLib.define(template.name, template.vert, template.frag, template.defines);
        }
      }
      Object.defineProperty(ShaderManager, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new ShaderManager();
        },
        enumerable: true,
        configurable: true
      });
      return ShaderManager;
    }();
    exports.ShaderManager = ShaderManager;
    false;
    var TransitionMaterial = function(_super) {
      __extends(TransitionMaterial, _super);
      function TransitionMaterial() {
        var _this = _super.call(this) || this;
        _this.time = 0;
        _this.range = .1;
        var pass = new renderer.Pass("transition_sprite");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "color",
          type: renderer.PARAM_COLOR4
        }, {
          name: "time",
          type: renderer.PARAM_FLOAT
        }, {
          name: "range",
          type: renderer.PARAM_FLOAT
        } ], [ pass ]);
        _this["_color"] = {
          r: 1,
          g: 1,
          b: 1,
          a: 1
        };
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          color: _this._color,
          time: _this.time,
          range: _this.range
        }, [ {
          name: "useTexture",
          value: true
        }, {
          name: "useModel",
          value: false
        }, {
          name: "useColor",
          value: true
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(TransitionMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(TransitionMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(TransitionMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(TransitionMaterial.prototype, "useTexture", {
        get: function() {
          return this._effect.getDefine("useTexture");
        },
        set: function(val) {
          this._effect.define("useTexture", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(TransitionMaterial.prototype, "useColor", {
        get: function() {
          return this._effect.getDefine("useColor");
        },
        set: function(val) {
          this._effect.define("useColor", val);
        },
        enumerable: true,
        configurable: true
      });
      TransitionMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      TransitionMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.useColor = this.useColor;
        copy.updateHash();
        return copy;
      };
      return TransitionMaterial;
    }(Material);
    exports.TransitionMaterial = TransitionMaterial;
    var WaveMaterial = function(_super) {
      __extends(WaveMaterial, _super);
      function WaveMaterial() {
        var _this = _super.call(this) || this;
        _this.time = 0;
        _this.range = 2;
        _this.deltaTime = 0;
        var pass = new renderer.Pass("wave_sprite");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "color",
          type: renderer.PARAM_COLOR4
        }, {
          name: "time",
          type: renderer.PARAM_FLOAT
        }, {
          name: "deltaTime",
          type: renderer.PARAM_FLOAT
        }, {
          name: "range",
          type: renderer.PARAM_FLOAT
        } ], [ pass ]);
        _this["_color"] = {
          r: 1,
          g: 1,
          b: 1,
          a: 1
        };
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          color: _this._color,
          time: _this.time,
          range: _this.range,
          deltaTime: _this.deltaTime
        }, [ {
          name: "useTexture",
          value: true
        }, {
          name: "useModel",
          value: false
        }, {
          name: "useColor",
          value: true
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(WaveMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WaveMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WaveMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WaveMaterial.prototype, "useTexture", {
        get: function() {
          return this._effect.getDefine("useTexture");
        },
        set: function(val) {
          this._effect.define("useTexture", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(WaveMaterial.prototype, "useColor", {
        get: function() {
          return this._effect.getDefine("useColor");
        },
        set: function(val) {
          this._effect.define("useColor", val);
        },
        enumerable: true,
        configurable: true
      });
      WaveMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      WaveMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.useColor = this.useColor;
        copy.updateHash();
        return copy;
      };
      return WaveMaterial;
    }(Material);
    exports.WaveMaterial = WaveMaterial;
    var ButterflySpringMaterial = function(_super) {
      __extends(ButterflySpringMaterial, _super);
      function ButterflySpringMaterial() {
        var _this = _super.call(this) || this;
        var pass = new renderer.Pass("butterfly_spring");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "color",
          type: renderer.PARAM_COLOR4
        } ], [ pass ]);
        _this["_color"] = {
          r: 1,
          g: 1,
          b: 1,
          a: 1
        };
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          color: _this._color
        }, [ {
          name: "useTexture",
          value: true
        }, {
          name: "useModel",
          value: false
        }, {
          name: "useColor",
          value: true
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(ButterflySpringMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ButterflySpringMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ButterflySpringMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ButterflySpringMaterial.prototype, "useTexture", {
        get: function() {
          return this._effect.getDefine("useTexture");
        },
        set: function(val) {
          this._effect.define("useTexture", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ButterflySpringMaterial.prototype, "useColor", {
        get: function() {
          return this._effect.getDefine("useColor");
        },
        set: function(val) {
          this._effect.define("useColor", val);
        },
        enumerable: true,
        configurable: true
      });
      ButterflySpringMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      ButterflySpringMaterial.prototype.setDefine = function(key, val) {
        this._effect.define(key, val);
      };
      ButterflySpringMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.useColor = this.useColor;
        copy.updateHash();
        return copy;
      };
      return ButterflySpringMaterial;
    }(Material);
    exports.ButterflySpringMaterial = ButterflySpringMaterial;
    var PointWaveMaterial = function(_super) {
      __extends(PointWaveMaterial, _super);
      function PointWaveMaterial() {
        var _this = _super.call(this) || this;
        _this.time = 0;
        _this.range = 2;
        _this.deltaTime = 0;
        _this.point = cc.v2(0, 0);
        var pass = new renderer.Pass("point_wave");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "color",
          type: renderer.PARAM_COLOR4
        }, {
          name: "point",
          type: renderer.PARAM_FLOAT2
        }, {
          name: "time",
          type: renderer.PARAM_FLOAT
        }, {
          name: "deltaTime",
          type: renderer.PARAM_FLOAT
        }, {
          name: "range",
          type: renderer.PARAM_FLOAT
        } ], [ pass ]);
        _this["_color"] = {
          r: 1,
          g: 1,
          b: 1,
          a: 1
        };
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          color: _this._color,
          time: _this.time,
          range: _this.range,
          deltaTime: _this.deltaTime,
          point: _this.point
        }, [ {
          name: "useTexture",
          value: true
        }, {
          name: "useModel",
          value: false
        }, {
          name: "useColor",
          value: true
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(PointWaveMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PointWaveMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PointWaveMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PointWaveMaterial.prototype, "useTexture", {
        get: function() {
          return this._effect.getDefine("useTexture");
        },
        set: function(val) {
          this._effect.define("useTexture", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PointWaveMaterial.prototype, "useColor", {
        get: function() {
          return this._effect.getDefine("useColor");
        },
        set: function(val) {
          this._effect.define("useColor", val);
        },
        enumerable: true,
        configurable: true
      });
      PointWaveMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      PointWaveMaterial.prototype.setDefine = function(key, val) {
        this._effect.define(key, val);
      };
      PointWaveMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.useColor = this.useColor;
        copy.updateHash();
        return copy;
      };
      return PointWaveMaterial;
    }(Material);
    exports.PointWaveMaterial = PointWaveMaterial;
    var PixelStyleMaterial = function(_super) {
      __extends(PixelStyleMaterial, _super);
      function PixelStyleMaterial() {
        var _this = _super.call(this) || this;
        var pass = new renderer.Pass("pixel_style");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "color",
          type: renderer.PARAM_COLOR4
        }, {
          name: "sampleCount",
          type: renderer.PARAM_FLOAT
        } ], [ pass ]);
        _this["_color"] = {
          r: 1,
          g: 1,
          b: 1,
          a: 1
        };
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          color: _this._color,
          sampleCount: 100
        }, [ {
          name: "useTexture",
          value: true
        }, {
          name: "useModel",
          value: false
        }, {
          name: "disableColor",
          value: false
        }, {
          name: "useColor",
          value: true
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(PixelStyleMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelStyleMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelStyleMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelStyleMaterial.prototype, "useTexture", {
        get: function() {
          return this._effect.getDefine("useTexture");
        },
        set: function(val) {
          this._effect.define("useTexture", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelStyleMaterial.prototype, "useColor", {
        get: function() {
          return this._effect.getDefine("useColor");
        },
        set: function(val) {
          this._effect.define("useColor", val);
        },
        enumerable: true,
        configurable: true
      });
      PixelStyleMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      PixelStyleMaterial.prototype.setDefine = function(key, val) {
        this._effect.define(key, val);
      };
      PixelStyleMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.useColor = this.useColor;
        copy.updateHash();
        return copy;
      };
      return PixelStyleMaterial;
    }(Material);
    exports.PixelStyleMaterial = PixelStyleMaterial;
    var PixelSpineMaterial = function(_super) {
      __extends(PixelSpineMaterial, _super);
      function PixelSpineMaterial() {
        var _this = _super.call(this) || this;
        var pass = new renderer.Pass("spine_pxiel");
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);
        var mainTech = new renderer.Technique([ "transparent" ], [ {
          name: "texture",
          type: renderer.PARAM_TEXTURE_2D
        }, {
          name: "sampleCount",
          type: renderer.PARAM_FLOAT
        } ], [ pass ]);
        _this["_effect"] = new renderer.Effect([ mainTech ], {
          sampleCount: 100
        }, [ {
          name: "useModel",
          value: true
        }, {
          name: "disableColor",
          value: false
        }, {
          name: "alphaTest",
          value: false
        }, {
          name: "use2DPos",
          value: true
        }, {
          name: "useTint",
          value: false
        } ]);
        _this["_mainTech"] = mainTech;
        _this["_texture"] = null;
        return _this;
      }
      Object.defineProperty(PixelSpineMaterial.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelSpineMaterial.prototype, "texture", {
        get: function() {
          return this._texture;
        },
        set: function(val) {
          if (this._texture !== val) {
            this["_texture"] = val;
            this._effect.setProperty("texture", val.getImpl());
            this._texIds["texture"] = val.getId();
          }
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelSpineMaterial.prototype, "useModel", {
        get: function() {
          return this._effect.getDefine("useModel");
        },
        set: function(val) {
          this._effect.define("useModel", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelSpineMaterial.prototype, "use2DPos", {
        get: function() {
          return this._effect.getDefine("use2DPos");
        },
        set: function(val) {
          this._effect.define("use2DPos", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelSpineMaterial.prototype, "alphaTest", {
        get: function() {
          return this._effect.getDefine("alphaTest");
        },
        set: function(val) {
          this._effect.define("alphaTest", val);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(PixelSpineMaterial.prototype, "useTint", {
        get: function() {
          return this._effect.getDefine("useTint");
        },
        set: function(val) {
          this._effect.define("useTint", val);
        },
        enumerable: true,
        configurable: true
      });
      PixelSpineMaterial.prototype.setProperty = function(key, val) {
        this._effect.setProperty(key, val);
      };
      PixelSpineMaterial.prototype.setDefine = function(key, val) {
        this._effect.define(key, val);
      };
      PixelSpineMaterial.prototype.clone = function() {
        var copy = new TransitionMaterial();
        copy._mainTech.copy(this._mainTech);
        copy.texture = this.texture;
        copy.useTexture = this.useTexture;
        copy.useModel = this.useModel;
        copy.updateHash();
        return copy;
      };
      return PixelSpineMaterial;
    }(Material);
    exports.PixelSpineMaterial = PixelSpineMaterial;
    cc._RF.pop();
  }, {
    "./ShaderTemplate": "ShaderTemplate"
  } ],
  ShaderTemplate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1949dMh6s5BRK3S3vf90vES", "ShaderTemplate");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.templates = [ {
      name: "transition_sprite",
      vert: "\n    uniform mat4 viewProj;\n    attribute vec3 a_position;\n    attribute lowp vec4 a_color;\n    varying mediump vec4 v_pos;\n    #ifdef useModel \n        uniform mat4 model;\n    #endif\n    #ifdef useTexture\n        attribute mediump vec2 a_uv0;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifndef useColor \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel\n             mvp = viewProj * model;\n        #else\n             mvp = viewProj;  \n        #endif  \n        vec4 pos = mvp * vec4(a_position, 1);\n        #ifndef useColor\n             v_fragmentColor = a_color;\n        #endif\n        #ifdef useTexture    \n             uv0 = a_uv0;  \n        #endif  \n        v_pos = pos;\n        gl_Position = pos;\n    }",
      frag: "\n    uniform float time;\n    uniform float range;\n    varying mediump vec4 v_pos;\n    #ifdef useTexture  \n        uniform sampler2D texture;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifdef useColor\n        uniform lowp vec4 color;\n    #else  \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {  \n        #ifdef useColor    \n             vec4 o = color;\n        #else\n             vec4 o = v_fragmentColor;  \n        #endif  \n        #ifdef useTexture    \n             o *= texture2D(texture, uv0); \n             if (uv0.x <= time) {\n                float factor = time - uv0.x;\n                if (factor > range) o.w *= 0.0;\n                else o.w *= (1.0-factor/range);\n                \n            } else {\n                o.w *=  1.0;\n            }\n        #else\n            float px = v_pos.x + 1.0;\n            if (px <= time*2.0) {\n                float factor = time*2.0 - px;\n                if (factor > range) o.w *= 0.0;\n                else o.w *= (1.0-factor/range);\n            } else {\n                o.w *=  1.0;\n            }\n        #endif  \n        \n        gl_FragColor = o;\n    }",
      defines: [ {
        name: "useModel"
      }, {
        name: "useTexture"
      }, {
        name: "useColor"
      } ]
    }, {
      name: "butterfly_spring",
      vert: "\n  \n    uniform mat4 viewProj;\n    attribute vec3 a_position;\n    attribute lowp vec4 a_color;\n    #ifdef useModel \n        uniform mat4 model;\n    #endif\n    #ifdef useTexture\n        attribute mediump vec2 a_uv0;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifndef useColor \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel\n             mvp = viewProj * model;\n        #else\n             mvp = viewProj;  \n        #endif  \n        vec4 pos = mvp * vec4(a_position, 1);\n        #ifndef useColor\n             v_fragmentColor = a_color;\n        #endif\n        #ifdef useTexture    \n             uv0 = a_uv0;  \n        #endif  \n    \n        gl_Position = pos;\n    }",
      frag: "\n    #ifdef useTexture  \n        uniform sampler2D texture;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifdef useColor\n        uniform lowp vec4 color;\n    #else  \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {  \n        #ifdef useColor    \n             vec4 o = color;\n        #else\n             vec4 o = v_fragmentColor;  \n        #endif  \n        #ifdef useTexture    \n             vec2 uv_temp = uv0;\n             float x = uv_temp.x;\n             float y = uv_temp.y;\n             float offset = uv0.x * 3.14 / 2.0;\n             o.r = offset;\n             o *= texture2D(texture, uv_temp); \n\n        #endif  \n        gl_FragColor = o;\n    }",
      defines: [ {
        name: "useModel"
      }, {
        name: "useTexture"
      }, {
        name: "useColor"
      } ]
    }, {
      name: "wave_sprite",
      vert: "\n    uniform float time;\n    uniform float deltaTime;\n    varying float v_time;\n    varying float v_deltaTime;\n    uniform mat4 viewProj;\n    attribute vec3 a_position;\n    attribute lowp vec4 a_color;\n    #ifdef useModel \n        uniform mat4 model;\n    #endif\n    #ifdef useTexture\n        attribute mediump vec2 a_uv0;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifndef useColor \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel\n             mvp = viewProj * model;\n        #else\n             mvp = viewProj;  \n        #endif  \n        vec4 pos = mvp * vec4(a_position, 1);\n        #ifndef useColor\n             v_fragmentColor = a_color;\n        #endif\n        #ifdef useTexture    \n             uv0 = a_uv0;  \n        #endif  \n        v_time = time;\n        v_deltaTime = deltaTime;\n        gl_Position = pos;\n    }",
      frag: "\n    varying float v_time;\n    varying float v_deltaTime;\n    \n    uniform float range;\n    #ifdef useTexture  \n        uniform sampler2D texture;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifdef useColor\n        uniform lowp vec4 color;\n    #else  \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {  \n        #ifdef useColor    \n             vec4 o = color;\n        #else\n             vec4 o = v_fragmentColor;  \n        #endif  \n        #ifdef useTexture    \n             vec2 uv_temp = uv0;\n             float x = uv_temp.x;\n             float y = uv_temp.y;\n             uv_temp.x += range*(sin(v_deltaTime + v_time + y) - sin(v_time + y));\n             uv_temp.y += range*(sin(v_deltaTime + v_time + x) - sin(v_time + x));\n             \n             o *= texture2D(texture, uv_temp); \n            \n        #endif  \n        //if (abs(o.x - 1.0) < 0.05 && abs(o.y - 1.0) < 0.05 && abs(o.z - 1.0) < 0.05) o.w = 0.0;\n        gl_FragColor = o;\n    }",
      defines: [ {
        name: "useModel"
      }, {
        name: "useTexture"
      }, {
        name: "useColor"
      } ]
    }, {
      name: "point_wave",
      vert: "\n    uniform float time;\n    uniform float deltaTime;\n    varying float v_time;\n    varying float v_deltaTime;\n    uniform mat4 viewProj;\n    attribute vec3 a_position;\n    attribute lowp vec4 a_color;\n    #ifdef useModel \n        uniform mat4 model;\n    #endif\n    #ifdef useTexture\n        attribute mediump vec2 a_uv0;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifndef useColor \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel\n             mvp = viewProj * model;\n        #else\n             mvp = viewProj;  \n        #endif  \n        vec4 pos = mvp * vec4(a_position, 1);\n        #ifndef useColor\n             v_fragmentColor = a_color;\n        #endif\n        #ifdef useTexture    \n             uv0 = a_uv0;  \n        #endif  \n        v_time = time;\n        v_deltaTime = deltaTime;\n        gl_Position = pos;\n    }",
      frag: "\n    varying float v_time;\n    varying float v_deltaTime;\n    uniform mediump vec2 point;  \n    uniform float range;\n    #ifdef useTexture  \n        uniform sampler2D texture;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifdef useColor\n        uniform lowp vec4 color;\n    #else  \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {  \n        #ifdef useColor    \n             vec4 o = color;\n        #else\n             vec4 o = v_fragmentColor;  \n        #endif  \n        #ifdef useTexture    \n             vec2 uv_temp = uv0;\n             float x = uv_temp.x;\n             float y = uv_temp.y;\n             float r = sqrt((x-point.x)*(x-point.x) + (y-point.y)*(y-point.y));\n             float f = abs(range - abs(r - v_time));\n             if (abs(r - v_time) < range) {\n                 if(x > point.x) {\n                    uv_temp.x -= 0.01;\n                 } else if (x < point.x) {\n                     uv_temp.x += 0.01;\n                 }\n               \n                 if(y > point.y) {\n                    uv_temp.y -= 0.01;\n                 } else if (y > point.y) {\n                     uv_temp.y += 0.01;\n                 }\n                 \n                o.r *= (1.0 + f);\n                o.b *= (1.0 + f);\n                o.g *= (1.0 + f);\n             \n             } else {\n                #ifdef useShadow\n                 if (f > 0.3) f = 0.3;\n                o.r *= (1.0 - f);\n                o.b *= (1.0 - f);\n                o.g *= (1.0 - f);\n                #endif \n\n             }\n             o *= texture2D(texture, uv_temp); \n            \n        #endif  \n        //if (abs(o.x - 1.0) < 0.05 && abs(o.y - 1.0) < 0.05 && abs(o.z - 1.0) < 0.05) o.w = 0.0;\n        gl_FragColor = o;\n    }",
      defines: [ {
        name: "useModel"
      }, {
        name: "useTexture"
      }, {
        name: "useColor"
      } ]
    }, {
      name: "pixel_style",
      vert: "\n    uniform mat4 viewProj;\n    attribute vec3 a_position;\n    attribute lowp vec4 a_color;\n    #ifdef useModel \n        uniform mat4 model;\n    #endif\n    #ifdef useTexture\n        attribute mediump vec2 a_uv0;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifndef useColor \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel\n             mvp = viewProj * model;\n        #else\n             mvp = viewProj;  \n        #endif  \n        vec4 pos = mvp * vec4(a_position, 1);\n        #ifndef useColor\n             v_fragmentColor = a_color;\n        #endif\n        #ifdef useTexture    \n             uv0 = a_uv0;  \n        #endif  \n        gl_Position = pos;\n    }",
      frag: "\n    uniform float sampleCount;\n    #ifdef useTexture  \n        uniform sampler2D texture;  \n        varying mediump vec2 uv0;\n    #endif\n    #ifdef useColor\n        uniform lowp vec4 color;\n    #else  \n        varying lowp vec4 v_fragmentColor;\n    #endif\n    void main () {  \n        #ifdef useColor    \n             vec4 o = color;\n        #else\n             vec4 o = v_fragmentColor;  \n        #endif  \n        #ifdef useTexture    \n             vec2 uv_temp = uv0;\n             float count = 1.0 / sampleCount;\n\n             float i = floor(uv0.x / count);\n             float j = floor(uv0.y / count);\n             float startX = count * i;\n             float endX = startX + count;\n             float pointX = (startX + endX) / 2.0;\n             \n\n             float startY = count * j;\n             float endY= startY + count;\n             float pointY = (startY + endY) / 2.0;\n             \n             if (uv0.x > startX && uv0.x < endX && uv0.y > startY && uv0.y < endY) {\n                uv_temp.x = pointX;\n                uv_temp.y = pointY;\n            }\n             o *= texture2D(texture, uv_temp); \n             #ifdef disableColor  \n                 float av = (o.r+o.g+o.b) / 3.0;  \n                 o.r = av;\n                 o.g = av;\n                 o.b = av;\n            #endif  \n        #endif  \n        gl_FragColor = o;\n    }",
      defines: [ {
        name: "useModel"
      }, {
        name: "useTexture"
      }, {
        name: "useColor"
      } ]
    }, {
      name: "spine_pxiel",
      vert: "\n    uniform mat4 viewProj;\n    #ifdef use2DPos\n      attribute vec2 a_position;\n    #else\n      attribute vec3 a_position;\n    #endif\n    attribute lowp vec4 a_color;\n    #ifdef useTint\n      attribute lowp vec4 a_color0;\n    #endif\n    #ifdef useModel  \n      uniform mat4 model;\n    #endif\n    attribute mediump vec2 a_uv0;\n    varying mediump vec2 uv0;\n    varying lowp vec4 v_light;\n    #ifdef useTint  \n      varying lowp vec4 v_dark;\n    #endif\n    void main () {\n        mat4 mvp;\n        #ifdef useModel    \n           mvp = viewProj * model;  \n        #else    \n           mvp = viewProj;  \n        #endif\n        #ifdef use2DPos  \n           vec4 pos = mvp * vec4(a_position, 0, 1);\n        #else  \n           vec4 pos = mvp * vec4(a_position, 1);  \n        #endif  \n        v_light = a_color;  \n        #ifdef useTint    \n           v_dark = a_color0;  \n        #endif  \n        uv0 = a_uv0;  \n        gl_Position = pos;\n    }",
      frag: "\n        uniform float sampleCount;\n        uniform sampler2D texture;\n        varying mediump vec2 uv0;\n        #ifdef alphaTest  \n           uniform lowp float alphaThreshold;\n        #endif\n        varying lowp vec4 v_light;\n        #ifdef useTint\n           varying lowp vec4 v_dark;\n        #endif\n        void main () {\n                vec2 uv_temp = uv0;\n                float count = 1.0 / sampleCount;\n\n                float i = floor(uv0.x / count);\n                float j = floor(uv0.y / count);\n                float startX = count * i;\n                float endX = startX + count;\n                float pointX = (startX + endX) / 2.0;\n             \n\n                float startY = count * j;\n                float endY= startY + count;\n                float pointY = (startY + endY) / 2.0;\n             \n                if (uv0.x > startX && uv0.x < endX && uv0.y > startY && uv0.y < endY) {\n                   uv_temp.x = pointX;\n                   uv_temp.y = pointY;\n                }\n\n                vec4 texColor = texture2D(texture, uv_temp);\n                vec4 finalColor;  \n                #ifdef useTint\n                    finalColor.a = v_light.a * texColor.a;    \n                    finalColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;  \n                #else\n                    finalColor = texColor * v_light;\n                #endif  \n                #ifdef alphaTest    \n                    if (finalColor.a <= alphaThreshold)      \n                        discard;  \n                #endif  \n                #ifdef disableColor    \n                    float av = (finalColor.r+finalColor.g+finalColor.b) / 3.0;  \n                    finalColor.r = av;\n                    finalColor.g = av;\n                    finalColor.b = av;\n                #endif  \n                gl_FragColor = finalColor;\n        }",
      defines: [ {
        name: "useModel"
      }, {
        name: "alphaTest"
      }, {
        name: "use2DPos"
      }, {
        name: "useTint"
      } ]
    } ];
    cc._RF.pop();
  }, {} ],
  Solar: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "66900C1/KhAO4HonDMvabMT", "Solar");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager_1 = require("../Event/EventManager");
    var EventName_1 = require("../Event/EventName");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Solar = function(_super) {
      __extends(Solar, _super);
      function Solar() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.moveFactor = -.01;
        _this.planet = null;
        _this.stars = null;
        _this.meteorites = null;
        _this.solarSystem = null;
        _this.solarRoot = null;
        _this.speedY = 0;
        _this.speed = 0;
        _this.speedPoint = 0;
        _this.starsBasePos = [];
        _this.maxX = -640;
        _this.minX = -320 - 6 * cc.winSize.height;
        return _this;
      }
      Solar.prototype.onLoad = function() {
        this.basePos = cc.v2(this.node.x, this.node.y);
        this.planetBasePos = cc.v2(this.planet.x, this.planet.y);
        this.meteBasePos = cc.v2(this.meteorites.x, this.meteorites.y);
        for (var i = 0; i < this.stars.childrenCount; i++) {
          var child = this.stars.children[i];
          this.starsBasePos[i] = cc.v2(child.x, child.y);
        }
        this.node.active = true;
        EventManager_1.gEventMgr.on(EventName_1.GlobalEvent.SCALE_SCENE, this.scaleScene, this);
        this.node.opacity = 0;
        this.solarSystem.opacity = 0;
        this.solarRoot.opacity = 255;
      };
      Solar.prototype.scaleScene = function(speed, height, maxHeight) {
        this.speed = speed;
        var opacityFactor = Math.max(cc.winSize.height, height - 3 * cc.winSize.height);
        this.node.opacity = 255 * (1 - cc.winSize.height / opacityFactor);
        var offset = Math.max(0, height - 1e6);
        this.solarSystem.opacity = 255 * Math.min(1, offset / 2e5);
        this.solarRoot.opacity = 255 - this.solarSystem.opacity;
        offset = Math.max(0, height - 11e5);
        this.solarSystem.y = 583 * CMath.Clamp(1 - offset / 2e5, 1, 0);
        offset = Math.max(0, height - 13e5);
        if (this.solarSystem.opacity >= 255) {
          this.solarSystem.scaleX = 10 * CMath.Clamp(1 - offset / 2e5, 1, 0);
          this.solarSystem.scaleY = this.solarSystem.scaleX;
        }
        if (this.node.opacity > 180) this.speedY = this.moveFactor * speed; else {
          this.node.setPosition(this.basePos);
          this.planet.setPosition(this.planetBasePos);
          this.meteorites.setPosition(this.meteBasePos);
          for (var i = 0; i < this.stars.childrenCount; i++) {
            var child = this.stars.children[i];
            child.setPosition(this.starsBasePos[i]);
          }
          this.speedY = 0;
        }
      };
      Solar.prototype.start = function() {};
      Solar.prototype.update = function(dt) {
        var _a, _b;
        var offset = this.speedY * dt;
        var offsetAdapt = 0;
        if (this.speed > this.speedPoint && this.speed < 0 && 0 != this.speedPoint) offsetAdapt += offset; else {
          this.node.y += offset;
          this.speed < 0 && (this.speedPoint = 0);
        }
        if (this.node.y < this.minX) {
          offsetAdapt += this.node.y - this.minX;
          this.node.y = this.minX;
          0 == this.speedPoint && (this.speedPoint = -this.speed);
        } else if (this.node.y > this.maxX) {
          offsetAdapt += this.node.y - this.maxX;
          this.node.y = this.maxX;
        }
        this.planet.y += 1.5 * offset + offsetAdapt;
        this.meteorites.y += .5 * offset + offsetAdapt;
        this.stars.children[0].y += .25 * offset + offsetAdapt;
        this.stars.children[1].y += .25 * offset + offsetAdapt;
        if (this.speed > 0) {
          if (this.stars.children[0].y + this.node.y + 640 < -1300) {
            this.stars.children[0].y = this.stars.children[1].y + 1280;
            _a = [ this.stars.children[1], this.stars.children[0] ], this.stars.children[0] = _a[0], 
            this.stars.children[1] = _a[1];
          }
        } else if (this.stars.children[1].y + this.node.y + 640 > 1300) {
          this.stars.children[1].y = this.stars.children[0].y - 1280;
          _b = [ this.stars.children[1], this.stars.children[0] ], this.stars.children[0] = _b[0], 
          this.stars.children[1] = _b[1];
        }
      };
      __decorate([ property(cc.Float) ], Solar.prototype, "moveFactor", void 0);
      __decorate([ property(cc.Node) ], Solar.prototype, "planet", void 0);
      __decorate([ property(cc.Node) ], Solar.prototype, "stars", void 0);
      __decorate([ property(cc.Node) ], Solar.prototype, "meteorites", void 0);
      __decorate([ property(cc.Node) ], Solar.prototype, "solarSystem", void 0);
      __decorate([ property(cc.Node) ], Solar.prototype, "solarRoot", void 0);
      Solar = __decorate([ ccclass ], Solar);
      return Solar;
    }(cc.Component);
    exports.default = Solar;
    cc._RF.pop();
  }, {
    "../Event/EventManager": "EventManager",
    "../Event/EventName": "EventName"
  } ],
  TableMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "884297Uj29L8bDc20pwjuOc", "TableMgr");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TableMgr = function() {
      function TableMgr() {
        this.load = TableMgr.JSON_URL && "" != TableMgr.JSON_URL ? cc.loader.load.bind(cc.loader) : cc.loader.loadRes.bind(cc.loader);
        this.fileFormat = TableMgr.JSON_URL && "" != TableMgr.JSON_URL ? ".json?time=" + Date.now() : "";
        this.total = 0;
        this.complete = 0;
        this.Monster_ball__monster = {};
        this.Monster_ball_ball = {};
        this.Monster_ball_evaluate = {};
        this.Monster_ball_paly_level = {};
        this.Monster_ball_prop = {};
        this.Monster_ball_scene = {};
        this.Monster_ball_text = {};
      }
      Object.defineProperty(TableMgr, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new TableMgr();
        },
        enumerable: true,
        configurable: true
      });
      TableMgr.prototype.startLoad = function(url, complete, progress) {
        this.completeCallback = complete;
        this.progressCallback = progress;
        var self = this;
        this.load(TableMgr.JSON_URL + url.trim().split("/").join("") + "/file_list" + this.fileFormat, function(err, JsonAsset) {
          if (err) console.error(err.errorMessage); else {
            var jsonArray = "Array" == JsonAsset.constructor["name"] ? JsonAsset : JsonAsset.json;
            this.total = jsonArray.length;
            for (var _i = 0, jsonArray_1 = jsonArray; _i < jsonArray_1.length; _i++) {
              var jsonFile = jsonArray_1[_i];
              self.loadJson(url.trim().split("/").join("") + "/" + jsonFile.replace(".json", ""));
            }
          }
        }.bind(this));
      };
      TableMgr.prototype.loadJson = function(url) {
        console.log("start load:" + url);
        var self = this;
        var tableName = url.split("/")[1];
        this.load(TableMgr.JSON_URL + url + this.fileFormat, function(err, JsonAsset) {
          if (err) console.error(err.errorMessage); else {
            var jsonArray = "Array" == JsonAsset.constructor["name"] ? JsonAsset : JsonAsset.json;
            for (var _i = 0, jsonArray_2 = jsonArray; _i < jsonArray_2.length; _i++) {
              var json = jsonArray_2[_i];
              self[tableName][json["ID"]] = json;
            }
            self.completeLoad();
          }
        }.bind(this));
      };
      TableMgr.prototype.completeLoad = function() {
        this.complete++;
        this.complete >= this.total && this.completeCallback && this.completeCallback();
      };
      TableMgr.prototype.getMonster_ball__monster = function(key) {
        if (this.Monster_ball__monster[key]) return this.Monster_ball__monster[key];
        console.error("Monster_ball__monster \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball__monster_Data = function() {
        return this.Monster_ball__monster;
      };
      TableMgr.prototype.getMonster_ball_ball = function(key) {
        if (this.Monster_ball_ball[key]) return this.Monster_ball_ball[key];
        console.error("Monster_ball_ball \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball_ball_Data = function() {
        return this.Monster_ball_ball;
      };
      TableMgr.prototype.getMonster_ball_evaluate = function(key) {
        if (this.Monster_ball_evaluate[key]) return this.Monster_ball_evaluate[key];
        console.error("Monster_ball_evaluate \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball_evaluate_Data = function() {
        return this.Monster_ball_evaluate;
      };
      TableMgr.prototype.getMonster_ball_paly_level = function(key) {
        if (this.Monster_ball_paly_level[key]) return this.Monster_ball_paly_level[key];
        console.error("Monster_ball_paly_level \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball_paly_level_Data = function() {
        return this.Monster_ball_paly_level;
      };
      TableMgr.prototype.getMonster_ball_prop = function(key) {
        if (this.Monster_ball_prop[key]) return this.Monster_ball_prop[key];
        console.error("Monster_ball_prop \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball_prop_Data = function() {
        return this.Monster_ball_prop;
      };
      TableMgr.prototype.getMonster_ball_scene = function(key) {
        if (this.Monster_ball_scene[key]) return this.Monster_ball_scene[key];
        console.error("Monster_ball_scene \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball_scene_Data = function() {
        return this.Monster_ball_scene;
      };
      TableMgr.prototype.getMonster_ball_text = function(key) {
        if (this.Monster_ball_text[key]) return this.Monster_ball_text[key];
        console.error("Monster_ball_text \u4e0d\u5b58key\uff1a" + key);
        return null;
      };
      TableMgr.prototype.getAll_Monster_ball_text_Data = function() {
        return this.Monster_ball_text;
      };
      TableMgr.JSON_URL = "";
      return TableMgr;
    }();
    exports.TableMgr = TableMgr;
    cc._RF.pop();
  }, {} ],
  TransitionMask: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "08619DCzsFP6qP811EwquC2", "TransitionMask");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TransitionMask = function(_super) {
      __extends(TransitionMask, _super);
      function TransitionMask() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.transitionMaterial = new ShaderManager_1.TransitionMaterial();
        _this.startTrans = false;
        _this.time = 0;
        return _this;
      }
      TransitionMask.prototype.onLoad = function() {
        var mask = this.getComponent(cc.Mask);
        mask["_material"] = this.transitionMaterial;
        mask["_activateMaterial"]();
        this.transitionMaterial.setProperty("range", .1);
      };
      TransitionMask.prototype.start = function() {};
      TransitionMask.prototype.update = function(dt) {
        if (!this.startTrans) return;
        this.time += 1.2 * dt;
        this.transitionMaterial.setProperty("time", this.time);
      };
      TransitionMask = __decorate([ ccclass ], TransitionMask);
      return TransitionMask;
    }(cc.Component);
    exports.default = TransitionMask;
    cc._RF.pop();
  }, {
    "./ShaderManager": "ShaderManager"
  } ],
  TransitionSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8f657dtmIRFtbSyVO1VxUsJ", "TransitionSprite");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TransitionSprite = function(_super) {
      __extends(TransitionSprite, _super);
      function TransitionSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.transitionMaterial = new ShaderManager_1.TransitionMaterial();
        _this.time = 0;
        return _this;
      }
      TransitionSprite.prototype.onLoad = function() {
        var sprite = this.getComponent(cc.Sprite);
        sprite["_spriteMaterial"] = this.transitionMaterial;
        sprite["_activateMaterial"]();
        this.transitionMaterial.setProperty("range", .1);
      };
      TransitionSprite.prototype.start = function() {};
      TransitionSprite.prototype.update = function(dt) {
        if (!this.node.active) {
          this.Time = 0;
          return;
        }
        this.Time += .8 * dt;
        if (this.time > 2) {
          this.Time = 0;
          this.node.active = false;
        }
      };
      Object.defineProperty(TransitionSprite.prototype, "Time", {
        get: function() {
          return this.time;
        },
        set: function(val) {
          this.time = val;
          this.transitionMaterial.setProperty("time", this.time);
        },
        enumerable: true,
        configurable: true
      });
      TransitionSprite = __decorate([ ccclass ], TransitionSprite);
      return TransitionSprite;
    }(cc.Component);
    exports.default = TransitionSprite;
    cc._RF.pop();
  }, {
    "./ShaderManager": "ShaderManager"
  } ],
  UIManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0637bWDjtNKJorZPZNuT2pe", "UIManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var HashMap_1 = require("../Utils/HashMap");
    var ccclass = cc._decorator.ccclass;
    var UIManager = function() {
      function UIManager() {
        this.isInit = false;
        this.guiMap = new HashMap_1.HashMap();
        this.windowMap = new HashMap_1.HashMap();
      }
      Object.defineProperty(UIManager, "inst", {
        get: function() {
          return this.ins ? this.ins : this.ins = new UIManager();
        },
        enumerable: true,
        configurable: true
      });
      UIManager.prototype.init = function() {
        true, fgui.addLoadHandler();
        cc.view.setResizeCallback(this.onResize.bind(this));
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function() {
          true, fgui.GRoot.create();
          console.info("########################### fgui.GRoot.create ###########################");
        }, this);
        this.isInit = true;
      };
      UIManager.prototype.loadUIPackage = function(callabck) {
        this.isInit || this.init();
        cc.loader.loadResDir("UI/sync", function(err, assets, urls) {
          console.log(urls);
          if (err) callabck(err); else {
            for (var _i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
              var url = urls_1[_i];
              if (!/atlas/.test(url)) {
                console.log(url);
                fgui.UIPackage.addPackage(url);
              }
            }
            callabck(null);
          }
        });
      };
      UIManager.prototype.onResize = function() {
        var size = cc.view.getCanvasSize();
        size.width /= cc.view.getScaleX();
        size.height /= cc.view.getScaleY();
        this.guiMap.forEach(function(key, view) {
          view.setPosition((size.width - view.width) / 2, (size.height - view.height) / 2);
        });
        this.windowMap.forEach(function(key, view) {
          view.setPosition((size.width - view.width) / 2, (size.height - view.height) / 2);
        });
      };
      UIManager.prototype.openGUI = function(uiItem, type) {
        var gui = this.guiMap.get(uiItem.URL);
        if (gui) {
          var comp = gui.node.getComponent(type);
          gui.node.active ? console.warn("UI is showed:" + uiItem.URL) : comp.show();
          return comp;
        }
        var view = uiItem.createInstanceSync();
        view.setPosition((fgui.GRoot.inst.width - view.width) / 2, (fgui.GRoot.inst.height - view.height) / 2);
        fgui.GRoot.inst.addChild(view);
        this.guiMap.add(uiItem.URL, view);
        return view.node.addComponent(type).register(view).show();
      };
      UIManager.prototype.closeGUI = function(uiItem, type) {
        var gui = this.guiMap.get(uiItem.URL);
        if (!gui) {
          console.error("UI not exist:" + uiItem.URL);
          return null;
        }
        return gui.node.getComponent(type).hide();
      };
      UIManager.prototype.openWindow = function(uiItem, type) {
        var _this = this;
        var win = this.windowMap.get(uiItem.URL);
        if (win) {
          var comp = win.node.getComponent(type);
          win.node.active ? console.warn("UI is showed:" + uiItem.URL) : comp.show();
        } else uiItem.createInstance(function(gComp) {
          gComp.setPosition((fgui.GRoot.inst.width - gComp.width) / 2, (fgui.GRoot.inst.height - gComp.height) / 2);
          fgui.GRoot.inst.addChild(gComp);
          _this.guiMap.add(uiItem.URL, gComp);
          gComp.node.addComponent(type).register(gComp).show();
        });
      };
      UIManager.prototype.closeWindow = function(uiItem, type) {
        var win = this.windowMap.get(uiItem.URL);
        if (!win) {
          console.error("UI not exist:" + uiItem.URL);
          return false;
        }
        var success = win.node.getComponent(type).hide(true);
        uiItem.releaseInstance();
        this.windowMap.remove(uiItem.URL);
        return success;
      };
      return UIManager;
    }();
    exports.UIMgr = UIManager.inst;
    var BaseUI = function(_super) {
      __extends(BaseUI, _super);
      function BaseUI() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      BaseUI.prototype.onShow = function() {};
      BaseUI.prototype.onHide = function() {};
      BaseUI.prototype.show = function() {
        if (!this.node.isValid) {
          console.error(" node valid!");
          return this;
        }
        this.node.active || (this.node.active = true);
        this.onShow();
        return this;
      };
      BaseUI.prototype.hide = function(clean) {
        void 0 === clean && (clean = false);
        if (!this.node.isValid) {
          console.error(" node valid!");
          return false;
        }
        this.node.active && (this.node.active = false);
        this.onHide();
        clean && this.node.removeFromParent(clean);
        return true;
      };
      BaseUI = __decorate([ ccclass ], BaseUI);
      return BaseUI;
    }(cc.Component);
    exports.BaseUI = BaseUI;
    cc._RF.pop();
  }, {
    "../Utils/HashMap": "HashMap"
  } ],
  WaveSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "313bfIxOzREdKYyjG/uVSPs", "WaveSprite");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ShaderManager_1 = require("./ShaderManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var WaveSprite = function(_super) {
      __extends(WaveSprite, _super);
      function WaveSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.wave = new ShaderManager_1.WaveMaterial();
        _this.time = 0;
        return _this;
      }
      WaveSprite.prototype.onLoad = function() {
        var sprite = this.getComponent(cc.Sprite);
        if (!sprite) return;
        sprite["_spriteMaterial"] = this.wave;
        sprite["_activateMaterial"]();
        this.wave.setProperty("range", 1);
      };
      WaveSprite.prototype.start = function() {};
      WaveSprite.prototype.update = function(dt) {
        this.time += 10 * dt;
        this.wave.setProperty("time", this.time);
        this.wave.setProperty("deltaTime", dt);
      };
      WaveSprite = __decorate([ ccclass ], WaveSprite);
      return WaveSprite;
    }(cc.Component);
    exports.default = WaveSprite;
    cc._RF.pop();
  }, {
    "./ShaderManager": "ShaderManager"
  } ],
  WelcomeScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8bdc2kTeilDGqLTs2cFtYeY", "WelcomeScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Config_1 = require("../Config/Config");
    var TableMgr_1 = require("../TableMgr");
    var ShaderManager_1 = require("../Shader/ShaderManager");
    var AudioController_1 = require("../Controller/AudioController");
    var UIManager_1 = require("../Controller/UIManager");
    var GameFactory_1 = require("../Factory/GameFactory");
    var celerx = require("../Utils/celerx");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LOAD_STEP;
    (function(LOAD_STEP) {
      LOAD_STEP[LOAD_STEP["READY"] = 2] = "READY";
      LOAD_STEP[LOAD_STEP["INIT"] = 4] = "INIT";
      LOAD_STEP[LOAD_STEP["REGISTER"] = 8] = "REGISTER";
      LOAD_STEP[LOAD_STEP["LOGIN"] = 16] = "LOGIN";
      LOAD_STEP[LOAD_STEP["MATCH"] = 32] = "MATCH";
      LOAD_STEP[LOAD_STEP["JSON_PARSE"] = 64] = "JSON_PARSE";
      LOAD_STEP[LOAD_STEP["ANIMATION_DONE"] = 128] = "ANIMATION_DONE";
      LOAD_STEP[LOAD_STEP["SCENE_DONE"] = 256] = "SCENE_DONE";
      LOAD_STEP[LOAD_STEP["AUDIO"] = 512] = "AUDIO";
      LOAD_STEP[LOAD_STEP["UI"] = 1024] = "UI";
      LOAD_STEP[LOAD_STEP["DONE"] = 2046] = "DONE";
    })(LOAD_STEP = exports.LOAD_STEP || (exports.LOAD_STEP = {}));
    var WelcomeScene = function(_super) {
      __extends(WelcomeScene, _super);
      function WelcomeScene() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.nextSceneName = "game";
        _this.percentLabel = null;
        _this.maxPercent = 0;
        _this.curPercent = 0;
        _this._step = LOAD_STEP.READY;
        return _this;
      }
      WelcomeScene.prototype.onLoad = function() {
        var _this = this;
        celerx.start();
        true;
        ShaderManager_1.ShaderManager.inst;
        cc.game.setFrameRate(Config_1.Config.FPS);
        this.maxPercent = 0;
        this.defaultAnimation = this.node.getComponent(cc.Animation);
        this.defaultAnimation ? this.defaultAnimation.once(cc.Animation.EventType.FINISHED, this.animationDone, this) : this.nextStep(LOAD_STEP.ANIMATION_DONE);
        if (Config_1.Config.isMultiPlayer) ; else {
          this.nextStep(LOAD_STEP.LOGIN);
          this.nextStep(LOAD_STEP.MATCH);
          this.nextStep(LOAD_STEP.REGISTER);
          this.nextStep(LOAD_STEP.INIT);
        }
        (true, "localhost" != window.document.domain) && (TableMgr_1.TableMgr.JSON_URL = "https://daythink.xyz:6060/Punchmoon/");
        TableMgr_1.TableMgr.inst.startLoad("json/", function() {
          GameFactory_1.gFactory.init(function() {
            this.nextStep(LOAD_STEP.JSON_PARSE);
          }.bind(_this));
        });
        AudioController_1.gAudio.init(function() {
          this.nextStep(LOAD_STEP.AUDIO);
        }.bind(this));
        cc.director.preloadScene(this.nextSceneName, null, function(err, sceneAsset) {
          if (err) console.error("\u573a\u666f\u52a0\u8f7d\u9519\u8bef"); else {
            _this.nextScene = sceneAsset.scene;
            _this.nextStep(LOAD_STEP.SCENE_DONE);
          }
        });
        UIManager_1.UIMgr.loadUIPackage(function(err) {
          err ? console.error("UI \u52a0\u8f7d\u9519\u8bef:", err) : _this.nextStep(LOAD_STEP.UI);
        });
      };
      WelcomeScene.prototype.update = function(dt) {
        this.curPercent += dt;
        this.curPercent >= this.maxPercent && (this.curPercent = this.maxPercent);
        this.percentLabel.string = (100 * this.curPercent).toFixed(2) + "%";
        this.curPercent >= 1 && this.node.emit("load_done");
      };
      WelcomeScene.prototype.animationDone = function() {
        this.defaultAnimation.off(cc.Animation.EventType.FINISHED);
        this.nextStep(LOAD_STEP.ANIMATION_DONE);
      };
      WelcomeScene.prototype.nextStep = function(loadStep) {
        var _this = this;
        this._step |= loadStep;
        console.log("CUR STEP:" + LOAD_STEP[loadStep] + ", total: " + this._step);
        this.maxPercent = (this._step & (65535 ^ LOAD_STEP.ANIMATION_DONE)) / (LOAD_STEP.DONE & (65535 ^ LOAD_STEP.ANIMATION_DONE));
        console.log(" MAXPERCENT:" + this.maxPercent);
        if (this._step >= LOAD_STEP.DONE) {
          this.node.once("load_done", function() {
            if (_this.nextScene) {
              console.log("runSceneImmediate", _this.nextScene);
              cc.director.runSceneImmediate(_this.nextScene);
            } else cc.director.loadScene(_this.nextSceneName);
          }, this);
          this.defaultAnimation && (this.defaultAnimation.play().wrapMode = cc.WrapMode.Loop);
        } else if (loadStep == LOAD_STEP.ANIMATION_DONE && this.defaultAnimation) {
          this._step &= 65535 ^ LOAD_STEP.ANIMATION_DONE;
          this.defaultAnimation.once(cc.Animation.EventType.FINISHED, this.animationDone, this);
          this.defaultAnimation.play();
        }
      };
      __decorate([ property({
        displayName: "\u6e38\u620f\u573a\u666f\u540d",
        tooltip: "\u9ed8\u8ba4\u8fdb\u5165game\u573a\u666f\uff0c\u5982\u679c\u9700\u8981\u6307\u5b9a\u573a\u666f\uff0c\u53ef\u4ee5\u6307\u5b9a"
      }) ], WelcomeScene.prototype, "nextSceneName", void 0);
      __decorate([ property(cc.Label) ], WelcomeScene.prototype, "percentLabel", void 0);
      WelcomeScene = __decorate([ ccclass ], WelcomeScene);
      return WelcomeScene;
    }(cc.Component);
    exports.default = WelcomeScene;
    cc._RF.pop();
  }, {
    "../Config/Config": "Config",
    "../Controller/AudioController": "AudioController",
    "../Controller/UIManager": "UIManager",
    "../Factory/GameFactory": "GameFactory",
    "../Shader/ShaderManager": "ShaderManager",
    "../TableMgr": "TableMgr",
    "../Utils/celerx": "celerx"
  } ],
  celerx: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "deadatK8OBKe71sPvMQnU76", "celerx");
    "use strict";
    var _typeof2 = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    function binary_to_base64(e) {
      for (var t = new Uint8Array(e), r = new Array(), n = 0, i = 0, a = new Array(3), o = new Array(4), s = t.length, d = 0; s--; ) if (a[n++] = t[d++], 
      3 == n) {
        for (o[0] = (252 & a[0]) >> 2, o[1] = ((3 & a[0]) << 4) + ((240 & a[1]) >> 4), o[2] = ((15 & a[1]) << 2) + ((192 & a[2]) >> 6), 
        o[3] = 63 & a[2], n = 0; n < 4; n++) r += base64_chars.charAt(o[n]);
        n = 0;
      }
      if (n) {
        for (i = n; i < 3; i++) a[i] = 0;
        for (o[0] = (252 & a[0]) >> 2, o[1] = ((3 & a[0]) << 4) + ((240 & a[1]) >> 4), o[2] = ((15 & a[1]) << 2) + ((192 & a[2]) >> 6), 
        o[3] = 63 & a[2], i = 0; i < n + 1; i++) r += base64_chars.charAt(o[i]);
        for (;n++ < 3; ) r += "=";
      }
      return r;
    }
    function dec2hex(e) {
      for (var t = hD.substr(15 & e, 1); e > 15; ) e >>= 4, t = hD.substr(15 & e, 1) + t;
      return t;
    }
    function base64_decode(e) {
      var t, r, n, i, a, o, s, d = new Array(), c = 0, l = e;
      if (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""), l != e && alert("Warning! Characters outside Base64 range in input string ignored."), 
      e.length % 4) return alert("Error: Input length is not a multiple of 4 bytes."), 
      "";
      for (var u = 0; c < e.length; ) i = keyStr.indexOf(e.charAt(c++)), a = keyStr.indexOf(e.charAt(c++)), 
      o = keyStr.indexOf(e.charAt(c++)), s = keyStr.indexOf(e.charAt(c++)), t = i << 2 | a >> 4, 
      r = (15 & a) << 4 | o >> 2, n = (3 & o) << 6 | s, d[u++] = t, 64 != o && (d[u++] = r), 
      64 != s && (d[u++] = n);
      return d;
    }
    var _typeof = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function(e) {
      return "undefined" === typeof e ? "undefined" : _typeof2(e);
    } : function(e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : "undefined" === typeof e ? "undefined" : _typeof2(e);
    }, bridge = {
      default: void 0,
      call: function call(e, t, r) {
        var n = "";
        if ("function" == typeof t && (r = t, t = {}), t = {
          data: void 0 === t ? null : t
        }, "function" == typeof r) {
          var i = "dscb" + window.dscb++;
          window[i] = r, t._dscbstub = i;
        }
        return t = JSON.stringify(t), window._dsbridge ? n = _dsbridge.call(e, t) : (window._dswk || -1 != navigator.userAgent.indexOf("_dsbridge")) && (n = prompt("_dsbridge=" + e, t)), 
        JSON.parse(n || "{}").data;
      },
      register: function register(e, t, r) {
        r = r ? window._dsaf : window._dsf, window._dsInit || (window._dsInit = !0, setTimeout(function() {
          bridge.call("_dsb.dsinit");
        }, 0)), "object" == (void 0 === t ? "undefined" : _typeof(t)) ? r._obs[e] = t : r[e] = t;
      },
      registerAsyn: function registerAsyn(e, t) {
        this.register(e, t, !0);
      },
      hasNativeMethod: function hasNativeMethod(e, t) {
        return this.call("_dsb.hasNativeMethod", {
          name: e,
          type: t || "all"
        });
      },
      disableJavascriptDialogBlock: function disableJavascriptDialogBlock(e) {
        this.call("_dsb.disableJavascriptDialogBlock", {
          disable: !1 !== e
        });
      }
    };
    !function() {
      if (!window._dsf) {
        var e, t = {
          _dsf: {
            _obs: {}
          },
          _dsaf: {
            _obs: {}
          },
          dscb: 0,
          celerx: bridge,
          close: function close() {
            bridge.call("_dsb.closePage");
          },
          _handleMessageFromNative: function _handleMessageFromNative(e) {
            var t = JSON.parse(e.data), r = {
              id: e.callbackId,
              complete: !0
            }, n = this._dsf[e.method], i = this._dsaf[e.method], a = function a(e, n) {
              r.data = e.apply(n, t), bridge.call("_dsb.returnValue", r);
            }, o = function o(e, n) {
              t.push(function(e, t) {
                r.data = e, r.complete = !1 !== t, bridge.call("_dsb.returnValue", r);
              }), e.apply(n, t);
            };
            if (n) a(n, this._dsf); else if (i) o(i, this._dsaf); else if (n = e.method.split("."), 
            !(2 > n.length)) {
              e = n.pop();
              var n = n.join("."), i = this._dsf._obs, i = i[n] || {}, s = i[e];
              s && "function" == typeof s ? a(s, i) : (i = this._dsaf._obs, i = i[n] || {}, (s = i[e]) && "function" == typeof s && o(s, i));
            }
          }
        };
        for (e in t) window[e] = t[e];
        bridge.register("_hasJavascriptMethod", function(e, t) {
          return t = e.split("."), 2 > t.length ? !(!_dsf[t] && !_dsaf[t]) : (e = t.pop(), 
          t = t.join("."), (t = _dsf._obs[t] || _dsaf._obs[t]) && !!t[e]);
        });
      }
    }();
    var base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", hD = "0123456789ABCDEF", keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    module.exports = {
      onStateReceived: function onStateReceived(e) {
        return bridge.register("onStateReceived", function(t) {
          var r = base64_decode(t);
          return e(new Uint8Array(r));
        });
      },
      onCourtModeStarted: function onCourtModeStarted(e) {
        return bridge.register("onCourtModeStarted", e);
      },
      getMatch: function getMatch() {
        var e = bridge.call("getMatch", "123");
        try {
          e = JSON.parse(e);
        } catch (e) {}
        return e;
      },
      showCourtModeDialog: function showCourtModeDialog() {
        return bridge.call("showCourtModeDialog");
      },
      start: function start() {
        return bridge.call("start");
      },
      sendState: function sendState(e) {
        return bridge.call("sendState", binary_to_base64(e));
      },
      draw: function draw(e) {
        return bridge.call("draw", binary_to_base64(e));
      },
      win: function win(e) {
        return bridge.call("win", binary_to_base64(e));
      },
      lose: function lose(e) {
        return bridge.call("lose", binary_to_base64(e));
      },
      surrender: function surrender(e) {
        return bridge.call("surrender", binary_to_base64(e));
      },
      applyAction: function applyAction(e, t) {
        return bridge.call("applyAction", binary_to_base64(e), t);
      },
      getOnChainState: function getOnChainState(e) {
        return bridge.call("getOnChainState", "123", function(t) {
          var r = base64_decode(t);
          return e(new Uint8Array(r));
        });
      },
      getOnChainActionDeadline: function getOnChainActionDeadline(e) {
        return bridge.call("getOnChainActionDeadline", "123", e);
      },
      getCurrentBlockNumber: function getCurrentBlockNumber() {
        return bridge.call("getCurrentBlockNumber", "123");
      },
      finalizeOnChainGame: function finalizeOnChainGame(e) {
        return bridge.call("finalizeOnChainGame", "123", e);
      },
      submitScore: function submitScore(e) {
        return bridge.call("submitScore", e);
      }
    };
    cc._RF.pop();
  }, {} ],
  fguiMainUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e623cRBazxLHr5uB47CCyBN", "fguiMainUI");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var fguiMainUI = function(_super) {
      __extends(fguiMainUI, _super);
      function fguiMainUI() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      fguiMainUI.createInstanceSync = function() {
        fgui.UIObjectFactory.setExtension("ui://vmvonsvyv7i62", fguiMainUI);
        return fgui.UIPackage.createObject("Game", "fguiMainUI");
      };
      fguiMainUI.createInstance = function(complete) {
        fgui.UIPackage.loadPackage("UI/dync/Game", function(err) {
          err ? console.error("load package error:", err) : complete(fgui.UIPackage.createObject("Game", "fguiMainUI").asCom);
        });
      };
      fguiMainUI.releaseInstance = function() {
        fgui.UIPackage.removePackage("Game");
      };
      fguiMainUI.prototype.onConstruct = function() {
        this.m_altitudeLabel = this.getChild("altitudeLabel");
        this.m_Record = this.getChild("Record");
        this.m_playerIcon = this.getChild("playerIcon");
        this.m_altitudeSlider = this.getChild("altitudeSlider");
        this.m_punch = this.getChild("punch");
      };
      fguiMainUI.URL = "ui://vmvonsvyv7i62";
      return fguiMainUI;
    }(fgui.GComponent);
    exports.default = fguiMainUI;
    cc._RF.pop();
  }, {} ],
  table: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e1a74J8tcJNy4RWW77X8AbS", "table");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Monster_ball__monster_monster;
    (function(Monster_ball__monster_monster) {
      Monster_ball__monster_monster[Monster_ball__monster_monster["XiaoGuai"] = 1] = "XiaoGuai";
      Monster_ball__monster_monster[Monster_ball__monster_monster["BOSS"] = 2] = "BOSS";
    })(Monster_ball__monster_monster = exports.Monster_ball__monster_monster || (exports.Monster_ball__monster_monster = {}));
    var Monster_ball__monster_type_1;
    (function(Monster_ball__monster_type_1) {
      Monster_ball__monster_type_1[Monster_ball__monster_type_1["GuDingWeiZhiBuDong"] = 1] = "GuDingWeiZhiBuDong";
      Monster_ball__monster_type_1[Monster_ball__monster_type_1["LuDiPingYi"] = 2] = "LuDiPingYi";
      Monster_ball__monster_type_1[Monster_ball__monster_type_1["FeiHangPingYi"] = 3] = "FeiHangPingYi";
      Monster_ball__monster_type_1[Monster_ball__monster_type_1["QuanTuShunYi"] = 4] = "QuanTuShunYi";
    })(Monster_ball__monster_type_1 = exports.Monster_ball__monster_type_1 || (exports.Monster_ball__monster_type_1 = {}));
    var Monster_ball__monster_type_2;
    (function(Monster_ball__monster_type_2) {
      Monster_ball__monster_type_2[Monster_ball__monster_type_2["LuDiPingYi"] = 1] = "LuDiPingYi";
      Monster_ball__monster_type_2[Monster_ball__monster_type_2["FeiHangPingYi"] = 2] = "FeiHangPingYi";
      Monster_ball__monster_type_2[Monster_ball__monster_type_2["QuanTuShunYi"] = 3] = "QuanTuShunYi";
      Monster_ball__monster_type_2[Monster_ball__monster_type_2["GuDingWeiZhiBuDong"] = 4] = "GuDingWeiZhiBuDong";
    })(Monster_ball__monster_type_2 = exports.Monster_ball__monster_type_2 || (exports.Monster_ball__monster_type_2 = {}));
    var Monster_ball__monster_type_3;
    (function(Monster_ball__monster_type_3) {
      Monster_ball__monster_type_3[Monster_ball__monster_type_3["LuDiPingYi"] = 1] = "LuDiPingYi";
      Monster_ball__monster_type_3[Monster_ball__monster_type_3["FeiHangPingYi"] = 2] = "FeiHangPingYi";
      Monster_ball__monster_type_3[Monster_ball__monster_type_3["QuanTuShunYi"] = 3] = "QuanTuShunYi";
      Monster_ball__monster_type_3[Monster_ball__monster_type_3["GuDingWeiZhiBuDong"] = 4] = "GuDingWeiZhiBuDong";
    })(Monster_ball__monster_type_3 = exports.Monster_ball__monster_type_3 || (exports.Monster_ball__monster_type_3 = {}));
    var Monster_ball_ball_form;
    (function(Monster_ball_ball_form) {
      Monster_ball_ball_form[Monster_ball_ball_form["PuTong"] = 1] = "PuTong";
      Monster_ball_ball_form[Monster_ball_ball_form["ZhaDan"] = 2] = "ZhaDan";
      Monster_ball_ball_form[Monster_ball_ball_form["DianJiMaBi"] = 3] = "DianJiMaBi";
    })(Monster_ball_ball_form = exports.Monster_ball_ball_form || (exports.Monster_ball_ball_form = {}));
    var Monster_ball_paly_level_form;
    (function(Monster_ball_paly_level_form) {
      Monster_ball_paly_level_form[Monster_ball_paly_level_form["PuTongGuanQia"] = 1] = "PuTongGuanQia";
      Monster_ball_paly_level_form[Monster_ball_paly_level_form["BOSSGuan"] = 2] = "BOSSGuan";
    })(Monster_ball_paly_level_form = exports.Monster_ball_paly_level_form || (exports.Monster_ball_paly_level_form = {}));
    var Monster_ball_prop_form;
    (function(Monster_ball_prop_form) {
      Monster_ball_prop_form[Monster_ball_prop_form["HuiFuNaiJiuDu"] = 1] = "HuiFuNaiJiuDu";
      Monster_ball_prop_form[Monster_ball_prop_form["QuanPingGongJiGuaiWu"] = 2] = "QuanPingGongJiGuaiWu";
      Monster_ball_prop_form[Monster_ball_prop_form["QuanBuGuaiWuTingDun"] = 3] = "QuanBuGuaiWuTingDun";
      Monster_ball_prop_form[Monster_ball_prop_form["JiaFenShu"] = 4] = "JiaFenShu";
    })(Monster_ball_prop_form = exports.Monster_ball_prop_form || (exports.Monster_ball_prop_form = {}));
    cc._RF.pop();
  }, {} ]
}, {}, [ "Config", "AudioController", "CameraController", "UIManager", "Base", "Enemy", "GameMgr", "Player", "Solar", "EventManager", "EventName", "GameFactory", "GameScene", "WelcomeScene", "ButterFlySpring", "PixelSprite", "PointWave", "ShaderManager", "ShaderTemplate", "TransitionMask", "TransitionSprite", "WaveSprite", "TableMgr", "MainUI", "GameBinder", "Record", "fguiMainUI", "HashMap", "celerx", "table" ]);