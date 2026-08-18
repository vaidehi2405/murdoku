import React from 'react';
import type { Case } from '../types/case';

interface MapPreviewProps {
  roomType: Case['roomType'];
  isLocked?: boolean;
}

export const MapPreview: React.FC<MapPreviewProps> = ({ roomType, isLocked = false }) => {
  // Theme color settings per room type to mimic architectural tactical floor plan blueprints
  const getRoomTheme = () => {
    switch (roomType) {
      case 'lab':
        return {
          bg: '#C5E1A5',
          grid: '#AED581',
          walls: '#33691E',
          accent: '#81C784',
          furniture: '#7CB342',
        };
      case 'library':
        return {
          bg: '#D1C4E9',
          grid: '#B39DDB',
          walls: '#4A148C',
          accent: '#9575CD',
          furniture: '#7E57C2',
        };
      case 'office':
        return {
          bg: '#B2DFDB',
          grid: '#80CBC4',
          walls: '#004D40',
          accent: '#4DB6AC',
          furniture: '#26A69A',
        };
      case 'penthouse':
        return {
          bg: '#90CAF9',
          grid: '#64B5F6',
          walls: '#0D47A1',
          accent: '#42A5F5',
          furniture: '#1976D2',
        };
      case 'showroom':
        return {
          bg: '#FFE082',
          grid: '#FFD54F',
          walls: '#FF6F00',
          accent: '#FFCA28',
          furniture: '#FFA000',
        };
      case 'medlab':
        return {
          bg: '#B2EBF2',
          grid: '#80DEEA',
          walls: '#006064',
          accent: '#4DD0E1',
          furniture: '#00ACC1',
        };
      case 'vault':
        return {
          bg: '#B0BEC5',
          grid: '#90A4AE',
          walls: '#263238',
          accent: '#78909C',
          furniture: '#546E7A',
        };
      case 'manor':
        return {
          bg: '#EF9A9A',
          grid: '#E57373',
          walls: '#880E4F',
          accent: '#EF5350',
          furniture: '#D32F2F',
        };
      case 'cubicles':
        return {
          bg: '#D7CCC8',
          grid: '#BCAAA4',
          walls: '#3E2723',
          accent: '#A1887F',
          furniture: '#8D6E63',
        };
      case 'boardroom':
        return {
          bg: '#C5CAE9',
          grid: '#9FA8DA',
          walls: '#1A237E',
          accent: '#7986CB',
          furniture: '#3F51B5',
        };
      case 'gallery':
        return {
          bg: '#E1BEE7',
          grid: '#CE93D8',
          walls: '#4A148C',
          accent: '#BA68C8',
          furniture: '#AB47BC',
        };
      case 'mansion':
        return {
          bg: '#424242',
          grid: '#303030',
          walls: '#121212',
          accent: '#616161',
          furniture: '#212121',
        };
      default:
        return {
          bg: '#C5E1A5',
          grid: '#AED581',
          walls: '#33691E',
          accent: '#81C784',
          furniture: '#7CB342',
        };
    }
  };

  const theme = getRoomTheme();

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <svg
        className={`w-full h-full object-cover transition-filter duration-300 ${
          isLocked ? 'filter grayscale contrast-125 brightness-50' : ''
        }`}
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Floor grid pattern */}
          <pattern id={`grid-${roomType}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill={theme.bg} />
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={theme.grid} strokeWidth="0.75" />
          </pattern>
          {/* Subtle hash texture */}
          <pattern id={`hash-${roomType}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 10 0 M -2 2 L 2 -2 M 8 12 L 12 8" stroke={theme.walls} strokeWidth="0.5" opacity="0.15" />
          </pattern>
        </defs>

        {/* Room Base Floor */}
        <rect width="320" height="200" fill={`url(#grid-${roomType})`} />

        {/* Outer Wall Boundary */}
        <rect x="10" y="10" width="300" height="180" fill="none" stroke={theme.walls} strokeWidth="6" rx="2" />
        <rect x="13" y="13" width="294" height="174" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />

        {/* Interior Walls & Rooms according to room type */}
        {roomType === 'lab' && (
          <g>
            {/* Divider Wall */}
            <line x1="180" y1="10" x2="180" y2="120" stroke={theme.walls} strokeWidth="5" />
            <line x1="180" y1="140" x2="180" y2="190" stroke={theme.walls} strokeWidth="5" />
            
            {/* Main Lab Desks */}
            <rect x="30" y="30" width="60" height="35" rx="3" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="35" y="35" width="20" height="12" fill={theme.furniture} opacity="0.7" />
            <circle cx="75" cy="47" r="4" fill={theme.accent} />

            <rect x="30" y="85" width="60" height="35" rx="3" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="65" y="90" width="20" height="12" fill={theme.furniture} opacity="0.7" />

            {/* Server Rack & Equipment */}
            <rect x="200" y="25" width="45" height="70" rx="2" fill="#ECEFF1" stroke={theme.walls} strokeWidth="2" />
            <line x1="200" y1="45" x2="245" y2="45" stroke={theme.walls} strokeWidth="1.5" />
            <line x1="200" y1="65" x2="245" y2="65" stroke={theme.walls} strokeWidth="1.5" />

            {/* Chairs */}
            <circle cx="60" cy="72" r="5" fill={theme.walls} />
            <circle cx="60" cy="127" r="5" fill={theme.walls} />
            <circle cx="260" cy="60" r="5" fill={theme.walls} />

            {/* Potted Plant */}
            <circle cx="290" cy="30" r="8" fill="#4CAF50" stroke={theme.walls} strokeWidth="1.5" />
            <circle cx="290" cy="30" r="4" fill="#2E7D32" />
          </g>
        )}

        {roomType === 'library' && (
          <g>
            {/* Bookshelves along walls */}
            <rect x="20" y="15" width="90" height="18" fill="#5D4037" stroke={theme.walls} strokeWidth="2" />
            <rect x="130" y="15" width="90" height="18" fill="#5D4037" stroke={theme.walls} strokeWidth="2" />
            <rect x="240" y="15" width="65" height="18" fill="#5D4037" stroke={theme.walls} strokeWidth="2" />

            <rect x="15" y="50" width="18" height="120" fill="#5D4037" stroke={theme.walls} strokeWidth="2" />
            
            {/* Reading Tables */}
            <rect x="70" y="60" width="80" height="40" rx="4" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="180" y="60" width="80" height="40" rx="4" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />

            {/* Armchairs */}
            <rect x="80" y="125" width="30" height="25" rx="3" fill="#8D6E63" stroke={theme.walls} strokeWidth="1.5" />
            <rect x="120" y="125" width="30" height="25" rx="3" fill="#8D6E63" stroke={theme.walls} strokeWidth="1.5" />

            {/* Rug */}
            <rect x="70" y="115" width="170" height="60" rx="4" fill="none" stroke="#7E57C2" strokeWidth="1.5" strokeDasharray="4 2" />

            {/* Potted Plants */}
            <circle cx="290" cy="170" r="9" fill="#388E3C" stroke={theme.walls} strokeWidth="1.5" />
          </g>
        )}

        {roomType === 'office' && (
          <g>
            {/* Partition Walls */}
            <path d="M 120 10 L 120 110 L 220 110" fill="none" stroke={theme.walls} strokeWidth="5" />

            {/* Executive Desk */}
            <rect x="30" y="30" width="70" height="45" rx="4" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="40" y="35" width="22" height="15" fill={theme.furniture} />
            <circle cx="65" cy="83" r="6" fill={theme.walls} />

            {/* Safe / Cabinet */}
            <rect x="250" y="20" width="40" height="25" fill="#37474F" stroke={theme.walls} strokeWidth="2" />
            <circle cx="270" cy="32" r="3" fill="#FFD54F" />

            {/* Lounge Sofa */}
            <rect x="140" y="140" width="90" height="35" rx="5" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="145" y="145" width="80" height="25" rx="3" fill={theme.furniture} opacity="0.5" />

            {/* Plant */}
            <circle cx="30" cy="170" r="9" fill="#2E7D32" stroke={theme.walls} strokeWidth="1.5" />
          </g>
        )}

        {roomType === 'penthouse' && (
          <g>
            {/* Balcony / Floor boundary */}
            <line x1="10" y1="140" x2="310" y2="140" stroke={theme.walls} strokeWidth="4" strokeDasharray="10 5" />
            
            {/* Dining Table */}
            <circle cx="100" cy="70" r="32" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2.5" />
            <circle cx="100" cy="70" r="22" fill={theme.accent} opacity="0.3" />
            {/* Chairs */}
            <circle cx="100" cy="30" r="5" fill={theme.walls} />
            <circle cx="100" cy="110" r="5" fill={theme.walls} />
            <circle cx="60" cy="70" r="5" fill={theme.walls} />
            <circle cx="140" cy="70" r="5" fill={theme.walls} />

            {/* Bar Counter */}
            <rect x="200" y="30" width="90" height="25" rx="3" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <circle cx="215" cy="65" r="4" fill={theme.walls} />
            <circle cx="245" cy="65" r="4" fill={theme.walls} />
            <circle cx="275" cy="65" r="4" fill={theme.walls} />

            {/* Balcony Chairs */}
            <rect x="60" y="155" width="30" height="25" rx="3" fill="#FFFFFF" stroke={theme.walls} strokeWidth="1.5" />
            <rect x="230" y="155" width="30" height="25" rx="3" fill="#FFFFFF" stroke={theme.walls} strokeWidth="1.5" />
          </g>
        )}

        {roomType === 'showroom' && (
          <g>
            {/* Display Cases */}
            <rect x="40" y="35" width="45" height="45" rx="4" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <circle cx="62.5" cy="57.5" r="8" fill="#FFD54F" stroke={theme.walls} strokeWidth="1.5" />

            <rect x="137.5" y="35" width="45" height="45" rx="4" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <circle cx="160" cy="57.5" r="8" fill="#E0E0E0" stroke={theme.walls} strokeWidth="1.5" />

            <rect x="235" y="35" width="45" height="45" rx="4" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <circle cx="257.5" cy="57.5" r="8" fill="#FFD54F" stroke={theme.walls} strokeWidth="1.5" />

            {/* Central Pedestal */}
            <rect x="120" y="115" width="80" height="55" rx="6" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2.5" />
            <rect x="135" y="125" width="50" height="35" fill={theme.accent} opacity="0.4" />
            <polygon points="160,132 167,147 153,147" fill="#E0F7FA" stroke={theme.walls} strokeWidth="1.5" />

            {/* Plants */}
            <circle cx="25" cy="175" r="8" fill="#4CAF50" stroke={theme.walls} />
            <circle cx="295" cy="175" r="8" fill="#4CAF50" stroke={theme.walls} />
          </g>
        )}

        {roomType === 'medlab' && (
          <g>
            {/* Lab Divider */}
            <line x1="160" y1="10" x2="160" y2="190" stroke={theme.walls} strokeWidth="4" strokeDasharray="8 4" />

            {/* Medical Counter */}
            <rect x="25" y="30" width="115" height="35" rx="3" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <circle cx="45" cy="47.5" r="6" fill="#80DEEA" />
            <circle cx="75" cy="47.5" r="6" fill="#80DEEA" />

            {/* Examination Bed */}
            <rect x="190" y="40" width="95" height="45" rx="4" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="195" y="45" width="20" height="35" fill="#E0F7FA" stroke={theme.walls} strokeWidth="1" />

            {/* Microscope Station */}
            <rect x="25" y="105" width="115" height="35" rx="3" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="50" y="112" width="15" height="20" fill="#37474F" />

            {/* Stools */}
            <circle cx="82" cy="155" r="6" fill={theme.walls} />
            <circle cx="237" cy="105" r="6" fill={theme.walls} />
          </g>
        )}

        {roomType === 'vault' && (
          <g>
            {/* Heavy Reinforced Vault Door & Walls */}
            <rect x="10" y="10" width="300" height="180" fill={`url(#hash-${roomType})`} />
            <rect x="35" y="35" width="250" height="130" fill={theme.bg} stroke={theme.walls} strokeWidth="3" />

            {/* Vault Shelves / Lockers */}
            <rect x="50" y="50" width="220" height="25" fill="#455A64" stroke={theme.walls} strokeWidth="2" />
            <circle cx="70" cy="62.5" r="3" fill="#FFD54F" />
            <circle cx="110" cy="62.5" r="3" fill="#FFD54F" />
            <circle cx="150" cy="62.5" r="3" fill="#FFD54F" />

            {/* Center Lock Box */}
            <rect x="110" y="95" width="100" height="50" rx="3" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="135" y="110" width="50" height="20" fill="#78909C" />
          </g>
        )}

        {roomType === 'manor' && (
          <g>
            {/* Fireplace */}
            <rect x="130" y="10" width="60" height="15" fill="#D32F2F" stroke={theme.walls} strokeWidth="2" />
            <path d="M 145 20 L 160 14 L 175 20" fill="none" stroke="#FFD54F" strokeWidth="2" />

            {/* Manor Desk */}
            <rect x="40" y="45" width="80" height="50" rx="4" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="50" y="55" width="30" height="20" fill={theme.furniture} opacity="0.6" />
            <circle cx="80" cy="110" r="6" fill={theme.walls} />

            {/* Armchairs */}
            <rect x="195" y="55" width="35" height="35" rx="5" fill="#880E4F" stroke={theme.walls} strokeWidth="2" />
            <rect x="245" y="55" width="35" height="35" rx="5" fill="#880E4F" stroke={theme.walls} strokeWidth="2" />

            {/* Grand Rug */}
            <ellipse cx="160" cy="135" rx="70" ry="35" fill="none" stroke="#C62828" strokeWidth="2" strokeDasharray="5 3" />
          </g>
        )}

        {roomType === 'cubicles' && (
          <g>
            {/* Cubicle Grid Layout */}
            {/* Row 1 */}
            <rect x="30" y="25" width="65" height="50" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="35" y="30" width="25" height="15" fill={theme.furniture} />
            <circle cx="75" cy="50" r="5" fill={theme.walls} />

            <rect x="110" y="25" width="65" height="50" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="115" y="30" width="25" height="15" fill={theme.furniture} />

            <rect x="190" y="25" width="95" height="50" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />

            {/* Row 2 */}
            <rect x="30" y="105" width="65" height="50" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="110" y="105" width="65" height="50" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <rect x="190" y="105" width="95" height="50" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />

            {/* Water Cooler / Elevator */}
            <rect x="290" y="80" width="20" height="40" fill="#90A4AE" stroke={theme.walls} />
          </g>
        )}

        {roomType === 'boardroom' && (
          <g>
            {/* Large Conference Oval Table */}
            <ellipse cx="160" cy="100" rx="95" ry="48" fill="#FFFFFF" stroke={theme.walls} strokeWidth="3" />
            <ellipse cx="160" cy="100" rx="70" ry="30" fill={theme.accent} opacity="0.3" />

            {/* Boardroom Executive Chairs */}
            <circle cx="90" cy="100" r="6" fill={theme.walls} />
            <circle cx="230" cy="100" r="6" fill={theme.walls} />
            <circle cx="120" cy="43" r="6" fill={theme.walls} />
            <circle cx="160" cy="43" r="6" fill={theme.walls} />
            <circle cx="200" cy="43" r="6" fill={theme.walls} />
            <circle cx="120" cy="157" r="6" fill={theme.walls} />
            <circle cx="160" cy="157" r="6" fill={theme.walls} />
            <circle cx="200" cy="157" r="6" fill={theme.walls} />

            {/* Projection Screen Wall */}
            <rect x="110" y="12" width="100" height="8" fill="#E0E0E0" stroke={theme.walls} strokeWidth="1.5" />
          </g>
        )}

        {roomType === 'gallery' && (
          <g>
            {/* Display Partition Walls */}
            <rect x="80" y="40" width="10" height="70" fill={theme.walls} />
            <rect x="230" y="90" width="10" height="70" fill={theme.walls} />

            {/* Paintings on Walls */}
            <rect x="30" y="12" width="40" height="5" fill="#AB47BC" />
            <rect x="140" y="12" width="50" height="5" fill="#AB47BC" />
            <rect x="240" y="12" width="40" height="5" fill="#AB47BC" />

            {/* Benches */}
            <rect x="120" y="80" width="70" height="25" rx="3" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            
            {/* Sculpture Pedestals */}
            <circle cx="50" cy="130" r="14" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
            <polygon points="50,122 58,135 42,135" fill="#7986CB" />

            <circle cx="270" cy="55" r="14" fill="#FFFFFF" stroke={theme.walls} strokeWidth="2" />
          </g>
        )}

        {roomType === 'mansion' && (
          <g>
            {/* Mysterious Darkened Layout */}
            <rect x="20" y="20" width="280" height="160" fill="#212121" stroke="#424242" strokeWidth="2" />
            <path d="M 40 40 L 280 160 M 280 40 L 40 160" stroke="#303030" strokeWidth="2" strokeDasharray="6 4" />
            
            <circle cx="160" cy="100" r="35" fill="none" stroke="#757575" strokeWidth="2" strokeDasharray="4 2" />
          </g>
        )}

        {/* Tactical Compass / Room Label Accent */}
        <g opacity="0.6">
          <circle cx="298" cy="178" r="12" fill="#FFFFFF" stroke={theme.walls} strokeWidth="1" />
          <text x="298" y="181" fontSize="9" fontWeight="bold" textAnchor="middle" fill={theme.walls}>N</text>
        </g>
      </svg>
    </div>
  );
};
