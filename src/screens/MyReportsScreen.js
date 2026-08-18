import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { Feather } from '@expo/vector-icons';
import { customAlert } from '../utils/alert';

export default function MyReportsScreen({ navigation }) {
  const { items, updateItemStatus, deleteItem } = useItems();
  const [filter, setFilter] = useState('All');

  const myItems = useMemo(() => {
    const userItems = items.filter((item) => item.isUserReported);
    if (filter === 'Active') {
      return userItems.filter((i) => i.status !== 'Claimed');
    }
    if (filter === 'Claimed') {
      return userItems.filter((i) => i.status === 'Claimed');
    }
    return userItems;
  }, [items, filter]);

  const handleMarkClaimed = (item) => {
    customAlert(
      'Mark as Claimed',
      `Change status of "${item.name}" to Claimed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Claimed',
          onPress: async () => {
            await updateItemStatus(item.id, 'Claimed');
          }
        }
      ]
    );
  };

  const handleDelete = (item) => {
    customAlert(
      'Delete Report',
      `Are you sure you want to permanently remove "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteItem(item.id);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Reports</Text>
          <Text style={styles.headerSub}>Manage items you have filed</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('ReportTab')}
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {['All', 'Active', 'Claimed'].map((tab) => {
          const isSelected = filter === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isSelected && styles.tabSelected]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={myItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ItemCard
              item={item}
              onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
            />
            {/* Quick Action Footer */}
            <View style={styles.actionRow}>
              {item.status !== 'Claimed' ? (
                <TouchableOpacity
                  style={styles.claimActionBtn}
                  onPress={() => handleMarkClaimed(item)}
                >
                  <Feather name="check-circle" size={14} color="#059669" style={{ marginRight: 4 }} />
                  <Text style={styles.claimActionText}>Mark Claimed</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.claimedBadge}>
                  <Text style={styles.claimedBadgeText}>Resolved</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.deleteActionBtn}
                onPress={() => handleDelete(item)}
              >
                <Feather name="trash-2" size={14} color="#EF4444" style={{ marginRight: 4 }} />
                <Text style={styles.deleteActionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No Reports Found"
            message={
              filter !== 'All'
                ? `You have no ${filter.toLowerCase()} reports.`
                : 'You have not submitted any lost or found reports yet.'
            }
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabSelected: {
    backgroundColor: '#1E293B',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextSelected: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  claimActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  claimActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  claimedBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  claimedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  deleteActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
});
