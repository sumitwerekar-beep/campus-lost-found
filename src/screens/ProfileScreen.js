import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
  StatusBar
} from 'react-native';
import { useItems } from '../context/ItemsContext';
import { Feather } from '@expo/vector-icons';
import { customAlert } from '../utils/alert';

export default function ProfileScreen() {
  const { userProfile, updateUserProfile, resetToMockData, stats } = useItems();
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Form State for Profile Edit
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [department, setDepartment] = useState(userProfile.department);
  const [studentId, setStudentId] = useState(userProfile.studentId);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      customAlert('Error', 'Name cannot be empty');
      return;
    }
    await updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
      studentId: studentId.trim()
    });
    setEditModalVisible(false);
    customAlert('Success', 'Profile updated successfully.');
  };

  const handleResetData = () => {
    customAlert(
      'Reset Demo Data?',
      'This will reset all reports to the initial sample campus dataset.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Data',
          style: 'destructive',
          onPress: async () => {
            await resetToMockData();
            customAlert('Reset Complete', 'App data has been restored to default sample items.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            {userProfile.avatarUrl ? (
              <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Feather name="user" size={36} color="#2563EB" />
              </View>
            )}
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => setEditModalVisible(true)}
            >
              <Feather name="edit-3" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userRole}>
            {userProfile.studentId} • {userProfile.department}
          </Text>

          <View style={styles.contactDetailsBox}>
            <View style={styles.contactItem}>
              <Feather name="mail" size={14} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.contactText}>{userProfile.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Feather name="phone" size={14} color="#64748B" style={{ marginRight: 6 }} />
              <Text style={styles.contactText}>{userProfile.phone}</Text>
            </View>
          </View>
        </View>

        {/* Live Dynamic Statistics Section */}
        <View style={styles.sectionHeaderRow}>
          <Feather name="award" size={18} color="#2563EB" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Live Activity Statistics</Text>
        </View>
        <Text style={styles.sectionSub}>Calculated in real-time from stored reports</Text>

        <View style={styles.statsGrid}>
          {/* Total Reports */}
          <View style={[styles.statCard, { borderLeftColor: '#2563EB' }]}>
            <View style={[styles.statIconBg, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="package" size={20} color="#2563EB" />
            </View>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>

          {/* Active Lost Items */}
          <View style={[styles.statCard, { borderLeftColor: '#EF4444' }]}>
            <View style={[styles.statIconBg, { backgroundColor: '#FEE2E2' }]}>
              <Feather name="alert-circle" size={20} color="#EF4444" />
            </View>
            <Text style={[styles.statNumber, { color: '#991B1B' }]}>{stats.lost}</Text>
            <Text style={styles.statLabel}>Lost Items</Text>
          </View>

          {/* Active Found Items */}
          <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
            <View style={[styles.statIconBg, { backgroundColor: '#D1FAE5' }]}>
              <Feather name="search" size={20} color="#10B981" />
            </View>
            <Text style={[styles.statNumber, { color: '#065F46' }]}>{stats.found}</Text>
            <Text style={styles.statLabel}>Found Items</Text>
          </View>

          {/* Claimed / Resolved */}
          <View style={[styles.statCard, { borderLeftColor: '#64748B' }]}>
            <View style={[styles.statIconBg, { backgroundColor: '#F1F5F9' }]}>
              <Feather name="check-square" size={20} color="#64748B" />
            </View>
            <Text style={[styles.statNumber, { color: '#475569' }]}>{stats.claimed}</Text>
            <Text style={styles.statLabel}>Claimed Items</Text>
          </View>
        </View>

        {/* My Submissions Counter Banner */}
        <View style={styles.myStatsBanner}>
          <Feather name="check-circle" size={20} color="#2563EB" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.myStatsBannerTitle}>My Filed Reports</Text>
            <Text style={styles.myStatsBannerSub}>You have reported {stats.myReports} items on campus.</Text>
          </View>
          <View style={styles.myStatsBadge}>
            <Text style={styles.myStatsBadgeText}>{stats.myReports}</Text>
          </View>
        </View>

        {/* Developer & App Management Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>App Management</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => setEditModalVisible(true)}>
            <Feather name="edit-3" size={18} color="#2563EB" style={{ marginRight: 12 }} />
            <Text style={styles.menuText}>Edit Profile Info</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleResetData}>
            <Feather name="rotate-ccw" size={18} color="#EF4444" style={{ marginRight: 12 }} />
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Restore Sample Demo Data</Text>
          </TouchableOpacity>
        </View>

        {/* App Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerAppTitle}>Campus Lost & Found v1.0.0</Text>
          <Text style={styles.footerSub}>React Native • AsyncStorage • Local State Sync</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile Information</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput style={styles.modalInput} value={name} onChangeText={setName} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Student / Staff ID</Text>
              <TextInput style={styles.modalInput} value={studentId} onChangeText={setStudentId} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Department</Text>
              <TextInput style={styles.modalInput} value={department} onChangeText={setDepartment} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.modalInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.modalInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveModalBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarFallback: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563EB',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  userRole: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  contactDetailsBox: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  myStatsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  myStatsBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  myStatsBannerSub: {
    fontSize: 12,
    color: '#3B82F6',
  },
  myStatsBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  myStatsBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  footer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  footerAppTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  footerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
    color: '#0F172A',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelModalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelModalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  saveModalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  saveModalBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
