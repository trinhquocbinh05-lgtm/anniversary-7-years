/* =========================================================
   SCRIPT.JS - KỶ NIỆM 7 NĂM YÊU NHAU (DÚI THƠM & ĐỤT ĐỤT THÚI)
   ========================================================= */

(function () {
  'use strict';

  // DOM Elements - Main Game
  const mainContainer = document.getElementById('mainContainer');
  const questionCard = document.getElementById('questionCard');
  const celebrationCard = document.getElementById('celebrationCard');
  const buttonsContainer = document.getElementById('buttonsContainer');
  const btnSuperYes = document.getElementById('btnSuperYes');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const btnNoText = document.getElementById('btnNoText');
  const btnReplay = document.getElementById('btnReplay');
  const btnOpenStoryDirect = document.getElementById('btnOpenStoryDirect');
  const btnReplayStory = document.getElementById('btnReplayStory');
  const dialogueText = document.getElementById('dialogueText');
  const speechBubble = document.getElementById('speechBubble');
  const mascotWrapper = document.getElementById('mascotWrapper');
  const mascotGif = document.getElementById('mascotGif');
  const celebrationGif = document.getElementById('celebrationGif');
  const counterText = document.getElementById('counterText');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const bgDecorations = document.getElementById('bgDecorations');
  const confettiCanvas = document.getElementById('confettiCanvas');

  // DOM Elements - Story Slideshow
  const storyOverlay = document.getElementById('storyOverlay');
  const storyCloseBtn = document.getElementById('storyCloseBtn');
  const storyMilestoneTag = document.getElementById('storyMilestoneTag');
  const storyYear = document.getElementById('storyYear');
  const storyTitle = document.getElementById('storyTitle');
  const storyDesc = document.getElementById('storyDesc');
  const storyImage = document.getElementById('storyImage');
  const storyBtnPrev = document.getElementById('storyBtnPrev');
  const storyBtnNext = document.getElementById('storyBtnNext');
  const storyProgressContainer = document.getElementById('storyProgressContainer');
  const storyDots = document.getElementById('storyDots');
  const tapLeft = document.getElementById('tapLeft');
  const tapRight = document.getElementById('tapRight');

  // State variables
  let dodgeCount = 0;
  let isSoundMuted = false;
  let audioCtx = null;
  let lastDodgeTime = 0;
  let bgMusicAudio = null;
  let isBgMusicPlaying = false;

  // Story Slideshow State
  let currentStoryIndex = 0;
  let storyTimer = null;
  let storyProgressInterval = null;
  const STORY_DURATION = 8000;

  // 6 Milestones of the 7-Year Journey (Customized with Dúi thơm & Đụt Đụt thúi)
  const storyMilestones = [
    {
      tag: "CỘT MỐC 01 / 06",
      year: "Năm 2019 • Ngày ấy ngây ngô",
      title: "Chỉ là bạn trong cùng một nhóm bạn",
      desc: "Ngày đó đi học chung, hai đứa chỉ là những người bạn ngây thơ trong cùng một nhóm bạn bè. Suốt ngày chí chóe cãi nhau, trêu chọc đủ thứ trên đời, chưa từng ai nghĩ rằng từ những lần gặp gỡ tình cờ ấy lại là mở đầu cho câu chuyện tình 7 năm thanh xuân.",
      image: "images/bubu_dudu_cover.png"
    },
    {
      tag: "CỘT MỐC 02 / 06",
      year: "Mùa hè thi đại học",
      title: "Chí chóe ôn bài & Vượt qua mùa thi",
      desc: "Mùa hè năm 18 tuổi với những tập đề thi dày cộp. Vừa ôn bài căng thẳng vừa cãi nhau chí chóe xem đứa nào giải bài nhanh hơn. Thật may mắn vì những ngày tháng đó luôn có một người cùng thức khuya, tiếp thêm can đảm trước bước ngoặt cuộc đời.",
      image: "images/sad3.gif"
    },
    {
      tag: "CỘT MỐC 03 / 06",
      year: "Những năm tháng sinh viên",
      title: "Xe máy đón đưa • Khác trường nhưng chung lối",
      desc: "Bước vào đại học ở hai ngôi trường khác nhau, lịch học lệch nhau. Nhưng nhớ nhất vẫn là những buổi chiều Dúi thơm chạy xe máy qua trường đón Đụt Đụt thúi, chở nhau lượn lờ phố xá, cùng ăn vặt và uống trà sữa sau giờ tan học.",
      image: "images/happy4.gif"
    },
    {
      tag: "CỘT MỐC 04 / 06",
      year: "Cột mốc tốt nghiệp",
      title: "Ngày em tốt nghiệp trước anh",
      desc: "Ngày Đụt Đụt thúi khoác lên mình bộ lễ phục cử nhân rạng rỡ nhất. Dúi thơm đứng nhìn em với tất cả niềm tự hào. Cô bạn ngô nghê hay chí chóe ngày nào giờ đã trưởng thành và tự tin vững vàng bước vào đời.",
      image: "images/happy2.gif"
    },
    {
      tag: "CỘT MỐC 05 / 06",
      year: "Thử thách cuộc đời",
      title: "Khác ngành, khác cả thành phố...",
      desc: "Bước vào đời với bao bộn bề lo toan. Công việc khác ngành, khoảng cách địa lý giữa hai thành phố. Những chuyến xe vội vã cuối tuần để được gặp nhau, những lúc nhớ nhung đến phát khóc... Nhưng chưa một lần hai đứa nghĩ đến việc buông tay!",
      image: "images/sad1.gif"
    },
    {
      tag: "CỘT MỐC 06 / 06",
      year: "Tròn 7 Năm • Hiện tại & Mãi mãi",
      title: "2.556 Ngày • Chúng mình đã làm được!",
      desc: "Vượt qua mọi khoảng cách địa lý và thử thách, hôm nay hai đứa đã cùng nhau đi trọn vẹn 7 năm bên nhau. Cảm ơn Đụt Đụt thúi vì đã luôn kiên nhẫn, luôn chọn ở lại và cùng Dúi thơm đi qua những năm tháng đẹp nhất. Yêu em rất nhiều! ❤️",
      image: "images/happy0.gif"
    }
  ];

  // Dialogue lines for troll button (Customized with Dúi thơm & Đụt Đụt thúi)
  const dialogues = [
    {
      text: "Đụt Đụt thúi có muốn tiếp tục mối quan hệ này với Dúi thơm hông nè? ✨",
      btnNoText: "Hỏng muốn",
      gif: "images/propose_bubu.gif",
      anim: "bounce-idle"
    },
    {
      text: "Ủa? Đụt Đụt thúi chắc chưa dạ ta? Nghĩ lại đi mà! 🤔",
      btnNoText: "Hỏng muốn (thật á?)",
      gif: "images/sad0.gif",
      anim: "bounce-idle"
    },
    {
      text: "Nghĩ cho kỹ nha, cơ hội sửa sai lần 1 đó Đụt Đụt thúi ơi! 🤨",
      btnNoText: "Hỏng muốn đâu 🙈",
      gif: "images/sad1.gif",
      anim: "shake-angry"
    },
    {
      text: "Nút này bị liệt rồi, bấm chi hoài dị má?? 😾",
      btnNoText: "Đã bảo hỏng mà 😤",
      gif: "images/sad2.gif",
      anim: "shake-angry"
    },
    {
      text: "Ủa alo?? 7 năm thanh xuân của Dúi thơm đâu rồi?!! 💢",
      btnNoText: "Vẫn bấm nút này? 👿",
      gif: "images/sad3.gif",
      anim: "furious-shake"
    },
    {
      text: "Bấm nữa là Dúi thơm lăn ra đất khóc ăn vạ dỗi nghỉ chơi luôn á! 🥺",
      btnNoText: "Tha cho Dúi thơm đi 😭",
      gif: "images/sad4.gif",
      anim: "shake-angry"
    },
    {
      text: "Hỏng cho bấm nữa! Chỉ được chọn 2 nút kia thui đồ đáng ghét! 😤",
      btnNoText: "Đố bắt được 🏃‍♂️💨",
      gif: "images/sad5.gif",
      anim: "furious-shake"
    }
  ];

  // Preload images into browser memory
  function preloadImages() {
    const gifs = [
      'images/bubu_dudu_cover.png',
      'images/propose_bubu.gif',
      'images/sad0.gif',
      'images/sad1.gif',
      'images/sad2.gif',
      'images/sad3.gif',
      'images/sad4.gif',
      'images/sad5.gif',
      'images/happy0.gif',
      'images/happy1.gif',
      'images/happy2.gif',
      'images/happy3.gif',
      'images/happy4.gif'
    ];
    gifs.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  // Web Audio Context initialization
  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Audio synthesis helpers
  function playSynthTone(freq, type, duration, gainVal = 0.15) {
    if (isSoundMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playDodgeSound() {
    initAudio();
    if (isSoundMuted || !audioCtx) return;
    const notes = [440, 554, 659, 880, 1108];
    const freq = notes[Math.min(dodgeCount, notes.length - 1)];
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  }

  function playFanfareSound() {
    initAudio();
    if (isSoundMuted || !audioCtx) return;
    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chords.forEach((note, index) => {
      setTimeout(() => {
        playSynthTone(note, 'triangle', 0.8, 0.22);
      }, index * 120);
    });
  }

  function playSlideChime() {
    initAudio();
    if (isSoundMuted || !audioCtx) return;
    playSynthTone(587.33, 'sine', 0.25, 0.1);
  }

  // Floating background elements
  function createFloatingHearts() {
    const symbols = ['💖', '💕', '✨', '🌸', '🥰'];
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.fontSize = (Math.random() * 16 + 14) + 'px';
      heart.style.animationDelay = (Math.random() * 6) + 's';
      heart.style.animationDuration = (Math.random() * 5 + 6) + 's';
      bgDecorations.appendChild(heart);
    }
  }

  // =========================================================
  // DODGE BUTTON LOGIC - CHẠY KHẮP MÀN HÌNH KHÔNG BAO GIỜ MẤT
  // =========================================================
  function dodgeButton(e) {
    if (e && e.type !== 'mousemove') {
      e.preventDefault();
    }

    const now = Date.now();
    if (now - lastDodgeTime < 160) return;
    lastDodgeTime = now;

    dodgeCount++;
    playDodgeSound();

    if (btnNo.parentElement !== document.body) {
      const initialRect = btnNo.getBoundingClientRect();
      btnNo.classList.add('dodging');
      btnNo.style.position = 'fixed';
      btnNo.style.left = initialRect.left + 'px';
      btnNo.style.top = initialRect.top + 'px';
      btnNo.style.margin = '0';
      document.body.appendChild(btnNo);
      void btnNo.offsetWidth;
    }

    const btnRect = btnNo.getBoundingClientRect();
    const btnWidth = btnRect.width || 135;
    const btnHeight = btnRect.height || 44;

    const padSide = 20;
    const padTop = 75;
    const padBottom = 75;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const minX = padSide;
    const maxX = Math.max(minX, viewportW - btnWidth - padSide);
    const minY = padTop;
    const maxY = Math.max(minY, viewportH - btnHeight - padBottom);

    const curX = parseFloat(btnNo.style.left) || btnRect.left || (viewportW / 2);
    const curY = parseFloat(btnNo.style.top) || btnRect.top || (viewportH / 2);

    let newX, newY;
    let attempts = 0;
    do {
      newX = Math.floor(Math.random() * (maxX - minX)) + minX;
      newY = Math.floor(Math.random() * (maxY - minY)) + minY;
      attempts++;
    } while (attempts < 15 && Math.hypot(newX - curX, newY - curY) < 130);

    btnNo.style.left = newX + 'px';
    btnNo.style.top = newY + 'px';

    const configIndex = Math.min(dodgeCount, dialogues.length - 1);
    const config = dialogues[configIndex];

    dialogueText.textContent = config.text;
    btnNoText.textContent = config.btnNoText;

    if (mascotGif.src.indexOf(config.gif) === -1) {
      mascotGif.src = config.gif;
    }

    speechBubble.style.animation = 'none';
    void speechBubble.offsetWidth;
    speechBubble.style.animation = 'bubblePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    mascotWrapper.className = 'mascot-wrapper ' + config.anim;

    const scaleFactor = Math.min(1.42, 1 + dodgeCount * 0.06);
    btnSuperYes.style.transform = `scale(${scaleFactor})`;
    btnYes.style.transform = `scale(${scaleFactor * 0.95})`;

    counterText.textContent = `Đụt Đụt thúi đã từ chối Dúi thơm ${dodgeCount} lần rồi đó nha 🥺`;
  }

  // =========================================================
  // STORY SLIDESHOW LOGIC
  // =========================================================

  function renderStorySlide(index) {
    if (index < 0) index = 0;
    if (index >= storyMilestones.length) {
      finishStory();
      return;
    }

    currentStoryIndex = index;
    const item = storyMilestones[index];

    storyMilestoneTag.textContent = item.tag;
    storyYear.textContent = item.year;
    storyTitle.textContent = item.title;
    storyDesc.textContent = item.desc;
    storyImage.src = item.image;

    // Update Dots
    const dots = storyDots.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.className = (idx === index) ? 'dot active' : 'dot';
    });

    // Update Progress Bars
    const bars = storyProgressContainer.querySelectorAll('.story-bar');
    bars.forEach((bar, idx) => {
      const fill = bar.querySelector('.story-fill');
      if (idx < index) {
        bar.className = 'story-bar completed';
        fill.style.width = '100%';
      } else if (idx === index) {
        bar.className = 'story-bar active';
        fill.style.width = '0%';
      } else {
        bar.className = 'story-bar';
        fill.style.width = '0%';
      }
    });

    // Update Buttons
    if (index === 0) {
      storyBtnPrev.style.visibility = 'hidden';
    } else {
      storyBtnPrev.style.visibility = 'visible';
    }

    if (index === storyMilestones.length - 1) {
      storyBtnNext.textContent = '💖 Xem thư tình & Đếm ngày ➔';
      storyBtnNext.className = 'story-nav-btn btn-finish';
    } else {
      storyBtnNext.textContent = 'Tiếp theo ▶';
      storyBtnNext.className = 'story-nav-btn btn-next';
    }

    playSlideChime();
    startSlideTimer();
  }

  function startSlideTimer() {
    clearSlideTimer();
    const currentBar = storyProgressContainer.querySelectorAll('.story-bar')[currentStoryIndex];
    if (!currentBar) return;
    const currentFill = currentBar.querySelector('.story-fill');

    const stepInterval = 50;
    const totalSteps = STORY_DURATION / stepInterval;
    let step = 0;

    storyProgressInterval = setInterval(() => {
      step++;
      const percent = (step / totalSteps) * 100;
      if (currentFill) currentFill.style.width = percent + '%';

      if (step >= totalSteps) {
        clearSlideTimer();
        nextStorySlide();
      }
    }, stepInterval);
  }

  function clearSlideTimer() {
    if (storyProgressInterval) clearInterval(storyProgressInterval);
    if (storyTimer) clearTimeout(storyTimer);
  }

  function nextStorySlide() {
    if (currentStoryIndex < storyMilestones.length - 1) {
      renderStorySlide(currentStoryIndex + 1);
    } else {
      finishStory();
    }
  }

  function prevStorySlide() {
    if (currentStoryIndex > 0) {
      renderStorySlide(currentStoryIndex - 1);
    }
  }

  function openStory(startIndex = 0) {
    initAudio();
    tryPlayBackgroundAudio();
    storyOverlay.style.display = 'flex';
    renderStorySlide(startIndex);
  }

  function closeStory() {
    clearSlideTimer();
    storyOverlay.style.display = 'none';
  }

  function finishStory() {
    closeStory();
    showCelebrationCard();
  }

  // =========================================================
  // CELEBRATION CARD LOGIC
  // =========================================================

  let happyGifTimer = null;
  function showCelebrationCard() {
    if (mainContainer) mainContainer.classList.add('has-celebration');
    questionCard.style.display = 'none';
    btnNo.style.display = 'none';
    celebrationCard.style.display = 'block';

    const happyGifs = ['images/happy0.gif', 'images/happy1.gif', 'images/happy2.gif'];
    let happyIndex = 0;
    celebrationGif.src = happyGifs[0];

    if (happyGifTimer) clearInterval(happyGifTimer);
    happyGifTimer = setInterval(() => {
      happyIndex = (happyIndex + 1) % happyGifs.length;
      celebrationGif.src = happyGifs[happyIndex];
    }, 3500);

    startConfetti();
    tryPlayBackgroundAudio();
  }

  function onAccept() {
    initAudio();
    playFanfareSound();
    startConfetti();

    dialogueText.textContent = "Dúi thơm biết ngay mà! Cùng Dúi thơm lên chuyến tàu nhìn lại 7 năm qua nhé... 🚂💕";
    btnSuperYes.textContent = "Đang khởi hành... 🚂";
    btnYes.style.display = 'none';
    btnNo.style.display = 'none';

    setTimeout(() => {
      openStory(0);
    }, 1400);
  }

  function tryPlayBackgroundAudio() {
    if (isSoundMuted) return;
    if (!bgMusicAudio) {
      bgMusicAudio = new Audio('music/background.mp3');
      bgMusicAudio.loop = true;
      bgMusicAudio.volume = 0.55;
    }
    bgMusicAudio.play().then(() => {
      isBgMusicPlaying = true;
      musicBtnStatus();
    }).catch((err) => {
      console.log('Autoplay pending user click:', err);
    });
  }

  function musicBtnStatus() {
    if (!bgMusicAudio || bgMusicAudio.paused || isSoundMuted) {
      musicIcon.textContent = '🔇';
      musicToggle.classList.remove('playing');
    } else {
      musicIcon.textContent = '🎵';
      musicToggle.classList.add('playing');
    }
  }

  function toggleMusic() {
    initAudio();
    if (!bgMusicAudio) {
      tryPlayBackgroundAudio();
      return;
    }
    if (bgMusicAudio.paused) {
      isSoundMuted = false;
      bgMusicAudio.play().catch(() => {});
    } else {
      isSoundMuted = true;
      bgMusicAudio.pause();
    }
    musicBtnStatus();
  }

  // Play music on first user interaction anywhere
  function onFirstUserGesture() {
    initAudio();
    tryPlayBackgroundAudio();
    document.removeEventListener('click', onFirstUserGesture);
    document.removeEventListener('touchstart', onFirstUserGesture);
  }
  document.addEventListener('click', onFirstUserGesture, { once: true });
  document.addEventListener('touchstart', onFirstUserGesture, { once: true });

  // Confetti Particle Engine
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  function initConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCtx = confettiCanvas.getContext('2d');
  }

  function startConfetti() {
    initConfettiCanvas();
    confettiParticles = [];
    const colors = ['#ff4757', '#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#9b59b6', '#ffd32a'];

    for (let i = 0; i < 120; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.8) * 18,
        size: Math.random() * 9 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        isHeart: Math.random() > 0.4,
        opacity: 1
      });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
  }

  function drawHeart(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.fillStyle = color;
    ctx.beginPath();
    const d = size;
    ctx.moveTo(0, d / 4);
    ctx.quadraticCurveTo(0, 0, d / 4, 0);
    ctx.quadraticCurveTo(d / 2, 0, d / 2, d / 3);
    ctx.quadraticCurveTo(d / 2, 0, (3 * d) / 4, 0);
    ctx.quadraticCurveTo(d, 0, d, d / 4);
    ctx.quadraticCurveTo(d, d / 2, (3 * d) / 4, (3 * d) / 4);
    ctx.lineTo(d / 2, d);
    ctx.lineTo(d / 4, (3 * d) / 4);
    ctx.quadraticCurveTo(0, d / 2, 0, d / 4);
    ctx.fill();
    ctx.restore();
  }

  function animateConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    let activeParticles = 0;
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.vx *= 0.98;
      p.rotation += p.rotSpeed;

      if (p.y < window.innerHeight + 50) {
        activeParticles++;
        confettiCtx.globalAlpha = p.opacity;
        if (p.isHeart) {
          drawHeart(confettiCtx, p.x, p.y, p.size * 1.5, p.color, p.rotation);
        } else {
          confettiCtx.save();
          confettiCtx.translate(p.x, p.y);
          confettiCtx.rotate((p.rotation * Math.PI) / 180);
          confettiCtx.fillStyle = p.color;
          confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          confettiCtx.restore();
        }
      }
    });

    confettiCtx.globalAlpha = 1;

    if (activeParticles > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    }
  }

  // Reset Game
  function resetGame() {
    dodgeCount = 0;
    if (happyGifTimer) clearInterval(happyGifTimer);
    clearSlideTimer();

    if (mainContainer) mainContainer.classList.remove('has-celebration');
    questionCard.style.display = 'block';
    celebrationCard.style.display = 'none';
    storyOverlay.style.display = 'none';

    btnNo.style.display = 'inline-flex';
    btnNo.classList.remove('dodging');
    btnNo.style.position = '';
    btnNo.style.left = '';
    btnNo.style.top = '';
    btnNo.style.width = '';
    btnNo.style.margin = '';
    buttonsContainer.appendChild(btnNo);

    btnNoText.textContent = "Hỏng muốn";

    btnSuperYes.style.transform = 'scale(1)';
    btnSuperYes.innerHTML = '<span class="btn-icon">💖</span><span class="btn-text">Rất muốn!</span>';
    btnYes.style.display = 'inline-flex';
    btnYes.style.transform = 'scale(1)';

    dialogueText.textContent = dialogues[0].text;
    mascotGif.src = dialogues[0].gif;
    mascotWrapper.className = 'mascot-wrapper ' + dialogues[0].anim;
    counterText.textContent = '';

    if (confettiCtx) {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // Event Listeners cho nút Hỏng muốn
  btnNo.addEventListener('mouseenter', dodgeButton);
  btnNo.addEventListener('mouseover', dodgeButton);
  btnNo.addEventListener('touchstart', dodgeButton, { passive: false });
  btnNo.addEventListener('pointerdown', dodgeButton);
  btnNo.addEventListener('click', dodgeButton);

  document.addEventListener('mousemove', (e) => {
    if (questionCard.style.display === 'none') return;
    if (!btnNo.classList.contains('dodging')) return;
    const btnRect = btnNo.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
    if (dist < 60) {
      dodgeButton(e);
    }
  });

  btnSuperYes.addEventListener('click', onAccept);
  btnYes.addEventListener('click', onAccept);
  btnReplay.addEventListener('click', resetGame);
  musicToggle.addEventListener('click', toggleMusic);

  // Story Navigation Events
  btnOpenStoryDirect.addEventListener('click', () => openStory(0));
  btnReplayStory.addEventListener('click', () => openStory(0));
  storyCloseBtn.addEventListener('click', closeStory);
  storyBtnNext.addEventListener('click', nextStorySlide);
  storyBtnPrev.addEventListener('click', prevStorySlide);

  tapLeft.addEventListener('click', (e) => {
    e.stopPropagation();
    prevStorySlide();
  });
  tapRight.addEventListener('click', (e) => {
    e.stopPropagation();
    nextStorySlide();
  });

  window.addEventListener('resize', () => {
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    if (btnNo.classList.contains('dodging')) {
      const btnRect = btnNo.getBoundingClientRect();
      const padSide = 20;
      const padTop = 75;
      const padBottom = 75;
      const maxX = Math.max(padSide, window.innerWidth - btnRect.width - padSide);
      const maxY = Math.max(padTop, window.innerHeight - btnRect.height - padBottom);
      let curX = parseFloat(btnNo.style.left) || padSide;
      let curY = parseFloat(btnNo.style.top) || padTop;
      btnNo.style.left = Math.min(Math.max(padSide, curX), maxX) + 'px';
      btnNo.style.top = Math.min(Math.max(padTop, curY), maxY) + 'px';
    }
  });

  // Init
  preloadImages();
  createFloatingHearts();

})();