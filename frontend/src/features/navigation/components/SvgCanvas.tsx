import React from 'react';
import { NavigationNodeDTO, RouteDTO } from '../../../core/types';

interface SvgCanvasProps {
  nodes: NavigationNodeDTO[];
  route: RouteDTO | null;
  selectedStart: number | null;
  selectedEnd: number | null;
  onSelectStart: (id: number) => void;
  onSelectEnd: (id: number) => void;
  getCoordinates: (lat: number, lng: number) => { x: number; y: number };
}

export default function SvgCanvas({
  nodes,
  route,
  selectedStart,
  selectedEnd,
  onSelectStart,
  onSelectEnd,
  getCoordinates
}: SvgCanvasProps) {
  return (
    <div className="glass-panel" style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'rgba(10, 15, 30, 0.9)',
      padding: '16px'
    }}>
      <h3 style={{ alignSelf: 'flex-start', marginBottom: '12px' }}>Interactive Stadium Map</h3>
      
      <svg
        viewBox="0 0 500 500"
        width="100%"
        height="100%"
        style={{
          maxHeight: '450px',
          border: '1px solid var(--border-glass)',
          borderRadius: '8px',
          background: '#070a13'
        }}
        aria-label="FIFA World Cup 2026 MetLife Stadium Layout Map"
      >
        <ellipse cx="250" cy="250" rx="210" ry="170" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="8" />
        <ellipse cx="250" cy="250" rx="150" ry="110" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="25" />
        <rect x="180" y="200" width="140" height="100" rx="4" fill="rgba(16, 185, 129, 0.15)" stroke="var(--color-primary)" strokeWidth="2" />
        <line x1="250" y1="200" x2="250" y2="300" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" />
        <circle cx="250" cy="250" r="20" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" />

        <text x="250" y="60" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="bold" textAnchor="middle">NORTH STAND</text>
        <text x="250" y="445" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="bold" textAnchor="middle">SOUTH STAND</text>
        <text x="440" y="255" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(90 440 255)">EAST STAND</text>
        <text x="60" y="255" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(-90 60 255)">WEST STAND</text>

        {route && route.waypoints && route.waypoints.length > 1 && (
          <path
            d={route.waypoints.reduce((acc, wp, idx) => {
              const { x, y } = getCoordinates(wp.lat, wp.lng);
              return acc + (idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
            }, '')}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth="4"
            strokeDasharray="8 4"
            style={{ filter: 'drop-shadow(0 0 6px var(--color-secondary))' }}
          />
        )}

        {nodes.map(node => {
          const { x, y } = getCoordinates(node.lat, node.lng);
          const isStart = selectedStart === node.id;
          const isEnd = selectedEnd === node.id;
          
          let pinColor = 'rgba(255, 255, 255, 0.6)';
          if (isStart) pinColor = 'var(--color-primary)';
          else if (isEnd) pinColor = 'var(--color-secondary)';
          else if (node.type === 'first_aid') pinColor = 'var(--color-danger)';
          else if (node.type === 'gate') pinColor = 'rgba(168, 85, 247, 0.8)';

          return (
            <g
              key={node.id}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (!selectedStart) onSelectStart(node.id);
                else onSelectEnd(node.id);
              }}
              tabIndex={0}
              role="button"
              aria-label={`${node.name} (${node.type}) - Select as destination`}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!selectedStart) onSelectStart(node.id);
                  else onSelectEnd(node.id);
                }
              }}
            >
              <circle cx={x} cy={y} r="16" fill="transparent" />
              <circle cx={x} cy={y} r="8" fill={pinColor} stroke="#ffffff" strokeWidth="1.5" />
              {node.accessibility_friendly && <circle cx={x} cy={y} r="3" fill="#000000" />}
              <title>{node.name} ({node.type}) - Click or press space to set route point</title>
            </g>
          );
        })}
      </svg>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', fontSize: '0.8rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)' }} />
          Start Pin
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-secondary)' }} />
          End Pin
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.8)' }} />
          Gates
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-danger)' }} />
          Medical
        </span>
      </div>
    </div>
  );
}
