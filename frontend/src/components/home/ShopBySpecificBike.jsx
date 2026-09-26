import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import {
  ArrowUpRight, Gauge, Zap, Wind,
  Volume2, VolumeX, LayoutGrid, List, Flame, Activity
} from 'lucide-react';
import { productsUrl } from '@/utils/urlUtils';

// ═══════════════════════════════════════════════════════════
// 🔊 ENGINE AUDIO SYNTHESIS
// ═══════════════════════════════════════════════════════════
const playEngineRev = (cc = 400, category = 'Sport') => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const ccNum = parseInt(cc, 10) || 400;
    const isSuperbike = ccNum > 600 || category === 'Superbike';
    const isAdventure = category === 'Adventure';
    const isRetro = category === 'Retro';

    const config = isSuperbike
      ? { base: 100, peak: 680, revTime: 0.25, decayTime: 0.75, gain: 0.28, filterPeak: 6000 }
      : isAdventure
      ? { base: 65, peak: 260, revTime: 0.32, decayTime: 0.85, gain: 0.24, filterPeak: 2400 }
      : isRetro
      ? { base: 55, peak: 210, revTime: 0.35, decayTime: 0.95, gain: 0.22, filterPeak: 1800 }
      : { base: 80, peak: 380, revTime: 0.26, decayTime: 0.7, gain: 0.25, filterPeak: 3600 };

    const duration = config.revTime + config.decayTime;
    const masterGain = ctx.createGain();
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.ratio.value = 4;
    masterGain.connect(compressor);
    compressor.connect(ctx.destination);

    // Bass Rumble
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    const bassFilter = ctx.createBiquadFilter();
    bass.type = 'sine';
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = 180;
    bass.frequency.setValueAtTime(config.base * 0.5, now);
    bass.frequency.exponentialRampToValueAtTime(config.peak * 0.4, now + config.revTime);
    bass.frequency.exponentialRampToValueAtTime(config.base * 0.6, now + duration);
    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(config.gain * 0.6, now + 0.08);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    bass.connect(bassFilter); bassFilter.connect(bassGain); bassGain.connect(masterGain);

    // Engine Sawtooth core
    const engine = ctx.createOscillator();
    const engineGain = ctx.createGain();
    const engineFilter = ctx.createBiquadFilter();
    engine.type = 'sawtooth';
    engineFilter.type = 'lowpass';
    engineFilter.Q.value = 3.5;
    engine.frequency.setValueAtTime(config.base, now);
    engine.frequency.exponentialRampToValueAtTime(config.peak, now + config.revTime);
    engine.frequency.exponentialRampToValueAtTime(config.base * 1.1, now + duration);
    engineFilter.frequency.setValueAtTime(320, now);
    engineFilter.frequency.exponentialRampToValueAtTime(config.filterPeak, now + config.revTime);
    engineFilter.frequency.exponentialRampToValueAtTime(380, now + duration);
    engineGain.gain.setValueAtTime(0.001, now);
    engineGain.gain.linearRampToValueAtTime(config.gain, now + 0.1);
    engineGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    engine.connect(engineFilter); engineFilter.connect(engineGain); engineGain.connect(masterGain);

    // Superbike Exhaust Backfire Pops
    if (isSuperbike) {
      [0.32, 0.48, 0.6].forEach((t) => {
        const pop = ctx.createOscillator();
        const popGain = ctx.createGain();
        pop.type = 'triangle';
        pop.frequency.value = 90 + Math.random() * 70;
        popGain.gain.setValueAtTime(0.001, now + t);
        popGain.gain.linearRampToValueAtTime(0.09, now + t + 0.005);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.07);
        pop.connect(popGain); popGain.connect(masterGain);
        pop.start(now + t); pop.stop(now + t + 0.07);
      });
    }

    bass.start(now); engine.start(now);
    bass.stop(now + duration); engine.stop(now + duration);
  } catch { /* Silent fail fallback */ }
};

