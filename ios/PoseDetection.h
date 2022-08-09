//
//  PoseDetection.h
//  posedetection
//
//  Created by Łukasz Kurant on 08/08/2022.
//

#ifndef PoseDetection_h
#define PoseDetection_h

#include <Foundation/Foundation.h>
#import <UIKit/UIImage.h>
#import <CoreMedia/CMSampleBuffer.h>
#import <VisionCamera/Frame.h>

@interface PoseDetection: NSObject
+ (NSDictionary *)findPose:(Frame *)frame;
@end

#endif /* PoseDetection_h */
