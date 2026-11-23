import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';

import { asset } from '@/lib/ui';
import { heroLook, size } from '@/tokens';

type Look = keyof typeof heroLook.offset;

/**
 * Figma: Hero · Mate looks (interactive) (11523:36622, set 11523:36009).
 * In the prototype, 32 hover zones (8 × 4) over the hero swap Mate's Look variant.
 * Here the same zone table picks the Look from the pointer position, and only the pupils move.
 * Mate keeps the last look when the pointer leaves, as the prototype does. Web only; elsewhere Mate looks ahead.
 */
export function HeroMate() {
  const box = useRef<unknown>(null);
  const [look, setLook] = useState<Look>('center');

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onMove = (e: MouseEvent) => {
      const el = box.current as unknown as HTMLElement | null;
      const hero = el?.parentElement;
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x >= r.width || y >= r.height) return;
      const col = Math.min(size.heroZoneColumns - 1, Math.floor((x / r.width) * size.heroZoneColumns));
      const row = Math.min(size.heroZoneRows - 1, Math.floor((y / r.height) * size.heroZoneRows));
      setLook(heroLook.zones[row][col]);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const [dx, dy] = heroLook.offset[look];
  return (
    <View
      ref={box as never}
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: size.heroMateArtLeft,
        top: size.heroMateArtTop,
        width: size.heroMateArt,
        height: size.heroMateArtHeight,
      }}
    >
      <Image source={asset.heroMate} style={{ width: size.heroMateArt, height: size.heroMateArtHeight }} contentFit="fill" />
      {heroLook.pupils.map(([px, py]) => (
        <View
          key={px}
          className="rounded-pill bg-ink"
          style={{ position: 'absolute', left: px + dx, top: py + dy, width: size.heroPupil, height: size.heroPupilHeight }}
        >
          <View
            className="rounded-pill bg-white"
            style={{
              position: 'absolute',
              left: heroLook.highlight[0],
              top: heroLook.highlight[1],
              width: size.heroHighlight,
              height: size.heroHighlight,
            }}
          />
        </View>
      ))}
    </View>
  );
}
