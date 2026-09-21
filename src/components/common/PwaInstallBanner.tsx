import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also show hint if on iOS Safari standalone is false
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isStandalone = (window.navigator as any).standalone;
    if (isIos && !isStandalone) {
      const dismissed = localStorage.getItem('burj_pwa_ios_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('burj_pwa_ios_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold shadow-xs">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 shrink-0" />
        <span>Install Burj Accounts PWA to Home Screen</span>
      </div>

      <div className="flex items-center gap-2">
        {deferredPrompt ? (
          <button
            onClick={handleInstall}
            className="px-2.5 py-1 bg-slate-950 text-amber-400 rounded-lg font-bold text-[11px] pressable"
          >
            Install
          </button>
        ) : (
          <span className="text-[10px] text-slate-900 bg-amber-400 px-2 py-0.5 rounded">
            Share <Share className="inline w-2.5 h-2.5 mx-0.5" /> + Add to Home
          </span>
        )}
        <button onClick={handleDismiss} className="text-slate-900/70 hover:text-slate-950 pressable">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
