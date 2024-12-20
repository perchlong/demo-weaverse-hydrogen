import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionInspector } from "~/components/section";
import type { SectionProps } from "~/components/section";
type QuoteProps = SectionProps;

let Quote = forwardRef<HTMLElement, QuoteProps>((props, ref) => {
  let { children, ...rest } = props;

  return (
    <Section ref={ref} {...rest}>
      {children}
    </Section>
  );
});

export default Quote;
export let schema: HydrogenComponentSchema = {
  type: "quotes",
  title: "Quotes",
  childTypes: ["subheading", "heading", "paragraph"],
  inspector: sectionInspector,
  presets: {
    children: [
      {
        type: "heading",
        content: "Quotes",
      },
      {
        type: "paragraph",
        content:
          "We are a team of passionate people whose goal is to improve everyone's life through disruptive products. We build great products to solve your business problems.",
      },
    ],
  },
};
