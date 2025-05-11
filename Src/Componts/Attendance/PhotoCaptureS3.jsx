import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// ====================== Professional Button Component ======================
const ProButton = ({ icon, label, colors, onPress, disabled = false }) => {
  const scaleValue = new Animated.Value(1);
  const [isPressed, setIsPressed] = useState(false);

  const animatePress = (toValue) => {
    Animated.spring(scaleValue, {
      toValue,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        onPressIn={() => {
          animatePress(0.96);
          setIsPressed(true);
        }}
        onPressOut={() => {
          animatePress(1);
          setIsPressed(false);
        }}
        onPress={onPress}
        activeOpacity={0.9}
        disabled={disabled}
        delayPressIn={0}
        delayPressOut={0}
      >
        <LinearGradient
          colors={isPressed ? [colors[1], colors[0]] : colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.proButton, disabled && styles.disabledButton]}
        >
          <Icon name={icon} size={22} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.proButtonText}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ====================== Photo Card Component ======================
const PhotoCard = ({ index, uri, onRemove }) => {
  return (
    <View style={styles.photoCard}>
      <Image source={{ uri }} style={styles.photoCardImage} />
      <View style={styles.photoCardOverlay}>
        <Text style={styles.photoCardText}>#{index + 1}</Text>
      </View>
    </View>
  );
};

// ====================== Main Component ======================
const ProfessionalPhotoCapture = () => {
  const camera = useRef(null);
  const navigation = useNavigation();
 const route = useRoute();
  const device = useCameraDevice('front');
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress] = useState(new Animated.Value(0));

  const instructions = [
    'Look straight into the camera',
    'Tilt head slightly right',
    'Now tilt to the left',
    'Smile naturally',
    'Neutral expression',
  ];

  // useEffect(() => {
  //   (async () => {
  //     const permission = await Camera.requestCameraPermission();
      
  //     console.log('Camera permission:', permission);
      
  //     if (permission !== 'authorized') {
  //       Alert.alert('Permission Required', 'Camera access is needed to capture photos');
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: ((currentStep + 1) / 5) * 100,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const capturePhoto = async () => {
    if (isCapturing || capturedPhotos.length >= 5) return;

    setIsCapturing(true);
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
        qualityPrioritization: 'quality',
      });

      const newPhotophotoPath = `file://${photo.path}`;
      const fileName = photo.path.split('/').pop();
      const fileType = 'image/jpeg'; // or infer from fileName
      const newPhoto = {
        uri: newPhotophotoPath,
        fileName,
        fileType,
      };
      const newPhotos = [...capturedPhotos, newPhoto];

      setCapturedPhotos(newPhotos);
      setCurrentStep(Math.min(currentStep + 1, 4));

      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 800));

      if (newPhotos.length === 5) {
        setTimeout(() => {
          setCameraVisible(false);
          Alert.alert(
            'Capture Complete',
            'All 5 photos have been captured successfully',
            [
              {
                text: 'Submit',
                onPress: handleSubmit,
              },
              {
                text: 'Continue Editing',
                style: 'cancel',
              },
            ]
          );
        }, 1000);
      }
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  };

 const handleGalleryPick = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.9,
    selectionLimit: 5 - capturedPhotos.length,
  });

  if (result.assets) {
    const newPhotos = result.assets.map(asset => ({
      uri: asset.uri,
      fileName: asset.fileName,
      fileType: asset.type,
    }));

    const updatedPhotos = [...capturedPhotos, ...newPhotos].slice(0, 5);
    setCapturedPhotos(updatedPhotos);
    setCurrentStep(Math.min(updatedPhotos.length - 1, 4));
  }
};


  const resetCapture = () => {
    // Clean up temporary photo files
    capturedPhotos.forEach(async (photo) => {
      try {
        const path = photo.uri.replace('file://', '');
        await RNFS.unlink(path);
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    });
    
    setCapturedPhotos([]);
    setCurrentStep(0);
  };

  const startGuidedCapture = () => {
    resetCapture();
    setCameraVisible(true);
  };

  const handleSubmit = () => {
    const onPhotosSubmit = route.params?.onPhotosSubmit;
  
    if (capturedPhotos.length === 0) {
      Alert.alert('No Photos', 'Please capture or select at least one photo before submitting.');
      return;
    }
  
    if (onPhotosSubmit) {
      onPhotosSubmit(capturedPhotos); // array of { uri, fileName, fileType }
    }
  
    navigation.goBack();
  };
  

  const progressInterpolated = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.proContainer}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.backgroundGradient}
      >
        <ScrollView contentContainerStyle={styles.proScrollContainer}>
          {/* Header */}
          <View style={styles.proHeader}>
            <Text style={styles.proTitle}>Professional Photo Capture</Text>
            <Text style={styles.proSubtitle}>
              {capturedPhotos.length}/5 photos captured
            </Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[styles.progressFill, { width: progressInterpolated }]}
              />
            </View>
            <Text style={styles.progressText}>
              {20 * capturedPhotos.length}% complete
            </Text>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.sectionTitle}>Capture Instructions</Text>
            {instructions.map((instruction, index) => (
              <View
                key={index}
                style={[
                  styles.instructionItem,
                  index <= currentStep && styles.activeInstruction,
                  index === currentStep && styles.currentInstruction,
                ]}
              >
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Photo Preview */}
          {/* {capturedPhotos.length > 0 && (
            <View style={styles.photoGridContainer}>
              <Text style={styles.sectionTitle}>Your Photos</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photoGrid}
              >
                {capturedPhotos.map((uri, index) => (
                  <PhotoCard key={index} index={index} uri={uri} />
                ))}
                {Array(5 - capturedPhotos.length)
                  .fill(0)
                  .map((_, index) => (
                    <View key={`empty-${index}`} style={styles.emptyPhotoCard}>
                      <Icon name="photo-camera" size={30} color="#adb5bd" />
                    </View>
                  ))}
              </ScrollView>
            </View>
          )} */}

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <ProButton
              icon="camera"
              label={capturedPhotos.length === 5 ? 'Retake All' : 'Start Capture'}
              colors={['#4361ee', '#3a0ca3']}
              onPress={startGuidedCapture}
            />
            <ProButton
              icon="photo-library"
              label="Add from Gallery"
              colors={['#7209b7', '#560bad']}
              onPress={handleGalleryPick}
              disabled={capturedPhotos.length >= 5}
            />
            {capturedPhotos.length > 0 && (
              <ProButton
                icon="check"
                label="Submit Photos"
                colors={['#2b8a3e', '#2f9e44']}
                onPress={handleSubmit}
              />
            )}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Camera Modal */}
      <Modal visible={isCameraVisible} animationType="slide" statusBarTranslucent>
        <View style={styles.cameraFullscreen}>
          {device ? (
            <>
              <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isCameraVisible}
                photo
                orientation="portrait"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent', 'transparent', 'rgba(0,0,0,0.7)']}
                locations={[0, 0.2, 0.8, 1]}
                style={styles.cameraOverlay}
              >
                <View style={styles.cameraHeader}>
                  <TouchableOpacity
                    onPress={() => setCameraVisible(false)}
                    style={styles.closeButton}
                  >
                    <Icon name="close" size={28} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.cameraStepText}>
                    Step {currentStep + 1} of 5
                  </Text>
                </View>
                <View style={styles.cameraInstructionBox}>
                  <Text style={styles.cameraInstructionText}>
                    {instructions[currentStep]}
                  </Text>
                </View>
                <View style={styles.captureButtonContainer}>
                  <TouchableOpacity
                    onPress={capturePhoto}
                    disabled={isCapturing}
                    activeOpacity={0.7}
                    style={styles.captureButton}
                  >
                    <View
                      style={[
                        styles.captureButtonOuter,
                        isCapturing && styles.captureButtonActive,
                      ]}
                    >
                      <View style={styles.captureButtonInner}>
                        {isCapturing ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Icon name="camera" size={32} color="#fff" />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </>
          ) : (
            <View style={styles.cameraError}>
              <Text style={styles.cameraErrorText}>No camera device available</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

// ====================== Professional Styles ======================
const styles = StyleSheet.create({
  proContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundGradient: {
    flex: 1,
  },
  proScrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  proHeader: {
    marginBottom: 30,
    alignItems: 'center',
  },
  proTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  proSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4361ee',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'right',
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 16,
    marginTop: 8,
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    opacity: 0.6,
  },
  activeInstruction: {
    opacity: 0.9,
  },
  currentInstruction: {
    opacity: 1,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontWeight: '600',
    color: '#495057',
    fontSize: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  photoGridContainer: {
    marginBottom: 24,
  },
  photoGrid: {
    paddingBottom: 10,
  },
  photoCard: {
    width: 120,
    height: 160,
    borderRadius: 10,
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f1f3f5',
  },
  photoCardImage: {
    width: '100%',
    height: '100%',
  },
  photoCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  photoCardText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyPhotoCard: {
    width: 120,
    height: 160,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
  },
  buttonGroup: {
    marginTop: 16,
  },
  proButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  proButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  cameraFullscreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 40,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    padding: 8,
  },
  cameraStepText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraInstructionBox: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 40,
    borderRadius: 20,
    alignSelf: 'center',
  },
  cameraInstructionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  captureButtonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    padding: 4,
  },
  captureButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonActive: {
    backgroundColor: 'rgba(67, 97, 238, 0.7)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4361ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraErrorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default ProfessionalPhotoCapture;