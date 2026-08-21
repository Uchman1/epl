import { useQuery } from '@tanstack/react-query';
import { footballService } from '@/services/football';

export function useSeasonMeta() {
  return useQuery({
    queryKey: ['season-meta'],
    queryFn: () => footballService.getSeasonMeta(),
    staleTime: 60_000,
  });
}
