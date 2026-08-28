import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ShareFeelingsRow, ShareVerseBlock} from '../ShareDesignParts';
import {buildShareContent, ShareArrangementProps} from '../shareDesignTypes';

function BoldCenterArrangement({payload, theme, scale}: ShareArrangementProps) {
  const s = scale;
  const content = buildShareContent(payload, theme);

  return (
    <View style={[styles.fill, {paddingHorizontal: 88 * s, paddingVertical: 96 * s}]}>
      <ShareFeelingsRow
        feelings={content.devotionFeelings}
        theme={theme}
        s={s}
        centered
        compact
      />
      <View style={styles.center}>
        {content.hasDevotion && payload.kind === 'devotion' ? (
          <Text style={[styles.title, {fontSize: 48 * s, lineHeight: 58 * s, marginBottom: 36 * s}]}>
            {payload.title}
          </Text>
        ) : null}
        <ShareVerseBlock payload={payload} content={content} s={s} centered large />
      </View>
      <Text style={[styles.footer, {fontSize: 28 * s}]}>TruthOverLies</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {flex: 1, justifyContent: 'space-between'},
  center: {flex: 1, justifyContent: 'center'},
  title: {
    fontWeight: '900',
    color: '#FFFDF5',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 6,
  },
  footer: {
    fontWeight: '900',
    color: 'rgba(255,253,245,0.8)',
    textAlign: 'center',
    letterSpacing: 1,
  },
});

export default BoldCenterArrangement;
