import type { SVGProps } from "react";

export const PixelGhostIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
      <path d="M12 2a8 8 0 0 0-8 8v12h16V10a8 8 0 0 0-8-8Z" />
      <path d="M12 16v4" />
      <path d="M8 20v-4" />
      <path d="M16 20v-4" />
    </svg>
  );
  
  // Using a simplified Lucide Ghost icon as a base for a more "pixelated" feel through its blocky structure
  export const SpookyPunkIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 4H6V6H4V4Z" />
      <path d="M6 2H8V4H6V2Z" />
      <path d="M8 0H16V2H8V0Z" />
      <path d="M16 2H18V4H16V2Z" />
      <path d="M18 4H20V6H18V4Z" />
      <path d="M20 6H22V14H20V6Z" />
      <path d="M2 6H4V14H2V6Z" />
      <path d="M4 14H6V16H4V14Z" />
      <path d="M6 16H8V18H6V16Z" />
      <path d="M8 18H10V20H8V18Z" />
      <path d="M10 20H14V22H10V20Z" />
      <path d="M14 18H16V20H14V18Z" />
      <path d="M16 16H18V18H16V16Z" />
      <path d="M18 14H20V16H18V14Z" />
      <path d="M6 6H18V14H6V6Z" />
      <path d="M8 8H10V10H8V8Z" fill="black" />
      <path d="M14 8H16V10H14V8Z" fill="black" />
      <path d="M8 12H16V13H8V12Z" fill="black" />
    </svg>
  );
  
