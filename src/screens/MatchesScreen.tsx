import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { FilterTabs } from '../components/FilterTabs';
import { MatchCard } from '../components/MatchCard';
import { useMatches } from '../hooks/useMatches';
import { filterMatches, type MatchFilter } from '../utils/match';

const EMPTY_MESSAGES: Record<MatchFilter, string> = {
  all: 'В этом туре пока нет матчей',
  upcoming: 'Предстоящих матчей нет',
  finished: 'Завершённых матчей пока нет',
};

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { matches, round, error, isLoading, retry } = useMatches();
  const [filter, setFilter] = useState<MatchFilter>('all');

  const visibleMatches = useMemo(
    () => (matches === null ? [] : filterMatches(matches, filter)),
    [matches, filter],
  );

  const counts = useMemo<Record<MatchFilter, number>>(() => {
    const list = matches ?? [];
    return {
      all: list.length,
      upcoming: filterMatches(list, 'upcoming').length,
      finished: filterMatches(list, 'finished').length,
    };
  }, [matches]);

  const title = round === null ? 'Матчи тура' : `Матчи ${round}-го тура`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {renderContent()}
    </View>
  );

  function renderContent() {
    if (matches === null) {
      if (isLoading) {
        return (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        );
      }
      return (
        <View style={styles.center}>
          <Text style={styles.message}>Не удалось загрузить матчи</Text>
          {error && <Text style={styles.details}>{error}</Text>}
          <Pressable style={styles.button} onPress={retry} accessibilityRole="button">
            <Text style={styles.buttonText}>Повторить</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <>
        {error && <Text style={styles.errorBanner}>Не удалось обновить: {error}</Text>}
        <FilterTabs value={filter} counts={counts} onChange={setFilter} />
        <FlatList
          data={visibleMatches}
          keyExtractor={(match) => match.id}
          renderItem={({ item }) => <MatchCard match={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<Text style={styles.message}>{EMPTY_MESSAGES[filter]}</Text>}
          style={styles.list}
          contentContainerStyle={visibleMatches.length === 0 && styles.center}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  center: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  message: {
    fontSize: 16,
    color: '#374151',
  },
  details: {
    fontSize: 13,
    color: '#6b7280',
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ef3124',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    marginTop: 12,
  },
  separator: {
    height: 8,
  },
  errorBanner: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
});
