import { useQuery } from '@tanstack/react-query';
import { footballService } from '@/services/football';

export function useCompetitionZones() {
  return useQuery({
    queryKey: ['competition-zones'],
    queryFn: () => footballService.getCompetitionZones(),
    staleTime: 5 * 60_000,
  });
}
