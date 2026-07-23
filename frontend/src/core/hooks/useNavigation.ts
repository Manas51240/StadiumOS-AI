import { useAuth } from '../context/AuthContext';
import { NavigationNodeDTO, RouteDTO } from '../types';
import { useCallback } from 'react';

const FALLBACK_NODES: NavigationNodeDTO[] = [
  { id: 1, name: 'Gate A (Main North Entrance)', type: 'gate', sector: 'North Stand', accessibility_friendly: true, lat: 40.8135, lng: -74.0745, details: 'North main entrance' },
  { id: 2, name: 'Gate B (East Entrance)', type: 'gate', sector: 'East Stand', accessibility_friendly: true, lat: 40.8138, lng: -74.0735, details: 'East concourse access' },
  { id: 3, name: 'Section 104 (Row A-F)', type: 'seat', sector: 'North Stand', accessibility_friendly: true, lat: 40.8136, lng: -74.0742, details: 'Lower bowl seats' },
  { id: 4, name: 'Section 210 (Row G-L)', type: 'seat', sector: 'East Stand', accessibility_friendly: false, lat: 40.8140, lng: -74.0732, details: 'Upper deck seats' },
  { id: 5, name: 'Concession Stand #3', type: 'concession', sector: 'North Stand', accessibility_friendly: true, lat: 40.8134, lng: -74.0741, details: 'Food and beverages' },
  { id: 6, name: 'Medical Station #1', type: 'medical', sector: 'West Stand', accessibility_friendly: true, lat: 40.8132, lng: -74.0750, details: 'First aid center' },
  { id: 7, name: 'Emergency Exit 4', type: 'exit', sector: 'South Stand', accessibility_friendly: true, lat: 40.8128, lng: -74.0740, details: 'South exit gate' }
];

export function useNavigationPlanner() {
  const { apiFetch } = useAuth();

  const getNodes = useCallback(async (): Promise<NavigationNodeDTO[]> => {
    try {
      return await apiFetch('/api/v1/navigation/nodes');
    } catch {
      return FALLBACK_NODES;
    }
  }, [apiFetch]);

  const getRoute = useCallback(async (
    startId: number,
    endId: number,
    accessibilityRequired: boolean,
    avoidCongested: boolean
  ): Promise<RouteDTO> => {
    const url = `/api/v1/navigation/route?start_id=${startId}&end_id=${endId}&accessibility_required=${accessibilityRequired}&avoid_congested_sectors=${avoidCongested}`;
    try {
      return await apiFetch(url);
    } catch {
      const startNode = FALLBACK_NODES.find(n => n.id === startId) || FALLBACK_NODES[0];
      const endNode = FALLBACK_NODES.find(n => n.id === endId) || FALLBACK_NODES[1];
      return {
        start: startNode.name,
        end: endNode.name,
        accessibility_mode: accessibilityRequired,
        total_distance_meters: 185,
        estimated_time_seconds: 180,
        waypoints: [
          { name: startNode.name, lat: startNode.lat, lng: startNode.lng, type: startNode.type },
          { name: endNode.name, lat: endNode.lat, lng: endNode.lng, type: endNode.type }
        ],
        warnings: avoidCongested ? ['Avoided Gate 2 crowded concourse'] : [],
        navigation_assistance_instructions: `Proceed from ${startNode.name} towards ${endNode.name} via ${accessibilityRequired ? 'step-free ramp' : 'main concourse'}.`
      };
    }
  }, [apiFetch]);

  return {
    getNodes,
    getRoute
  };
}
