// pages/starMap/starMap.js
Page({
  data: {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    touchStart: { x: 0, y: 0 }
  },

  // 星座数据（归一化坐标 0~1）
  starData: {
  stars: [
    { name: '天枢', x: 0.32, y: 0.38 },   // α UMa
    { name: '天璇', x: 0.38, y: 0.36 },   // β UMa
    { name: '天玑', x: 0.44, y: 0.41 },   // γ UMa
    { name: '天权', x: 0.41, y: 0.48 },   // δ UMa
    { name: '玉衡', x: 0.35, y: 0.56 },   // ε UMa
    { name: '开阳', x: 0.30, y: 0.64 },   // ζ UMa
    { name: '摇光', x: 0.24, y: 0.72 }    // η UMa
  ],
  lines: [
    [0, 1], [1, 2], [2, 3], [3, 0],  // 勺斗四边形
    [3, 4], [4, 5], [5, 6]           // 勺柄连线
  ]
},

  canvasWidth: 0,
  canvasHeight: 0,

  onReady() {
    this.getCanvasSizeAndDraw();
  },

  getCanvasSizeAndDraw() {
    const query = wx.createSelectorQuery().in(this);
    query.select('#starCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res && res[0] && res[0].node) {
          // 新版 Canvas 2D
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          this.canvas = canvas;
          this.ctx = ctx;
          this.canvasWidth = res[0].width;
          this.canvasHeight = res[0].height;
          canvas.width = this.canvasWidth;
          canvas.height = this.canvasHeight;
          this.drawNew();
        } else {
          // 降级到旧版 canvas-id
          this.drawLegacy();
        }
      });
  },

  drawNew() {
    const ctx = this.ctx;
    const { scale, offsetX, offsetY } = this.data;
    const { stars, lines } = this.starData;
    const w = this.canvasWidth;
    const h = this.canvasHeight;

    // 清空
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // 绘制连线
    ctx.beginPath();
    ctx.strokeStyle = '#6688ff';
    ctx.lineWidth = 2 / scale;
    lines.forEach(line => {
      const s1 = stars[line[0]];
      const s2 = stars[line[1]];
      const x1 = s1.x * w;
      const y1 = s1.y * h;
      const x2 = s2.x * w;
      const y2 = s2.y * h;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    });
    ctx.stroke();

    // 绘制星星和标签
    stars.forEach(star => {
      const x = star.x * w;
      const y = star.y * h;
      ctx.beginPath();
      ctx.arc(x, y, 5 / scale, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.font = `${12 / scale}px sans-serif`;
      ctx.fillStyle = '#cccccc';
      ctx.fillText(star.name, x + 8 / scale, y - 6 / scale);
    });

    ctx.restore();
  },

  drawLegacy() {
    const ctx = wx.createCanvasContext('starCanvasLegacy', this);
    const query = wx.createSelectorQuery().in(this);
    query.select('.star-canvas-legacy').boundingClientRect(rect => {
      if (!rect) return;
      const w = rect.width;
      const h = rect.height;
      const { scale, offsetX, offsetY } = this.data;
      const { stars, lines } = this.starData;

      ctx.setFillStyle('#000000');
      ctx.fillRect(0, 0, w, h);

      // 连线
      ctx.beginPath();
      ctx.setStrokeStyle('#6688ff');
      ctx.setLineWidth(2);
      lines.forEach(line => {
        const s1 = stars[line[0]];
        const s2 = stars[line[1]];
        const x1 = s1.x * w * scale + offsetX;
        const y1 = s1.y * h * scale + offsetY;
        const x2 = s2.x * w * scale + offsetX;
        const y2 = s2.y * h * scale + offsetY;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // 星星
      stars.forEach(star => {
        const x = star.x * w * scale + offsetX;
        const y = star.y * h * scale + offsetY;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.setFillStyle('#ffffff');
        ctx.fill();
        ctx.setFontSize(12);
        ctx.setFillStyle('#cccccc');
        ctx.fillText(star.name, x + 8, y - 6);
      });

      ctx.draw();
    }).exec();
  },

  touchStart(e) {
    const touch = e.touches[0];
    this.setData({
      touchStart: { x: touch.clientX, y: touch.clientY }
    });
  },

  touchMove(e) {
    const touch = e.touches[0];
    const dx = touch.clientX - this.data.touchStart.x;
    const dy = touch.clientY - this.data.touchStart.y;
    this.setData({
      offsetX: this.data.offsetX + dx,
      offsetY: this.data.offsetY + dy,
      touchStart: { x: touch.clientX, y: touch.clientY }
    });
    // 重新绘制
    if (this.ctx) this.drawNew();
    else this.drawLegacy();
  },

  resetView() {
    this.setData({ scale: 1, offsetX: 0, offsetY: 0 }, () => {
      if (this.ctx) this.drawNew();
      else this.drawLegacy();
    });
  }
});