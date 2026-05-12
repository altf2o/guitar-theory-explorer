/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';

const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

const MAJOR_SCALES: Record<string, string[]> = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
};

const MODES = [
  { name: 'Major (Ionian)', shift: 0 },
  { name: 'Dorian', shift: 1 },
  { name: 'Phrygian', shift: 2 },
  { name: 'Lydian', shift: 3 },
  { name: 'Mixolydian', shift: 4 },
  { name: 'Minor (Aeolian)', shift: 5 },
  { name: 'Locrian', shift: 6 },
];

const BASE_QUALITIES = ['Major', 'minor', 'minor', 'Major', 'Major', 'minor', 'dim'];
const BASE_STEPS = ['W', 'W', 'H', 'W', 'W', 'W', 'H'];
const BASE_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

function shiftArray<T>(arr: T[], shift: number): T[] {
  return [...arr.slice(shift), ...arr.slice(0, shift)];
}

function getRomanNumeral(degreeIndex: number, quality: string) {
  const base = BASE_NUMERALS[degreeIndex];
  if (quality === 'Major') return base;
  if (quality === 'minor') return base.toLowerCase();
  if (quality === 'dim') return base.toLowerCase() + '°';
  return base;
}

const chordVoicings: Record<string, number[][]> = {
  'C Major': [[-1, 3, 2, 0, 1, 0], [-1, 3, 5, 5, 5, 3], [8, 10, 10, 9, 8, 8]],
  'C minor': [[-1, 3, 5, 5, 4, 3], [8, 10, 10, 8, 8, 8]],
  'C dim': [[-1, 3, 4, 5, 4, -1], [8, 9, 10, 8, -1, -1]],
  'C# Major': [[-1, 4, 6, 6, 6, 4], [9, 11, 11, 10, 9, 9]],
  'C# minor': [[-1, 4, 6, 6, 5, 4], [9, 11, 11, 9, 9, 9]],
  'C# dim': [[-1, 4, 5, 6, 5, -1], [9, 10, 11, 9, -1, -1]],
  'D Major': [[-1, -1, 0, 2, 3, 2], [-1, 5, 7, 7, 7, 5], [10, 12, 12, 11, 10, 10]],
  'D minor': [[-1, -1, 0, 2, 3, 1], [-1, 5, 7, 7, 6, 5], [10, 12, 12, 10, 10, 10]],
  'D dim': [[-1, -1, 0, 1, 3, 1], [-1, 5, 6, 7, 6, -1]],
  'D# Major': [[-1, 6, 8, 8, 8, 6], [11, 13, 13, 12, 11, 11]],
  'D# minor': [[-1, 6, 8, 8, 7, 6], [11, 13, 13, 11, 11, 11]],
  'D# dim': [[-1, 6, 7, 8, 7, -1]],
  'E Major': [[0, 2, 2, 1, 0, 0], [-1, 7, 9, 9, 9, 7]],
  'E minor': [[0, 2, 2, 0, 0, 0], [-1, 7, 9, 9, 8, 7]],
  'E dim': [[0, 1, 2, 0, -1, -1], [-1, 7, 8, 9, 8, -1]],
  'F Major': [[1, 3, 3, 2, 1, 1], [-1, 8, 10, 10, 10, 8]],
  'F minor': [[1, 3, 3, 1, 1, 1], [-1, 8, 10, 10, 9, 8]],
  'F dim': [[1, 2, 3, 1, -1, -1], [-1, 8, 9, 10, 9, -1]],
  'F# Major': [[2, 4, 4, 3, 2, 2], [-1, 9, 11, 11, 11, 9]],
  'F# minor': [[2, 4, 4, 2, 2, 2], [-1, 9, 11, 11, 10, 9]],
  'F# dim': [[2, 3, 4, 2, -1, -1], [-1, 9, 10, 11, 10, -1]],
  'G Major': [[3, 2, 0, 0, 0, 3], [3, 5, 5, 4, 3, 3], [-1, 10, 12, 12, 12, 10]],
  'G minor': [[3, 5, 5, 3, 3, 3], [-1, 10, 12, 12, 11, 10]],
  'G dim': [[3, 4, 5, 3, -1, -1], [-1, 10, 11, 12, 11, -1]],
  'G# Major': [[4, 6, 6, 5, 4, 4], [-1, 11, 13, 13, 13, 11]],
  'G# minor': [[4, 6, 6, 4, 4, 4], [-1, 11, 13, 13, 12, 11]],
  'G# dim': [[4, 5, 6, 4, -1, -1], [-1, 11, 12, 13, 12, -1]],
  'A Major': [[-1, 0, 2, 2, 2, 0], [5, 7, 7, 6, 5, 5], [-1, 12, 14, 14, 14, 12]],
  'A minor': [[-1, 0, 2, 2, 1, 0], [5, 7, 7, 5, 5, 5], [-1, 12, 14, 14, 13, 12]],
  'A dim': [[-1, 0, 1, 2, 1, -1], [5, 6, 7, 5, -1, -1]],
  'A# Major': [[-1, 1, 3, 3, 3, 1], [6, 8, 8, 7, 6, 6]],
  'A# minor': [[-1, 1, 3, 3, 2, 1], [6, 8, 8, 6, 6, 6]],
  'A# dim': [[-1, 1, 2, 3, 2, -1], [6, 7, 8, 6, -1, -1]],
  'B Major': [[-1, 2, 4, 4, 4, 2], [7, 9, 9, 8, 7, 7]],
  'B minor': [[-1, 2, 4, 4, 3, 2], [7, 9, 9, 7, 7, 7]],
  'B dim': [[-1, 2, 3, 4, 3, -1], [7, 8, 9, 7, -1, -1]],
};

