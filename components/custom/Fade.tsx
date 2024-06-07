"use client"
import { useState, useEffect } from 'react';

const texts = [
  "Use SUMMER15 to Get 15% discount on order above 999.",
  "Free shipping on orders over 500.",
  "Sign up for our newsletter to get exclusive offers."
];

const FadingBanner = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState('opacity-100');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeClass('opacity-0');
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setFadeClass('opacity-100');
      }, 100);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-pink-100 text-center py-2">
      <div className={`transition-opacity duration-1000 ${fadeClass}`}>
        {texts[currentTextIndex]}
      </div>
    </div>
  );
};

export default FadingBanner;
