import { useQuery } from '@tanstack/react-query';
import { footballService } from '@/services/football';

export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: () => footballService.getPlayers(),
    staleTime: 60_000,
  });
}