const enharmonicMap: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'E#': 'F',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  'Cb': 'B',
  'B#': 'C'
};

function getChordVoicings(root: string, quality: string) {
  const normalizedRoot = enharmonicMap[root] || root;
  const key = `${normalizedRoot} ${quality}`;
  return chordVoicings[key] || [[-1, -1, -1, -1, -1, -1]];
}

const noteValues: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
  'A': 9, 'A#': 10, 'Bb': 10, 'B': 11, 'Cb': 11, 'B#': 0, 'E#': 5, 'Fb': 4
};

function getPowerChords(note: string, quality: string) {
  const rootValue = noteValues[note] ?? 0;
  const eRoot = (rootValue - 4 + 12) % 12;
  const aRoot = (rootValue - 9 + 12) % 12;
  const dRoot = (rootValue - 2 + 12) % 12;
  const isDim = quality === 'dim';
  const offset = isDim ? 1 : 2;

  const voicings = [];
  voicings.push([eRoot, eRoot + offset, isDim ? -1 : eRoot + offset, -1, -1, -1]);
  if (eRoot !== 0) voicings.push([eRoot + 12, eRoot + 12 + offset, isDim ? -1 : eRoot + 12 + offset, -1, -1, -1]);
  voicings.push([-1, aRoot, aRoot + offset, isDim ? -1 : aRoot + offset, -1, -1]);
  voicings.push([-1, -1, dRoot, dRoot + offset, isDim ? -1 : dRoot + offset + 1, -1]);
  
  return voicings.filter(v => v.every(fret => fret === -1 || fret <= 14)).slice(0, 3);
}

function getCAGEDShapes(rootNote: string) {
  const v = noteValues[rootNote] ?? 0;
  const r6 = (v - 4 + 12) % 12;
  const r5 = (v - 9 + 12) % 12;
  const r4 = (v - 2 + 12) % 12;

  let shapes = [
    { name: 'E Shape', baseFret: r6 === 0 ? 0 : r6 - 1 },
    { name: 'G Shape', baseFret: r6 < 3 ? r6 + 12 - 3 : r6 - 3 },
    { name: 'A Shape', baseFret: r5 === 0 ? 0 : r5 - 1 },
    { name: 'C Shape', baseFret: r5 < 3 ? r5 + 12 - 3 : r5 - 3 },
    { name: 'D Shape', baseFret: r4 === 0 ? 0 : r4 - 1 }
  ];

  shapes = shapes.map(s => ({ ...s, baseFret: s.baseFret % 12 }));
  shapes.sort((a, b) => a.baseFret - b.baseFret);
  return shapes.map((s, i) => ({ ...s, targetName: `Pos ${i + 1} (${s.name})` }));
}

