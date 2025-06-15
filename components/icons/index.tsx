import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

export const HomeIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth="2" fill="none"/>
    <Polyline points="9,22 9,12 15,12 15,22" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const BookOpenIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const UserIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none"/>
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const UsersIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none"/>
    <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const CoffeeIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke={color} strokeWidth="2" fill="none"/>
    <Line x1="6" y1="1" x2="6" y2="4" stroke={color} strokeWidth="2"/>
    <Line x1="10" y1="1" x2="10" y2="4" stroke={color} strokeWidth="2"/>
    <Line x1="14" y1="1" x2="14" y2="4" stroke={color} strokeWidth="2"/>
  </Svg>
);

export const UserPlusIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none"/>
    <Circle cx="8.5" cy="7" r="4" stroke={color} strokeWidth="2" fill="none"/>
    <Line x1="20" y1="8" x2="20" y2="14" stroke={color} strokeWidth="2"/>
    <Line x1="23" y1="11" x2="17" y2="11" stroke={color} strokeWidth="2"/>
  </Svg>
);

export const SearchIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="m21 21-4.35-4.35" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const ClockIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <Polyline points="12,6 12,12 16,14" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const XIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2"/>
    <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2"/>
  </Svg>
);

export const CheckIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Polyline points="20,6 9,17 4,12" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const PauseIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Rect x="6" y="4" width="4" height="16" fill={color}/>
    <Rect x="14" y="4" width="4" height="16" fill={color}/>
  </Svg>
);

export const PlayIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Polygon points="5,3 19,12 5,21" fill={color}/>
  </Svg>
);

export const Volume2Icon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const VolumeXIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke={color} strokeWidth="2" fill="none"/>
    <Line x1="23" y1="9" x2="17" y2="15" stroke={color} strokeWidth="2"/>
    <Line x1="17" y1="9" x2="23" y2="15" stroke={color} strokeWidth="2"/>
  </Svg>
);

export const GlobeIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <Line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2"/>
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const MailIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth="2" fill="none"/>
    <Polyline points="22,6 12,13 2,6" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const LockIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
    <Circle cx="12" cy="16" r="1" fill={color}/>
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const LogInIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke={color} strokeWidth="2" fill="none"/>
    <Polyline points="10,17 15,12 10,7" stroke={color} strokeWidth="2" fill="none"/>
    <Line x1="15" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2"/>
  </Svg>
);

export const LogOutIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" fill="none"/>
    <Polyline points="16,17 21,12 16,7" stroke={color} strokeWidth="2" fill="none"/>
    <Line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2"/>
  </Svg>
);

export const SettingsIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const AwardIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="8" r="7" stroke={color} strokeWidth="2" fill="none"/>
    <Polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const CalendarIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
    <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2"/>
    <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2"/>
    <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2"/>
  </Svg>
);

export const FilterIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const CameraIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" fill="none"/>
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const UploadIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={color} strokeWidth="2" fill="none"/>
    <Polyline points="7,10 12,5 17,10" stroke={color} strokeWidth="2" fill="none"/>
    <Line x1="12" y1="5" x2="12" y2="15" stroke={color} strokeWidth="2"/>
  </Svg>
);

export const MicIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke={color} strokeWidth="2" fill="none"/>
    <Line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="2"/>
    <Line x1="8" y1="23" x2="16" y2="23" stroke={color} strokeWidth="2"/>
  </Svg>
);

export const MicOffIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth="2"/>
    <Path d="M9 9v3a3 3 0 0 0 5.12 2.12L9 9z" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M12 1a3 3 0 0 0-3 3v.17L12 7.17V1z" stroke={color} strokeWidth="2" fill="none"/>
    <Path d="M19 10v2a7 7 0 0 1-.64 3.08L19 10z" stroke={color} strokeWidth="2" fill="none"/>
    <Line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="2"/>
    <Line x1="8" y1="23" x2="16" y2="23" stroke={color} strokeWidth="2"/>
  </Svg>
);

export const VideoIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Polygon points="23,7 16,12 23,17" stroke={color} strokeWidth="2" fill="none"/>
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
  </Svg>
);

export const VideoOffIcon = ({ size = 24, color = '#000', style }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" stroke={color} strokeWidth="2" fill="none"/>
    <Line x1="1" y1="1" x2="23" y2="23" stroke={color} strokeWidth="2"/>
  </Svg>
);