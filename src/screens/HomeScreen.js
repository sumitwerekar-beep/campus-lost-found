import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ItemCard';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { items, loading, reload } = useItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(true);

  // Combined Search & Filter Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Status Filter
      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }
      // 2. Category Filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // 3. Search Query Keyword
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.name?.toLowerCase().includes(query);
        const matchLoc = item.location?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchCat = item.category?.toLowerCase().includes(query);
        if (!matchName && !matchLoc && !matchDesc && !matchCat) {
          return false;
        }
      }
      return true;
    });
  }, [items, searchQuery, selectedCategory, selectedStatus]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  const isFiltered = searchQuery !== '' || selectedCategory !== 'All' || selectedStatus !== 'All';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>CAMPUS LOST & FOUND</Text>
          <Text style={styles.headerTitle}>Explore Items</Text>
        </View>
        <TouchableOpacity
          style={styles.reportHeaderBtn}
          onPress={() => navigation.navigate('ReportTab')}
          activeOpacity={0.8}
        >
          <Feather name="plus-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.reportHeaderBtnText}>Report Item</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by keyword, location, item..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterToggleBtn, showFilterBar && styles.filterToggleActive]}
          onPress={() => setShowFilterBar(!showFilterBar)}
        >
          <Feather name="sliders" size={18} color={showFilterBar ? '#2563EB' : '#64748B'} />
        </TouchableOpacity>
      </View>

      {/* Combined Filter Bar */}
      {showFilterBar && (
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
        />
      )}

      {/* Results Count & Filter Summary Bar */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          Showing <Text style={styles.boldText}>{filteredItems.length}</Text> of {items.length} items
        </Text>
        {isFiltered && (
          <TouchableOpacity onPress={handleResetFilters}>
            <Text style={styles.resetText}>Reset Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading state */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading campus items...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#2563EB']}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title={isFiltered ? 'No matching items' : 'No items reported yet'}
              message={
                isFiltered
                  ? `No items found matching category "${selectedCategory}" and status "${selectedStatus}".`
                  : 'Be the first to file a lost or found report on campus!'
              }
              onReset={isFiltered ? handleResetFilters : null}
            />
          }
        />
      )}
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
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  reportHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reportHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  clearBtn: {
    padding: 4,
  },
  filterToggleBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
  },
  summaryText: {
    fontSize: 12,
    color: '#64748B',
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  resetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
});
