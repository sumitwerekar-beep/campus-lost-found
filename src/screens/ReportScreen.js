import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useItems } from '../context/ItemsContext';
import { CATEGORIES } from '../types/constants';
import { Feather } from '@expo/vector-icons';
import { customAlert } from '../utils/alert';

export default function ReportScreen({ navigation }) {
  const { addItem, userProfile } = useItems();

  // Form State
  const [status, setStatus] = useState('Lost');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);

  useEffect(() => {
    if (userProfile) {
      if (!contactName) setContactName(userProfile.name || '');
      if (!contactPhone) setContactPhone(userProfile.phone || '');
      if (!contactEmail) setContactEmail(userProfile.email || '');
    }
  }, [userProfile]);

  const handleTakePhoto = async () => {
    setPickerModalVisible(false);
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        customAlert('Permission Needed', 'Camera access is required to take photos of items.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.error('Error taking photo', e);
      customAlert('Error', 'Could not access camera.');
    }
  };

  const handleChooseGallery = async () => {
    setPickerModalVisible(false);
    try {
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus !== 'granted') {
        customAlert('Permission Needed', 'Photo gallery access is required to select item images.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.error('Error choosing image', e);
      customAlert('Error', 'Could not open gallery.');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Item name is required';
    if (!category) newErrors.category = 'Please select a category';
    if (!location.trim()) newErrors.location = 'Campus location is required';
    if (!date.trim()) newErrors.date = 'Date is required';
    if (!contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!contactPhone.trim() && !contactEmail.trim()) {
      newErrors.contactPhone = 'Provide phone or email contact info';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      customAlert('Incomplete Form', 'Please fill out all required fields marked in red.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newItem = await addItem({
        name: name.trim(),
        category,
        location: location.trim(),
        date,
        description: description.trim(),
        status,
        imageUri,
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim()
      });

      setIsSubmitting(false);

      setName('');
      setCategory('');
      setLocation('');
      setDescription('');
      setImageUri(null);
      setErrors({});

      customAlert(
        'Report Filed Successfully! 🎉',
        `Your ${status.toLowerCase()} item report for "${newItem.name}" has been saved and is now visible on the Campus feed.`,
        [
          {
            text: 'View Item',
            onPress: () => navigation.navigate('ItemDetail', { itemId: newItem.id })
          },
          {
            text: 'Go to Home',
            onPress: () => navigation.navigate('HomeTab')
          }
        ]
      );
    } catch (e) {
      setIsSubmitting(false);
      customAlert('Error', 'Failed to save report. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report Item</Text>
        <Text style={styles.headerSubtitle}>Submit a new Lost or Found campus record</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Status Toggle Switch */}
        <View style={styles.statusToggleContainer}>
          <TouchableOpacity
            style={[styles.statusOption, status === 'Lost' && styles.statusOptionLost]}
            onPress={() => setStatus('Lost')}
            activeOpacity={0.8}
          >
            <Text style={[styles.statusOptionText, status === 'Lost' && styles.statusOptionTextActive]}>
              🔴 I Lost An Item
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusOption, status === 'Found' && styles.statusOptionFound]}
            onPress={() => setStatus('Found')}
            activeOpacity={0.8}
          >
            <Text style={[styles.statusOptionText, status === 'Found' && styles.statusOptionTextActive]}>
              🟢 I Found An Item
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section 1: Item Basic Info */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Item Details</Text>

          {/* Item Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Item Name / Title <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
              <Feather name="tag" size={16} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Blue Water Bottle, MacBook Pro, Lanyard"
                value={name}
                onChangeText={(val) => {
                  setName(val);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                placeholderTextColor="#94A3B8"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Category Picker Chips */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Category <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.categoryChipsGrid}>
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catChip,
                    category === cat && styles.catChipSelected
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    if (errors.category) setErrors({ ...errors, category: null });
                  }}
                >
                  <Text style={[styles.catChipText, category === cat && styles.catChipTextSelected]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          {/* Location */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Campus Location <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, errors.location && styles.inputError]}>
              <Feather name="map-pin" size={16} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Science Library 2nd Floor, Gym Bench, Quad"
                value={location}
                onChangeText={(val) => {
                  setLocation(val);
                  if (errors.location) setErrors({ ...errors, location: null });
                }}
                placeholderTextColor="#94A3B8"
              />
            </View>
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          {/* Date */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Date {status === 'Lost' ? 'Lost' : 'Found'} <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, errors.date && styles.inputError]}>
              <Feather name="calendar" size={16} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={setDate}
                placeholderTextColor="#94A3B8"
              />
            </View>
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>

          {/* Description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Detailed Description</Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Provide distinctive features, brand, color, stickers, or specific details to help identify..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* Section 2: Image Attachment with Camera & Gallery */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Item Photo</Text>
          <Text style={styles.sectionSubtext}>Attach a clear photo of the item (optional but recommended)</Text>

          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
              <View style={styles.imageActionOverlay}>
                <TouchableOpacity
                  style={styles.imageActionBtn}
                  onPress={() => setPickerModalVisible(true)}
                >
                  <Feather name="camera" size={16} color="#FFFFFF" />
                  <Text style={styles.imageActionBtnText}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.imageActionBtn, styles.deleteActionBtn]}
                  onPress={() => setImageUri(null)}
                >
                  <Feather name="trash-2" size={16} color="#FFFFFF" />
                  <Text style={styles.imageActionBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadPlaceholder}
              onPress={() => setPickerModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.uploadIconCircle}>
                <Feather name="camera" size={28} color="#2563EB" />
              </View>
              <Text style={styles.uploadTitle}>Add Item Photo</Text>
              <Text style={styles.uploadSubtext}>Tap to take a photo or select from gallery</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Section 3: Contact Info */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Contact Information</Text>
          <Text style={styles.sectionSubtext}>How people can reach you regarding this report</Text>

          {/* Contact Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Your Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, errors.contactName && styles.inputError]}>
              <Feather name="user" size={16} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={contactName}
                onChangeText={setContactName}
                placeholderTextColor="#94A3B8"
              />
            </View>
            {errors.contactName && <Text style={styles.errorText}>{errors.contactName}</Text>}
          </View>

          {/* Phone Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputWrapper, errors.contactPhone && styles.inputError]}>
              <Feather name="phone" size={16} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 000-0000"
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
              />
            </View>
            {errors.contactPhone && <Text style={styles.errorText}>{errors.contactPhone}</Text>}
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Campus Email</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={16} color="#64748B" style={styles.fieldIcon} />
              <TextInput
                style={styles.input}
                placeholder="student@campus.edu"
                value={contactEmail}
                onChangeText={setContactEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Feather name="check-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Submit {status} Item Report</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Image Source Selection Modal */}
      <Modal
        visible={pickerModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Photo Source</Text>

            <TouchableOpacity style={styles.modalOption} onPress={handleTakePhoto}>
              <View style={[styles.modalOptionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Feather name="camera" size={22} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.modalOptionTitle}>Take Photo</Text>
                <Text style={styles.modalOptionSub}>Use camera to capture image now</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={handleChooseGallery}>
              <View style={[styles.modalOptionIcon, { backgroundColor: '#ECFDF5' }]}>
                <Feather name="image" size={22} color="#10B981" />
              </View>
              <View>
                <Text style={styles.modalOptionTitle}>Photo Gallery</Text>
                <Text style={styles.modalOptionSub}>Select an existing photo from device</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setPickerModalVisible(false)}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
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
  header: {
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
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  statusOptionLost: {
    backgroundColor: '#EF4444',
  },
  statusOptionFound: {
    backgroundColor: '#10B981',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  statusOptionTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  fieldIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '600',
  },
  categoryChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catChipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  catChipTextSelected: {
    color: '#FFFFFF',
  },
  textAreaWrapper: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
  },
  textArea: {
    fontSize: 14,
    color: '#0F172A',
    minHeight: 80,
  },
  uploadPlaceholder: {
    borderWidth: 2,
    borderColor: '#93C5FD',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 2,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#64748B',
  },
  imagePreviewContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    height: 180,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imageActionOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  imageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  deleteActionBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  imageActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  modalOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalOptionSub: {
    fontSize: 12,
    color: '#64748B',
  },
  modalCancelBtn: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
});
