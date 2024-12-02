// icons/TaskPaws.tsx

/**
 * This project was developed by Nikandr Surkov.
 * 
 * YouTube: https://www.youtube.com/@NikandrSurkov
 * GitHub: https://github.com/nikandr-surkov
 */

import { IconProps } from "../utils/types";

const TaskPaws: React.FC<IconProps> = ({ size = 24, className = "" }) => {

    const svgSize = `${size}px`;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="12" cy="12" r="5" fill="#FFEB3B"/>
  <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="#FFEB3B" stroke-width="2"/>
</svg>
    );
};

export default TaskPaws;