import React, { useEffect } from 'react';
import { Sparkles, DollarSign } from 'lucide-react';

export default function AdSenseBanner({ 
  slot = "1234567890", 
  format = "auto", 
  responsive = "true",
  type = "leaderboard", // leaderboard | sidebar | infeed
  className = "" 
}) {
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    // Inject AdSense script if adsbygoogle is defined
    try {
      if (window.adsbygoogle && !isDev) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense Error: ", e);
    }
  }, [isDev]);

  if (isDev) {
    // Visual high-tech preview card in development mode showing AdSense revenue potential
    return (
      <div className={`relative overflow-hidden rounded-xl border border-dashed border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900 to-amber-950/20 p-4 text-center ${className}`}>
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span>Google AdSense Slot ({type.toUpperCase()})</span>
          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">High CPC</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Targeted Career & Job Ads will display here when live (`pub-xxxxxxxxxxxxxx`).
        </p>
      </div>
    );
  }

  return (
    <div className={`my-4 flex justify-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with actual AdSense Publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
