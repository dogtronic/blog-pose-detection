//
//  PoseDetection.m
//  posedetection
//
//  Created by Łukasz Kurant on 08/08/2022.
//

#import <Foundation/Foundation.h>
#import "PoseDetection.h"
#import <UIKit/UIImage.h>
#import <CoreMedia/CMSampleBuffer.h>
#import <VisionCamera/Frame.h>
#import <MLKit.h>
#import <AVFoundation/AVCaptureDevice.h>

@implementation PoseDetection : NSObject

+ (NSDictionary *)findPose:(Frame *)frame {
  CMSampleBufferRef buffer = frame.buffer;
  UIImageOrientation orientation = frame.orientation;

  MLKPoseDetectorOptions *options = [[MLKPoseDetectorOptions alloc] init];
  options.detectorMode = MLKPoseDetectorModeStream;
  
  MLKPoseDetector *poseDetector =
      [MLKPoseDetector poseDetectorWithOptions:options];

  MLKVisionImage *image = [[MLKVisionImage alloc] initWithBuffer:buffer];
  image.orientation = orientation;

  NSError *error;
  NSArray *poses = [poseDetector resultsInImage:image error:&error];
  
  if (error != nil) {
    // Error.
    return @{};
  }
  
  if (poses.count == 0) {
    // No pose detected.
    return @{};
  }
  
  for (MLKPose *pose in poses) {
    return @{
      @"leftShoulder": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftShoulder]],
      @"rightShoulder": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightShoulder]],
      @"leftElbow": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftElbow]],
      @"rightElbow": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightElbow]],
      @"leftWrist": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftWrist]],
      @"rightWrist": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightWrist]],
      @"leftHip": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftHip]],
      @"rightHip": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightHip]],
      @"leftKnee": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftKnee]],
      @"rightKnee": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightKnee]],
      @"leftAnkle": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeLeftAnkle]],
      @"rightAnkle": [self getLandmarkPosition:[pose landmarkOfType:MLKPoseLandmarkTypeRightAnkle]],
    };
  }
  
  return @{};
}

+ (NSDictionary *)getLandmarkPosition:(MLKPoseLandmark *)landmark {
  MLKVision3DPoint *position = landmark.position;
  return @{
    @"x": [NSNumber numberWithDouble:position.x],
    @"y": [NSNumber numberWithDouble:position.y]
  };
}

@end
