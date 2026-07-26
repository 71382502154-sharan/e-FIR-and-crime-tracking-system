const fs = require('fs');

let content = fs.readFileSync('src/components/FIRDetailsModal.tsx', 'utf8');

const importRefStr = `import React, { useState, useEffect, useRef } from 'react';`;

const componentStart = `export default function FIRDetailsModal({ fir: initialFir, isOpen, onClose, user }: FIRDetailsModalProps) {`;

const refStr = `
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [isOpen]);
`;

if (content.includes('const tabsRef = useRef')) {
    console.log("Already patched");
    process.exit(0);
}

content = content.replace(componentStart, componentStart + refStr);

const targetDivStart = `<div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-2 overflow-x-auto">`;
const newTargetDivStart = `<div ref={tabsRef} className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-2 overflow-x-auto" style={{ scrollBehavior: 'smooth' }}>`;

content = content.replace(targetDivStart, newTargetDivStart);

fs.writeFileSync('src/components/FIRDetailsModal.tsx', content);
