import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import Svg, {Circle, Defs, Line, RadialGradient, Stop} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const PARTICLES: {left: string; size: number; duration: number; delay: number}[] = [
  {left: '14%', size: 2.5, duration: 5800, delay: 0},
  {left: '40%', size: 4, duration: 7000, delay: 1200},
  {left: '65%', size: 3, duration: 6400, delay: 700},
  {left: '26%', size: 3.5, duration: 6800, delay: 2200},
  {left: '78%', size: 2.5, duration: 5500, delay: 1700},
  {left: '52%', size: 2, duration: 7400, delay: 3100},
];

// 12 rays: alternating thick/thin, every 30°
const RAYS = Array.from({length: 12}, (_, i) => {
  const angle = i * 30;
  const rad = (angle * Math.PI) / 180;
  return {
    x2: 180 + Math.cos(rad) * 250,
    y2: 180 + Math.sin(rad) * 250,
    major: i % 2 === 0,
  };
});

type ParticleProps = {
  left: string;
  size: number;
  duration: number;
  delay: number;
  height: number;
};

function Particle({left, size, duration, delay, height}: ParticleProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, {
          toValue: 1,
          duration,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(progress, {toValue: 0, duration: 0, useNativeDriver: true}),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [progress, duration, delay]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(height + size * 4)],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.08, 0.72, 1],
    outputRange: [0, 0.9, 0.5, 0],
  });

  const scale = progress.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0.3, 1, 0.2],
  });

  // eslint-disable-next-line react-native/no-inline-styles
  const animStyle = {
    position: 'absolute' as const,
    left,
    bottom: 12,
    width: size * 2,
    height: size * 2,
    borderRadius: size,
    backgroundColor: 'rgba(255, 215, 130, 0.9)',
    shadowColor: '#FFD080',
    shadowOpacity: 0.9 as number,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 0},
    opacity,
    transform: [{translateY}, {scale}],
  };
  // RN animated style types require a cast when mixing static + interpolated values
  return <Animated.View style={animStyle as any} />;
}

type Props = {height?: number};

export default function HeroAnimation({height = 280}: Props) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 40000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ]),
    ).start();

    // shimmer sweeps for 1s then pauses 7.5s
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.delay(7500),
        Animated.timing(shimmerAnim, {toValue: 0, duration: 0, useNativeDriver: true}),
      ]),
    ).start();
  }, [rotateAnim, pulseAnim, shimmerAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 1.35],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  const shimmerX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 480],
  });

  return (
    <View style={styles.root} pointerEvents="none">
      {/* Base gradient */}
      <LinearGradient
        colors={['#030101', '#0A0504', '#180A06', '#2D160E', '#3E1E10']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />

      {/* Rotating ray wheel — anchored to top-left corner */}
      <Animated.View style={[styles.raysWrap, {transform: [{rotate}]}]}>
        <Svg width={360} height={360} viewBox="0 0 360 360">
          {RAYS.map(({x2, y2, major}, i) => (
            <Line
              key={i}
              x1="180"
              y1="180"
              x2={x2}
              y2={y2}
              stroke={`rgba(255,200,100,${major ? 0.22 : 0.09})`}
              strokeWidth={major ? 34 : 14}
              strokeLinecap="round"
            />
          ))}
        </Svg>
      </Animated.View>

      {/* Pulsing radial glow — bottom-right quadrant */}
      <Animated.View
        style={[
          styles.glowWrap,
          {opacity: pulseOpacity, transform: [{scale: pulseScale}]},
        ]}>
        <Svg width={260} height={260} viewBox="0 0 260 260">
          <Defs>
            <RadialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFD86A" stopOpacity="1" />
              <Stop offset="45%" stopColor="#C47820" stopOpacity="0.55" />
              <Stop offset="100%" stopColor="#3A1A08" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="130" cy="130" r="130" fill="url(#heroGlow)" />
        </Svg>
      </Animated.View>

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} height={height} />
      ))}

      {/* Periodic shimmer streak */}
      <Animated.View style={[styles.shimmer, {transform: [{translateX: shimmerX}]}]}>
        <LinearGradient
          colors={[
            'rgba(255,245,210,0)',
            'rgba(255,245,210,0.07)',
            'rgba(255,245,210,0.18)',
            'rgba(255,245,210,0.07)',
            'rgba(255,245,210,0)',
          ]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  raysWrap: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 360,
    height: 360,
  },
  glowWrap: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 260,
    height: 260,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 130,
  },
});
