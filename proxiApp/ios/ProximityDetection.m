//
//  ProximityDetection.m
//  proxiApp
//
//  Created by Maximilian Kaufmann on 7/10/23.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(ProximityDetection, NSObject)

RCT_EXTERN_METHOD(initializeProxi:(NSString *)thisUUID recommendedUUIDs:(NSArray<NSString *> *)recommendedUUIDs connectionDistance:(NSInteger)connectionDistance)
RCT_EXTERN_METHOD(getCurrentConnections:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(testMethod:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(getConnections)
RCT_EXTERN_METHOD(isScanning:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(stopScan)
RCT_EXTERN_METHOD(startScan)

@end
