#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface WidgetDataBridge : NSObject <RCTBridgeModule>
@end

@implementation WidgetDataBridge

RCT_EXPORT_MODULE();

static NSString *const kWidgetAppGroup = @"group.com.truthoverlies.shared";
static NSString *const kWidgetVerseKey = @"widget_verse";

static void ReloadWidgetTimelinesIfAvailable(void)
{
  if (@available(iOS 14.0, *)) {
    Class widgetCenterClass = NSClassFromString(@"WidgetCenter");
    if (widgetCenterClass == Nil) {
      return;
    }

    SEL sharedCenterSelector = NSSelectorFromString(@"sharedCenter");
    if (![widgetCenterClass respondsToSelector:sharedCenterSelector]) {
      return;
    }

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
    id center = [widgetCenterClass performSelector:sharedCenterSelector];
    SEL reloadSelector = NSSelectorFromString(@"reloadAllTimelines");
    if (center != nil && [center respondsToSelector:reloadSelector]) {
      [center performSelector:reloadSelector];
    }
#pragma clang diagnostic pop
  }
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_METHOD(setWidgetVerse:(NSString *)payloadJson)
{
  if (payloadJson == nil || payloadJson.length == 0) {
    return;
  }

  NSUserDefaults *sharedDefaults = [[NSUserDefaults alloc] initWithSuiteName:kWidgetAppGroup];
  [sharedDefaults setObject:payloadJson forKey:kWidgetVerseKey];
  [sharedDefaults synchronize];

  ReloadWidgetTimelinesIfAvailable();
}

RCT_EXPORT_METHOD(reloadTimelines)
{
  ReloadWidgetTimelinesIfAvailable();
}

@end
