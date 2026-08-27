import React, {useRef} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';

const WINDOW = Dimensions.get('window');
const FAB_SIZE = 52;
const INITIAL_X = 20;
const INITIAL_Y = WINDOW.height - 155;

function PenIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="#FFFDF5"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

type Props = {
  onPress: () => void;
};

function FloatingJournalButton({onPress}: Props) {
  const position = useRef(new Animated.ValueXY({x: INITIAL_X, y: INITIAL_Y})).current;
  const currentPos = useRef({x: INITIAL_X, y: INITIAL_Y});
  const wasDragged = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 4 || Math.abs(gs.dy) > 4,
      onPanResponderGrant: () => {
        wasDragged.current = false;
        position.setOffset(currentPos.current);
        position.setValue({x: 0, y: 0});
      },
      onPanResponderMove: (_, gs) => {
        wasDragged.current = true;
        position.x.setValue(gs.dx);
        position.y.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        position.flattenOffset();

        if (!wasDragged.current) {
          onPress();
          return;
        }

        const rawX = currentPos.current.x + gs.dx;
        const rawY = currentPos.current.y + gs.dy;
        const clampedX = Math.max(8, Math.min(WINDOW.width - FAB_SIZE - 8, rawX));
        const clampedY = Math.max(80, Math.min(WINDOW.height - 150, rawY));

        currentPos.current = {x: clampedX, y: clampedY};
        Animated.spring(position, {
          toValue: {x: clampedX, y: clampedY},
          useNativeDriver: false,
          damping: 15,
          stiffness: 200,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[styles.fab, {transform: position.getTranslateTransform()}]}
      {...panResponder.panHandlers}>
      <View style={styles.fabInner}>
        <LinearGradient
          colors={['#8B5E3C', '#5C3020', '#3E1E10']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <PenIcon />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: FAB_SIZE,
    height: FAB_SIZE,
    zIndex: 999,
  },
  fabInner: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3E1E10',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 8,
  },
});

export default FloatingJournalButton;
