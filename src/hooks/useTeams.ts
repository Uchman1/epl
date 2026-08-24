import { useQuery } from '@tanstack/react-query';
import { footballService } from '@/services/football';

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => footballService.getTeams(),
    staleTime: 5 * 60_000,
  });
}

export function useTeam(id: string | undefined) {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => footballService.getTeam(id as string),
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
  });
}
