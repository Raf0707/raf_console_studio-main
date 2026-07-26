(() => {
  const params = new URLSearchParams(window.location.search);
  const requestedLanguage = params.get('lang');
  const isRussian = requestedLanguage
    ? requestedLanguage === 'ru'
    : navigator.language.toLowerCase().startsWith('ru');

  document.documentElement.lang = isRussian ? 'ru' : 'en';

  const copy = isRussian
    ? {
        title: 'Нет подключения',
        eyebrow: 'Raf</>Console Studio · Офлайн',
        lead: 'Интернет недоступен, но два важных раздела уже сохранены на устройстве и продолжат работать.',
        boredTitle: 'От скуки',
        boredDescription: 'Полноэкранная игра, AIM-тренировка и все сохранённые звуки.',
        policyTitle: 'Политика',
        policyDescription: 'Политика конфиденциальности доступна даже без сети.',
        retry: 'Проверить подключение',
        checking: 'Проверяем подключение…',
        stillOffline: 'Интернет пока недоступен.',
        restored: 'Подключение восстановлено. Возвращаемся на сайт…',
      }
    : {
        title: 'No connection',
        eyebrow: 'Raf</>Console Studio · Offline',
        lead: 'The internet is unavailable, but two important sections are already stored on this device and remain usable.',
        boredTitle: 'AntiBoredom',
        boredDescription: 'Fullscreen game, AIM training and all cached sound effects.',
        policyTitle: 'Policy',
        policyDescription: 'The Privacy Policy remains available without a connection.',
        retry: 'Check connection',
        checking: 'Checking connection…',
        stillOffline: 'The internet is still unavailable.',
        restored: 'Connection restored. Returning to the website…',
      };

  document.title = `${copy.title} — Raf</>Console Studio`;
  document.getElementById('title').textContent = copy.title;
  document.getElementById('eyebrow').textContent = copy.eyebrow;
  document.getElementById('lead').textContent = copy.lead;
  document.getElementById('bored-title').textContent = copy.boredTitle;
  document.getElementById('bored-description').textContent = copy.boredDescription;
  document.getElementById('policy-title').textContent = copy.policyTitle;
  document.getElementById('policy-description').textContent = copy.policyDescription;
  document.getElementById('retry').textContent = copy.retry;

  document.getElementById('bored-link').href = isRussian ? '/bored_ru' : '/bored';
  document.getElementById('policy-link').href = isRussian ? '/privacy_policy_ru' : '/privacy_policy';

  const retryButton = document.getElementById('retry');
  const status = document.getElementById('status');

  async function checkConnection() {
    retryButton.disabled = true;
    status.textContent = copy.checking;

    try {
      const response = await fetch(`/api/connectivity?check=${Date.now()}`, {
        cache: 'no-store',
      });

      if (!response.ok || !navigator.onLine) {
        throw new Error('Offline');
      }

      status.textContent = copy.restored;

      const target = params.get('target');
      window.setTimeout(() => {
        window.location.replace(target || (isRussian ? '/main_ru' : '/main'));
      }, 500);
    } catch {
      status.textContent = copy.stillOffline;
      retryButton.disabled = false;
    }
  }

  retryButton.addEventListener('click', checkConnection);

  window.addEventListener('online', checkConnection);
})();
