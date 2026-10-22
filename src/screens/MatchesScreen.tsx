import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useMatches } from '../hooks/useMatches';

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { matches, round, error, isLoading, retry } = useMatches();

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
        <FlatList
          data={matches}
          keyExtractor={(match) => match.id}
          renderItem={({ item }) => (
            <Text>
              {item.home.name} — {item.away.name}
            </Text>
          )}
          ListEmptyComponent={<Text style={styles.message}>Матчей нет</Text>}
          contentContainerStyle={matches.length === 0 && styles.center}
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
  errorBanner: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
});
