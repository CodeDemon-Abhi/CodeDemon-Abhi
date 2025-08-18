(() => {
  const buttons = Array.from(document.querySelectorAll('[data-screen]'));
  const navButtons = Array.from(document.querySelectorAll('.nav-btn'));
  const screens = {
    onboarding: document.getElementById('screen-onboarding'),
    dashboard: document.getElementById('screen-dashboard'),
    scan: document.getElementById('screen-scan'),
    skin: document.getElementById('screen-skin'),
    plan: document.getElementById('screen-plan'),
    habits: document.getElementById('screen-habits'),
    progress: document.getElementById('screen-progress'),
    settings: document.getElementById('screen-settings')
  };

  function setActive(screenKey) {
    Object.values(screens).forEach(el => el.classList.remove('is-active'));
    screens[screenKey]?.classList.add('is-active');
    navButtons.forEach(btn => btn.classList.toggle('is-active', btn.dataset.screen === screenKey));
  }

  buttons.forEach(btn => btn.addEventListener('click', (e) => setActive(btn.dataset.screen)));

  // Progress compare slider mock
  const slider = document.querySelector('.slider');
  const layerB = document.querySelector('.layer-b');
  if (slider && layerB) {
    slider.addEventListener('input', () => {
      const v = Number(slider.value);
      layerB.style.opacity = String(v / 100);
    });
  }
})();

