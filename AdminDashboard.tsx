@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Public+Sans:wght@400;600;700;800&display=swap');
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-primary: #000666;
  --color-primary-container: #1a237e;
  --color-primary-fixed: #e0e0ff;
  --color-on-primary: #ffffff;
  --color-on-primary-container: #8690ee;
  --color-on-surface: #1a1c1c;
  --color-on-surface-variant: #454652;
  --color-surface: #f9f9f9;
  --color-surface-container: #eeeeee;
  --color-surface-variant: #e2e2e2;
  --color-secondary: #705d00;
  --color-secondary-container: #fcd400;
  --color-on-secondary-container: #6e5c00;
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;
  
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Public Sans', ui-sans-serif, system-ui, sans-serif;
}

@layer utilities {
  .glass-panel {
    @apply bg-white/65 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)];
  }
  .hover-lift {
    @apply transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(26,35,126,0.15)];
  }
  .scrollbar-hide {
    /* IE and Edge */
    -ms-overflow-style: none;
    /* Firefox */
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}




@layer base {
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
  *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  *::-webkit-scrollbar-track {
    background: transparent;
  }
  *::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }
  *::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.8);
  }
}
