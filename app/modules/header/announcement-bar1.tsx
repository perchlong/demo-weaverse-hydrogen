import { useThemeSettings } from "@weaverse/hydrogen";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Marquee } from "~/components/marquee";

export function AnnouncementBar() {
  let themeSettings = useThemeSettings();

  let {
    topbarText,
    topbarText1,
    topbarHeight,
    topbarTextColor,
    topbarBgColor,
    enableScrolling,
    scrollingGap,
    scrollingSpeed,
  } = themeSettings;

  function updateStyles() {
    document.body.style.setProperty(
      "--topbar-height",
      `${Math.max(topbarHeight - window.scrollY, 0)}px`
    );
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    updateStyles();
    window.addEventListener("scroll", updateStyles);
    return () => window.removeEventListener("scroll", updateStyles);
  }, []);

  const maxAnimationTime = 100000; // 100 seconds - slowest speed 0% - 0 speed
  const minAnimationTime = 1000; // 1 second - fastest speed 100% - 100 speed
  const animationTime =
    ((100 - scrollingSpeed) * (maxAnimationTime - minAnimationTime)) / 100 +
    minAnimationTime;
  const animationDelay =
    ((100 - scrollingSpeed) * (maxAnimationTime - minAnimationTime)) / 100 +
    minAnimationTime;
  if (!topbarText && !topbarText1) return null;

  return (
    <>
      {enableScrolling ? (
        <div
          id="announcement-bar"
          style={
            {
              height: `${topbarHeight}px`,
              backgroundColor: topbarBgColor,
              color: topbarTextColor,
              "--animation-speed": `${animationTime}ms`,
            } as CSSProperties
          }
          className="text-center w-full   z-50 flex items-center justify-center relative overflow-x-hidden"
        >
          <span
            className="animate-marquee"
            dangerouslySetInnerHTML={{ __html: topbarText }}
          />
          <span
            className="animate-marquee1 "
            style={
              { "--animation-delay": `${animationDelay}ms` } as CSSProperties
            }
            dangerouslySetInnerHTML={{ __html: topbarText1 }}
          />
        </div>
      ) : (
        <div
          id="announcement-bar"
          className="text-center w-full  z-50 flex items-center justify-center relative overflow-x-hidden"
          style={
            {
              height: `${topbarHeight}px`,
              backgroundColor: topbarBgColor,
              color: topbarTextColor,
              gap: `${scrollingGap}px`,
            } as CSSProperties
          }
        >
          <div dangerouslySetInnerHTML={{ __html: topbarText }} />
          <div dangerouslySetInnerHTML={{ __html: topbarText1 }} />
        </div>
      )}
    </>
  );
}
