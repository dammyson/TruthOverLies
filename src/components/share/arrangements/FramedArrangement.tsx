import React from 'react';
import {StyleSheet, View} from 'react-native';

import {
  ShareDevotionBody,
  ShareFeelingsRow,
  ShareFooter,
  ShareTopBadge,
  ShareVerseBlock,
} from '../ShareDesignParts';
import {buildShareContent, ShareArrangementProps} from '../shareDesignTypes';

function FramedArrangement({payload, theme, scale, textVariant}: ShareArrangementProps) {
  const s = scale;
  const content = buildShareContent(payload, theme);

  return (
    <View
      style={[
        styles.frame,
        {
          margin: 48 * s,
          borderWidth: 3 * s,
          paddingHorizontal: 56 * s,
          paddingTop: 72 * s,
          paddingBottom: 64 * s,
        },
      ]}>
      <View style={[styles.innerFrame, {borderWidth: 1 * s, padding: 8 * s}]}>
        <View style={styles.content}>
          <ShareTopBadge content={content} themeLabel={theme.label} s={s} variant={textVariant} />
          <ShareFeelingsRow
            feelings={content.devotionFeelings}
            theme={theme}
            s={s}
            variant={textVariant}
          />
          <View style={styles.main}>
            <ShareDevotionBody payload={payload} s={s} variant={textVariant} />
            <ShareVerseBlock payload={payload} content={content} s={s} variant={textVariant} />
          </View>
          <ShareFooter s={s} variant={textVariant} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    borderColor: 'rgba(255,253,245,0.45)',
  },
  innerFrame: {
    flex: 1,
    borderColor: 'rgba(255,253,245,0.18)',
  },
  content: {flex: 1, justifyContent: 'space-between'},
  main: {flex: 1, justifyContent: 'center', paddingVertical: 32},
});

export default FramedArrangement;
