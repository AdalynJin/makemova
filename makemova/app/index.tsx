import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AskVisual } from '@/components/AskVisual';
import { BringVisual } from '@/components/BringVisual';
import { Button } from '@/components/Button';
import { CompareVisual } from '@/components/CompareVisual';
import { type CrewCardProps } from '@/components/CrewCard';
import { CrewHelpers } from '@/components/CrewHelpers';
import { CrewLineUp } from '@/components/CrewLineUp';
import { CrewMosaic } from '@/components/CrewMosaic';
import { PublicNav } from '@/components/PublicNav';
import { HeroMate } from '@/components/HeroMate';
import { HeroTitle } from '@/components/HeroTitle';
import { MovaPuzzle } from '@/components/MovaPuzzle';
import { VersionsCard } from '@/components/VersionsCard';
import { useAuth } from '@/lib/auth';
import { asset } from '@/lib/ui';
import { opacity, radius, size, space } from '@/tokens';

type Section = 'how' | 'example' | 'plans';

/** Figma: CH00 · Welcome · Homepage v3 (Refined 11125:38701) */
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
    <View className="flex-1 bg-paper">
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
          <Plans onPlan={(name) => (name === 'Free Preview' ? start() : router.push(session ? '/account/plans' : '/create-account'))} />
        </View>
        <Faq />
        <Cta onStart={start} onExample={example} />
        <Footer onSection={jump} />
      </ScrollView>
    </View>
  );
}

function Hero({ onStart, onExample }: { onStart: () => void; onExample: () => void }) {
  return (
    <View className="overflow-hidden bg-paper" style={{ height: size.heroHeight }}>
      {/* Figma: MOVA · Decorative background / Welcome. The repeat starts at the frame top, under the nav. */}
      <CrewMosaic opacity={opacity.patternWelcome} originY={size.homeNavHeight} />
      <View
        className="bg-mateOrange"
        style={{
          position: 'absolute',
          left: size.heroArchLeft,
          top: size.heroArchTop,
          width: size.heroArch,
          height: size.heroArchHeight,
          borderTopLeftRadius: radius.arch,
          borderTopRightRadius: radius.arch,
        }}
      >
        {/* Figma: Workspace preview (11125:38771), exported with its 0 24 48 shadow. */}
        <Image
          source={asset.heroPreview}
          accessibilityLabel="Campus café ordering at Make, v2, with feedback on your screen"
          style={{
            position: 'absolute',
            left: size.heroPreviewArtLeft,
            top: size.heroPreviewArtTop,
            width: size.heroPreviewArt,
            height: size.heroPreviewArtHeight,
          }}
          contentFit="fill"
        />
      </View>
      {/* Figma: Hero · Mate looks (interactive). Mate's eyes follow the pointer; press Mate to say hi. */}
      <HeroMate />
      {/* Figma: Homepage v3 hero copy column. Each block sits at its Figma y, less the 81 nav. */}
      <View style={{ position: 'absolute', left: space[64], top: size.heroEyebrowTop }}>
        <Text className="font-bold text-eyebrow text-ink">GUIDED DESIGN PRACTICE</Text>
      </View>
      <View className="w-heroText" style={{ position: 'absolute', left: space[64], top: size.heroTitleTop }}>
        <HeroTitle />
      </View>
      <Text
        className="w-heroLead font-regular text-lead text-secondaryText"
        style={{ position: 'absolute', left: space[64], top: size.heroLeadTop }}
      >
        Upload a screenshot, compare two versions, and save why you picked one.
      </Text>
      <View className="flex-row gap-14" style={{ position: 'absolute', left: space[64], top: size.heroButtonsTop }}>
        <Button label="Create free account" size="hero" arrow onPress={onStart} />
        <Button label="Try the example project" size="hero" variant="outline" arrow onPress={onExample} />
      </View>
      <View className="flex-row items-center gap-8" style={{ position: 'absolute', left: space[64], top: size.heroNoteTop }}>
        <Image source={asset.checkInk} style={{ width: size.check, height: size.checkHeight }} />
        <Text className="font-medium text-labelUi text-secondaryText">One free critique. No card needed.</Text>
      </View>
    </View>
  );
}

const values = [
  { title: 'Follow a clear project path', body: 'Brief → Make → Revise → Reflect' },
  { title: 'Get feedback on your screen', body: 'Add a screenshot and choose one decision to work on.' },
  { title: 'Keep every version', body: 'Save each attempt and one useful takeaway.' },
];

