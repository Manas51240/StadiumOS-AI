import { useAuth } from '../context/AuthContext';
import { NavigationNodeDTO, RouteDTO } from '../types';

export function useNavigationPlanner() {
  const { apiFetch } = useAuth();

  const getNodes = async (): Promise<NavigationNodeDTO[]> => {
    return apiFetch('/api/v1/navigation/nodes');
  };

  const getRoute = async (
    startId: number,
    endId: number,
    accessibilityRequired: boolean,
    avoidCongested: boolean
  ): Promise<RouteDTO> => {
    const url = `/api/v1/navigation/route?start_id=${startId}&end_id=${endId}&accessibility_required=${accessibilityRequired}&avoid_congested_sectors=${avoidCongested}`;
    return apiFetch(url);
  };

  return {
    getNodes,
    getRoute
  };
}
