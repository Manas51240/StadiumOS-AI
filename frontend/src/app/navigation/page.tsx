'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/core/context/AuthContext';
import { useAccessibility } from '@/core/context/AccessibilityContext';
import { useRouter } from 'next/navigation';
import { useNavigationPlanner } from '../../core/hooks/useNavigation';
import { NavigationNodeDTO, RouteDTO } from '../../core/types';
import dynamic from 'next/dynamic';
const InteractiveMap = dynamic(() => import('../../features/navigation/components/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ width: '100%', height: '400px' }} />
});
import { Compass, Accessibility, AlertTriangle } from 'lucide-react';

export default function NavigationPage() {
  const { user, loading } = useAuth();
  const { announce } = useAccessibility();
  const router = useRouter();
  const { getNodes, getRoute } = useNavigationPlanner();

  const [nodes, setNodes] = useState<NavigationNodeDTO[]>([]);
  const [selectedStart, setSelectedStart] = useState<number | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<number | null>(null);
  const [accessibilityRequired, setAccessibilityRequired] = useState(false);
  const [avoidCongested, setAvoidCongested] = useState(true);
  const [route, setRoute] = useState<RouteDTO | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Load Map Nodes
  useEffect(() => {
    if (user) {
      getNodes()
        .then(data => setNodes(data))
        .catch(err => setErrorMsg(`Failed to load nodes: ${err.message}`));
    }
  }, [user, getNodes]);

  // Calculate route when start/end/modes change
  useEffect(() => {
    if (selectedStart && selectedEnd) {
      if (selectedStart === selectedEnd) {
        setErrorMsg("Start and End locations cannot be identical.");
        setRoute(null);
        return;
      }
      setErrorMsg('');
      
      getRoute(selectedStart, selectedEnd, accessibilityRequired, avoidCongested)
        .then(data => {
          setRoute(data);
          announce(`Route calculated. Total distance is ${data.total_distance_meters} meters.`);
        })
        .catch(err => {
          setErrorMsg(`Routing failed: ${err.message}`);
          setRoute(null);
        });
    } else {
      setRoute(null);
    }
  }, [selectedStart, selectedEnd, accessibilityRequired, avoidCongested, getRoute, announce]);

  if (loading || !user) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Loading Navigation...</h2>
      </div>
    );
  }

  return (
    <div className="container animated-fade">
      
      {/* Page Header */}
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

        {/* Accessibility & Congestion Toggles */}
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

      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--color-danger)',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '20px',
          color: 'var(--color-danger)',
          fontSize: '0.85rem'
        }}>
          {errorMsg}
        </div>
      )}

      {/* Main Map Viewer */}
      <InteractiveMap
        nodes={nodes}
        route={route}
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
        onSelectStart={setSelectedStart}
        onSelectEnd={setSelectedEnd}
      />

      {/* Quick Action Reset */}
      {(selectedStart || selectedEnd) && (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSelectedStart(null);
              setSelectedEnd(null);
              setRoute(null);
              announce("Map inputs cleared");
            }}
          >
            Clear Route Parameters
          </button>
        </div>
      )}

    </div>
  );
}
