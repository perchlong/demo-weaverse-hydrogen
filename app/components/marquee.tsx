import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface MarqueeProps {
  // children: React.ReactNode;
  gap?: number;
  speed?: number;
  rollAsNeeded?: boolean;
  topbarText: TrustedHTML;
  topbarText1: TrustedHTML;
}
const ANIMATION_SPEED = 100;
export function Marquee({
  // children,
  gap = 0,
  speed = ANIMATION_SPEED,
  rollAsNeeded,
  topbarText,
  topbarText1,
}: MarqueeProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (contentRef.current) {
      const { width } = contentRef.current.getBoundingClientRect();
      console.log("width", width);

      if (rollAsNeeded) {
        if (width < window.innerWidth) {
          setContentWidth(0);
        } else {
          setContentWidth(width);
        }
      } else {
        setContentWidth(width);
      }
    }
  }, []);
  const maxAnimationTime = 100000; // 100 seconds - slowest speed 0% - 0 speed
  const minAnimationTime = 1000; // 1 second - fastest speed 100% - 100 speed
  const animationTime =
    ((100 - speed) * (maxAnimationTime - minAnimationTime)) / 100 +
    minAnimationTime;
  return (
    <div
      className="flex items-center justify-center w-full h-full"
      style={
        {
          "--animation-speed": `${animationTime}ms`,
          "--gap": `${gap}px`,
        } as CSSProperties
      }
    >
      {contentWidth === 0 ? (
        <div className="relative w-full h-full ">
          <div className=" animate-flip marquee-card ">
            <div
              ref={contentRef}
              className="mx-auto marquee-front"
              dangerouslySetInnerHTML={{ __html: topbarText }}
            />
            <div
              className="mx-auto marquee-back"
              dangerouslySetInnerHTML={{ __html: topbarText1 }}
            />
          </div>
        </div>
      ) : (
        <OneView
          contentWidth={contentWidth}
          gap={gap}
          topbarText={topbarText}
          topbarText1={topbarText1}
        ></OneView>
      )}
    </div>
  );
}

function OneView({
  topbarText,
  topbarText1,
  contentWidth,
  gap,
}: {
  topbarText: TrustedHTML;
  topbarText1: TrustedHTML;
  contentWidth: number;
  gap: number;
}) {
  const [contentRepeat, setContentRepeat] = useState(0);

  const calculateRepeat = useCallback(() => {
    if (contentWidth < window.innerWidth) {
      // if it is, set the contentRepeat to the number of times the text can fit on the screen
      const repeat = Math.ceil(window.innerWidth / (contentWidth + gap));
      setContentRepeat(repeat);
    } else {
      // setContentRepeat(3);
    }
  }, [contentWidth, gap]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    calculateRepeat();
    window.addEventListener("resize", calculateRepeat);
    return () => {
      window.removeEventListener("resize", calculateRepeat);
    };
  }, []);

  return (
    <div className="flex flex-nowrap justify-center items-center w-1/2 h-full relative  ">
      <div
        className=" animate-front  whitespace-nowrap absolute left-[100%] top-1/2  "
        dangerouslySetInnerHTML={{ __html: topbarText }}
      />
      <div
        className="animate-back whitespace-nowrap  absolute left-[100%] top-1/2    "
        dangerouslySetInnerHTML={{ __html: topbarText1 }}
      />
    </div>
  );
}
