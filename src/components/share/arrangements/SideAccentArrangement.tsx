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

function SideAccentArrangement({payload, theme, scale, textVariant}: ShareArrangementProps) {
  const s = scale;
  const content = buildShareContent(payload, theme);
  const variant = textVariant === 'dark' ? 'dark' : 'light';

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.accent,
          {
            width: 12 * s,
            backgroundColor:
              textVariant === 'dark' ? theme.gradient[1] : 'rgba(255,255,255,0.35)',
          },
        ]}
      />
      <View
        style={[
          styles.content,
          {paddingHorizontal: 80 * s, paddingTop: 96 * s, paddingBottom: 80 * s},
        ]}>
        <ShareTopBadge content={content} themeLabel={theme.label} s={s} variant={variant} />
        <ShareFeelingsRow
          feelings={content.devotionFeelings}
          theme={theme}
          s={s}
          variant={variant}
        />
        <View style={styles.main}>
          <ShareDevotionBody payload={payload} s={s} variant={variant} />
          <ShareVerseBlock payload={payload} content={content} s={s} variant={variant} />
        </View>
        <ShareFooter s={s} variant={variant} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flex: 1, flexDirection: 'row'},
  accent: {height: '100%'},
  content: {flex: 1, justifyContent: 'space-between'},
  main: {flex: 1, justifyContent: 'center', paddingVertical: 48},
});

export default SideAccentArrangement;
