// src/components/ExtendedWinwheel.js
import Winwheel from 'winwheel';

class ExtendedWinwheel extends Winwheel {
  constructor(options) {
    super(options);
    this.outerBorderColor = options.outerBorderColor || '#000000';
    this.outerBorderWidth = options.outerBorderWidth || 1;
    this.innerBorderColor = options.innerBorderColor || '#000000';
    this.innerBorderWidth = options.innerBorderWidth || 1;
    this.additionalBorderColor = options.additionalBorderColor || '#FF0000';
    this.additionalBorderWidth = options.additionalBorderWidth || 10;
    this.additionalBorderMargin = options.additionalBorderMargin || 0;
    this.radiusLineColor = options.radiusLineColor || '#000000';
    this.radiusLineWidth = options.radiusLineWidth || 1;

    this.outerBorderShadowColor = options.outerBorderShadowColor || 'rgba(0, 0, 0, 0.5)';
    this.outerBorderShadowBlur = options.outerBorderShadowBlur || 5;
    this.outerBorderShadowOffsetX = options.outerBorderShadowOffsetX || 0;
    this.outerBorderShadowOffsetY = options.outerBorderShadowOffsetY || 0;
    this.innerBorderShadowColor = options.innerBorderShadowColor || 'rgba(0,0,0,0.5)';
    this.innerBorderShadowBlur = options.innerBorderShadowBlur || 5;
    this.innerBorderShadowOffsetX = options.innerBorderShadowOffsetX || 0;
    this.innerBorderShadowOffsetY = options.innerBorderShadowOffsetY || 0;
    this.innerBorderFillStyle = options.innerBorderFillStyle || null;
    this.additionalBorderShadowColor = options.additionalBorderShadowColor || 'rgba(0,0,0,0.5)';
    this.additionalBorderShadowBlur = options.additionalBorderShadowBlur || 5;
    this.additionalBorderShadowOffsetX = options.additionalBorderShadowOffsetX || 0;
    this.additionalBorderShadowOffsetY = options.additionalBorderShadowOffsetY || 0;

    // Các thuộc tính khác
    this.callbackFinished = options.animation?.callbackFinished || null;
    this.callbackSound = options.animation?.callbackSound || null;
    this.animationDuration = options.animation?.duration || 5;
    this.animationSpins = options.animation?.spins || 8;
    this.soundTrigger = options.animation?.soundTrigger || 'pin';
    this.customDrawMode = options.customDrawMode || 'code';

    this.centerCircle = options.centerCircle || {
      fillStyle: '#FFD700',
      strokeStyle: '#000000',
      strokeWidth: 2,
      text: '高',
      textFontFamily: 'Arial',
      textFontSize: 30,
      textFillStyle: '#000000'
    };

  }

  draw() {
    if (this.customDrawMode === 'image') {
      // Vẽ chỉ sử dụng hình ảnh
      super.draw();
      this.drawSegmentImages();
    } else if (this.customDrawMode === 'code') {
      // Vẽ sử dụng code tùy chỉnh
      super.draw();
      this.drawCustomBorders();
      this.drawSegmentTextBoxes();
      this.drawCustomPins();
      this.drawCustomPointer();
      this.drawCenterCircle();
      this.drawSegmentImages();
    } else {
      // Mặc định, sử dụng phương thức draw gốc
      super.draw();
    }
  }

  startAnimation() {
    super.startAnimation();
  
    const animationLoop = () => {
      if (this.animation.stopAnimation === false) {
        this.draw();
        requestAnimationFrame(animationLoop);
      }
    };
    requestAnimationFrame(animationLoop);

    // Bắt đầu tính toán thời gian và vòng quay
    this.animationTimeout = setTimeout(() => {
      // Kiểm tra và gọi callback khi kết thúc
      if (this.callbackFinished) {
        this.callbackFinished();
      }
    }, this.animationDuration * 1000); // duration là giây
  
    // Nếu có callback âm thanh và soundTrigger là 'pin'
  if (this.callbackSound && this.animation.soundTrigger === 'pin') {
    const segmentAngle = 360 / this.segments.length;
    let lastAngle = this.rotationAngle;

    this.soundInterval = setInterval(() => {
      const currentAngle = this.getRotationPosition();
      if (Math.floor(currentAngle / segmentAngle) !== Math.floor(lastAngle / segmentAngle)) {
        this.callbackSound();
      }
      lastAngle = currentAngle;
    }, 10); // Kiểm tra mỗi 10ms để có độ chính xác cao
  }
  }
  
  stopAnimation() {
    clearTimeout(this.animationTimeout);
    clearInterval(this.soundInterval); // Dừng âm thanh khi dừng vòng quay
    super.stopAnimation();
  }


