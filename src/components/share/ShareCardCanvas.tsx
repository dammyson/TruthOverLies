import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {ShareCardPayload} from '../../types/share';
import ShareBackgroundLayer from './ShareBackgroundLayer';
import {getShareBackground} from './shareBackgroundCatalog';
import {ShareArrangementId} from './shareArrangementCatalog';
import {renderShareArrangement} from './shareArrangementRegistry';
import {resolveShareTheme} from './shareColorCatalog';
import {ShareTextVariant} from './shareBackgroundCatalog';
import {
  SHARE_CAPTURE_QUALITY,
  SHARE_CARD_HEIGHT,
  SHARE_CARD_WIDTH,
} from './shareDesignTypes';

export {SHARE_CAPTURE_QUALITY, SHARE_CARD_HEIGHT, SHARE_CARD_WIDTH};

type Props = {
  payload: ShareCardPayload;
  backgroundId: string;
  colorPaletteId: string;
  arrangementId: ShareArrangementId;
  scale?: number;
  customPhotoUri?: string | null;
};

function textVariantForSelection(
  backgroundId: string,
  arrangementId: ShareArrangementId,
): ShareTextVariant {
  const background = getShareBackground(backgroundId);
  if (arrangementId === 'bold-center' || arrangementId === 'framed') {
    return 'light';
  }
  if (background.kind === 'png') {
    return 'light';
  }
  return background.textVariant;
}

function ShareCardCanvas({
  payload,
  backgroundId,
  colorPaletteId,
  arrangementId,
  scale = 1,
  customPhotoUri,
}: Props) {
  const theme = useMemo(
    () => resolveShareTheme(payload, colorPaletteId),
    [payload, colorPaletteId],
  );

  const background = getShareBackground(backgroundId);
  const textVariant = textVariantForSelection(backgroundId, arrangementId);
  const width = SHARE_CARD_WIDTH * scale;
  const height = SHARE_CARD_HEIGHT * scale;

  return (
    <View style={[styles.root, {width, height}]} collapsable={false}>
      <ShareBackgroundLayer
        background={background}
        theme={theme}
        scale={scale}
        customImageUri={customPhotoUri}
      />
      {renderShareArrangement(arrangementId, {payload, theme, scale, textVariant})}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {overflow: 'hidden'},
});

export default ShareCardCanvas;
