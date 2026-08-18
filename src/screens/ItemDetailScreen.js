import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Share
} from 'react-native';
import { useItems } from '../context/ItemsContext';
import StatusBadge from '../components/StatusBadge';
import { Feather } from '@expo/vector-icons';
import { customAlert } from '../utils/alert';

export default function ItemDetailScreen({ route, navigation }) {
  const { itemId } = route.params || {};
  const { items, updateItemStatus } = useItems();
  const [contactModalVisible, setContactModalVisible] = useState(false);

  const item = items.find((i) => i.id === itemId);

  if (!item) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Item Not Found</Text>
        <Text style={styles.errorSub}>The requested report may have been deleted or moved.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Return to Feed</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleMarkAsClaimed = () => {
    customAlert(
      'Mark as Claimed?',
      `Are you sure you want to mark "${item.name}" as claimed / resolved? This will update the status across all screens.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Mark Claimed',
          style: 'default',
          onPress: async () => {
            await updateItemStatus(item.id, 'Claimed');
            customAlert('Status Updated ✨', 'Item is now marked as Claimed.');
          }
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Campus Lost & Found Report:\nItem: ${item.name}\nStatus: ${item.status}\nLocation: ${item.location}\nCategory: ${item.category}\nContact: ${item.contactName} (${item.contactPhone || item.contactEmail})`,
      });
    } catch (error) {
      console.log('Share error', error);
    }
  };

  const isClaimed = item.status === 'Claimed';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Top Navigation Bar */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.navHeaderBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.navHeaderTitle} numberOfLines={1}>Item Details</Text>
        <TouchableOpacity style={styles.navHeaderBtn} onPress={handleShare}>
          <Feather name="share-2" size={18} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Image Header */}
        <View style={styles.imageContainer}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="tag" size={48} color="#94A3B8" />
              <Text style={styles.placeholderText}>No Image Attached</Text>
            </View>
          )}
          <View style={styles.statusBadgeOverlay}>
            <StatusBadge status={item.status} size="medium" />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.card}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            {item.isUserReported && (
              <View style={styles.myReportBadge}>
                <Text style={styles.myReportText}>Reported by You</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{item.name}</Text>

          {/* Metadata Cards */}
          <View style={styles.metaBox}>
            <View style={styles.metaItem}>
              <Feather name="map-pin" size={18} color="#2563EB" style={styles.metaIcon} />
              <View>
                <Text style={styles.metaLabel}>Location</Text>
                <Text style={styles.metaVal}>{item.location}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.metaItem}>
              <Feather name="calendar" size={18} color="#2563EB" style={styles.metaIcon} />
              <View>
                <Text style={styles.metaLabel}>Date {item.status === 'Lost' ? 'Lost' : 'Reported'}</Text>
                <Text style={styles.metaVal}>{item.date}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description & Context</Text>
            <Text style={styles.descriptionText}>
              {item.description || 'No detailed description provided by the reporter.'}
            </Text>
          </View>

          {/* Reporter Contact Info Box */}
          <View style={styles.reporterBox}>
            <View style={styles.reporterHeader}>
              <View style={styles.reporterAvatar}>
                <Feather name="user" size={20} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reporterRole}>
                  {item.status === 'Lost' ? 'Owner (Lost Item)' : 'Finder (Found Item)'}
                </Text>
                <Text style={styles.reporterName}>{item.contactName}</Text>
              </View>
              <Feather name="shield" size={20} color="#10B981" />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {/* Primary Contact Action Button */}
          <TouchableOpacity
            style={[styles.primaryActionBtn, isClaimed && styles.disabledBtn]}
            onPress={() => setContactModalVisible(true)}
            activeOpacity={0.8}
          >
            <Feather name="message-square" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryActionBtnText}>
              Contact {item.status === 'Lost' ? 'Owner' : 'Finder'}
            </Text>
          </TouchableOpacity>

          {/* Mark as Claimed Button */}
          {!isClaimed ? (
            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={handleMarkAsClaimed}
              activeOpacity={0.8}
            >
              <Feather name="check-circle" size={18} color="#10B981" style={{ marginRight: 6 }} />
              <Text style={styles.secondaryActionBtnText}>Mark as Claimed / Resolved</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.claimedBanner}>
              <Feather name="check-circle" size={18} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.claimedBannerText}>This item has been marked as Claimed</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Contact Dialog Modal */}
      <Modal
        visible={contactModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setContactModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Contact Information</Text>
            <Text style={styles.modalSub}>
              Reach out directly to {item.contactName} regarding "{item.name}":
            </Text>

            <View style={styles.contactRow}>
              <View style={styles.contactIconBg}>
                <Feather name="user" size={18} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.contactLabel}>Reporter Name</Text>
                <Text style={styles.contactVal}>{item.contactName}</Text>
              </View>
            </View>

            {item.contactPhone ? (
              <View style={styles.contactRow}>
                <View style={[styles.contactIconBg, { backgroundColor: '#ECFDF5' }]}>
                  <Feather name="phone" size={18} color="#10B981" />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Phone Number</Text>
                  <Text style={styles.contactVal}>{item.contactPhone}</Text>
                </View>
              </View>
            ) : null}

            {item.contactEmail ? (
              <View style={styles.contactRow}>
                <View style={[styles.contactIconBg, { backgroundColor: '#EFF6FF' }]}>
                  <Feather name="mail" size={18} color="#2563EB" />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Campus Email</Text>
                  <Text style={styles.contactVal}>{item.contactEmail}</Text>
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setContactModalVisible(false)}
            >
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  navHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  statusBadgeOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: -16,
    padding: 20,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  myReportBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  myReportText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  metaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 12,
  },
  metaLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  metaVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  reporterBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 14,
  },
  reporterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reporterAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reporterRole: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  reporterName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  secondaryActionBtnText: {
    color: '#065F46',
    fontSize: 14,
    fontWeight: '700',
  },
  claimedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  claimedBannerText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F8FAFC',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  errorSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  contactIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  contactVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeModalBtn: {
    marginTop: 16,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeModalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
});
