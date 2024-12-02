// icons/Community.tsx

/**
 * This project was developed by Nikandr Surkov.
 * 
 * YouTube: https://www.youtube.com/@NikandrSurkov
 * GitHub: https://github.com/nikandr-surkov
 */

import { IconProps } from "../utils/types";

const Community: React.FC<IconProps> = ({ size = 24, className = "" }) => {

    const svgSize = `${size}px`;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} height={svgSize} width={svgSize} viewBox="0 0 32 32" fill="none">
  
  <circle cx="16" cy="16" r="6" fill="currentColor" />
 
  <path d="M16 3V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M16 27V29" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  
  <path d="M3 16H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M27 16H29" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
 
  <path d="M7.75736 7.75736L9.41421 9.41421" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M22.5858 7.75736L24.2426 9.41421" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M7.75736 24.2426L9.41421 22.5858" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  <path d="M22.5858 24.2426L24.2426 22.5858" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
</svg>
    );
};

export default Community;