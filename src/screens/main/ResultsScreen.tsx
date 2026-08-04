import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import {HomeStackParamList} from '../../navigation/HomeStackNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'Results'>;

function ResultsScreen({navigation}: Props) {
  const {devotionCards, selectedFeelings, toggleSavedCard, isSaved} = useAppContext();
  const {colors} = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        },
        backButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        },
        backArrow: {
          fontSize: 18,
          lineHeight: 22,
          color: colors.primaryDark,
          marginTop: -1,
        },
        selectedText: {
          flex: 1,
          marginLeft: 12,
          textAlign: 'right',
          fontSize: 12,
          lineHeight: 16,
          color: colors.muted,
        },
        header: {
          marginBottom: 16,
        },
        eyebrow: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: colors.primaryDark,
          marginBottom: 6,
        },
        title: {
          fontSize: 24,
          lineHeight: 30,
          fontWeight: '800',
          color: colors.text,
          marginBottom: 6,
        },
        subtitle: {
          fontSize: 14,
          lineHeight: 20,
          color: colors.muted,
        },
        cardsSection: {
          gap: 12,
        },
        devotionCard: {
          backgroundColor: colors.surfaceStrong,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 14,
        },
        devotionTopRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          gap: 10,
        },
        devotionTitle: {
          flex: 1,
          fontSize: 16,
          lineHeight: 22,
          fontWeight: '800',
          color: colors.text,
        },
        saveButton: {
          borderRadius: 999,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 10,
          paddingVertical: 6,
          backgroundColor: colors.surface,
        },
        saveButtonActive: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        saveButtonText: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        saveButtonTextActive: {
          color: colors.white,
        },
        devotionBody: {
          fontSize: 14,
          lineHeight: 22,
          color: colors.muted,
          marginBottom: 12,
        },
        verseBlock: {
          backgroundColor: colors.surface,
          borderRadius: 14,
          padding: 12,
        },
        verseText: {
          fontSize: 14,
          lineHeight: 22,
          color: colors.text,
          marginBottom: 6,
        },
        referenceText: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '700',
          color: colors.primaryDark,
        },
      }),
    [colors],
  );

  return (
    <ScreenShell>
      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
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

export default ResultsScreen;
