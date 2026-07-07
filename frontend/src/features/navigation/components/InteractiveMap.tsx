'use client';

import React from 'react';
import { NavigationNodeDTO, RouteDTO } from '../../../core/types';
import { Accessibility, HelpCircle, AlertTriangle } from 'lucide-react';
import SvgCanvas from './SvgCanvas';

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
      
      <SvgCanvas
        nodes={nodes}
        route={route}
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
        onSelectStart={onSelectStart}
        onSelectEnd={onSelectEnd}
        getCoordinates={getCoordinates}
      />

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

        {/* Route Details Panel */}
        {route ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Distance:</span>
                <strong style={{ color: 'var(--color-primary)' }}>{route.total_distance_meters.toFixed(0)} meters</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transit Duration:</span>
                <strong style={{ color: 'var(--color-secondary)' }}>{(route.estimated_time_seconds / 60).toFixed(1)} mins</strong>
              </div>
              
              {route.accessibility_mode && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#34d399',
                  background: 'rgba(52, 211, 153, 0.1)',
                  padding: '6px',
                  borderRadius: '4px',
                  marginTop: '4px',
                  fontSize: '0.8rem'
                }}>
                  <Accessibility size={14} />
                  <span>Step-free wheelchair friendly route</span>
                </div>
              )}
            </div>

            {/* Turn by turn directions */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>TURN-BY-TURN ROUTING</span>
              {route.navigation_assistance_instructions.split('\n').filter(Boolean).map((dir, idx) => (
                <div key={idx} style={{
                  fontSize: '0.85rem',
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.01)',
                  borderLeft: '2px solid var(--color-secondary)',
                  borderRadius: '0 4px 4px 0'
                }}>
                  {dir}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: '20px'
          }}>
            <HelpCircle size={32} style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '0.85rem', margin: 0 }}>
              Select a start and end pin on the map or select from the options to generate dynamic routes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
