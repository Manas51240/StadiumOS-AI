'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/context/AuthContext';
import { useAccessibility } from '@/core/context/AccessibilityContext';
import { useRouter } from 'next/navigation';
import { useNavigationPlanner } from '../../core/hooks/useNavigation';
import { NavigationNodeDTO, RouteDTO } from '../../core/types';
import dynamic from 'next/dynamic';
import NavigationHeader from '../../features/navigation/components/NavigationHeader';

const InteractiveMap = dynamic(() => import('../../features/navigation/components/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ width: '100%', height: '400px' }} />
});

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
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getNodes()
        .then(data => setNodes(data))
        .catch(err => setErrorMsg(`Failed to load nodes: ${err.message}`));
    }
  }, [user, getNodes]);

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
      <NavigationHeader
        accessibilityRequired={accessibilityRequired}
        setAccessibilityRequired={setAccessibilityRequired}
        avoidCongested={avoidCongested}
        setAvoidCongested={setAvoidCongested}
        announce={announce}
      />

      {errorMsg && <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--color-danger)', padding: '10px', borderRadius: '6px', marginBottom: '20px', color: 'var(--color-danger)', fontSize: '0.85rem' }}>{errorMsg}</div>}

      <InteractiveMap
        nodes={nodes}
        route={route}
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
        onSelectStart={setSelectedStart}
        onSelectEnd={setSelectedEnd}
      />

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
