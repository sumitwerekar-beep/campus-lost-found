import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import StatusBadge from './StatusBadge';
import { Feather } from '@expo/vector-icons';

export default function ItemCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Feather name="tag" size={32} color="#94A3B8" />
            <Text style={styles.placeholderText}>No Photo</Text>
          </View>
        )}
        <View style={styles.badgePosition}>
          <StatusBadge status={item.status} size="small" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.categoryRow}>
          <Text style={styles.categoryTag}>{item.category}</Text>
          {item.isUserReported && (
            <View style={styles.userTag}>
              <Text style={styles.userTagText}>My Report</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.metaRow}>
          <Feather name="map-pin" size={14} color="#64748B" style={styles.icon} />
          <Text style={styles.metaText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.metaRow}>
            <Feather name="calendar" size={13} color="#94A3B8" style={styles.icon} />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <View style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>Details</Text>
            <Feather name="chevron-right" size={14} color="#2563EB" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: 110,
    height: '100%',
    minHeight: 120,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  placeholderText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '600',
  },
  badgePosition: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  userTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  userTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  icon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginRight: 2,
  },
});
