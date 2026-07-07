import React from 'react';
import { Compass, Accessibility, AlertTriangle } from 'lucide-react';

interface NavigationHeaderProps {
  accessibilityRequired: boolean;
  setAccessibilityRequired: (val: boolean) => void;
  avoidCongested: boolean;
  setAvoidCongested: (val: boolean) => void;
  announce: (msg: string) => void;
}

export default function NavigationHeader({
  accessibilityRequired,
  setAccessibilityRequired,
  avoidCongested,
  setAvoidCongested,
  announce
}: NavigationHeaderProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
      <div>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={28} color="var(--color-primary)" />
          Stadium OS Navigation
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Dynamic pathfinding across MetLife stadium gates, seats, exits, concessions, and medical stations.
        </p>
      </div>

      <div className="glass-panel" style={{ display: 'flex', gap: '20px', padding: '12px 20px', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
          <input
            type="checkbox"
            style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
            checked={accessibilityRequired}
            onChange={e => {
              setAccessibilityRequired(e.target.checked);
              announce(`Accessibility step-free routing ${e.target.checked ? "activated" : "deactivated"}`);
            }}
            aria-label="Toggle Accessibility Routing"
          />
          <Accessibility size={16} />
          Step-free Paths
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
          <input
            type="checkbox"
            style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
            checked={avoidCongested}
            onChange={e => {
              setAvoidCongested(e.target.checked);
              announce(`Bypass congested areas ${e.target.checked ? "activated" : "deactivated"}`);
            }}
            aria-label="Toggle Congested Area Bypass"
          />
          <AlertTriangle size={16} />
          Bypass Congestion
        </label>
      </div>
    </div>
  );
}
