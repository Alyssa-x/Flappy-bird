//对象收编变量 防止污染全局
var bird = {
  skyPosition: 0,
  skyStep: 2,
  birdTop: 220,
  birdStepY: 0,
  startColor: "blue",
  startFlag: false,
  minTop: 0,
  maxtop: 570,

  //初始化函数
  init: function () {
    this.initData();
    this.animate();
    this.handle();

  },
  initData: function () {
    this.el = document.getElementById("container");
    this.oBird = this.el.getElementsByClassName("bird")[0]; //获取鸟的dom元素
    this.oStart = this.el.getElementsByClassName("start")[0];
    this.oScore = this.el.getElementsByClassName("score")[0];
    this.oMask = this.el.getElementsByClassName("mask")[0];
    this.oEnd = this.el.getElementsByClassName("end")[0];
  },

  //单一职责原则
  //管理所有动画
  animate: function () {
    var count = 0;
    var self = this;
    this.timer = setInterval(function () {
      self.skyMove();
      if (self.startFlag) {
        self.birdDrop();
      }
      if (++count % 10 === 0) {
        if (!self.startFlag) {
          self.birdJump();
          self.startBound();
        }

        self.birdFly(count);
      }
    }, 30);
  },

  //背景移动
  skyMove: function () {
    this.skyPosition -= this.skyStep;
    this.el.style.backgroundPositionX = this.skyPosition + "px";
  },

  //小鸟跳跃
  birdJump: function () {
    this.birdTop = this.birdTop === 220 ? 250 : 220;
    this.oBird.style.top = this.birdTop + "px";
  },

  // 小鸟煽动翅膀
  birdFly: function (count) {
    // 移动雪碧图位置达到煽动翅膀效果
    this.oBird.style.backgroundPositionX = (count % 3) * -30 + "px";
    this.collision();
  },

  // 小鸟坠落
  birdDrop: function () {
    this.birdTop += ++this.birdStepY;
    this.oBird.style.top = this.birdTop + "px";
  },

  // 开始按钮缩放
  startBound: function () {
    var prevColor = this.startColor;
    this.startColor = prevColor === "blue" ? "white" : "blue";
    // 改变start样式
    this.oStart.classList.remove(prevColor);
    this.oStart.classList.add(this.startColor);
  },

  collision: function () {
    this.collideBoundary();
    this.collidePipe();
  },
  collideBoundary: function () {
    if (this.birdTop < this.minTop || this.birdTop > this.maxtop) {
      console.log(this.birdTop);
      this.gameOver();
    }
  },
  collidePipe: function () {},

  //监听所有事件
  handle: function () {
    this.handleStart();
  },

  // 点击开始游戏
  handleStart: function () {

    var self = this;
    this.oStart.onclick = function () {
    
      // console.log(this);
      self.oStart.style.display = "none";
      self.oBird.style.left = "80px";
      self.skyStep = 5;
      self.startFlag = true;

    };
    


  },

  // 游戏结束
  gameOver: function () {

    clearInterval(this.timer);

    this.oMask.style.display = "block";
    this.oEnd.style.display = "block";
    this.oBird.style.display = "none";
    this.oScore.style.display = "none";
    
  },
};

bird.init();
