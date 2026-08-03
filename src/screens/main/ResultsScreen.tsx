import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {HomeStackParamList} from '../../navigation/HomeStackNavigator';
import {colors} from '../../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'Results'>;

function ResultsScreen({navigation}: Props) {
  const {devotionCards, selectedFeelings, toggleSavedCard, isSaved} = useAppContext();

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.selectedText}>{selectedFeelings.join(', ')}</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>Your result</Text>
        <Text style={styles.title}>Scripture for this moment</Text>
        <Text style={styles.subtitle}>
          Receive these verses and words of encouragement for what you are carrying today.
        </Text>
      </View>

      <View style={styles.cardsSection}>
        {devotionCards.map(card => {
          const saved = isSaved(card.id);

          return (
            <View key={card.id} style={styles.devotionCard}>
              <View style={styles.devotionTopRow}>
                <Text style={styles.devotionTitle}>{card.title}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => toggleSavedCard(card)}
                  style={[styles.saveButton, saved ? styles.saveButtonActive : null]}>
                  <Text style={[styles.saveButtonText, saved ? styles.saveButtonTextActive : null]}>
                    {saved ? 'Saved' : 'Save'}
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.devotionBody}>{card.encouragement}</Text>
              <View style={styles.verseBlock}>
                <Text style={styles.verseText}>{card.verse}</Text>
                <Text style={styles.referenceText}>{card.reference}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  selectedText: {
    flex: 1,
    marginLeft: 16,
    textAlign: 'right',
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
  },
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
  cardsSection: {
    gap: 16,
  },
  devotionCard: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  devotionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  devotionTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.text,
  },
  saveButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  saveButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  saveButtonText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  saveButtonTextActive: {
    color: colors.white,
  },
  devotionBody: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.muted,
    marginBottom: 16,
  },
  verseBlock: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
  },
  verseText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 8,
  },
  referenceText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});

export default ResultsScreen;