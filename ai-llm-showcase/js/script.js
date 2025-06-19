/**
 * 📦 模組：ai-llm-showcase
 * 🕒 更新：2025-06-19T05:04:45Z
 * 🧑‍💻 作者：@Codex
 * 🔢 版本：v1.5.0
 * 📝 摘要：add ai llm showcase
 */
// Initialize AOS animations
AOS.init();

// ChatGPT typed effect
const cgptTyped = new Typed('#cgpt-typed', {
  strings: ['歡迎來到 AI 世界！', '這裡有最酷炫的展示！'],
  typeSpeed: 50,
  backSpeed: 25,
  loop: true,
});

// Claude card tilt on scroll
const claudeCard = document.querySelector('.claude-card');
window.addEventListener('scroll', () => {
  const rotate = window.scrollY % 360;
  claudeCard.style.transform = `rotateY(${rotate}deg)`;
});

// Gemini star dust animation
const gemButton = document.getElementById('gem-button');
const egg = document.getElementById('easter-egg');
let gemActive = false;

gemButton.addEventListener('click', () => {
  if (gemActive) return;
  gemActive = true;
  gsap.to(gemButton, {
    duration: 1,
    rotation: 360,
    scale: 1.5,
    ease: 'elastic',
    onComplete: () => {
      egg.hidden = false;
      gsap.fromTo(egg, {opacity: 0}, {opacity: 1, duration: 1});
    }
  });
});
