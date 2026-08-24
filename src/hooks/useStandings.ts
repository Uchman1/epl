import { useQuery } from '@tanstack/react-query';
import { footballService } from '@/services/football';

export function useStandings() {
  return useQuery({
    queryKey: ['standings'],
    queryFn: () => footballService.getStandings(),
    staleTime: 60_000,
  });
}
