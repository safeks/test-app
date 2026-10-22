import { StyleSheet, Text, View } from 'react-native';
import type { Match } from '../types/match';
import { formatScore, formatStartsAt, getStatusLabel } from '../utils/match';
import { FavoriteButton } from './FavoriteButton';

type Props = {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function MatchCard({ match, isFavorite, onToggleFavorite }: Props) {
  const isLive = match.status === 'live';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatStartsAt(match.startsAt)}</Text>
        <Text style={[styles.status, isLive && styles.live]}>{getStatusLabel(match)}</Text>
        <FavoriteButton active={isFavorite} onPress={onToggleFavorite} />
      </View>
      <View style={styles.teams}>
        <Text style={[styles.team, styles.home]} numberOfLines={2}>
          {match.home.name}
        </Text>
        <Text style={styles.score}>{formatScore(match)}</Text>
        <Text style={styles.team} numberOfLines={2}>
          {match.away.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
  },
  status: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  live: {
    color: '#ef3124',
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  team: {
    flex: 1,
    fontSize: 16,
  },
  home: {
    textAlign: 'right',
  },
  score: {
    minWidth: 56,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
});
