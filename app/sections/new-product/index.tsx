import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  HydrogenComponentSchema,
  WeaverseProduct,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { HOMEPAGE_FEATURED_PRODUCTS_QUERY } from "~/data/queries";
import type { SectionProps } from "~/components/section";

import type { HomepageFeaturedProductsQuery } from "storefrontapi.generated";
import { Section, layoutInputs } from "~/components/section";
interface NewProductsData {
  products: WeaverseProduct[];
}
export type NewProductsLoaderData = Awaited<ReturnType<typeof loader>>;

interface NewProductsProps
  extends SectionProps<NewProductsLoaderData>,
    NewProductsData {}
let NewProducts = forwardRef<HTMLElement, NewProductsProps>((props, ref) => {
  let { loaderData, children, ...rest } = props;

  return (
    <Section ref={ref} {...rest}>
      {children}
    </Section>
  );
});

export default NewProducts;

export let loader = async ({ weaverse }: ComponentLoaderArgs) => {
  let { language, country } = weaverse.storefront.i18n;
  let handle = "nEW-aRRIVALS";
  return await weaverse.storefront.query<HomepageFeaturedProductsQuery>(
    HOMEPAGE_FEATURED_PRODUCTS_QUERY,
    {
      variables: {
        handle,
        country,
        language,
      },
    }
  );
};

export let schema: HydrogenComponentSchema = {
  type: "new-products",
  title: "New products",
  childTypes: ["new-products-items", "heading", "subheading", "paragraph"],
  inspector: [
    {
      group: "Layout",
      inputs: layoutInputs.filter((i) => i.name !== "borderRadius"),
    },
  ],
  presets: {
    gap: 32,
    children: [
      { type: "heading", content: "Shop our products" },
      {
        type: "new-products-items",
        aspectRatio: "3/4",
        gridSize: "3",
        contentPosition: "over",
        collectionNameColor: "#fff",
        buttonText: "Shop now",
        enableOverlay: true,
        overlayColor: "#000",
        overlayOpacity: 30,
        backgroundColor: "#fff",
        textColor: "#000",
        borderColor: "#fff",
        backgroundColorHover: "#ffeded",
        textColorHover: "#000",
        borderColorHover: "#ffeded",
      },
    ],
  },
};