function getModeNotes(root: string, shift: number) {
  let match = Object.values(MAJOR_SCALES).find(scale => scale[shift] === root);
  if (!match && enharmonicMap[root]) {
    match = Object.values(MAJOR_SCALES).find(scale => scale[shift] === enharmonicMap[root]);
  }
  if (!match) {
    const reverseMap: Record<string, string> = Object.entries(enharmonicMap).reduce((acc, [k, v]) => ({...acc, [v]: k}), {});
    if (reverseMap[root]) {
      match = Object.values(MAJOR_SCALES).find(scale => scale[shift] === reverseMap[root]);
    }
  }
  
  if (match) {
    return shiftArray(match, shift);
  }
  return MAJOR_SCALES['C'];
}

const genericNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const ChordDiagram = ({ name, frets, scaleNotes }: { name: string, frets: number[], scaleNotes?: string[] }) => {
  const validFrets = frets.filter(f => f > 0);
  const minFret = validFrets.length > 0 ? Math.min(...validFrets) : 0;
  const maxFret = validFrets.length > 0 ? Math.max(...validFrets) : 0;
  const stringOrder = [4, 9, 2, 7, 11, 4];
  
  let baseFret = 1;
  if (maxFret > 4) {
    baseFret = minFret;
  }

  const stringSpacing = 16;
  const fretSpacing = 22;
  const startX = 24;
  const startY = 25;
  const width = startX * 2 + stringSpacing * 5;
  const height = startY + fretSpacing * 4 + 25;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="font-sans text-neutral-800">
      {/* Fret Number */}
      {baseFret > 1 && (
        <text x={startX - 18} y={startY + fretSpacing / 2 + 4} fontSize="12" fill="currentColor" className="font-medium">{baseFret}</text>
      )}

      {/* Nut */}
      {baseFret === 1 && (
        <line x1={startX} y1={startY} x2={startX + 5 * stringSpacing} y2={startY} stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      )}

      {/* Frets */}
      {[0, 1, 2, 3, 4].map(i => (
        <line 
          key={`fret-${i}`} 
          x1={startX} 
          y1={startY + i * fretSpacing} 
          x2={startX + 5 * stringSpacing} 
          y2={startY + i * fretSpacing} 
          stroke="currentColor" 
          strokeWidth={i === 0 && baseFret === 1 ? 0 : 1} 
        />
      ))}

      {/* Strings */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <line 
          key={`string-${i}`} 
          x1={startX + i * stringSpacing} 
          y1={startY} 
          x2={startX + i * stringSpacing} 
          y2={startY + 4 * fretSpacing} 
          stroke="currentColor" 
          strokeWidth="1.5" 
        />
      ))}

      {/* Markers */}
      {frets.map((fret, i) => {
        const x = startX + i * stringSpacing;
        if (fret === -1) {
          return (
            <text key={`marker-${i}`} x={x} y={startY - 8} fontSize="12" textAnchor="middle" fill="currentColor" className="font-medium">X</text>
          );
        } else if (fret === 0) {
          return (
            <circle key={`marker-${i}`} cx={x} cy={startY - 10} r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          );
        } else {
          const y = startY + (fret - baseFret) * fretSpacing + fretSpacing / 2;
          return (
            <circle key={`marker-${i}`} cx={x} cy={y} r="5" fill="currentColor" />
          );
        }
      })}

      {/* Note Names Below */}
      {frets.map((fret, i) => {
        if (fret !== -1) {
          const val = (stringOrder[i] + fret) % 12;
          let noteName = scaleNotes?.find(n => noteValues[n] === val);
          if (!noteName) noteName = genericNotes[val];
          return (
             <text key={`notename-${i}`} x={startX + i * stringSpacing} y={startY + 4 * fretSpacing + 18} fontSize="10" textAnchor="middle" fill="currentColor" className="font-medium">
              {noteName}
            </text>
          );
        }
        return null;
      })}
    </svg>
  );
};

