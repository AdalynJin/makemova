import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { PublicNav } from '@/components/PublicNav';
import { Sticker, type Crew } from '@/components/Sticker';
import { useAuth } from '@/lib/auth';
import { asset, cardShadow, softShadow } from '@/lib/ui';
import { radius, size, space } from '@/tokens';

type Section = 'how' | 'example' | 'plans';

/** Figma: Homepage (10551:4788) */
export default function Home() {
  const { session } = useAuth();
  const scroll = useRef<{ scrollTo: (o: { y: number; animated: boolean }) => void } | null>(null);
  const offsets = useRef<Record<Section, number>>({ how: 0, example: 0, plans: 0 });
  const mark = (id: Section, e: { nativeEvent: { layout: { y: number } } }) => {
    offsets.current[id] = e.nativeEvent.layout.y;
  };
  const jump = (id: Section) => scroll.current?.scrollTo({ y: offsets.current[id], animated: true });
  const start = () => router.push(session ? '/projects' : '/create-account');
  const example = () => router.push(session ? '/projects/example' : { pathname: '/sign-in', params: { project: 'example' } });

  return (
    <View className="flex-1 bg-white">
      <PublicNav variant="home" onSection={jump} />
      <ScrollView ref={scroll as never} className="flex-1">
        <Hero onStart={start} onExample={example} />
        <ValueStrip />
        <View onLayout={(event) => mark('how', event)}>
          <HowItWorks />
        </View>
        <View onLayout={(event) => mark('example', event)}>
          <ExampleProject onExample={example} />
        </View>
        <CrewSection />
        <Tools />
        <View onLayout={(event) => mark('plans', event)}>
          <Plans onStart={start} />
        </View>
        <Faq />
        <Cta onStart={start} onExample={example} />
        <Footer onSection={jump} />
      </ScrollView>
    </View>
  );
}

function Eyebrow({ children, light }: { children: string; light?: boolean }) {
  return <Text className={`font-bold text-eyebrow ${light ? 'text-onDarkMuted' : 'text-ink'}`}>{children}</Text>;
}

const path = [
  { label: 'Brief', icon: asset.shapeBrief, w: size.shape, h: size.halfCircleHeight },
  { label: 'Make', icon: asset.shapeMake, w: size.icon, h: size.triangleHeight },
  { label: 'Revise', icon: asset.shapeRevise, w: size.icon, h: size.triangleHeight },
  { label: 'Reflect', icon: asset.shapeReflect, w: size.icon, h: size.icon },
];

