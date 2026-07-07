import React from 'react';
import { NavigationNodeDTO } from '../../../core/types';

interface RouteSelectorsProps {
  nodes: NavigationNodeDTO[];
  selectedStart: number | null;
  selectedEnd: number | null;
  onSelectStart: (id: number) => void;
  onSelectEnd: (id: number) => void;
}

export default function RouteSelectors({
  nodes,
  selectedStart,
  selectedEnd,
  onSelectStart,
  onSelectEnd
}: RouteSelectorsProps) {
  return (
    <div>
      <div className="form-group">
        <label className="form-label" htmlFor="start-node-select">Start Point</label>
        <select
          id="start-node-select"
          className="form-input"
          value={selectedStart || ''}
          onChange={e => onSelectStart(Number(e.target.value))}
        >
          <option value="">Select Origin...</option>
          {nodes.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="end-node-select">Destination Point</label>
        <select
          id="end-node-select"
          className="form-input"
          value={selectedEnd || ''}
          onChange={e => onSelectEnd(Number(e.target.value))}
        >
          <option value="">Select Destination...</option>
          {nodes.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
