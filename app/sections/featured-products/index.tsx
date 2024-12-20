import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  HydrogenComponentSchema,
  WeaverseProduct,
} from "@weaverse/hydrogen";
import type { SectionProps } from "~/components/section";
import { Section, layoutInputs } from "~/components/section";
import { forwardRef } from "react";
import type { HomepageFeaturedProductsQuery } from "storefrontapi.generated";
import { HOMEPAGE_FEATURED_PRODUCTS_QUERY } from "~/data/queries";
import { ProductSwimlane } from "~/modules/product-swimlane";

interface FeaturedProductsData {
  products: WeaverseProduct[];
}
export type FeaturedProductsLoaderData = Awaited<ReturnType<typeof loader>>;

interface FeaturedProductsProps
  extends SectionProps<FeaturedProductsLoaderData>,
    FeaturedProductsData {}
let FeaturedProducts = forwardRef<HTMLElement, FeaturedProductsProps>(
  (props, ref) => {
    let { loaderData, children, ...rest } = props;

    return (
      <Section ref={ref} {...rest}>
        {children}
      </Section>
    );
  }
);

export default FeaturedProducts;

export let loader = async ({ weaverse }: ComponentLoaderArgs) => {
  let { language, country } = weaverse.storefront.i18n;
  let handle = "featured-products";
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
  type: "featured-products",
  title: "Featured products",
  childTypes: ["featured-products-items", "heading", "subheading", "paragraph"],
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
        type: "featured-products-items",
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
