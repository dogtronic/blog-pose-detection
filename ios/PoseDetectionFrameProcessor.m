#import <Foundation/Foundation.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/Frame.h>
#import "PoseDetection.h"

@interface PoseDetectionFrameProcessor : NSObject
@end

@implementation PoseDetectionFrameProcessor

static inline id poseDetection(Frame* frame, NSArray* args) {
  CMSampleBufferRef buffer = frame.buffer;
  UIImageOrientation orientation = frame.orientation;
  
  return [PoseDetection findPose:frame];
}

VISION_EXPORT_FRAME_PROCESSOR(poseDetection)

@end
