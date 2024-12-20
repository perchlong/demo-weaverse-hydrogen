import { useThemeSettings } from "@weaverse/hydrogen";
import { Children, useEffect } from "react";
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

  if (!topbarText) return null;

  return (
    <div
      id="announcement-bar"
      className="text-center z-50 flex items-center justify-center  w-full h-full"
      style={{
        height: `${topbarHeight}px`,
        backgroundColor: topbarBgColor,
        color: topbarTextColor,
      }}
    >
      <Marquee
        key={`${topbarText}${enableScrolling}`}
        speed={scrollingSpeed}
        gap={scrollingGap}
        rollAsNeeded={!enableScrolling}
        topbarText={topbarText}
        topbarText1={topbarText1}
      ></Marquee>
    </div>
  );
}
