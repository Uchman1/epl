import { useQuery } from '@tanstack/react-query';
import { footballService } from '@/services/football';

export function useFixtures() {
  return useQuery({
    queryKey: ['fixtures'],
    queryFn: () => footballService.getFixtures(),
    staleTime: 60_000,
  });
}

export function useTeamFixtures(teamId: string | undefined) {
  return useQuery({
    queryKey: ['fixtures', 'team', teamId],
    queryFn: () => footballService.getFixturesByTeam(teamId as string),
    enabled: Boolean(teamId),
    staleTime: 60_000,
  });
}