/** Figma: Value strip (11125:38848) */
function ValueStrip() {
  return (
    <View className="justify-center gap-36 bg-white px-64" style={{ height: size.valueStripHeight }}>
      <Text className="font-bold text-headline text-ink">Get help only{'\n'}where you need it</Text>
      <View className="flex-row gap-32">
        {values.map((v) => (
          <View key={v.title} className="w-valueColumn gap-8 border-t border-border pt-32">
            <Text className="font-bold text-h4 text-ink">{v.title}</Text>
            <Text className="font-regular text-bodyLarge text-secondaryText">{v.body}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Figma: How it works steps. */
const steps: { badge: number; title: string; body: string; sub: string; subBody: string; visual: ReactNode }[] = [
  {
    badge: asset.step1,
    title: 'Bring your work',
    body: 'Start the café brief or bring your own screen.',
    sub: 'Know your next step',
    subBody: 'A brief, a stage goal, and one practical task.',
    visual: <BringVisual />,
  },
  {
    badge: asset.step2,
    title: 'Ask about one decision',
    body: 'Feedback points to your screen and explains one principle.',
    sub: 'Understand the feedback',
    subBody: 'See which part of your screen to change and why.',
    visual: <AskVisual />,
  },
  {
    badge: asset.step3,
    title: 'Compare, revise, reflect',
    body: 'Compare two directions, save your pick and why.',
    sub: 'See how you improved',
    subBody: 'Save the version you chose and one lesson for next time.',
    visual: <CompareVisual />,
  },
];

function HowItWorks() {
  return (
    <View className="gap-80 bg-paper px-64 pb-120 pt-80">
      <Text className="font-bold text-section text-ink">How a project works</Text>
      <View className="gap-120">
        {steps.map((s, i) => (
          <View key={s.title} className={`items-center justify-between ${i % 2 ? 'flex-row-reverse' : 'flex-row'}`}>
            <View className="w-stepText gap-20">
              <Image source={s.badge} style={{ width: size.stepBadge, height: size.stepBadge }} />
              <Text className="font-bold text-stepTitle text-ink">{s.title}</Text>
              <Text className="w-stepBody font-regular text-howBody text-secondaryText">{s.body}</Text>
              <View className="mt-48 w-stepBody gap-6 border-t border-border pt-24">
                <Text className="font-bold text-nav text-ink">{s.sub}</Text>
                <Text className="font-regular text-nav text-secondaryText">{s.subBody}</Text>
              </View>
            </View>
            {s.visual}
          </View>
        ))}
      </View>
    </View>
  );
}

/** Figma: Example project (11125:39110) */
function ExampleProject({ onExample }: { onExample: () => void }) {
  return (
    <View className="flex-row items-start justify-between bg-paper px-64 py-110">
      <View className="w-exampleText gap-24">
        <Text className="font-bold text-section text-ink">Look inside the{'\n'}café project</Text>
        <Text className="font-regular text-leadSmall text-secondaryText">
          Bring one screen and a goal. Every version stays saved.
        </Text>
        <View className="self-start pt-16">
          <Button label="Try the example project" variant="outline" size="hero" arrow onPress={onExample} />
        </View>
      </View>
      <VersionsCard />
    </View>
  );
}

const crew: CrewCardProps[] = [
  { name: 'Mate', tag: 'm  ·  make', body: 'Your guide. Shows the brief and the next step.', bg: 'bg-mateOrange', shape: asset.crewMate, crew: 'mate', width: size.crewCardMate, left: size.crewCardMateLeft, top: size.crewCardMateTop },
  { name: 'Versa', tag: 'v · compare', body: 'Lays two versions side by side.', bg: 'bg-versaPink', shape: asset.crewVersa, crew: 'versa', width: size.crewCardVersa, left: size.crewCardVersaLeft, top: size.crewCardVersaTop },
  { name: 'Opus', tag: 'o · teach', body: 'Explains the why behind a tip.', bg: 'bg-opusYellow', shape: asset.crewMate, crew: 'opus', width: size.crewCardOpus, left: size.crewCardOpusLeft, top: size.crewCardOpusTop },
  { name: 'Arti', tag: 'a · critique', body: 'Points out what to improve.', bg: 'bg-artiBlue', light: true, shape: asset.crewArti, crew: 'arti', width: size.crewCardArti, left: size.crewCardArtiLeft, top: size.crewCardArtiTop },
];

/** Figma: The crew (11125:39199 – 39447). Each v3 character stands on its card's ink shape. */
function CrewSection() {
  return (
    <View className="gap-56 bg-paper px-64 pb-64 pt-100">
      <Text className="font-bold text-section text-ink">Meet your{'\n'}four helpers</Text>
      <CrewHelpers crew={crew} />
      <MovaPuzzle />
    </View>
  );
}

const toolRows = [
  { name: 'Critique', body: 'Find what to improve.', price: '5 credits / new run', icon: asset.toolIconCritique },
  { name: 'Compare', body: 'View versions side by side.', price: 'Manual comparison · Free', icon: asset.toolIconCompare },
  { name: 'Tutorials', body: 'Learn a tool or principle.', price: 'Short guides · Free', icon: asset.toolIconTutorials },
];

/** Figma: Tools (11125:39448) */
function Tools() {
  return (
    <View className="flex-row justify-between bg-white px-64 py-100">
      <View className="w-column gap-20">
        <Text className="font-bold text-headline text-ink">What each{'\n'}tool costs</Text>
        <Text className="w-stepBody font-regular text-leadSmall text-secondaryText">
          You always see the cost before you run something new.
        </Text>
      </View>
      <View className="w-preview border-b border-border">
        {toolRows.map((t) => (
          <View key={t.name} className="flex-row items-center gap-28 border-t border-border py-30">
            <Image source={t.icon} style={{ width: size.toolIcon72, height: size.toolIcon72 }} />
            <View className="flex-1 gap-4">
              <Text className="font-bold text-heading text-ink">{t.name}</Text>
              <Text className="font-regular text-bodyLarge text-secondaryText">{t.body}</Text>
            </View>
            <View className="rounded-pill bg-paper px-16 py-10">
              <Text className="font-bold text-bodySmall text-ink">{t.price}</Text>
            </View>
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
    tone: 'ink' as const,
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
    tone: 'ink' as const,
    icon: asset.planStudio,
  },
];

/** Figma: Plans & AI credits (11125:39474). Plan buttons lead to Account · Plans when signed in. */
function Plans({ onPlan }: { onPlan: (name: string) => void }) {
  return (
    <View className="gap-40 bg-ink px-64 pb-80 pt-100">
      <View className="gap-20">
        <Text className="font-bold text-section text-white">Start free, add AI help{'\n'}when you need it</Text>
        <Text className="font-regular text-leadSmall text-onDarkMuted">
          Credits are only used for new AI requests. You see the price first.
        </Text>
      </View>
      <View className="mt-56 flex-row items-center gap-32">
        {plans.map((p) => {
          const yellow = p.tone === 'yellow';
          return (
            <View key={p.name} className={`w-planCard gap-12 rounded-32 p-32 ${yellow ? 'bg-opusYellow' : 'bg-ink'}`}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-10">
                  <Image source={p.icon} style={{ width: size.planDot, height: size.planDot }} contentFit="contain" />
                  <Text className={`font-bold text-cardTitle ${yellow ? 'text-ink' : 'text-white'}`}>{p.name}</Text>
                </View>
                {yellow && (
                  <View className="rounded-pill bg-ink px-12 py-4">
                    <Text className="font-bold text-labelSmall text-white">Full project</Text>
                  </View>
                )}
              </View>
              <Text className={`pt-12 font-bold text-price ${yellow ? 'text-ink' : 'text-white'}`}>{p.price}</Text>
              <Text className={`font-medium text-nav ${yellow ? 'text-ink' : 'text-onDarkMuted'}`}>{p.lead}</Text>
              <View className={`mt-8 gap-20 border-t pt-24 ${yellow ? 'border-yellowDivider' : 'border-inkDivider'}`}>
                {p.items.map((it) => (
                  <View key={it} className="flex-row items-center gap-12">
                    <Image source={yellow ? asset.checkInk : asset.checkWhite} style={{ width: size.check, height: size.checkHeight }} />
                    <Text className={`font-medium text-action ${yellow ? 'text-ink' : 'text-white'}`}>{it}</Text>
                  </View>
                ))}
              </View>
              <View className="pt-64">
                <Button
                  label={p.cta}
                  variant={yellow ? 'primary' : 'outlineOnDark'}
                  size="plan"
                  full
                  onPress={() => onPlan(p.name)}
                />
              </View>
            </View>
          );
        })}
      </View>
      <View className="flex-row items-start gap-12">
        <Image source={asset.planNote} style={{ width: size.iconSmall, height: size.iconSmall }} contentFit="contain" />
        <View className="gap-4">
          <Text className="font-bold text-action text-white">Some tools need Project Pass or Studio</Text>
          <Text className="font-regular text-labelUi text-onDarkMuted">Deeper AI tools use credits. Manual compare and notes stay free.</Text>
        </View>
      </View>
    </View>
  );
}

const faqs = [
  ['Do I need my own project?', 'No. You can start with the café project and bring your own screen any time.'],
  ['What uses credits?', 'Only new AI requests. You see the price first; manual work is free.'],
  ['Will the AI redesign my work?', 'No. It gives feedback. You make the changes.'],
  ['What do I keep at the end?', 'Every version you made, why you chose one, and a lesson for next time.'],
];

/** Figma: FAQ (11125:39526 – 39540) */
function Faq() {
  return (
    <View className="flex-row justify-between bg-paper px-64 pt-100">
      <Text className="w-column font-bold text-headline text-ink">Common{'\n'}questions</Text>
      <View className="w-visual border-b border-border">
        {faqs.map(([q, a]) => (
          <View key={q} className="gap-8 border-t border-border pb-28 pt-26">
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
    <View className="items-center gap-24 bg-paper px-64 pt-60">
      <Text className="text-center font-bold text-cta text-ink">Try the café project first</Text>
      <Text className="font-regular text-howBody text-secondaryText">Keep your projects and versions in one place.</Text>
      <View className="flex-row gap-12 pt-12">
        <Button label="Create free account" size="hero" arrow onPress={onStart} />
        <Button label="Try the example project" size="hero" variant="outline" arrow onPress={onExample} />
      </View>
      <CrewLineUp />
    </View>
  );
}

function Footer({ onSection }: { onSection: (s: Section) => void }) {
  // Figma: Footer (11125:39783). Privacy and Contact have no prototype link yet.
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
          <Text key={l} onPress={s ? () => onSection(s) : undefined} className="font-medium text-labelUi text-white">
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}
