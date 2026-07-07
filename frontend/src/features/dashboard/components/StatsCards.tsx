import React from 'react';
import { CommandCenterStats } from '../../../core/hooks/useDashboard';

interface StatsCardsProps {
  stats: CommandCenterStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '4px solid var(--color-primary)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>CROWD SAFETY INDEX</span>
        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          {stats.crowd_safety_index}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span className="status-dot status-dot-active" style={{ marginRight: '6px' }} />
          Stable stadium dynamics
        </span>
      </div>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '4px solid var(--color-accent)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE CROWD WARNINGS</span>
        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: stats.active_alerts_count > 0 ? 'var(--color-accent)' : 'var(--text-primary)' }}>
          {stats.active_alerts_count}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Alert bulletins dispatched
        </span>
      </div>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '4px solid var(--color-danger)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE EMERGENCY ISSUES</span>
        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: stats.unresolved_incidents_count > 0 ? 'var(--color-danger)' : 'var(--text-primary)' }}>
          {stats.unresolved_incidents_count}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Dispatches requiring resolution
        </span>
      </div>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '4px solid var(--color-secondary)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>VOLUNTEERS ON SHIFT</span>
        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-secondary)' }}>
          {stats.volunteers_on_shift}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Personnel allocated on duty
        </span>
      </div>
    </div>
  );
}
