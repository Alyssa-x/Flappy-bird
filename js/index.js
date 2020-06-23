//对象收编变量 防止污染全局
var bird = {
  skyPosition: 0,
  skyStep: 2,
  birdTop: 220,
  birdStepY: 0,
  startColor: "blue",
  startFlag: false,
  minTop: 0,
  maxTop: 570,
  pipeLength: 7,
  pipeArr: [],
  pipeLastIndex: 6,
  score: 0,

  //初始化函数
  init: function () {
    this.initData();
    this.animate();
    this.handle();
  },

  initData: function () {
    this.el = document.getElementById("container");
    this.oBird = this.el.getElementsByClassName("bird")[0];
    this.oStart = this.el.getElementsByClassName("start")[0];
    this.oScore = this.el.getElementsByClassName("score")[0];
    this.oMask = this.el.getElementsByClassName("mask")[0];
    this.oEnd = this.el.getElementsByClassName("end")[0];
    this.oFinalScore = this.oEnd.getElementsByClassName("final-score")[0];
    this.oRankList = this.oEnd.getElementsByClassName("ranking")[0];
    this.oRestart = this.oEnd.getElementsByClassName("restart")[0];
    this.scoreArr = this.getScore();

    // console.log(this.scoreArr);
  },
  getScore: function () {
    var scoreArr = getLocal("score");
    // 键值不存在 值为null
    return scoreArr ? scoreArr : [];
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
        self.pipeMove();
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

  // 背景移动
  skyMove: function () {
    this.skyPosition -= this.skyStep;
    this.el.style.backgroundPositionX = this.skyPosition + "px";
  },
  // 小鸟跳跃
  birdJump: function () {
    this.birdTop = this.birdTop === 200 ? 230 : 200;
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
    this.collision();
    this.addScore();
  },

  pipeMove: function () {
    for (var i = 0; i < this.pipeLength; i++) {
      // 数组中取出柱子，避免循环操作dom元素，节省效率

      var oUpPipe = this.pipeArr[i].up;
      var oDownPipe = this.pipeArr[i].down;
      // 改变left值使其与天空同步移动
      var x = oUpPipe.offsetLeft - this.skyStep; //offsetLeft为数字，styleLeft是带px的字符串

      if (x < -52) {
        // console.log(this.pipeArr[this.pipeLastIndex].up.offsetLeft);
        var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;

        oUpPipe.style.left = lastPipeLeft + 300 + "px";
        oDownPipe.style.left = lastPipeLeft + 300 + "px";
        this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;
        continue;
      }
      oUpPipe.style.left = x + "px";
      oDownPipe.style.left = x + "px";
    }
  },
  getPipeHeight: function () {
    var upHeight = 50 + Math.floor(Math.random() * 175);
    var downHeight = 600 - 150 - upHeight;
    return {
      up: upHeight,
      down: downHeight,
    };
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
    if (this.birdTop < this.minTop || this.birdTop > this.maxTop) {
      this.gameOver();
    }
  },
  collidePipe: function () {
    var index = this.score % this.pipeLength;

    var pipeX = this.pipeArr[index].up.offsetLeft;
    var pipeY = this.pipeArr[index].y;
    var birdY = this.birdTop;

    //碰到柱子左右上下边缘
    if (
      pipeX <= 95 &&
      pipeX >= 13 &&
      (birdY <= pipeY[0] || birdY >= pipeY[1])
    ) {
      this.gameOver();
    }
  },
  addScore: function () {
    var index = this.score % this.pipeLength;
    var pipeX = this.pipeArr[index].up.offsetLeft;
    if (pipeX < 13) {
      this.oScore.innerText = ++this.score;
    }
  },

  //监听所有事件
  handle: function () {
    this.handleStart();
    this.handleClick();
    this.handleRestart();
  },

  // 点击开始游戏
  handleStart: function () {
    var self = this;
    this.oStart.onclick = function () {
      self.oStart.style.display = "none";
      self.oScore.style.display = "block";
      self.oBird.style.left = "80px";
      //取消top值过渡
      self.oBird.style.transition = "none";
      self.skyStep = 5;
      self.startFlag = true;
      //创建柱子
      for (var i = 0; i < self.pipeLength; i++) {
        self.createPipe(300 * (i + 1));
      }
    };
  },
  handleRestart: function () {
    this.oRestart.onclick = function () {
      window.location.reload();
    };
  },
  //点击屏幕小鸟上移
  handleClick: function () {
    var self = this;
    this.el.onclick = function (e) {
      //阻止点击开始按钮时小鸟上移
      if (!e.target.classList.contains("start")) {
        self.birdStepY = -10;
      }
    };
  },

  // 创建柱子
  createPipe: function (x) {
    //计算柱子高度
    var upHeight = 50 + Math.floor(Math.random() * 175);
    var downHeight = 600 - 150 - upHeight;
    // 创建上柱
    var oUpPipe = createEle("div", ["pipe", "pipe-up"], {
      height: upHeight + "px",
      left: x + "px",
    });
    // 创建下柱
    var oDownPipe = createEle("div", ["pipe", "pipe-down"], {
      height: downHeight + "px",
      left: x + "px",
    });

    this.el.appendChild(oUpPipe);
    this.el.appendChild(oDownPipe);

    this.pipeArr.push({
      up: oUpPipe,
      down: oDownPipe,
      y: [upHeight, upHeight + 150],
    });
  },

  setScore: function () {
    this.scoreArr.push({
      score: this.score,
      time: this.getDate(),
    });
    setLocal("score", this.scoreArr);
    this.scoreArr.sort(function (a, b) {
      return b.score - a.score;
    });
  },
  getDate: function () {
    var d = new Date();
    var year = d.getFullYear();
    var month = formatNum(d.getMonth() + 1);
    var day = formatNum(d.getDate());
    var hour = formatNum(d.getHours());
    var minute = formatNum(d.getMinutes());
    var second = formatNum(d.getSeconds());

    return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
  },

  // 游戏结束
  gameOver: function () {
    clearInterval(this.timer);
    this.setScore();
    this.oMask.style.display = "block";
    this.oEnd.style.display = "block";
    this.oBird.style.display = "none";
    this.oScore.style.display = "none";
    this.oFinalScore.innerText = this.score;

    this.renderRankList();
    if(this.score < 5){
      alert("5分都不到，陆展不太行哦");      
    }else if(this.score >= 5 && this.score < 10){
      alert("可以，陆展终于能玩到5分了");   
    }else{
      alert("哇你终于超过10分啦厉害厉害"); 
    }

  },
  renderRankList: function () {
    
    if (this.scoreArr.length < 9) {
      var length = this.scoreArr.length;
    } else {
      length = 8;
    }
    var template = ``;
    for (var i = 0; i < length; i++) {
      var degreeClass = "";
      switch (i) {
        case 0:
          degreeClass = "fir";
          break;
        case 1:
          degreeClass = "sec";
          break;
        case 2:
          degreeClass = "thi";
          break;
      }
      template += `
      <li class="rank-item">
          <span class="rank-num ${degreeClass}">${i + 1}</span>
          <span class="finalscore">${this.scoreArr[i].score}</span>
          <span class="time">${this.scoreArr[i].time}</span>
      </li>
      `;
    }
    this.oRankList.innerHTML = template;
  },
};
