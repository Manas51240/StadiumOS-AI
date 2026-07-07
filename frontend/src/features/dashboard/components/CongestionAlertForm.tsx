import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CongestionAlertFormProps {
  sector: string;
  setSector: (val: string) => void;
  congestionLevel: string;
  setCongestionLevel: (val: string) => void;
  spectatorCount: number;
  setSpectatorCount: (val: number) => void;
  capacity: number;
  setCapacity: (val: number) => void;
  message: string;
  setMessage: (val: string) => void;
  alertSubmitting: boolean;
  handleBroadcastAlert: (e: React.FormEvent) => void;
}

export default function CongestionAlertForm({
  sector,
  setSector,
  congestionLevel,
  setCongestionLevel,
  spectatorCount,
  setSpectatorCount,
  capacity,
  setCapacity,
  message,
  setMessage,
  alertSubmitting,
  handleBroadcastAlert
}: CongestionAlertFormProps) {
  return (
    <div className="glass-panel">
      <form onSubmit={handleBroadcastAlert}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="var(--color-accent)" />
          Broadcast Congestion Alert
        </h2>

        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label className="form-label" htmlFor="alert-sector">Target Sector</label>
            <select
              id="alert-sector"
              className="form-input"
              value={sector}
              onChange={e => setSector(e.target.value)}
            >
              <option value="North Stand">North Stand</option>
              <option value="South Stand">South Stand</option>
              <option value="East Stand">East Stand</option>
              <option value="West Stand">West Stand</option>
              <option value="Main Concourse">Main Concourse</option>
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="alert-congestion">Congestion Status</label>
            <select
              id="alert-congestion"
              className="form-input"
              value={congestionLevel}
              onChange={e => setCongestionLevel(e.target.value)}
            >
              <option value="low">Low Density</option>
              <option value="medium">Medium Load</option>
              <option value="high">High Congestion</option>
              <option value="critical">Critical (Limit)</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label className="form-label" htmlFor="alert-count">Active Count</label>
            <input
              id="alert-count"
              type="number"
              className="form-input"
              value={spectatorCount}
              onChange={e => setSpectatorCount(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="alert-capacity">Max Capacity</label>
            <input
              id="alert-capacity"
              type="number"
              className="form-input"
              value={capacity}
              onChange={e => setCapacity(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="alert-msg">Operations Message</label>
          <textarea
            id="alert-msg"
            className="form-input"
            rows={2}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Describe gate adjustments, staff dispatch instructions, or route diversions..."
          />
        </div>

        <button type="submit" className="btn btn-accent" style={{ width: '100%' }} disabled={alertSubmitting}>
          {alertSubmitting ? 'Dispatching Alert...' : 'Broadcast Operational Warning'}
        </button>
      </form>
    </div>
  );
}
