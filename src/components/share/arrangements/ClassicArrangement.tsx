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

function ClassicArrangement({payload, theme, scale, textVariant}: ShareArrangementProps) {
  const s = scale;
  const content = buildShareContent(payload, theme);

  return (
    <View
      style={[
        styles.fill,
        {paddingHorizontal: 72 * s, paddingTop: 96 * s, paddingBottom: 80 * s},
      ]}>
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
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1, justifyContent: 'space-between'},
  main: {flex: 1, justifyContent: 'center', paddingVertical: 48},
});

export default ClassicArrangement;
