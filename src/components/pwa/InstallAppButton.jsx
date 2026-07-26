'use client';

import { Download, Share2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import styles from './InstallAppButton.module.css';

let sharedDeferredPrompt = null;
const promptSubscribers = new Set();

function publishPromptState() {
  promptSubscribers.forEach((subscriber) => subscriber(Boolean(sharedDeferredPrompt)));
}

function isStandaloneMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
  );
}

function isIosDevice() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function InstallAppButton({
  locale = 'ru',
  compact = false,
  className = '',
  onAction,
}) {
  const deferredPromptRef = useRef(sharedDeferredPrompt);
  const [installed, setInstalled] = useState(false);
  const [canPrompt, setCanPrompt] = useState(() => Boolean(sharedDeferredPrompt));
  const [showHelp, setShowHelp] = useState(false);
  const [busy, setBusy] = useState(false);

  const copy = useMemo(() => (
    locale === 'ru'
      ? {
          label: 'Установить приложение',
          installed: 'Приложение установлено',
          iosHelp: 'Нажмите «Поделиться», затем «На экран Домой».',
          browserHelp: 'Откройте меню браузера и выберите «Установить приложение».',
          close: 'Закрыть подсказку',
        }
      : {
          label: 'Install app',
          installed: 'App installed',
          iosHelp: 'Tap Share, then “Add to Home Screen”.',
          browserHelp: 'Open the browser menu and choose “Install app”.',
          close: 'Close installation hint',
        }
  ), [locale]);

  useEffect(() => {
    setInstalled(isStandaloneMode());

    const syncPromptState = (available) => {
      deferredPromptRef.current = sharedDeferredPrompt;
      setCanPrompt(available);
    };

    promptSubscribers.add(syncPromptState);
    syncPromptState(Boolean(sharedDeferredPrompt));

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      sharedDeferredPrompt = event;
      deferredPromptRef.current = event;
      publishPromptState();
    };

    const handleInstalled = () => {
      sharedDeferredPrompt = null;
      deferredPromptRef.current = null;
      publishPromptState();
      setInstalled(true);
      setShowHelp(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      promptSubscribers.delete(syncPromptState);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (installed || busy) {
      return;
    }

    const deferredPrompt = deferredPromptRef.current;

    if (!deferredPrompt) {
      setShowHelp((current) => !current);
      onAction?.();
      return;
    }

    setBusy(true);
    setShowHelp(false);

    try {
      await deferredPrompt.prompt();

      const choice = await deferredPrompt.userChoice;

      sharedDeferredPrompt = null;
      deferredPromptRef.current = null;
      publishPromptState();

      if (choice?.outcome === 'accepted') {
        setInstalled(true);
      }
    } catch (error) {
      console.warn(
          '[InstallAppButton] Installation prompt failed:',
          error,
      );

      sharedDeferredPrompt = null;
      deferredPromptRef.current = null;
      publishPromptState();

      setShowHelp(true);
    } finally {
      setBusy(false);
      onAction?.();
    }
  };

  if (installed) {
    return null;
  }

  const Icon = !canPrompt && isIosDevice() ? Share2 : Download;

  return (
    <span className={`${styles.wrapper} ${className}`}>
      <button
        type="button"
        className={`${styles.button} ${compact ? styles.compact : styles.full}`}
        onClick={handleInstall}
        disabled={busy}
        aria-expanded={showHelp}
        aria-label={copy.label}
      >
        <Icon aria-hidden="true" />
        {!compact && <span>{copy.label}</span>}
      </button>

      {showHelp && (
        <span className={styles.help} role="note">
          <span>{isIosDevice() ? copy.iosHelp : copy.browserHelp}</span>
          <button
            type="button"
            className={styles.helpClose}
            onClick={() => setShowHelp(false)}
            aria-label={copy.close}
          >
            ×
          </button>
        </span>
      )}
    </span>
  );
}