  drawSegments() {
    let ctx = this.ctx;
    for (let i = 0; i < this.segments.length; i++) {
      let segment = this.segments[i];
      if (!segment) continue;
      ctx.save();
      ctx.beginPath();
      let startAngle = this.degToRad(segment.startAngle + this.rotationAngle);
      let endAngle = this.degToRad(segment.endAngle + this.rotationAngle);
      ctx.moveTo(this.centerX, this.centerY);
      ctx.arc(this.centerX, this.centerY, this.outerRadius, startAngle, endAngle, false);
      ctx.lineTo(this.centerX, this.centerY);
      ctx.fillStyle = segment.fillStyle || '#ffff';
      ctx.strokeStyle = segment.strokeStyle || '#0000';
      ctx.fill();
      ctx.stroke();
      if (segment.image) {
        this.drawSegmentImage(segment, startAngle, endAngle);
      }
      ctx.restore();
    }
  }

  drawSegmentImages() {
    for (let i = 1; i < this.segments.length; i++) {
      if (this.segments[i].image) {
        this.drawSegmentImage(this.segments[i]);
      }
    }
  }

  drawSegmentImage(segment) {
    if (!segment || !segment.image) {
      return;
    }
    const ctx = this.ctx;
    const image = new Image();
    image.src = segment.image;
    
    const drawImageOnLoad = () => {
      // Điều chỉnh góc bắt đầu để bắt đầu từ hướng 12 giờ
      const startAngle = this.degToRad(segment.startAngle + this.rotationAngle - 90);
      const endAngle = this.degToRad(segment.endAngle + this.rotationAngle - 90);
      const angle = (startAngle + endAngle) / 2;
      const radius = (this.outerRadius + this.innerRadius) / 2;
      const imageMargin = segment.imageMargin || 20;
      const adjustedRadius = radius - imageMargin;
  
      // Tính toán vị trí x, y mới
      const x = this.centerX + adjustedRadius * Math.cos(angle);
      const y = this.centerY + adjustedRadius * Math.sin(angle);
  
      const imageWidth = segment.imageWidth || this.imageWidth || 50;
      const imageHeight = segment.imageHeight || this.imageHeight || 50;
  
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Áp dụng sharpening
      ctx.filter = 'contrast(1.2) saturate(1.2) brightness(0.9)';
      ctx.translate(x, y);
      // Điều chỉnh góc xoay của hình ảnh
      ctx.rotate(angle + Math.PI / 2);
      ctx.drawImage(image, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
      ctx.restore();
    };
  
    if (image.complete) {
      drawImageOnLoad();
    } else {
      image.onload = drawImageOnLoad;
    }
  }


  drawCustomPointer() {
    const canvas = document.getElementById(this.canvasId);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const pointer = this.pointer;
      if (pointer.display) {
        ctx.shadowColor = pointer.pointerShadow.color;
        ctx.shadowOffsetX = pointer.pointerShadow.offsetX;
        ctx.shadowOffsetY = pointer.pointerShadow.offsetY;
        ctx.shadowBlur = pointer.pointerShadow.blur;
        const pointerTopY = pointer.pointerMargin;
        const pointerBottomY = pointerTopY + pointer.pointerLength;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - pointer.pointerWidth / 2, pointerTopY);
        ctx.lineTo(canvas.width / 2 + pointer.pointerWidth / 2, pointerTopY);
        ctx.lineTo(canvas.width / 2, pointerBottomY);
        ctx.closePath();
        ctx.fillStyle = pointer.pointerColor;
        ctx.fill();
        ctx.lineWidth = pointer.pointerBorderWidth;
        ctx.strokeStyle = pointer.pointerBorderColor;
        ctx.stroke();
        ctx.shadowColor = 'transparent';
      }
    }
  }

  drawCustomBorders() {
    const ctx = this.ctx;
    ctx.save();
    ctx.shadowColor = this.outerBorderShadowColor;
    ctx.shadowBlur = this.outerBorderShadowBlur;
    ctx.shadowOffsetX = this.outerBorderShadowOffsetX;
    ctx.shadowOffsetY = this.outerBorderShadowOffsetY;
    ctx.strokeStyle = this.outerBorderColor;
    ctx.lineWidth = this.outerBorderWidth;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.outerRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.shadowColor = this.innerBorderShadowColor;
    ctx.shadowBlur = this.innerBorderShadowBlur;
    ctx.shadowOffsetX = this.innerBorderShadowOffsetX;
    ctx.shadowOffsetY = this.innerBorderShadowOffsetY;
    ctx.strokeStyle = this.innerBorderColor;
    ctx.lineWidth = this.innerBorderWidth;
    if (this.innerBorderFillStyle) {
      ctx.fillStyle = this.innerBorderFillStyle;
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, this.innerRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.innerRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.shadowColor = this.additionalBorderShadowColor;
    ctx.shadowBlur = this.additionalBorderShadowBlur;
    ctx.shadowOffsetX = this.additionalBorderShadowOffsetX;
    ctx.shadowOffsetY = this.additionalBorderShadowOffsetY;
    ctx.strokeStyle = this.additionalBorderColor;
    ctx.lineWidth = this.additionalBorderWidth;
    ctx.beginPath();
    const additionalRadius = this.outerRadius + this.additionalBorderWidth / 2 + this.additionalBorderMargin;
    ctx.arc(this.centerX, this.centerY, additionalRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  drawCustomPins() {
    if (this.pins && this.pins.number) {
      const ctx = this.ctx;
      const centerX = this.centerX;
      const centerY = this.centerY;
      const outerRadius = this.outerRadius;
      const pinOuterRadius = this.pins.outerRadius || 3;
      const pinMargin = this.pins.margin || 0;
      const pinRadius = outerRadius + this.additionalBorderWidth + this.additionalBorderMargin + pinMargin + pinOuterRadius;
      ctx.fillStyle = this.pins.fillStyle || 'grey';
      ctx.strokeStyle = this.pins.strokeStyle || 'black';
      ctx.lineWidth = 1;
      const anglePerPin = (2 * Math.PI) / this.pins.number;
      for (let i = 0; i < this.pins.number; i++) {
        const angle = i * anglePerPin;
        const x = centerX + pinRadius * Math.cos(angle);
        const y = centerY + pinRadius * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, pinOuterRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }
  }
  

  drawCenterCircle() {
    const ctx = this.ctx;
    const centerX = this.centerX;
    const centerY = this.centerY;
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.centerCircle.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.centerCircle.fillStyle;
    ctx.fill();
    ctx.lineWidth = this.centerCircle.strokeWidth;
    ctx.strokeStyle = this.centerCircle.strokeStyle;
    ctx.stroke();
    ctx.fillStyle = this.centerCircle.textFillStyle;
    ctx.font = `${this.centerCircle.textFontSize}px ${this.centerCircle.textFontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.centerCircle.text, centerX, centerY);
  }

  drawSegmentTextBoxes() {
    const ctx = this.ctx;
    const boxWidth = 80;  // Chiều rộng của khung
    const boxHeight = 21; // Chiều cao của khung
    const margin = -18;    // Khoảng cách giữa khung và viền segment
    const radius = this.outerRadius * 0.75; // Bán kính vị trí của khung
    const borderRadius = 8; // Bán kính bo góc của khung

    for (let i = 1; i < this.segments.length; i++) {
        const segment = this.segments[i];
        if (!segment) continue;

        const startAngle = this.degToRad(segment.startAngle + this.rotationAngle);
        const endAngle = this.degToRad(segment.endAngle + this.rotationAngle);
        const midAngle = (startAngle + endAngle) / 2;

        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(midAngle);

        // Tính toán vị trí của khung với margin
        const x = -boxWidth / 2;
        const y = -radius - boxHeight - margin; // Đặt khung dưới văn bản

        // Vẽ khung trắng với border-radius
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + boxWidth - borderRadius, y);
        ctx.arc(x + boxWidth - borderRadius, y + borderRadius, borderRadius, -Math.PI / 2, 0);
        ctx.lineTo(x + boxWidth, y + boxHeight - borderRadius);
        ctx.arc(x + boxWidth - borderRadius, y + boxHeight - borderRadius, borderRadius, 0, Math.PI / 2);
        ctx.lineTo(x + borderRadius, y + boxHeight);
        ctx.arc(x + borderRadius, y + boxHeight - borderRadius, borderRadius, Math.PI / 2, Math.PI);
        ctx.lineTo(x, y + borderRadius);
        ctx.arc(x + borderRadius, y + borderRadius, borderRadius, Math.PI, -Math.PI / 2);
        ctx.closePath();
        ctx.fill();

        // Vẽ văn bản lên khung
        ctx.fillStyle = 'black'; // Màu văn bản
        ctx.font = '12px Arial'; // Cỡ chữ và kiểu chữ
        ctx.textAlign = 'center'; // Căn giữa văn bản
        ctx.textBaseline = 'middle'; // Căn giữa văn bản theo chiều dọc
        ctx.fillText(segment.text, 0, -radius - (boxHeight / 2) - margin); // Vị trí của văn bản

        ctx.restore();
    }
}

}

export default ExtendedWinwheel;
