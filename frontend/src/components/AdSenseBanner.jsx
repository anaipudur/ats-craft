import React, { useEffect } from 'react';
import { DollarSign } from 'lucide-react';

export default function AdSenseBanner({ 
  slot = "1234567890", 
  format = "auto", 
  responsive = "true",
  type = "leaderboard", // leaderboard | sidebar | infeed
  className = "" 
}) {
  const isDev = import.meta.env.DEV;
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX";
  const isPlaceholderId = clientId === "ca-pub-XXXXXXXXXXXXXXXX";

  useEffect(() => {
    // Skip script injection in local development or with placeholder IDs
    if (isDev || isPlaceholderId) return;

    // Dynamically inject Google AdSense script in production if not already loaded
    const scriptId = 'adsbygoogle-js-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onerror = () => {
        console.warn('AdSense script blocked or failed to load (e.g. AdBlocker active).');
      };
      document.head.appendChild(script);
    }

    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense Push Error: ", e);
    }
  }, [isDev, clientId, isPlaceholderId]);

  if (isDev || isPlaceholderId) {
    // Visual preview card in development or testing mode showing AdSense revenue slot
    return (
      <div className={`relative overflow-hidden rounded-xl border border-dashed border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900 to-amber-950/20 p-4 text-center ${className}`}>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span>Google AdSense Slot ({type.toUpperCase()})</span>
          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">Development Mode</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Targeted Ads will display here in production when <code className="text-amber-300 font-mono">VITE_ADSENSE_CLIENT_ID</code> is configured.
        </p>
      </div>
    );
  }

  return (
    <div className={`my-4 flex justify-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

