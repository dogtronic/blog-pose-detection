import React, {useEffect} from 'react';
import 'react-native-reanimated';
import {Dimensions, Platform, StyleSheet, useWindowDimensions} from 'react-native';
import {Camera, useFrameProcessor, useCameraDevices} from 'react-native-vision-camera';
import {useSharedValue, useAnimatedStyle} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import Svg, {Line} from 'react-native-svg';

const AnimatedLine = Animated.createAnimatedComponent(Line);

const usePosition = (pose, valueName1, valueName2) => {
  return useAnimatedStyle(
    () => ({
      x1: pose.value[valueName1].x,
      y1: pose.value[valueName1].y,
      x2: pose.value[valueName2].x,
      y2: pose.value[valueName2].y,
    }),
    [pose],
  );
};

export function objectDetect(frame) {
  'worklet';
  return __poseDetection(frame);
}

const defaultPose = {
  leftShoulder: {x: 0, y: 0},
  rightShoulder: {x: 0, y: 0},
  leftElbow: {x: 0, y: 0},
  rightElbow: {x: 0, y: 0},
  leftWrist: {x: 0, y: 0},
  rightWrist: {x: 0, y: 0},
  leftHip: {x: 0, y: 0},
  rightHip: {x: 0, y: 0},
  leftKnee: {x: 0, y: 0},
  rightKnee: {x: 0, y: 0},
  leftAnkle: {x: 0, y: 0},
  rightAnkle: {x: 0, y: 0},
};

function App() {
  const pose = useSharedValue(defaultPose);

  const leftWristToElbowPosition = usePosition(pose, 'leftWrist', 'leftElbow');
  const leftElbowToShoulderPosition = usePosition(pose, 'leftElbow', 'leftShoulder');
  const leftShoulderToHipPosition = usePosition(pose, 'leftShoulder', 'leftHip');
  const leftHipToKneePosition = usePosition(pose, 'leftHip', 'leftKnee');
  const leftKneeToAnklePosition = usePosition(pose, 'leftKnee', 'leftAnkle');

  const rightWristToElbowPosition = usePosition(pose, 'rightWrist', 'rightElbow');
  const rightElbowToShoulderPosition = usePosition(pose, 'rightElbow', 'rightShoulder');
  const rightShoulderToHipPosition = usePosition(pose, 'rightShoulder', 'rightHip');
  const rightHipToKneePosition = usePosition(pose, 'rightHip', 'rightKnee');
  const rightKneeToAnklePosition = usePosition(pose, 'rightKnee', 'rightAnkle');

  const shoulderToShoulderPosition = usePosition(pose, 'leftShoulder', 'rightShoulder');
  const hipToHipPosition = usePosition(pose, 'leftHip', 'rightHip');

  const dimensions = useWindowDimensions();

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const poseObject = objectDetect(frame);

    const xFactor = dimensions.width / frame.width;
    const yFactor = dimensions.height / frame.height;

    const poseCopy = {
      leftShoulder: {x: 0, y: 0},
      rightShoulder: {x: 0, y: 0},
      leftElbow: {x: 0, y: 0},
      rightElbow: {x: 0, y: 0},
      leftWrist: {x: 0, y: 0},
      rightWrist: {x: 0, y: 0},
      leftHip: {x: 0, y: 0},
      rightHip: {x: 0, y: 0},
      leftKnee: {x: 0, y: 0},
      rightKnee: {x: 0, y: 0},
      leftAnkle: {x: 0, y: 0},
      rightAnkle: {x: 0, y: 0},
    };

    Object.keys(poseObject).forEach(v => {
      poseCopy[v] = {
        x: poseObject[v].x * xFactor,
        y: poseObject[v].y * yFactor,
      };
    });

    pose.value = poseCopy;
  }, []);

  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    const checkPermissions = async () => {
      await Camera.requestCameraPermission();
    };
    checkPermissions();
  }, []);

  if (device == null) {
    return null;
  }

  return (
    <>
      <Camera
        frameProcessor={frameProcessor}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        orientation="portrait"
        frameProcessorFps={15}
      />
      <Svg
        height={Dimensions.get('window').height}
        width={Dimensions.get('window').width}
        style={styles.linesContainer}>
        <AnimatedLine animatedProps={leftWristToElbowPosition} stroke="red" strokeWidth="2" />
        <AnimatedLine animatedProps={leftElbowToShoulderPosition} stroke="red" strokeWidth="2" />
        <AnimatedLine animatedProps={leftShoulderToHipPosition} stroke="red" strokeWidth="2" />
        <AnimatedLine animatedProps={leftHipToKneePosition} stroke="red" strokeWidth="2" />
        <AnimatedLine animatedProps={leftKneeToAnklePosition} stroke="red" strokeWidth="2" />
        <AnimatedLine animatedProps={rightWristToElbowPosition} stroke="red" strokeWidth="2" />
        <AnimatedLine animatedProps={rightElbowToShoulderPosition} stroke="red" strokeWidth="2" />
        <AnimatedLine animatedProps={rightShoulderToHipPosition} stroke="red" strokeWidth="2" />
        <AnimatedLine animatedProps={rightHipToKneePosition} stroke="red" strokeWidth="2" />
        <AnimatedLine animatedProps={rightKneeToAnklePosition} stroke="red" strokeWidth="2" />
        <AnimatedLine animatedProps={shoulderToShoulderPosition} stroke="red" strokeWidth="2" />
        <AnimatedLine animatedProps={hipToHipPosition} stroke="red" strokeWidth="2" />
      </Svg>
    </>
  );
}

export default App;

const styles = StyleSheet.create({
  linesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});
