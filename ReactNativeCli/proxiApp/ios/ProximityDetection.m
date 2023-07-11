//
//  ProximityDetection.m
//  proxiApp
//
//  Created by Maximilian Kaufmann on 7/10/23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(ProximityDetection, NSObject)

RCT_EXTERN_METHOD(getCurrentConnections)
RCT_EXTERN_METHOD(getConnections)
RCT_EXTERN_METHOD(isScanning)
RCT_EXTERN_METHOD(stopScan)
RCT_EXTERN_METHOD(startScan)

@end
