import React, {useCallback} from 'react';
import {Pressable, StyleProp, Text, TextStyle} from 'react-native';
import {useBibleNav} from '../context/BibleNavContext';
import {resolveReferenceToBibleTarget} from '../utils/verseNavigation';

type Props = {
  reference: string; // e.g. "John 14:18" or "Psalm 103:2"
  style?: StyleProp<TextStyle>;
  onBeforeNavigate?: () => void;
};

function VerseLink({reference, style, onBeforeNavigate}: Props) {
  const {navigateTo} = useBibleNav();

  const handlePress = useCallback(async () => {
    try {
      const target = await resolveReferenceToBibleTarget(reference);
      if (!target) return;

      onBeforeNavigate?.();
      navigateTo(target);
    } catch {}
  }, [reference, navigateTo, onBeforeNavigate]);

  return (
    <Pressable onPress={handlePress} hitSlop={8}>
      <Text style={style}>{reference}</Text>
    </Pressable>
  );
}

export default VerseLink;
