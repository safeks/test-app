import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MatchFilter } from '../utils/match';

const FILTER_LABELS: Record<MatchFilter, string> = {
  all: 'Все',
  upcoming: 'Предстоящие',
  finished: 'Завершённые',
};

const FILTERS = Object.keys(FILTER_LABELS) as MatchFilter[];

type Props = {
  value: MatchFilter;
  counts: Record<MatchFilter, number>;
  onChange: (filter: MatchFilter) => void;
};

export function FilterTabs({ value, counts, onChange }: Props) {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => {
        const selected = filter === value;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            style={[styles.tab, selected && styles.selectedTab]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.text, selected && styles.selectedText]}>
              {FILTER_LABELS[filter]} {counts[filter]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 13,
    color: '#6b7280',
  },
  selectedText: {
    color: '#111827',
    fontWeight: '600',
  },
});
