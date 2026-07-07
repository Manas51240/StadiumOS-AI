'use client';

import React from 'react';
import { NavigationNodeDTO, RouteDTO } from '../../../core/types';
import SvgCanvas from './SvgCanvas';
import RouteSelectors from './RouteSelectors';
import RouteDirections from './RouteDirections';

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
        
        <RouteSelectors
          nodes={nodes}
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
          onSelectStart={onSelectStart}
          onSelectEnd={onSelectEnd}
        />

        <RouteDirections route={route} />
      </div>
    </div>
  );
}