// ═══════════════════════════════════════════════════════════
// 🏎️ DYNAMIC TACHOMETER / REV METER COMPONENT
// ═══════════════════════════════════════════════════════════
const RevMeterGauge = ({ isActive, idleRpm = 1200, maxRpm = 11000, redlineRpm = 9500 }) => {
  const [currentRpm, setCurrentRpm] = useState(idleRpm);
  const rpmValue = useMotionValue(idleRpm);

  useEffect(() => {
    let controls;
    if (isActive) {
      // Rev animation curve: Idle -> Peak Rev -> Decays back to slight throttle
      controls = animate(rpmValue, [idleRpm, redlineRpm + 600, idleRpm + 1000], {
        duration: 1.1,
        times: [0, 0.35, 1],
        ease: ["easeOut", "easeInOut"],
        onUpdate: (latest) => setCurrentRpm(Math.round(latest)),
      });
    } else {
      controls = animate(rpmValue, idleRpm, {
        duration: 0.5,
        ease: "easeOut",
        onUpdate: (latest) => setCurrentRpm(Math.round(latest)),
      });
    }
    return () => controls?.stop();
  }, [isActive, idleRpm, redlineRpm, rpmValue]);

  // Sweep angle calculation (-120deg to +120deg)
  const minAngle = -120;
  const maxAngle = 120;
  const rpmRatio = Math.min(Math.max(currentRpm / maxRpm, 0), 1);
  const needleAngle = minAngle + rpmRatio * (maxAngle - minAngle);
  const isRedlining = currentRpm >= redlineRpm;

  return (
    <div className="relative w-36 h-36 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 p-2 shadow-inner">
      {/* SHIFT LIGHT INDICATOR */}
      <div className="absolute top-2 flex items-center gap-1">
        <span className="text-[8px] font-mono text-gray-400 font-bold uppercase tracking-wider">RPM</span>
        <div
          className={`w-2 h-2 rounded-full transition-all duration-150 ${
            isRedlining ? 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-ping' : 'bg-gray-700'
          }`}
        />
      </div>

      {/* SVG GAUGE DIAL */}
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        {/* Background Arc */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="6"
          strokeDasharray="180 240"
          strokeDashoffset="-30"
          strokeLinecap="round"
        />

        {/* Dynamic RPM Arc Fill */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={isRedlining ? '#ef4444' : '#3b82f6'}
          strokeWidth="6"
          strokeDasharray="180 240"
          strokeDashoffset={-30 + (1 - rpmRatio) * 180}
          strokeLinecap="round"
          className="transition-all duration-75"
        />

        {/* Needle Line */}
        <g transform={`rotate(${needleAngle + 90} 50 50)`}>
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="18"
            stroke={isRedlining ? '#ef4444' : '#f59e0b'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="4" fill="#ffffff" />
        </g>
      </svg>

      {/* DIGITAL RPM COUNTER */}
      <div className="absolute bottom-2 text-center">
        <span
          className={`font-mono text-sm font-black tracking-tight ${
            isRedlining ? 'text-red-500 animate-pulse' : 'text-white'
          }`}
        >
          {currentRpm.toLocaleString()}
        </span>
        <span className="text-[8px] font-mono text-gray-400 block -mt-1">x1000 RPM</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ANIMATED COUNTER
// ═══════════════════════════════════════════════════════════
const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = React.useState(0);
  const target = parseInt(value, 10) || 0;

  React.useEffect(() => {
    let frameId;
    const startTime = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startTime) / 600, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(target * ease));
      if (p < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target]);

  return <>{display}</>;
};

// ═══════════════════════════════════════════════════════════
// SPEC MINI-GAUGE BAR
// ═══════════════════════════════════════════════════════════
const SpecGauge = ({ icon: Icon, label, value, unit, max = 300, color = '#ef4444' }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-gray-400">
      <span className="flex items-center gap-1 uppercase">
        <Icon size={12} style={{ color }} /> {label}
      </span>
      <span className="font-bold text-white">
        <AnimatedNumber value={value} /> <span className="text-[9px] text-gray-500 uppercase">{unit}</span>
      </span>
    </div>
    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
      <motion.div
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, #f59e0b, ${color})` }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((parseInt(value, 10) / max) * 100, 100)}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// BIKES DATA (WITH RPM SPECS)
// ═══════════════════════════════════════════════════════════
const BIKES_DATA = [
  { id: 'rs457', name: 'Aprilia RS 457', shortName: 'RS 457', brand: 'Aprilia', category: 'Sport', year: '2024', bhp: '47', cc: '457', speed: '180', idleRpm: 1300, maxRpm: 11500, redlineRpm: 10000, image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790420221/Aprilla_sgqr0p_vvuaoa.jpg' },
  { id: 'rtx300', name: 'Apache RTX 300', shortName: 'RTX 300', brand: 'TVS', category: 'Naked', year: '2024', bhp: '35', cc: '300', speed: '160', idleRpm: 1400, maxRpm: 10500, redlineRpm: 9000, image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790420222/tvs-rtsx-0-1770097813_n7ikeo_ry2orz.avif' },
  { id: 'him450', name: 'Himalayan 450', shortName: 'Himalayan', brand: 'Royal Enfield', category: 'Adventure', year: '2024', bhp: '40', cc: '452', speed: '155', idleRpm: 1200, maxRpm: 9000, redlineRpm: 8000, image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790420221/2_ybj2rd_octnps.avif' },
  { id: 'z900', name: 'Kawasaki Z900', shortName: 'Z900', brand: 'Kawasaki', category: 'Superbike', year: '2024', bhp: '125', cc: '948', speed: '250', idleRpm: 1100, maxRpm: 13000, redlineRpm: 11000, image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790420221/6929e135-b127-4b2b-ba6c-6428e9942784_prqssd_zoibh1.png' },
  { id: 'xsr155', name: 'Yamaha XSR 155', shortName: 'XSR 155', brand: 'Yamaha', category: 'Retro', year: '2024', bhp: '19', cc: '155', speed: '140', idleRpm: 1400, maxRpm: 11500, redlineRpm: 10000, image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790420224/xsr_black_lulcuy_otxykn.webp' },
  { id: 'yezdiadv', name: 'Yezdi Adventure', shortName: 'Yezdi ADV', brand: 'Yezdi', category: 'Adventure', year: '2025', bhp: '29', cc: '334', speed: '145', idleRpm: 1300, maxRpm: 9500, redlineRpm: 8200, image: 'https://res.cloudinary.com/rteryyle/image/upload/v1790420222/ltp0cgb_1838720_trnc2c_rpq7px.avif' },
];

const CATEGORY_COLORS = {
  Sport: '#ef4444', Superbike: '#dc2626', Naked: '#f97316',
  Adventure: '#10b981', Retro: '#8b5cf6',
};

// ═══════════════════════════════════════════════════════════
// HORIZONTAL ACCORDION CARD ITEM (EXPANDS LEFT TO RIGHT)
// ═══════════════════════════════════════════════════════════
const HorizontalAccordionCard = ({ bike, idx, isActive, onActivate, onShop, soundEnabled }) => {
  const accentColor = CATEGORY_COLORS[bike.category] || '#ef4444';
  const audioCooldown = useRef(0);

  const handleMouseEnter = () => {
    onActivate(idx);
    const now = Date.now();
    if (soundEnabled && now - audioCooldown.current > 400) {
      playEngineRev(bike.cc, bike.category);
      audioCooldown.current = now;
    }
  };

  return (
    <motion.div
      layout
      onClick={() => onActivate(idx)}
      onMouseEnter={handleMouseEnter}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className={`relative h-[500px] sm:h-[540px] rounded-3xl overflow-hidden cursor-pointer border-2 transition-all duration-500 flex-shrink-0 ${
        isActive 
          ? 'flex-[3.8] min-w-[300px] sm:min-w-[480px] border-red-500/80 shadow-2xl shadow-red-600/20' 
          : 'flex-[1] min-w-[70px] sm:min-w-[90px] border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
      } bg-gray-950`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bike.image}
          alt={bike.name}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ${
            isActive ? 'scale-105 grayscale-0' : 'scale-110 grayscale brightness-50'
          }`}
          onError={(e) => { e.target.src = 'https://placehold.co/600x800/111827/ef4444?text=MOTORCYCLE'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'bg-black/30' : 'bg-black/60'}`} />
      </div>

      {/* ── EXPANDED LEFT-TO-RIGHT CONTENT (ACTIVE) ── */}
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="active-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-between z-10 overflow-hidden"
          >
            {/* Dynamic REV Watermark */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden opacity-10">
              <span
                className="font-black uppercase tracking-tighter text-white whitespace-nowrap block"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(8rem, 20vw, 18rem)',
                  lineHeight: 0.8,
                  WebkitTextStroke: '2px rgba(255,255,255,0.8)',
                }}
              >
                REV {bike.cc}
              </span>
            </div>

            {/* Top Bar Info */}
            <div className="flex items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-widest text-black"
                  style={{ backgroundColor: accentColor }}
                >
                  {bike.category}
                </span>
                <span className="text-xs font-mono text-gray-300 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md">
                  {bike.year} MODEL
                </span>
              </div>

              {/* Sound Button */}
              {soundEnabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playEngineRev(bike.cc, bike.category);
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-red-600/80 border border-white/20 text-white transition-all active:scale-95 flex items-center justify-center"
                  title="Rev Engine Audio"
                >
                  <Volume2 size={14} />
                </button>
              )}
            </div>

            {/* Middle Section: Bike Name & Rev Gauge Cluster */}
            <div className="flex items-end justify-between gap-4 z-10 my-auto">
              <div className="max-w-[60%]">
                <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Flame size={12} /> {bike.brand} PERFORMANCE
                </p>
                <h3
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none uppercase tracking-tight"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {bike.name}
                </h3>
              </div>

              {/* 🏎️ TACHOMETER / REV METER */}
              <div className="shrink-0">
                <RevMeterGauge
                  isActive={isActive}
                  idleRpm={bike.idleRpm}
                  maxRpm={bike.maxRpm}
                  redlineRpm={bike.redlineRpm}
                />
              </div>
            </div>

            {/* Bottom Specs Grid & Actions */}
            <div className="space-y-3 z-10">
              <div className="grid grid-cols-3 gap-3 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                <SpecGauge icon={Zap} label="BHP" value={bike.bhp} unit="hp" max={150} color={accentColor} />
                <SpecGauge icon={Gauge} label="CC" value={bike.cc} unit="cc" max={1000} color={accentColor} />
                <SpecGauge icon={Wind} label="MAX" value={bike.speed} unit="km/h" max={300} color={accentColor} />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShop(bike.name);
                }}
                className="group w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 active:scale-[0.98]"
              >
                <span>Shop Parts for {bike.shortName}</span>
                <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── COLLAPSED VERTICAL TEXT STRIP (INACTIVE) ── */
          <motion.div
            key="inactive-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between items-center z-10"
          >
            <span className="text-[10px] font-mono text-gray-400 font-bold">
              0{idx + 1}
            </span>

            <div className="rotate-180 [writing-mode:vertical-lr] flex items-center gap-2">
              <span
                className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase whitespace-nowrap opacity-80"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {bike.shortName}
              </span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>

            <span className="text-[10px] font-mono text-red-400 font-bold">
              {bike.cc}C
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
// GRID CARD ALTERNATE VIEW WITH LED REV BAR
// ═══════════════════════════════════════════════════════════
const GridCard = ({ bike, idx, onShop, soundEnabled }) => {
  const accentColor = CATEGORY_COLORS[bike.category] || '#ef4444';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ y: -6 }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (soundEnabled) playEngineRev(bike.cc, bike.category);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onShop(bike.name)}
      className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-gray-950 border border-white/10 hover:border-red-500/50 transition-all duration-300 shadow-xl"
    >
      <img
        src={bike.image}
        alt={bike.name}
        className="w-full h-full object-cover transition-transform duration-700 grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Top category badge */}
      <div className="absolute top-3 left-3">
        <span
          className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded text-black"
          style={{ backgroundColor: accentColor }}
        >
          {bike.category}
        </span>
      </div>

      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <div>
          <h3
            className="text-2xl font-black text-white uppercase leading-none tracking-tight group-hover:text-red-400 transition-colors"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {bike.shortName}
          </h3>
          <p className="text-gray-400 text-[10px] font-mono mt-0.5">{bike.brand} · {bike.cc}CC</p>
        </div>

        {/* 🚦 HOVER LED REV BAR */}
        <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between text-[8px] font-mono text-gray-400 mb-1">
            <span>RPM REV</span>
            <span className={isHovered ? 'text-red-400 font-bold animate-pulse' : 'text-gray-500'}>
              {isHovered ? `${bike.redlineRpm} MAX` : `${bike.idleRpm} IDLE`}
            </span>
          </div>
          <div className="flex gap-0.5 h-1.5">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={`flex-1 rounded-sm ${
                  i > 9 ? 'bg-red-500' : i > 6 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                animate={{
                  opacity: isHovered ? (i < 10 ? 1 : [0.2, 1, 0.2]) : i < 2 ? 0.6 : 0.1,
                }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
const ShopBySpecificBike = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('deck');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleShop = useCallback((bikeName) => {
    navigate(productsUrl({ bike: bikeName }));
  }, [navigate]);

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gray-950 text-white overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-500 font-mono text-xs tracking-[0.25em] uppercase font-bold">
                REV & RIDE MATRIX
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-black leading-none tracking-tight uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Shop By <span className="text-red-500">Bike Model</span>
            </h2>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode('deck')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  viewMode === 'deck' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List size={13} /> Deck
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  viewMode === 'grid' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutGrid size={13} /> Grid
              </button>
            </div>

            <button
              onClick={() => setSoundEnabled((p) => !p)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                soundEnabled 
                  ? 'bg-red-600/20 border-red-500/50 text-red-400' 
                  : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="hidden sm:inline">{soundEnabled ? 'REV ON' : 'MUTED'}</span>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {viewMode === 'deck' ? (
            <motion.div
              key="deck-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex gap-2 sm:gap-4 overflow-x-auto pb-4 pt-2 scrollbar-none"
            >
              {BIKES_DATA.map((bike, idx) => (
                <HorizontalAccordionCard
                  key={bike.id}
                  bike={bike}
                  idx={idx}
                  isActive={activeIndex === idx}
                  onActivate={setActiveIndex}
                  onShop={handleShop}
                  soundEnabled={soundEnabled}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              {BIKES_DATA.map((bike, idx) => (
                <GridCard
                  key={bike.id}
                  bike={bike}
                  idx={idx}
                  onShop={handleShop}
                  soundEnabled={soundEnabled}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-red-500" />
            <span>HOVER CARD TO EXPAND, SWEEP REV METER & PLAY ENGINE AUDIO</span>
          </div>

          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-white hover:text-red-400 transition-colors uppercase tracking-widest font-bold"
          >
            <span>Explore All Garage Parts</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default React.memo(ShopBySpecificBike);