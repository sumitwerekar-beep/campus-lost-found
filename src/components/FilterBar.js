import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CATEGORIES, STATUSES } from '../types/constants';

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus
}) {
  return (
    <View style={styles.container}>
      {/* Status Filter Row */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Status Filter</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STATUSES.map((status) => {
          const isSelected = selectedStatus === status;
          return (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusChip,
                isSelected && styles.statusChipSelected,
                status === 'Lost' && isSelected && { backgroundColor: '#EF4444', borderColor: '#EF4444' },
                status === 'Found' && isSelected && { backgroundColor: '#10B981', borderColor: '#10B981' },
                status === 'Claimed' && isSelected && { backgroundColor: '#64748B', borderColor: '#64748B' }
              ]}
              onPress={() => onSelectStatus(status)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.statusChipText,
                  isSelected && styles.chipTextSelected
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Category Filter Row */}
      <View style={[styles.sectionHeader, { marginTop: 10 }]}>
        <Text style={styles.sectionTitle}>Category Filter</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected
              ]}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && styles.chipTextSelected
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 4,
  },
  statusChipSelected: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 4,
  },
  categoryChipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
