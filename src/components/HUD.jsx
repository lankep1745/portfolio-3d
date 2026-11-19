import React from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { PORTFOLIO_DATA } from '../portfolioData';
import { audioEngine } from '../utils/audio';

/**
 * Ultra-Minimal HUD Component
 * - Top-Left: Brand tag & station link
 * - Top-Right: Current station indicator + AUDIO toggle
 * - Bottom: 2px Golden progress bar
 * - Strictly NO flight-route mini-map box, NO bottom corner next boxes
 */
export default function HUD({
  currentStationIndex,
  scrollProgress,
  isAudioOn,
  onToggleAudio,
  onJumpToStation,
  onInteractiveHover,
}) {
  const currentStation = PORTFOLIO_DATA.stations[currentStationIndex] || PORTFOLIO_DATA.stations[0];

  return (
    <header className="fixed inset-x-0 top-0 z-40 pointer-events-none select-none">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        
        {/* Top-Left: Brand Tag */}
        <div
          className="pointer-events-auto flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            audioEngine.playClick();
            onJumpToStation(0);
          }}
          onMouseEnter={onInteractiveHover}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#F5B041] animate-pulse shadow-[0_0_8px_#F5B041]" />
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm tracking-[0.22em] text-[#F4F6FA] group-hover:text-[#F5B041] transition-colors">
              {PORTFOLIO_DATA.personal.hudBrand}
            </span>
            <span className="font-mono-code text-[10px] tracking-[0.18em] text-[#8E95A5] uppercase">
              {PORTFOLIO_DATA.personal.hudSub}
            </span>
          </div>
        </div>

        {/* Top-Right: Station Indicator & Audio Toggle */}
        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6">
          
          {/* Station Readout */}
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0a0c14]/70 border border-[#F5B041]/20 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-[#F5B041] animate-spin-slow" />
            <span className="font-mono-code text-xs tracking-wider text-[#8E95A5]">
              STATION
            </span>
            <span className="font-mono-code text-xs font-semibold tracking-widest text-[#FFD27D]">
              [{currentStation.id}/05] {currentStation.name}
            </span>
          </div>

          {/* Audio Toggle Button */}
          <button
            onClick={() => {
              onToggleAudio();
            }}
            onMouseEnter={onInteractiveHover}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono-code tracking-wider transition-all duration-300 backdrop-blur-md ${
              isAudioOn
                ? 'bg-[#F5B041]/15 text-[#FFD27D] border border-[#F5B041]/50 shadow-[0_0_15px_rgba(245,176,65,0.2)]'
                : 'bg-[#0a0c14]/70 text-[#8E95A5] border border-white/10 hover:border-[#F5B041]/30 hover:text-[#F4F6FA]'
            }`}
            title="Toggle Ambient Space Drone & SFX"
          >
            {isAudioOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#F5B041] animate-pulse" />
                <span className="hidden xs:inline">AUDIO: ON</span>
                {/* Audio wave bars */}
                <span className="flex items-center gap-0.5 ml-1">
                  <span className="w-0.5 h-2 bg-[#F5B041] animate-[pulse_0.6s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-3.5 bg-[#FFD27D] animate-[pulse_0.4s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-2 bg-[#F5B041] animate-[pulse_0.7s_ease-in-out_infinite]" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span className="hidden xs:inline">AUDIO: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Viewport 2px Golden Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-white/5 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#F5B041] via-[#FFD27D] to-[#F5B041] shadow-[0_0_10px_#F5B041] transition-all duration-75 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
        />
      </div>
    </header>
  );
}
