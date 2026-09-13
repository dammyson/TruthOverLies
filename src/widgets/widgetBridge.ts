import {NativeModules, Platform} from 'react-native';

type VersePayload = {
  text: string;
  reference: string;
};

type WidgetDataBridgeModule = {
  setWidgetVerse?: (payloadJson: string) => void;
  reloadTimelines?: () => void;
};

const APP_GROUP = 'group.com.truthoverlies.shared';
const BRIDGE = NativeModules.WidgetDataBridge as WidgetDataBridgeModule | undefined;

export function getWidgetAppGroup(): string {
  return APP_GROUP;
}

export function syncVerseToWidget(verse: VersePayload): void {
  if (Platform.OS !== 'ios') {
    return;
  }

  const payload = JSON.stringify({
    text: verse.text,
    reference: verse.reference,
    updatedAt: new Date().toISOString(),
  });

  try {
    BRIDGE?.setWidgetVerse?.(payload);
    BRIDGE?.reloadTimelines?.();
  } catch {
    // Keep app flow resilient even if native bridge isn't wired yet.
  }
}
