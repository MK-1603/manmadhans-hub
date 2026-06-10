import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  label?: string;
}

export const CustomDropdown = ({ options, value, onChange, placeholder = 'Select Option', icon, label }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.id === value || opt.name === value);

  return (
    <div className="relative w-full h-full" ref={dropdownRef}>
      {label && <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest ml-1 mb-1.5 block">{label}</label>}
      
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-full flex items-center justify-between gap-3 px-4 rounded-2xl text-[13px] font-bold transition-all duration-300 group
          ${isOpen 
            ? 'bg-[var(--card-bg)] border-[var(--neon)] text-[var(--text)] shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
            : 'bg-[var(--input-bg)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border2)] hover:bg-[var(--card-bg)]'} border`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {icon && <span className={`flex-none transition-colors duration-300 ${isOpen ? 'text-[var(--neon)]' : 'text-[var(--muted2)] group-hover:text-[var(--muted)]'}`}>{icon}</span>}
          <span className="truncate whitespace-nowrap">{selectedOption ? selectedOption.name : placeholder}</span>
        </div>
        <ChevronDown size={14} className={`flex-none transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--neon)]' : 'text-[var(--muted2)] group-hover:text-[var(--muted)]'}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(5px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute z-[100] mt-2 w-full bg-[var(--card-bg)]/90 backdrop-blur-xl border border-[var(--border2)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden max-h-60 overflow-y-auto no-scrollbar"
          >
            <div className="p-2 flex flex-col gap-1">
              {options.map((option, idx) => {
                const isSelected = option.id === value || option.name === value;
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02, duration: 0.2 }}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all relative overflow-hidden group/item
                      ${isSelected
                        ? 'text-black'
                        : 'text-[var(--muted)] hover:text-[var(--text)]'
                      }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeOptionBg"
                        className="absolute inset-0 bg-[var(--neon)] rounded-xl"
                        initial={false}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      />
                    )}
                    {!isSelected && (
                      <div className="absolute inset-0 bg-[var(--neon)]/10 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    )}
                    
                    <span className="relative z-10">{option.name}</span>
                    {isSelected && <Check size={14} className="relative z-10" />}
                  </motion.button>
                );
              })}
              {options.length === 0 && (
                <div className="px-4 py-4 text-[11px] font-black uppercase tracking-widest text-[var(--muted)] text-center font-mono">
                  No Options Found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