const ScaleDiagram: React.FC<{ title: string, scaleNotes: string[], rootNote: string, baseFret?: number, activePattern?: {sIdx: number, fIdx: number}[], fullFretboard?: boolean }> = ({ title, scaleNotes, rootNote, baseFret = 0, activePattern, fullFretboard }) => {
  const scaleVals = scaleNotes.map(n => noteValues[n]);
  const rootVal = noteValues[rootNote];
  const stVals = [4, 11, 7, 2, 9, 4]; 

  const numFrets = 22;
  const fretSpacing = 40;
  const stringSpacing = 18;
  const startX = 20;
  const startY = 20;
  
  const width = startX * 2 + numFrets * fretSpacing;
  const height = startY * 2 + 5 * stringSpacing + 10;

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 hover:shadow-md transition-shadow overflow-hidden flex flex-col items-start">
      <div className="text-sm font-semibold mb-2 text-neutral-700">{title}</div>
      <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="font-sans text-neutral-800" style={{ minWidth: width }}>
          {/* Fret Markers */}
          {[3, 5, 7, 9, 15, 17, 19, 21].map(fret => (
            <circle key={`marker-${fret}`} cx={startX + (fret - 0.5) * fretSpacing} cy={startY + 2.5 * stringSpacing} r="5" fill="#e5e5e5" />
          ))}
          {/* 12th fret double marker */}
          <circle cx={startX + 11.5 * fretSpacing} cy={startY + 1.5 * stringSpacing} r="5" fill="#e5e5e5" />
          <circle cx={startX + 11.5 * fretSpacing} cy={startY + 3.5 * stringSpacing} r="5" fill="#e5e5e5" />

          {/* Strings */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`string-${i}`} x1={startX} y1={startY + i * stringSpacing} x2={startX + numFrets * fretSpacing} y2={startY + i * stringSpacing} stroke="#d4d4d4" strokeWidth={1 + (i * 0.2)} />
          ))}

          {/* Frets */}
          {Array.from({ length: numFrets + 1 }).map((_, i) => (
            <line key={`fret-${i}`} x1={startX + i * fretSpacing} y1={startY} x2={startX + i * fretSpacing} y2={startY + 5 * stringSpacing} stroke={i === 0 ? "#171717" : "#e5e5e5"} strokeWidth={i === 0 ? 4 : 2} />
          ))}

          {/* Fret Numbers At Bottom */}
          {Array.from({ length: numFrets + 1 }).map((_, i) => (
            <text key={`fret-num-${i}`} x={i === 0 ? startX - 10 : startX + (i - 0.5) * fretSpacing} y={startY + 5 * stringSpacing + 20} fontSize="10" fill="#a3a3a3" textAnchor="middle">
              {i}
            </text>
          ))}

          {/* Notes */}
          {stVals.map((stVal, sIdx) => 
            Array.from({ length: numFrets + 1 }).map((_, fIdx) => {
              const noteVal = (stVal + fIdx) % 12;
              if (!scaleVals.includes(noteVal)) return null;
              
              const isRoot = noteVal === rootVal;
              let noteName = scaleNotes.find(n => noteValues[n] === noteVal) || genericNotes[noteVal] || '';

              let inShape = false;
              if (fullFretboard) {
                inShape = true;
              } else if (activePattern) {
                inShape = activePattern.some(p => p.sIdx === sIdx && p.fIdx === fIdx);
              } else {
                inShape = fIdx >= baseFret && fIdx <= baseFret + 4;
              }

              const x = fIdx === 0 ? startX - 10 : startX + (fIdx - 0.5) * fretSpacing;
              const y = startY + sIdx * stringSpacing;

              if (!inShape) {
                return (
                  <circle key={`note-${sIdx}-${fIdx}`} cx={x} cy={y} r="4" fill={isRoot ? "rgba(234, 88, 12, 0.4)" : "rgba(163, 163, 163, 0.3)"} />
                );
              }

              return (
                <g key={`note-${sIdx}-${fIdx}`}>
                  <circle cx={x} cy={y} r="9" fill={isRoot ? "#ea580c" : "#171717"} />
                  <text x={x} y={y + 1} fontSize="8" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="central">
                    {noteName}
                  </text>
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
};

const PROGRESSIONS = [
  {
    degrees: [0, 4, 5, 3],
    name: '1 - 5 - 6 - 4',
    feel: 'Uplifting, driving, emotional. Incredibly common in modern pop and rock.'
  },
  {
    degrees: [0, 3, 4, 0],
    name: '1 - 4 - 5 - 1',
    feel: 'Strong, resolved, traditional. The backbone of early rock, blues, and folk.'
  },
  {
    degrees: [1, 4, 0],
    name: '2 - 5 - 1',
    feel: 'Smooth, sophisticated, resolving. The most important progression in jazz.'
  },
  {
    degrees: [0, 5, 3, 4],
    name: '1 - 6 - 4 - 5',
    feel: 'Nostalgic, romantic, sweet. Think of 1950s ballads and early soul.'
  },
  {
    degrees: [5, 3, 0, 4],
    name: '6 - 4 - 1 - 5',
    feel: 'Melancholy but hopeful. Often used in emotional ballads and modern pop anthems.'
  },
  {
    degrees: [0, 5, 1, 4],
    name: '1 - 6 - 2 - 5',
    feel: 'Jazzy turnaround. Great for looping back to the start of a phrase.'
  }
];

export default function App() {
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedMode, setSelectedMode] = useState(0);

  const currentMode = MODES.find(m => m.shift === selectedMode) || MODES[0];
  const scaleNotes = getModeNotes(selectedKey, selectedMode);
  const currentQualities = shiftArray(BASE_QUALITIES, selectedMode);
  const currentSteps = shiftArray(BASE_STEPS, selectedMode);
  const currentNumerals = currentQualities.map((q, i) => getRomanNumeral(i, q));

  // Use the actual first note of the generated scale as the display key 
  // to handle enharmonic spelling correctly (e.g. Db Minor -> C# Minor)
  const displayKey = scaleNotes[0];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center space-y-2 pt-4">
          <h1 className="text-3xl font-semibold tracking-tight">Guitar Theory Explorer</h1>
          <p className="text-neutral-500">Select a key and scale to explore its notes and chords.</p>
        </header>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4">
          <div className="flex flex-col gap-6">
            <div className="w-full">
              <div className="text-sm font-medium text-neutral-500 mb-2 px-1">Key</div>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                {KEYS.map(k => (
                  <button
                    key={k}
                    onClick={() => setSelectedKey(k)}
                    className={`py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedKey === k 
                        ? 'bg-neutral-900 text-white shadow-md scale-105' 
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full border-t border-neutral-100 pt-4">
              <div className="text-sm font-medium text-neutral-500 mb-2 px-1">Scale / Mode</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {MODES.map(mode => (
                  <button
                    key={mode.name}
                    onClick={() => setSelectedMode(mode.shift)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedMode === mode.shift 
                        ? 'bg-neutral-900 text-white shadow-md scale-105' 
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {mode.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scale Info */}
        <motion.div 
          key={`${selectedKey}-${selectedMode}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 overflow-hidden">
            <h2 className="text-xl font-semibold mb-6">{displayKey} {currentMode.name}</h2>
            
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-center min-w-[600px]">
                <thead>
                  <tr className="text-neutral-400 text-xs uppercase tracking-wider">
                    <th className="pb-4 font-medium text-left pl-4">Degree</th>
                    {currentNumerals.map((rn, i) => <th key={i} className="pb-4 font-medium">{rn}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-4 text-sm text-neutral-500 font-medium text-left pl-4">Note</td>
                    {scaleNotes.map((note, i) => (
                      <td key={i} className="py-4 text-lg font-semibold">{note}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 text-sm text-neutral-500 font-medium text-left pl-4">Interval to Next</td>
                    {currentSteps.map((step, i) => (
                      <td key={i} className="py-4">
                        <span className="inline-block px-3 py-1 text-xs font-mono font-medium text-neutral-500 bg-neutral-100 rounded-md">
                          {step}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 text-sm text-neutral-500 font-medium text-left pl-4">Quality</td>
                    {currentQualities.map((q, i) => (
                      <td key={i} className="py-4 text-sm text-neutral-600">{q}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Chords Grid */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 px-2">Diatonic Chords</h3>
            <div className="space-y-6">
              {scaleNotes.map((note, i) => {
                const quality = currentQualities[i];
                const chordName = `${note} ${quality === 'dim' ? 'dim' : quality === 'minor' ? 'm' : ''}`;
                const voicings = getChordVoicings(note, quality);
                
                return (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 flex flex-col md:flex-row items-center md:items-start gap-8 hover:shadow-md transition-shadow">
                    <div className="text-center md:text-left md:w-32 shrink-0 md:pt-4">
                      <div className="text-sm text-neutral-400 font-medium mb-1">{currentNumerals[i]}</div>
                      <div className="text-2xl font-semibold">{chordName}</div>
                    </div>
                    <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                      {voicings.map((frets, vIndex) => (
                        <div key={vIndex} className="flex flex-col items-center">
                          <ChordDiagram name={chordName} frets={frets} scaleNotes={scaleNotes} />
                          <span className="text-xs text-neutral-400 mt-3 font-medium bg-neutral-50 px-2 py-1 rounded-md">
                            {vIndex === 0 && frets.some(f => f === 0) ? 'Open Position' : `Shape ${vIndex + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Power Chords */}
          <div className="pt-8">
            <h3 className="text-2xl font-semibold mb-6 px-2">Power Chords</h3>
            <div className="space-y-6">
              {scaleNotes.map((note, i) => {
                const quality = currentQualities[i];
                const chordName = `${note}5${quality === 'dim' ? '(b5)' : ''}`;
                const voicings = getPowerChords(note, quality);
                
                return (
                  <div key={`pwr-${i}`} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 flex flex-col md:flex-row items-center md:items-start gap-8 hover:shadow-md transition-shadow">
                    <div className="text-center md:text-left md:w-32 shrink-0 md:pt-4">
                      <div className="text-sm text-neutral-400 font-medium mb-1">{currentNumerals[i]}5</div>
                      <div className="text-2xl font-semibold">{chordName}</div>
                    </div>
                    <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                      {voicings.map((frets, vIndex) => (
                        <div key={vIndex} className="flex flex-col items-center">
                          <ChordDiagram name={chordName} frets={frets} scaleNotes={scaleNotes} />
                          <span className="text-xs text-neutral-400 mt-3 font-medium bg-neutral-50 px-2 py-1 rounded-md">
                            Position {vIndex + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CAGED Scale Shapes */}
          <div className="pt-12">
            <h3 className="text-2xl font-semibold mb-2 px-2">CAGED Scale Shapes</h3>
            <p className="text-sm text-neutral-500 mb-6 px-2">
              The 5 positions cover the entire fretboard. The root note ({scaleNotes[0]}) is highlighted in orange.
            </p>
            <div className="flex flex-col gap-6 px-2">
              {getCAGEDShapes(scaleNotes[0]).map((shape, i) => (
                <ScaleDiagram 
                  key={i} 
                  title={shape.targetName} 
                  scaleNotes={scaleNotes} 
                  rootNote={scaleNotes[0]} 
                  baseFret={shape.baseFret} 
                />
              ))}
            </div>
          </div>

          {/* Full Fretboard Scale */}
          <div className="pt-12">
            <h3 className="text-2xl font-semibold mb-2 px-2">Full Fretboard</h3>
            <p className="text-sm text-neutral-500 mb-6 px-2">
              All notes of the {displayKey} {currentMode.name} scale across the entire fretboard.
            </p>
            <div className="px-2">
              <ScaleDiagram 
                title={`${displayKey} ${currentMode.name} Scale`}
                scaleNotes={scaleNotes} 
                rootNote={scaleNotes[0]} 
                fullFretboard
              />
            </div>
          </div>

          {/* Progressions */}
          <div className="pt-12">
            <h3 className="text-2xl font-semibold mb-6 px-2">Popular Progressions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROGRESSIONS.map((prog, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold mb-2">{prog.name}</h4>
                  <p className="text-sm text-neutral-500 mb-6">{prog.feel}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {prog.degrees.map((deg, j) => {
                      const note = scaleNotes[deg];
                      const quality = currentQualities[deg];
                      const chordName = `${note} ${quality === 'dim' ? 'dim' : quality === 'minor' ? 'm' : ''}`;
                      const numeral = currentNumerals[deg];
                      return (
                        <React.Fragment key={j}>
                          <div className="bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-200 flex flex-col items-center min-w-[70px]">
                            <span className="text-xs text-neutral-400 font-medium mb-1">{numeral}</span>
                            <span className="font-semibold text-neutral-800">{chordName}</span>
                          </div>
                          {j < prog.degrees.length - 1 && (
                            <span className="text-neutral-300 font-bold">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
