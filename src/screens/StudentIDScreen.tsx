import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useData } from '../context/DataContext';

const StudentIDScreen = () => {
  const { currentUser } = useData();
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    Animated.spring(flipAnimation, {
      toValue: flipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Digital ID Card</Text>
        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={() => {
            // Download functionality
            const alertMessage = flipped 
              ? 'QR Code saved to your device!' 
              : 'Student ID saved to your device!';
            Alert.alert(
              'Download Complete',
              alertMessage,
              [{ text: 'OK' }]
            );
          }}
        >
          <Icon name="download" size={24} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        {/* Front of Card */}
        <Animated.View
          style={[
            styles.card,
            styles.cardFront,
            { transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }] },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.universityLogo}>
              <Icon name="school" size={40} color="#DC2626" />
            </View>
            <Text style={styles.universityName}>University Campus</Text>
          </View>

          <View style={styles.photoSection}>
            <Image
              source={{ uri: currentUser.photo_url }}
              style={styles.studentPhoto}
            />
          </View>

          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{currentUser.name}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={styles.infoValue}>{currentUser.student_id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Major:</Text>
              <Text style={styles.infoValue}>{currentUser.major}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Year:</Text>
              <Text style={styles.infoValue}>{currentUser.class_year}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Icon name="verified" size={16} color="#10B981" />
            <Text style={styles.verifiedText}>Verified Student</Text>
          </View>
        </Animated.View>

        {/* Back of Card */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { transform: [{ perspective: 1000 }, { rotateY: backInterpolate }] },
          ]}
        >
          <View style={styles.qrCodeContainer}>
            <Text style={styles.qrTitle}>Student QR Code</Text>
            <View style={styles.qrCode}>
              <Icon name="qr-code-2" size={180} color="#111827" />
            </View>
            <Text style={styles.qrSubtext}>Scan for authentication</Text>
            <Text style={styles.qrId}>{currentUser.student_id}</Text>
          </View>

          <View style={styles.barcode}>
            <View style={styles.barcodeLines}>
              {[...Array(20)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.barcodeLine,
                    { width: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1 },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.barcodeNumber}>*{currentUser.student_id}*</Text>
          </View>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
        <Icon name="flip" size={24} color="#FFFFFF" />
        <Text style={styles.flipButtonText}>Flip Card</Text>
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Icon name="info-outline" size={24} color="#DC2626" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoCardTitle}>How to Use</Text>
            <Text style={styles.infoCardText}>
              Show your digital ID at campus locations or scan the QR code for
              contactless access.
            </Text>
          </View>
        </View>

        <View style={styles.quickAccessSection}>
          <Text style={styles.quickAccessTitle}>Quick Access</Text>
          <View style={styles.quickAccessButtons}>
            <TouchableOpacity style={styles.quickAccessButton}>
              <Icon name="brightness-high" size={24} color="#DC2626" />
              <Text style={styles.quickAccessText}>Brightness</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAccessButton}>
              <Icon name="share" size={24} color="#DC2626" />
              <Text style={styles.quickAccessText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAccessButton}>
              <Icon name="lock" size={24} color="#DC2626" />
              <Text style={styles.quickAccessText}>Lock</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  downloadButton: {
    padding: 8,
  },
  cardContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    height: 480,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    zIndex: 1,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  universityLogo: {
    width: 60,
    height: 60,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  universityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  studentPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#DC2626',
  },
  studentInfo: {
    marginBottom: 20,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  verifiedText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  qrCodeContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  qrCode: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 20,
  },
  qrSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  qrId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  barcode: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  barcodeLines: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'flex-end',
    gap: 2,
    marginBottom: 8,
  },
  barcodeLine: {
    height: '100%',
    backgroundColor: '#111827',
  },
  barcodeNumber: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#6B7280',
  },
  flipButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  flipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#EEF2FF',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 4,
  },
  infoCardText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  quickAccessSection: {
    marginBottom: 20,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  quickAccessButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessButton: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAccessText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
});

export default StudentIDScreen;

