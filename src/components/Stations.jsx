import React, { useState, useRef } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Download,
  Copy,
  Check,
  Send,
  Terminal,
  ExternalLink,
  Code2,
  Cpu,
  Wrench,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, YoutubeIcon, InstagramIcon } from './SocialIcons';
import { PORTFOLIO_DATA } from '../portfolioData';
import { audioEngine } from '../utils/audio';

/**
 * 3D Interactive Project Card with perspective tilt
 */
function ProjectCard({ proj, onSelectProject, onInteractiveHover }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onClick={() => {
        audioEngine.playShockwave();
        onSelectProject(proj);
      }}
      onMouseEnter={onInteractiveHover}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s',
      }}
      className="group relative glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-[#F5B041]/50 cursor-pointer hover:shadow-[0_0_35px_rgba(245,176,65,0.18)] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono-code font-bold tracking-widest uppercase bg-[#F5B041]/20 text-[#FFD27D] border border-[#F5B041]/40">
            {proj.badge}
          </span>
          <span className="font-mono-code text-xs text-[#8E95A5]">
            {proj.year}
          </span>
        </div>

        <h3 className="font-syne text-xl sm:text-2xl font-bold text-[#F4F6FA] group-hover:text-[#FFD27D] transition-colors mb-2">
          {proj.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#8E95A5] leading-relaxed mb-6 font-light">
          {proj.summary}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {proj.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-[#030408]/80 text-[#8E95A5] border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="font-mono-code text-xs text-[#F5B041] group-hover:underline tracking-wider">
            INSPECT CASE STUDY // INTEL
          </span>
          <ExternalLink className="w-4 h-4 text-[#F5B041] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

/**
 * 6 Stations Along Multi-Axis Guided Trajectory
 */
export default function Stations({
  onSelectProject,
  onInteractiveHover,
  onJumpToStation,
  isMobile,
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'sending' | 'success' | null
  const [formFields, setFormFields] = useState({ name: '', email: '', message: '' });

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState(PORTFOLIO_DATA.terminal.motd);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef(null);

  // Copy email handler
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.personal.email);
    setCopiedEmail(true);
    audioEngine.playShockwave();
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  // Terminal command execution
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    audioEngine.playClick();
    const promptPrefix = PORTFOLIO_DATA.terminal.prompt;
    const newHistory = [...terminalHistory, `${promptPrefix} ${terminalInput}`];

    if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    }

    if (PORTFOLIO_DATA.terminal.commands[cmd]) {
      newHistory.push(PORTFOLIO_DATA.terminal.commands[cmd]);
    } else {
      newHistory.push(`Command not recognized: '${cmd}'. Type 'help' for available commands.`);
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');

    setTimeout(() => {
      if (terminalBottomRef.current) {
        terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Contact form submission handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    audioEngine.playShockwave();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      setFormFields({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus(null), 4000);
    }, 1000);
  };

  return (
    <>
      {/* ========================================================
          STATION 00: ORIGIN (Hero)
          Coords: (0vw, 0vh)
          ======================================================== */}
      <section
        id="station-00"
        className="w-screen h-screen absolute top-0 left-0 flex items-center justify-center p-6 md:p-12 select-none overflow-y-auto"
      >
        <div className="max-w-4xl w-full text-center relative z-10 flex flex-col items-center my-auto">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0a0c14]/70 border border-[#F5B041]/30 backdrop-blur-md mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#F5B041]" />
            <span className="font-mono-code text-[11px] tracking-[0.25em] text-[#FFD27D] uppercase">
              {PORTFOLIO_DATA.personal.heroBadge}
            </span>
          </div>

          {/* Main Display Headline */}
          <h1 className="font-syne text-4xl sm:text-6xl lg:text-7xl font-black text-[#F4F6FA] tracking-tighter leading-tight mb-4">
            MAULANA AHMAD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5B041] via-[#FFD27D] to-[#F5B041] text-gold-glow">
              KHAIRUNNAS
            </span>
            <span className="text-xl sm:text-2xl font-mono-code font-light text-[#FFD27D] ml-2 sm:ml-4 align-middle">
              // LANA
            </span>
          </h1>

          {/* Subtitle & Role */}
          <p className="font-heading text-lg sm:text-2xl text-[#8E95A5] font-light max-w-2xl mb-4 tracking-wide">
            {PORTFOLIO_DATA.personal.role}
          </p>

          <p className="font-mono-code text-xs sm:text-sm text-[#8E95A5]/90 max-w-2xl mb-10 leading-relaxed font-light">
            {PORTFOLIO_DATA.personal.quote}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => {
                audioEngine.playClick();
                onJumpToStation(1);
              }}
              onMouseEnter={onInteractiveHover}
              className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#F5B041] to-[#FFD27D] text-[#030408] font-heading font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(245,176,65,0.4)] hover:shadow-[0_0_40px_rgba(245,176,65,0.7)] transition-all duration-300"
            >
              <span>JELAJAHI PROFIL</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>

            <a
              href={PORTFOLIO_DATA.personal.cvUrl}
              download
              onClick={() => audioEngine.playClick()}
              onMouseEnter={onInteractiveHover}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full glass-panel text-[#F4F6FA] hover:text-[#F5B041] font-mono-code text-xs sm:text-sm tracking-wider uppercase border border-white/10 hover:border-[#F5B041]/40 transition-all duration-300"
            >
              <Download className="w-4 h-4 text-[#F5B041]" />
              <span>DOWNLOAD CV</span>
            </a>
          </div>

          {/* Scroll Cue Hint */}
          <div className="mt-12 flex flex-col items-center gap-2 opacity-60">
            <span className="font-mono-code text-[10px] tracking-[0.25em] text-[#8E95A5] uppercase">
              SCROLL DOWN TO ENTER ORBIT
            </span>
            <div className="w-4 h-7 rounded-full border border-white/20 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-[#F5B041] animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          STATION 01: IDENTITY (About, Stats & Philosophy)
          Coords: (0vw, 100vh) [DOWN from 00]
          ======================================================== */}
      <section
        id="station-01"
        className="w-screen h-screen absolute top-[100vh] left-0 flex items-center justify-center p-6 md:p-12 select-none overflow-y-auto"
      >
        <div className="max-w-5xl w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          {/* Left Column: Bio */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-10 border border-[#F5B041]/25">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono-code text-xs text-[#F5B041] tracking-widest font-semibold uppercase">
                STATION [01] // IDENTITY
              </span>
            </div>

            <h2 className="font-syne text-2xl sm:text-3xl font-bold text-[#F4F6FA] tracking-tight mb-4">
              FULL-STACK PRECISION & LOCAL AI ARCHITECTURE
            </h2>

            <p className="text-[#8E95A5] text-sm sm:text-base leading-relaxed mb-6 font-light">
              {PORTFOLIO_DATA.personal.bio}
            </p>

            <div className="p-4 rounded-xl bg-[#030408]/60 border border-white/5 mb-8">
              <div className="font-mono-code text-xs text-[#8E95A5] flex items-center justify-between mb-1.5">
                <span>LOCATION:</span>
                <span className="text-[#F4F6FA]">{PORTFOLIO_DATA.personal.location}</span>
              </div>
              <div className="font-mono-code text-xs text-[#8E95A5] flex items-center justify-between">
                <span>AVAILABILITY:</span>
                <span className="text-[#FFD27D] font-semibold">{PORTFOLIO_DATA.personal.availability}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleCopyEmail}
                onMouseEnter={onInteractiveHover}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F5B041]/15 text-[#FFD27D] border border-[#F5B041]/40 text-xs font-mono-code tracking-wider uppercase hover:bg-[#F5B041]/25 transition-all"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'EMAIL TERSALIN' : 'COPY EMAIL / CONTACT'}</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playClick();
                  onJumpToStation(2);
                }}
                onMouseEnter={onInteractiveHover}
                className="flex items-center gap-2 text-xs font-mono-code text-[#8E95A5] hover:text-[#F5B041] transition-colors ml-auto"
              >
                <span>WARP TO WORKS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {PORTFOLIO_DATA.personal.stats.map((s, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#F5B041]/40 transition-all duration-300 flex flex-col justify-center text-center group"
                onMouseEnter={onInteractiveHover}
              >
                <span className="font-syne text-2xl sm:text-3xl font-extrabold text-[#F4F6FA] group-hover:text-[#FFD27D] transition-colors">
                  {s.value}
                </span>
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#8E95A5] mt-1">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          STATION 02: WORKS I (Featured Projects 1 & 2)
          Coords: (100vw, 100vh) [RIGHT from 01]
          ======================================================== */}
      <section
        id="station-02"
        className="w-screen h-screen absolute top-[100vh] left-[100vw] flex items-center justify-center p-6 md:p-12 select-none overflow-y-auto"
      >
        <div className="max-w-6xl w-full relative z-10 my-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-mono-code text-xs text-[#F5B041] tracking-widest uppercase font-semibold">
                STATION [02] // WORKS I
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-bold text-[#F4F6FA] tracking-tight mt-1">
                FLAGSHIP FULL-STACK & AI SYSTEMS
              </h2>
            </div>
            <span className="hidden sm:block font-mono-code text-xs text-[#8E95A5] tracking-widest">
              LOCAL AI & FINTECH
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PORTFOLIO_DATA.projects.slice(0, 2).map((proj) => (
              <ProjectCard
                key={proj.id}
                proj={proj}
                onSelectProject={onSelectProject}
                onInteractiveHover={onInteractiveHover}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          STATION 03: WORKS II (Featured Projects 3 & 4)
          Coords: (200vw, 100vh) [RIGHT from 02]
          ======================================================== */}
      <section
        id="station-03"
        className="w-screen h-screen absolute top-[100vh] left-[200vw] flex items-center justify-center p-6 md:p-12 select-none overflow-y-auto"
      >
        <div className="max-w-6xl w-full relative z-10 my-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-mono-code text-xs text-[#F5B041] tracking-widest uppercase font-semibold">
                STATION [03] // WORKS II
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-bold text-[#F4F6FA] tracking-tight mt-1">
                SPECIALIZED PLATFORMS & TOOLS
              </h2>
            </div>
            <span className="hidden sm:block font-mono-code text-xs text-[#8E95A5] tracking-widest">
              WEB PLATFORMS & AUTOMATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PORTFOLIO_DATA.projects.slice(2, 4).map((proj) => (
              <ProjectCard
                key={proj.id}
                proj={proj}
                onSelectProject={onSelectProject}
                onInteractiveHover={onInteractiveHover}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          STATION 04: ARSENAL (Tech Stack & Live Interactive Terminal)
          Coords: (200vw, 200vh) [DOWN from 03]
          ======================================================== */}
      <section
        id="station-04"
        className="w-screen h-screen absolute top-[200vh] left-[200vw] flex items-center justify-center p-6 md:p-12 select-none overflow-y-auto"
      >
        <div className="max-w-6xl w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
          
          {/* Left Column: Tech Stack Taxonomy */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <span className="font-mono-code text-xs text-[#F5B041] tracking-widest uppercase font-semibold">
                STATION [04] // ARSENAL
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-bold text-[#F4F6FA] tracking-tight mt-1">
                TEKNOLOGI & PERANGKAT
              </h2>
            </div>

            {/* Frontend Matrix */}
            <div className="glass-panel p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2.5">
                <Code2 className="w-4 h-4 text-[#F5B041]" />
                <h4 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#F4F6FA]">
                  Frontend Architecture
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PORTFOLIO_DATA.arsenal.frontend.map((item) => (
                  <div key={item.name} className="p-2 rounded-lg bg-[#030408]/60 border border-white/5">
                    <div className="flex items-center justify-between text-xs font-mono-code mb-0.5">
                      <span className="text-[#F4F6FA] font-medium">{item.name}</span>
                      <span className="text-[10px] text-[#FFD27D]">{item.level}</span>
                    </div>
                    <p className="text-[11px] text-[#8E95A5] truncate">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend & Systems Matrix */}
            <div className="glass-panel p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2.5">
                <Cpu className="w-4 h-4 text-[#FFD27D]" />
                <h4 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#F4F6FA]">
                  Backend & Database
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PORTFOLIO_DATA.arsenal.backend.map((item) => (
                  <div key={item.name} className="p-2 rounded-lg bg-[#030408]/60 border border-white/5">
                    <div className="flex items-center justify-between text-xs font-mono-code mb-0.5">
                      <span className="text-[#F4F6FA] font-medium">{item.name}</span>
                      <span className="text-[10px] text-[#FFD27D]">{item.level}</span>
                    </div>
                    <p className="text-[11px] text-[#8E95A5] truncate">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI & Dev Tools */}
            <div className="glass-panel p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2.5">
                <Wrench className="w-4 h-4 text-[#F5B041]" />
                <h4 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#F4F6FA]">
                  AI & Developer Tools
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PORTFOLIO_DATA.arsenal.toolsAndCloud.map((item) => (
                  <div key={item.name} className="p-2 rounded-lg bg-[#030408]/60 border border-white/5">
                    <div className="flex items-center justify-between text-xs font-mono-code mb-0.5">
                      <span className="text-[#F4F6FA] font-medium">{item.name}</span>
                      <span className="text-[10px] text-[#FFD27D]">{item.level}</span>
                    </div>
                    <p className="text-[11px] text-[#8E95A5] truncate">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Shell Terminal */}
          <div className="lg:col-span-6 glass-panel-glow rounded-2xl border border-[#F5B041]/30 p-5 flex flex-col h-[520px]">
            {/* Terminal Title Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#F5B041]" />
                <span className="font-mono-code text-xs font-semibold text-[#F4F6FA] tracking-wider">
                  lana_terminal.zsh
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
            </div>

            {/* Terminal Output Area */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 font-mono-code text-xs text-[#8E95A5] leading-relaxed">
              {terminalHistory.map((line, idx) => (
                <div key={idx} className={line.startsWith(PORTFOLIO_DATA.terminal.prompt) ? 'text-[#FFD27D]' : 'text-[#8E95A5]'}>
                  {line}
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* Terminal Input Bar */}
            <form onSubmit={handleTerminalSubmit} className="pt-3 border-t border-white/10 flex items-center gap-2">
              <span className="font-mono-code text-xs text-[#F5B041] whitespace-nowrap">
                {PORTFOLIO_DATA.terminal.prompt}
              </span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="type 'help', 'about', 'projects', 'contact'..."
                className="flex-1 bg-transparent border-none outline-none font-mono-code text-xs text-[#F4F6FA] placeholder:text-[#8E95A5]/50"
              />
            </form>
          </div>

        </div>
      </section>

      {/* ========================================================
          STATION 05: SIGNAL (Contact Form, Email & Socials)
          Coords: (300vw, 200vh) [RIGHT from 04]
          ======================================================== */}
      <section
        id="station-05"
        className="w-screen h-screen absolute top-[200vh] left-[300vw] flex items-center justify-center p-6 md:p-12 select-none overflow-y-auto"
      >
        <div className="max-w-5xl w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          
          {/* Left Column: Direct Transmissions Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-mono-code text-xs text-[#F5B041] tracking-widest uppercase font-semibold">
                STATION [05] // SIGNAL
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-bold text-[#F4F6FA] tracking-tight mt-1">
                HUBUNGI SAYA
              </h2>
            </div>

            <p className="text-[#8E95A5] text-sm leading-relaxed font-light">
              Terbuka untuk diskusi proyek pengembangan full-stack (Laravel / React), arsitektur Local AI dengan Ollama, serta sharing materi IT.
            </p>

            {/* Quick Email Card */}
            <div className="glass-panel p-5 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-mono-code text-[10px] text-[#8E95A5] uppercase tracking-wider block">
                  PRIMARY EMAIL
                </span>
                <span className="font-mono-code text-xs sm:text-sm text-[#FFD27D] font-medium">
                  {PORTFOLIO_DATA.personal.email}
                </span>
              </div>
              <button
                onClick={handleCopyEmail}
                onMouseEnter={onInteractiveHover}
                className="p-2.5 rounded-lg bg-[#F5B041]/15 text-[#FFD27D] hover:bg-[#F5B041]/30 transition-all border border-[#F5B041]/30"
                title="Copy Email"
              >
                {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Social Grid */}
            <div>
              <span className="font-mono-code text-[11px] text-[#8E95A5] tracking-widest uppercase block mb-3">
                JARINGAN & SOSIAL MEDIA
              </span>
              <div className="flex items-center gap-3">
                {PORTFOLIO_DATA.socials.map((soc) => (
                  <a
                    key={soc.label}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => audioEngine.playClick()}
                    onMouseEnter={onInteractiveHover}
                    className="p-3 rounded-xl glass-panel text-[#8E95A5] hover:text-[#F5B041] border border-white/10 hover:border-[#F5B041]/40 transition-all hover:scale-105"
                    title={soc.label}
                  >
                    {soc.icon === 'Github' && <GithubIcon className="w-4 h-4" />}
                    {soc.icon === 'Linkedin' && <LinkedinIcon className="w-4 h-4" />}
                    {soc.icon === 'Youtube' && <YoutubeIcon className="w-4 h-4" />}
                    {soc.icon === 'Instagram' && <InstagramIcon className="w-4 h-4" />}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Transmission Form */}
          <div className="lg:col-span-7 glass-panel-glow p-6 sm:p-8 rounded-2xl border border-[#F5B041]/30">
            <h3 className="font-syne text-xl font-bold text-[#F4F6FA] mb-2">
              KIRIM PESAN LANGSUNG
            </h3>
            <p className="font-mono-code text-xs text-[#8E95A5] mb-6 font-light">
              Pesan terkirim langsung ke inbox saya.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block font-mono-code text-[10px] uppercase tracking-widest text-[#8E95A5] mb-1.5">
                  NAMA / IDENTITAS ANDA
                </label>
                <input
                  type="text"
                  required
                  value={formFields.name}
                  onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                  placeholder="e.g. Budi Santoso / Partner"
                  className="w-full px-4 py-3 rounded-lg bg-[#030408]/80 border border-white/10 text-[#F4F6FA] text-xs font-mono-code focus:border-[#F5B041] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono-code text-[10px] uppercase tracking-widest text-[#8E95A5] mb-1.5">
                  EMAIL ANDA
                </label>
                <input
                  type="email"
                  required
                  value={formFields.email}
                  onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                  placeholder="budi@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#030408]/80 border border-white/10 text-[#F4F6FA] text-xs font-mono-code focus:border-[#F5B041] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono-code text-[10px] uppercase tracking-widest text-[#8E95A5] mb-1.5">
                  PESAN / KEBUTUHAN PROYEK
                </label>
                <textarea
                  rows={4}
                  required
                  value={formFields.message}
                  onChange={(e) => setFormFields({ ...formFields, message: e.target.value })}
                  placeholder="Jelaskan kebutuhan proyek web, integrasi AI, atau agenda lainnya..."
                  className="w-full px-4 py-3 rounded-lg bg-[#030408]/80 border border-white/10 text-[#F4F6FA] text-xs font-mono-code focus:border-[#F5B041] outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                onMouseEnter={onInteractiveHover}
                className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#F5B041] to-[#FFD27D] text-[#030408] font-heading font-bold text-xs tracking-widest uppercase hover:shadow-[0_0_25px_rgba(245,176,65,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {formStatus === 'sending' ? (
                  <span>MENGIRIM PESAN...</span>
                ) : formStatus === 'success' ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> PESAN TERKIRIM
                  </span>
                ) : (
                  <>
                    <span>KIRIM SEKARANG</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>
    </>
  );
}
