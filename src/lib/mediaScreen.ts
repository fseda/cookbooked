import { browser } from "$app/environment"

export const tailwindResolutions = {
  'sm': '640px',
  // => @media (min-width: 640px) { ... }

  'md': '768px',
  // => @media (min-width: 768px) { ... }

  'lg': '1024px',
  // => @media (min-width: 1024px) { ... }

  'xl': '1280px',
  // => @media (min-width: 1280px) { ... }

  '2xl': '1536px',
  // => @media (min-width: 1536px) { ... }
}
export type MediaScreen = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const getScreen = (): MediaScreen => {
  if (!browser) return '2xl';
  let screen: MediaScreen = '2xl';
  
  Object.entries(tailwindResolutions).forEach(([k, v]) => {
    if (window.innerWidth > Number(v.slice(0, v.length-2))) {
      screen = k as MediaScreen;
    }
  });

  return screen;
}
