import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import MessageBanner from '../../components/MessageBanner';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenShell from '../../components/ScreenShell';
import {feelingOptions} from '../../data/devotions';
import {useAppContext} from '../../context/AppContext';
import useTransitionAction from '../../hooks/useTransitionAction';
import {HomeStackParamList} from '../../navigation/HomeStackNavigator';
import {colors} from '../../theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

function HomeScreen({navigation}: Props) {
  const {
    authMessage,
    authMessageTone,
    clearAuthMessage,
    selectedFeelings,
    toggleFeeling,
    generateDevotions,
  } = useAppContext();
  const {isTransitioning, runWithTransition} = useTransitionAction();

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Today's encouragement</Text>
        <Text style={styles.title}>How are you feeling today?</Text>
        <Text style={styles.subtitle}>
          Choose up to 4 feelings and receive a short encouragement with one or two verses.
        </Text>
      </View>

      <MessageBanner message={authMessage} tone={authMessageTone} />

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Select feelings</Text>
          <Text style={styles.counter}>{selectedFeelings.length}/4</Text>
        </View>
        <View style={styles.feelingsWrap}>
          {feelingOptions.map(feeling => {
            const active = selectedFeelings.includes(feeling);

            return (
              <Pressable
                accessibilityRole="button"
                key={feeling}
                onPress={() => {
                  clearAuthMessage();
                  toggleFeeling(feeling);
                }}
                style={[styles.feelingChip, active ? styles.feelingChipActive : null]}>
                <Text style={[styles.feelingText, active ? styles.feelingTextActive : null]}>
                  {feeling}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <PrimaryButton
          label="Continue"
          loading={isTransitioning}
          onPress={() => {
            runWithTransition(() => {
              const generated = generateDevotions();

              if (generated) {
                navigation.navigate('Results');
              }
            });
          }}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
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
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 24,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  panelTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.text,
  },
  counter: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  feelingsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  feelingChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
  },
  feelingChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  feelingText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  feelingTextActive: {
    color: colors.white,
  },
});

export default HomeScreen;