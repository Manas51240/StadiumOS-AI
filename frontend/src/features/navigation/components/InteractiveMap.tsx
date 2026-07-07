'use client';

import React from 'react';
import { NavigationNodeDTO, RouteDTO } from '../../../core/types';
import { Accessibility, HelpCircle, AlertTriangle } from 'lucide-react';

interface InteractiveMapProps {
  nodes: NavigationNodeDTO[];
  route: RouteDTO | null;
  selectedStart: number | null;
  selectedEnd: number | null;
  onSelectStart: (id: number) => void;
  onSelectEnd: (id: number) => void;
}

export default function InteractiveMap({
  nodes,
  route,
  selectedStart,
  selectedEnd,
  onSelectStart,
  onSelectEnd
}: InteractiveMapProps) {
  
  const getCoordinates = (lat: number, lng: number) => {
    const latMin = 40.8115;
    const latMax = 40.8145;
    const lngMin = -74.0765;
    const lngMax = -74.0725;

    const x = 50 + ((lng - lngMin) / (lngMax - lngMin)) * 400;
    const y = 450 - ((lat - latMin) / (latMax - latMin)) * 400;
    
    return { x: Math.min(Math.max(x, 20), 480), y: Math.min(Math.max(y, 20), 480) };
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px', minHeight: '500px' }}>
      
      {/* SVG Canvas Map */}
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
          {/* Outer Stadium Perimeter */}
          <ellipse cx="250" cy="250" rx="210" ry="170" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="8" />
          
          {/* Inner Seating Bowl */}
          <ellipse cx="250" cy="250" rx="150" ry="110" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="25" />
          
          {/* Pitch / Field */}
          <rect x="180" y="200" width="140" height="100" rx="4" fill="rgba(16, 185, 129, 0.15)" stroke="var(--color-primary)" strokeWidth="2" />
          <line x1="250" y1="200" x2="250" y2="300" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" />
          <circle cx="250" cy="250" r="20" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" />

          {/* Sectors Text Indicators */}
          <text x="250" y="60" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="bold" textAnchor="middle">NORTH STAND</text>
          <text x="250" y="445" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="bold" textAnchor="middle">SOUTH STAND</text>
          <text x="440" y="255" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(90 440 255)">EAST STAND</text>
          <text x="60" y="255" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(-90 60 255)">WEST STAND</text>

          {/* Render Route Waypoint Path */}
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

          {/* Interactive Pins */}
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
                {/* Interactive Click Target Area */}
                <circle cx={x} cy={y} r="16" fill="transparent" />
                
                {/* Visual Pin */}
                <circle cx={x} cy={y} r="8" fill={pinColor} stroke="#ffffff" strokeWidth="1.5" />
                
                {/* Inner dot for Accessibility Node */}
                {node.accessibility_friendly && (
                  <circle cx={x} cy={y} r="3" fill="#000000" />
                )}
                
                {/* Label text shown on hover */}
                <title>{node.name} ({node.type}) - Click or press space to set route point</title>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
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
            Medical Stations
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
            Step-free / Accessible
          </span>
        </div>
      </div>

      {/* Navigation Instructions Sidepanel */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3>Route Assistant</h3>
        
        {/* Input Selector Dropdowns */}
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

        {/* Calculated Routing results */}
        {route ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            
            {/* Quick Metrics */}
            <div style={{ display: 'flex', gap: '20px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '6px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distance</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                  {route.total_distance_meters} meters
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Time</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                  {Math.round(route.estimated_time_seconds / 60)} mins
                </div>
              </div>
            </div>

            {/* Accessibility Indicator */}
            {route.accessibility_mode && (
              <div style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Accessibility size={16} color="var(--color-secondary)" />
                <span>Step-free accessibility routing active.</span>
              </div>
            )}

            {/* Warnings Alert */}
            {route.warnings && route.warnings.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {route.warnings.map((w, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <AlertTriangle size={14} />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Directions Instructions */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Path Guidance:</div>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                borderLeft: '3px solid var(--color-primary)'
              }}>
                {route.navigation_assistance_instructions}
              </div>
            </div>

            {/* Waypoints steps */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Waypoints Checklist:</div>
              <ol style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {route.waypoints.map((wp, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    {wp.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({wp.type})</span>
                  </li>
                ))}
              </ol>
            </div>
            
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            <HelpCircle size={40} style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '0.9rem' }}>
              Select start and end markers on the map canvas or from dropdowns to configure dynamic route.
            </p>
          </div>
        )}
      </div>
      
    </div>
  );
}