function Hero({ onStart, onExample }: { onStart: () => void; onExample: () => void }) {
  return (
    <View className="bg-canvas px-64 pt-64" style={{ height: size.heroHeight }}>
      <Image
        source={asset.heroArch}
        style={{
          position: 'absolute',
          left: size.heroArtLeft,
          top: size.heroArtTop,
          width: size.heroArt,
          height: size.heroArtHeight,
        }}
        contentFit="contain"
      />
      <View
        className="rounded-pill bg-guidance"
        style={{ position: 'absolute', right: space[36], top: space[36], width: size.heroDot, height: size.heroDot }}
      />
      <View className="w-heroText gap-24">
        <Eyebrow>GUIDED DESIGN PRACTICE</Eyebrow>
        <View>
          <Text className="font-bold text-hero text-ink">Learn design{'\n'}by making</Text>
          <View className="self-start">
            <View
              className="rounded-18 bg-opusYellow"
              style={{ position: 'absolute', left: -space[10], top: space[6], width: size.highlight, height: size.highlightHeight }}
            />
            <Text className="font-bold text-hero text-ink">decisions.</Text>
          </View>
        </View>
        <Text className="w-column font-regular text-lead text-secondaryText" style={{ width: size.highlight + space[64] }}>
          Bring one screen, compare two directions, and keep your reasoning.
        </Text>
        <View className="mt-24 flex-row gap-12">
          <Button label="Create free account" size="hero" arrow onPress={onStart} />
          <Button label="Try the example project" size="hero" variant="outline" arrow onPress={onExample} />
        </View>
        <View className="flex-row items-center gap-8">
          <Image source={asset.checkInk} style={{ width: size.check, height: size.checkHeight }} />
          <Text className="font-regular text-labelUi text-secondaryText">One free critique. No card needed.</Text>
        </View>
        <View className="mt-24 gap-12 border-t border-border pt-24">
          <Text className="font-semibold text-labelUi text-ink">Follow a clear project path</Text>
          <View className="flex-row items-center gap-12">
            {path.map((p, i) => (
              <View key={p.label} className="flex-row items-center gap-8">
                <Image source={p.icon} style={{ width: p.w, height: p.h }} contentFit="contain" />
                <Text className="font-medium text-nav text-ink">{p.label}</Text>
                {i < path.length - 1 && <Text className="font-medium text-nav text-secondaryText">→</Text>}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const values = [
  { icon: asset.shapeBrief, w: size.shape, h: size.halfCircleHeight, title: 'Start with one screen', body: 'Bring your own work or use the café brief. No setup needed.' },
  { icon: asset.shapeMake, w: size.shape, h: size.triangleLargeHeight, title: 'Ask about one decision', body: 'Feedback points to your screen and explains one principle.' },
  { icon: asset.shapeReflect, w: size.shape, h: size.shape, title: 'Keep your reasoning', body: 'Every version and the reason you chose it stay saved.' },
];

function ValueStrip() {
  return (
    <View className="justify-center gap-48 bg-white px-64" style={{ height: size.valueHeight }}>
      <Text className="font-bold text-headline text-ink">One project. Four stages.{'\n'}Help only where you need it.</Text>
      <View className="flex-row gap-32">
        {values.map((v) => (
          <View key={v.title} className="w-column gap-12 border-t border-border pt-20">
            <Image source={v.icon} style={{ width: v.w, height: v.h }} contentFit="contain" />
            <Text className="font-bold text-h4 text-ink">{v.title}</Text>
            <Text className="font-regular text-bodyLarge text-secondaryText">{v.body}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Chip({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <View className={`self-start rounded-pill px-14 py-6 ${dark ? 'bg-ink' : 'bg-white'}`}>
      <Text className={`font-semibold text-labelUi ${dark ? 'text-white' : 'text-ink'}`}>{children}</Text>
    </View>
  );
}

function Visual({ bg, children, sticker }: { bg: string; children: ReactNode; sticker: Crew }) {
  return (
    <View className={`w-visual h-visualHeight justify-center gap-16 overflow-hidden rounded-32 p-40 ${bg}`}>
      {children}
      <Sticker crew={sticker} size={size.crewSticker} style={{ position: 'absolute', right: space[24], top: space[24] }} />
    </View>
  );
}

const steps = [
  {
    n: 1,
    badge: 'bg-mateOrange',
    title: 'Bring your work',
    body: 'Start the café brief or bring your own screen.',
    sub: 'Know your next step',
    subBody: 'A brief, a stage goal, and one practical task.',
    visual: (
      <Visual bg="bg-mateOrange" sticker="mate">
        <View className="w-column gap-8 rounded-16 bg-white p-16" style={softShadow}>
          <Text className="font-bold text-h4 text-ink">The café brief</Text>
          <View className="flex-row gap-6">
            {['Students', 'Pickup first', '8am rush'].map((t) => (
              <View key={t} className="rounded-pill bg-chip px-10 py-4">
                <Text className="font-medium text-labelSmall text-ink">{t}</Text>
              </View>
            ))}
          </View>
        </View>
        <Image source={asset.cafe1} style={{ width: size.visualImage, height: size.visualImageHeight, borderRadius: radius[14] }} />
        <View className="flex-row gap-8">
          <Chip>↑ cafe-home-v1.png</Chip>
          <Chip dark>Goal · pickup easy to find</Chip>
        </View>
      </Visual>
    ),
  },
  {
    n: 2,
    badge: 'bg-artiBlue',
    title: 'Ask about one decision',
    body: 'Feedback points to your screen and explains one principle.',
    sub: 'Understand the feedback',
    subBody: 'AI points to your work and explains one design principle.',
    visual: (
      <Visual bg="bg-artiBlue" sticker="arti">
        <View className="flex-row items-center gap-16">
          <View className="rounded-16 bg-white p-10">
            <Image source={asset.cafe2} style={{ width: size.askImage, height: size.askImageHeight, borderRadius: radius[10] }} />
            <View
              className="h-pinDot w-pinDot items-center justify-center rounded-pill bg-versaPink"
              style={{ position: 'absolute', left: size.pinLeft, top: size.pinTop }}
            >
              <Text className="font-bold text-labelUi text-ink">1</Text>
            </View>
          </View>
          <View className="flex-1 gap-10 rounded-16 bg-ink p-16">
            <Text className="font-bold text-nav text-white">Does pickup stand out?</Text>
            <Text className="font-semibold text-labelUi text-white">Pickup reads first.</Text>
            <Text className="font-regular text-bodySmall text-onDarkMuted">
              “Order pickup” is the only filled button, so it reads first. Is “View menu” still easy to find?
            </Text>
            <View className="self-start rounded-pill bg-opusYellow px-12 py-6">
              <Text className="font-semibold text-labelSmall text-ink">You decide what to change</Text>
            </View>
          </View>
        </View>
      </Visual>
    ),
  },
  {
    n: 3,
    badge: 'bg-versaPink',
    title: 'Compare, revise, reflect',
    body: 'Compare two directions, save your pick and why.',
    sub: 'See how you improved',
    subBody: 'Compare attempts, save your reasoning, and reflect.',
    visual: (
      <Visual bg="bg-versaPink" sticker="versa">
        <View className="flex-row gap-16">
          <View className="gap-8">
            <Image source={asset.cafe2} style={{ width: size.compareThumb, height: size.compareThumbHeight, borderRadius: radius[10] }} />
            <Chip>v2 · Alternative</Chip>
          </View>
          <View className="gap-8">
            <View className="rounded-14 border-chosen border-ink">
              <Image source={asset.cafe3} style={{ width: size.compareThumb, height: size.compareThumbHeight, borderRadius: radius[10] }} />
            </View>
            <Chip dark>✓ v3 · chosen</Chip>
          </View>
        </View>
        <View className="gap-8 rounded-16 bg-white p-20">
          <Text className="font-bold text-eyebrow text-secondaryText">KEEP ONE USEFUL LESSON</Text>
          <Text className="font-medium text-lesson text-ink">
            Give one action the most contrast; make the second one quieter, not hidden.
          </Text>
        </View>
      </Visual>
    ),
  },
];

function HowItWorks() {
  return (
    <View className="gap-80 bg-canvas px-64 py-120">
      <View className="gap-20">
        <Eyebrow>HOW IT WORKS</Eyebrow>
        <Text className="font-bold text-section text-ink">A project path with help{'\n'}where you need it.</Text>
      </View>
      {steps.map((s, i) => (
        <View key={s.n} className={`items-center justify-between ${i % 2 ? 'flex-row-reverse' : 'flex-row'}`}>
          <View className="w-column gap-20">
            <View className={`h-badge w-badge items-center justify-center rounded-pill ${s.badge}`}>
              <Text className="font-bold text-h4 text-ink">{s.n}</Text>
            </View>
            <Text className="font-bold text-stepTitle text-ink">{s.title}</Text>
            <Text className="font-regular text-howBody text-secondaryText">{s.body}</Text>
            <View className="gap-6 border-t border-border pt-20">
              <Text className="font-bold text-nav text-ink">{s.sub}</Text>
              <Text className="font-regular text-nav text-secondaryText">{s.subBody}</Text>
            </View>
          </View>
          {s.visual}
        </View>
      ))}
    </View>
  );
}

function ExampleProject({ onExample }: { onExample: () => void }) {
  const thumbs = [
    { v: 'v1 · Original', src: asset.cafe1 },
    { v: 'v2 · Alternative', src: asset.cafe2 },
    { v: 'v3 · Saved revision', src: asset.cafe3 },
  ];
  return (
    <View className="flex-row items-center justify-between bg-sand px-64 py-96">
      <View className="w-column gap-24">
        <Text className="font-bold text-section text-ink">See it on a real project.</Text>
        <Text className="font-regular text-leadSmall text-secondaryText">
          Bring one screen and a goal. Every version stays saved.
        </Text>
        <View className="gap-12">
          {['Your screen and goal stay side by side', 'Feedback is pinned to what is visible', 'v1, v2 and v3 stay saved to compare'].map(
            (b) => (
              <View key={b} className="flex-row items-center gap-10">
                <Image source={asset.checkInk} style={{ width: size.check, height: size.checkHeight }} />
                <Text className="font-medium text-bodyLarge text-ink">{b}</Text>
              </View>
            ),
          )}
        </View>
        <View className="self-start">
          <Button label="Try the example project" variant="outline" size="hero" arrow onPress={onExample} />
        </View>
      </View>
      <View className="w-preview h-previewHeight gap-16 rounded-28 bg-white p-28" style={cardShadow}>
        <Sticker crew="opus" size={size.crewStickerSmall} style={{ position: 'absolute', right: -space[24], top: -space[48] }} />
        <View className="flex-row gap-12">
          {thumbs.map((t, i) => (
            <View key={t.v} className="gap-6">
              <View className={`rounded-14 bg-chip p-6 ${i === 2 ? 'border-focus border-ink' : ''}`}>
                <Image source={t.src} style={{ width: size.previewThumb - space[12], height: size.previewThumbHeight - space[12], borderRadius: radius[6] }} />
              </View>
              <Text className="font-medium text-labelSmall text-secondaryText">{t.v}</Text>
            </View>
          ))}
        </View>
        <Image source={asset.cafe3} style={{ width: size.previewMain, height: size.previewMainHeight - space[80], borderRadius: radius[14] }} />
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-labelUi text-ink">v3 · Saved revision</Text>
          <Text className="font-regular text-labelSmall text-secondaryText">Menu is outlined, pickup stays first.</Text>
        </View>
      </View>
    </View>
  );
}

const crew: { name: string; tag: string; body: string; bg: string; light?: boolean; shape?: number; sticker: Crew }[] = [
  { name: 'Mate', tag: 'm · make', body: 'Your guide. Shows the brief and the next step.', bg: 'bg-mateOrange', shape: asset.crewMate, sticker: 'mate' },
  { name: 'Versa', tag: 'v · compare', body: 'Lays two versions side by side.', bg: 'bg-versaPink', shape: asset.crewVersa, sticker: 'versa' },
  { name: 'Opus', tag: 'o · teach', body: 'Explains the why behind a tip.', bg: 'bg-opusYellow', sticker: 'opus' },
  { name: 'Arti', tag: 'a · critique', body: 'Points out what to improve.', bg: 'bg-artiBlue', light: true, shape: asset.crewArti, sticker: 'arti' },
];

function CrewSection() {
  return (
    <View className="gap-48 bg-white px-64 py-120">
      <View className="gap-20">
        <Eyebrow>MEET THE CREW</Eyebrow>
        <Text className="font-bold text-section text-ink">Four helpers.{'\n'}Each shows up at one moment.</Text>
      </View>
      <View className="flex-row gap-24">
        {crew.map((c) => (
          <View key={c.name} className={`w-crewCard h-crewCardHeight gap-8 overflow-hidden rounded-32 p-32 ${c.bg}`}>
            <Text className={`font-bold text-crewName ${c.light ? 'text-white' : 'text-ink'}`}>{c.name}</Text>
            <Text className={`font-semibold text-labelUi ${c.light ? 'text-white' : 'text-ink'}`}>{c.tag}</Text>
            <Text className={`font-regular text-nav ${c.light ? 'text-white' : 'text-ink'}`}>{c.body}</Text>
            {c.shape ? (
              <Image
                source={c.shape}
                style={{ position: 'absolute', left: size.crewShapeLeft, top: size.crewShapeTop, width: size.crewShape, height: size.crewShape }}
                contentFit="contain"
                contentPosition="top"
              />
            ) : (
              <View
                className="rounded-pill bg-ink"
                style={{ position: 'absolute', left: size.crewShapeLeft, top: size.crewShapeTop, width: size.crewShape, height: size.crewShape }}
              />
            )}
            <Sticker crew={c.sticker} size={size.crewSticker} style={{ position: 'absolute', right: space[16], top: size.crewStickerTop }} />
          </View>
        ))}
      </View>
      <Text className="font-bold text-h4 text-ink">m + o + v + a = mova. You bring the make.</Text>
    </View>
  );
}

const toolRows = [
  { name: 'Critique', body: 'Points to one part of your screen and explains one principle.', price: '5 credits / new run', bg: 'bg-critiqueIcon', icon: asset.shapeMake, w: size.shape, h: size.triangleLargeHeight },
  { name: 'Compare', body: 'Put two versions side by side and save the one you pick.', price: 'Manual comparison · Free', bg: 'bg-compareIcon', icon: asset.shapeReflect, w: size.shape, h: size.shape },
  { name: 'Tutorials', body: 'Short guides for a tool or a principle.', price: 'Short guides · Free', bg: 'bg-tutorialIcon', icon: asset.planNote, w: size.shape, h: size.triangleLargeHeight },
];

function Tools() {
  return (
    <View className="gap-40 bg-white px-64 pb-120">
      <View className="gap-12">
        <Text className="font-bold text-headline text-ink">Three tools, priced up front.</Text>
        <Text className="font-regular text-leadSmall text-secondaryText">
          You always see the cost before you run something new.
        </Text>
      </View>
      <View>
        {toolRows.map((t) => (
          <View key={t.name} className="flex-row items-center gap-24 border-t border-border py-24">
            <View className={`h-toolIcon w-toolIcon items-center justify-center rounded-pill ${t.bg}`}>
              <Image source={t.icon} style={{ width: t.w, height: t.h }} contentFit="contain" />
            </View>
            <View className="flex-1 gap-4">
              <Text className="font-bold text-h4 text-ink">{t.name}</Text>
              <Text className="font-regular text-bodyLarge text-secondaryText">{t.body}</Text>
            </View>
            <Text className="font-semibold text-nav text-ink">{t.price}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const plans = [
  {
    name: 'Free Preview',
    price: 'Free',
    lead: 'Try the first stages',
    items: ['1 included critique', 'Project setup and first-stage guidance', 'Continue with a Project Pass'],
    cta: 'Create free account',
    tone: 'raised' as const,
    icon: asset.planFree,
  },
  {
    name: 'Project Pass',
    price: 'One payment',
    lead: 'One guided project',
    items: ['4 included critiques', 'All stages, revisions and reflection', 'Extra use priced before you start'],
    cta: 'Get Project Pass',
    tone: 'yellow' as const,
    icon: asset.planPass,
  },
  {
    name: 'Studio',
    price: 'Per month',
    lead: 'Ongoing practice',
    items: ['400 credits each month', '2 active projects', 'History and decisions across projects'],
    cta: 'Choose Studio',
    tone: 'raised' as const,
    icon: asset.planStudio,
  },
];

function Plans({ onStart }: { onStart: () => void }) {
  return (
    <View className="gap-48 bg-ink px-64 py-120">
      <View className="gap-20">
        <Eyebrow light>PLANS</Eyebrow>
        <Text className="font-bold text-section text-white">Pay for one project,{'\n'}or keep practising.</Text>
      </View>
      <View className="flex-row gap-24">
        {plans.map((p) => {
          const yellow = p.tone === 'yellow';
          return (
            <View key={p.name} className={`w-planCard gap-20 rounded-32 p-32 ${yellow ? 'bg-opusYellow' : 'bg-inkRaised'}`}>
              <View className="flex-row items-center justify-between">
                <Image source={p.icon} style={{ width: size.icon, height: size.icon }} contentFit="contain" />
                {yellow && (
                  <View className="rounded-pill bg-ink px-12 py-4">
                    <Text className="font-semibold text-labelSmall text-opusYellow">Full project</Text>
                  </View>
                )}
              </View>
              <Text className={`font-semibold text-nav ${yellow ? 'text-ink' : 'text-onDarkMuted'}`}>{p.name}</Text>
              <Text className={`font-bold text-price ${yellow ? 'text-ink' : 'text-white'}`}>{p.price}</Text>
              <Text className={`font-medium text-bodyLarge ${yellow ? 'text-ink' : 'text-white'}`}>{p.lead}</Text>
              <View className={`gap-12 border-t pt-20 ${yellow ? 'border-yellowDivider' : 'border-inkDivider'}`}>
                {p.items.map((it) => (
                  <View key={it} className="flex-row items-center gap-10">
                    <Image source={yellow ? asset.checkInk : asset.checkWhite} style={{ width: size.check, height: size.checkHeight }} />
                    <Text className={`font-regular text-nav ${yellow ? 'text-ink' : 'text-onDarkMuted'}`}>{it}</Text>
                  </View>
                ))}
              </View>
              <Button
                label={p.cta}
                variant={yellow ? 'yellowInk' : 'outlineOnDark'}
                size="lg"
                full
                onPress={onStart}
              />
            </View>
          );
        })}
      </View>
      <View className="flex-row items-center justify-between rounded-24 border border-inkDivider px-32 py-24">
        <Text className="font-bold text-h4 text-white">Some tools need Project Pass or Studio</Text>
        <Text className="font-regular text-nav text-onDarkMuted">Deeper AI tools use credits. Manual compare and notes stay free.</Text>
      </View>
    </View>
  );
}

const faqs = [
  ['Do I need my own project?', 'No. Start with the café brief, or bring one screen of your own when you are ready.'],
  ['What uses credits?', 'Only AI critique. Upload, manual comparison and saved notes are free, and you see the cost before anything runs.'],
  ['Will the AI redesign my work?', 'No. It points to one part of your screen and explains one principle. You decide what to change.'],
  ['What do I keep at the end?', 'Every version, the choice you made, why you made it, and one lesson to carry forward.'],
];

function Faq() {
  return (
    <View className="flex-row justify-between bg-white px-64 py-120">
      <Text className="w-column font-bold text-headline text-ink">Questions, answered.</Text>
      <View className="w-visual">
        {faqs.map(([q, a]) => (
          <View key={q} className="gap-8 border-t border-border py-24">
            <Text className="font-bold text-h4 text-ink">{q}</Text>
            <Text className="font-regular text-bodyLarge text-secondaryText">{a}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Cta({ onStart, onExample }: { onStart: () => void; onExample: () => void }) {
  return (
    <View className="items-center gap-24 overflow-hidden bg-canvas px-64 pt-120">
      <Eyebrow>CREATE YOUR ACCOUNT</Eyebrow>
      <Text className="text-center font-bold text-cta text-ink">Start with the café project.{'\n'}No setup needed.</Text>
      <Text className="font-regular text-lead text-secondaryText">Keep your projects and versions in one place.</Text>
      <View className="flex-row gap-12 pt-12">
        <Button label="Create free account" size="hero" arrow onPress={onStart} />
        <Button label="Try the example project" size="hero" variant="outline" arrow onPress={onExample} />
      </View>
      <View className="mt-64 flex-row items-end gap-24">
        <Image source={asset.luA} style={{ width: size.lineUp, height: size.lineUpA }} />
        <Image source={asset.luB} style={{ width: size.lineUp, height: size.lineUp }} />
        <Image source={asset.luC} style={{ width: size.lineUp, height: size.lineUpC }} />
        <Image source={asset.luD} style={{ width: size.lineUp, height: size.lineUpD }} />
      </View>
    </View>
  );
}

function Footer({ onSection }: { onSection: (s: Section) => void }) {
  const links: [string, Section | null][] = [
    ['How it works', 'how'],
    ['Example project', 'example'],
    ['Plans', 'plans'],
    ['Privacy', null],
    ['Contact', null],
  ];
  return (
    <View className="h-footerHeight flex-row items-center justify-between bg-ink px-64">
      <View className="gap-6">
        <Text className="font-bold text-footerBrand text-white">makemova</Text>
        <Text className="font-regular text-labelUi text-onDarkMuted">Project-based design learning</Text>
      </View>
      <View className="flex-row gap-32">
        {links.map(([l, s]) => (
          <Text key={l} onPress={s ? () => onSection(s) : undefined} className="font-medium text-labelUi text-onDarkMuted">
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}
