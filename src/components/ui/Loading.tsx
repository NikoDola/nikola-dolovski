"use client"
import { useEffect, useRef } from 'react';
import Logo from '../client/Logo';
import "./Loading.css"

export default function Loading() {
  const scrollY = useRef(0);

  useEffect(() => {
    // 1. Save scroll position
    scrollY.current = window.scrollY;
    
    // 2. Lock scroll without visual changes
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.body.style.position = 'relative';

    // 3. Hide scrollbar visually but maintain layout
    document.documentElement.style.scrollbarGutter = 'stable';

    return () => {
      // 4. Restore everything smoothly
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.position = '';
      document.documentElement.style.scrollbarGutter = '';
      window.scrollTo(0, scrollY.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#F7F6E2] z-[9999]">
      <Logo 
        size="200px" 
        loadingState={true}
      />
    </div>
  );
}