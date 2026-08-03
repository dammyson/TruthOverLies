import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {colors} from '../../theme/colors';

function SavedScreen() {
  const {savedCards} = useAppContext();

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Saved</Text>
        <Text style={styles.title}>Your favorite encouragements</Text>
        <Text style={styles.subtitle}>
          Keep the verses and reflections you want to return to during the week.
        </Text>
      </View>

      {savedCards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyText}>
            Save a verse from the Home tab and it will appear here.
          </Text>
        </View>
      ) : (
        savedCards.map(card => (
          <View key={card.id} style={styles.card}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardBody}>{card.encouragement}</Text>
            <Text style={styles.cardVerse}>{card.verse}</Text>
            <Text style={styles.cardReference}>{card.reference}</Text>
          </View>
        ))
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.primaryDark,
    marginBottom: 10,
  },
  title: {
    fontSize: 31,
    lineHeight: 37,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  cardBody: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.muted,
    marginBottom: 16,
  },
  cardVerse: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 8,
  },
  cardReference: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});

export default SavedScreen;