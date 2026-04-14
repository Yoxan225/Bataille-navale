interface IconProps { className?: string; color?: string }

export function CarrierIcon({ className = '', color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 80 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16 Q6 10 10 10 L70 10 Q76 10 78 16 L76 18 L4 18 Z" fill={color} opacity="0.9"/>
      <rect x="10" y="6" width="52" height="4" rx="1" fill={color} opacity="0.75"/>
      <rect x="14" y="4" width="36" height="2" rx="1" fill={color} opacity="0.6"/>
      <rect x="54" y="2" width="6" height="4" rx="1" fill={color} opacity="0.85"/>
      <rect x="56" y="1" width="2" height="3" fill={color}/>
      <rect x="18" y="8" width="3" height="2" fill={color} opacity="0.5"/>
      <rect x="26" y="8" width="3" height="2" fill={color} opacity="0.5"/>
      <rect x="34" y="8" width="3" height="2" fill={color} opacity="0.5"/>
      <rect x="42" y="8" width="3" height="2" fill={color} opacity="0.5"/>
    </svg>
  );
}

export function CruiserIcon({ className = '', color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 17 Q6 11 12 11 L52 11 Q58 11 60 17 L58 19 L4 19 Z" fill={color} opacity="0.9"/>
      <rect x="12" y="7" width="36" height="4" rx="1" fill={color} opacity="0.8"/>
      <rect x="18" y="4" width="14" height="3" rx="1" fill={color} opacity="0.7"/>
      <rect x="36" y="5" width="8" height="2" rx="1" fill={color} opacity="0.65"/>
      <rect x="20" y="2" width="4" height="2" rx="1" fill={color} opacity="0.9"/>
      <rect x="21" y="1" width="2" height="2" fill={color}/>
      <circle cx="14" cy="14" r="2" fill={color} opacity="0.4"/>
      <circle cx="50" cy="14" r="2" fill={color} opacity="0.4"/>
    </svg>
  );
}

export function DestroyerIcon({ className = '', color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 48 22" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16 Q7 10 13 10 L36 10 Q42 10 44 16 L42 18 L4 18 Z" fill={color} opacity="0.9"/>
      <rect x="12" y="6" width="22" height="4" rx="1" fill={color} opacity="0.78"/>
      <rect x="16" y="3" width="10" height="3" rx="1" fill={color} opacity="0.7"/>
      <rect x="17" y="2" width="3" height="2" rx="1" fill={color}/>
      <rect x="30" y="7" width="4" height="3" rx="1" fill={color} opacity="0.6"/>
    </svg>
  );
}

export function SubmarineIcon({ className = '', color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 48 22" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="15" rx="20" ry="5" fill={color} opacity="0.9"/>
      <rect x="20" y="8" width="8" height="7" rx="3" fill={color} opacity="0.8"/>
      <rect x="22" y="5" width="4" height="3" rx="1" fill={color} opacity="0.7"/>
      <rect x="4" y="14" width="6" height="2" rx="1" fill={color} opacity="0.5" transform="rotate(-15 4 14)"/>
      <rect x="38" y="14" width="6" height="2" rx="1" fill={color} opacity="0.5" transform="rotate(15 38 14)"/>
      <ellipse cx="38" cy="15" rx="4" ry="3" fill={color} opacity="0.6"/>
    </svg>
  );
}

export function PatrolIcon({ className = '', color = 'currentColor' }: IconProps) {
  return (
    <svg viewBox="0 0 32 20" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 15 Q5 10 9 10 L23 10 Q27 10 29 15 L27 17 L5 17 Z" fill={color} opacity="0.9"/>
      <rect x="9" y="7" width="12" height="3" rx="1" fill={color} opacity="0.78"/>
      <rect x="11" y="5" width="7" height="2" rx="1" fill={color} opacity="0.7"/>
      <rect x="12" y="4" width="2" height="2" fill={color}/>
    </svg>
  );
}

export const SHIP_ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  carrier:   CarrierIcon,
  cruiser:   CruiserIcon,
  destroyer: DestroyerIcon,
  submarine: SubmarineIcon,
  patrol:    PatrolIcon,
};
