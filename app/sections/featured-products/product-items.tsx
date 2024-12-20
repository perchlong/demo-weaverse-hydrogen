import { Image } from "@shopify/hydrogen";
import {
  type HydrogenComponentSchema,
  IMAGES_PLACEHOLDERS,
  useParentInstance,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import type { CSSProperties } from "react";
import { forwardRef } from "react";
import type { ButtonStyleProps } from "~/components/button";
import { Link } from "~/components/link";
import type { OverlayProps } from "~/components/overlay";
import { Overlay, overlayInputs } from "~/components/overlay";
import { getImageAspectRatio } from "~/lib/utils";
import type { FeaturedProductsLoaderData } from ".";

let variants = cva("", {
  variants: {
    gridSize: {
      3: "md:grid-cols-3",
      4: "md:grid-cols-3 lg:grid-cols-4",
      5: "md:grid-cols-3 xl:grid-cols-5",
      6: "md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6",
    },
    gap: {
      8: "md:gap-2",
      12: "md:gap-3",
      16: "md:gap-4",
      20: "md:gap-5",
      24: "md:gap-6",
      28: "md:gap-7",
      32: "md:gap-8",
    },
    borderRadius: {
      0: "",
      2: "rounded-sm",
      4: "rounded",
      6: "rounded-md",
      8: "rounded-lg",
      10: "rounded-[10px]",
      12: "rounded-xl",
      14: "rounded-[14px]",
      16: "rounded-2xl",
      18: "rounded-[18px]",
      20: "rounded-[20px]",
      22: "rounded-[22px]",
      24: "rounded-3xl",
    },
    alignment: {
      top: "items-start",
      middle: "items-center",
      bottom: "items-end",
    },
    contentPosition: {
      over: "absolute inset-0 flex flex-col justify-center z-1",
      below: "",
    },
  },
});

interface ProductItemsProps
  extends VariantProps<typeof variants>,
    OverlayProps,
    ButtonStyleProps {
  aspectRatio: "adapt" | "1/1" | "4/3" | "3/4" | "16/9";
  collectionNameColor: string;
}

let ProductItems = forwardRef<HTMLDivElement, ProductItemsProps>(
  (props, ref) => {
    let {
      gridSize,
      gap,
      aspectRatio,
      borderRadius,
      contentPosition,
      collectionNameColor,
      alignment,
      enableOverlay,
      overlayColor,
      overlayColorHover,
      overlayOpacity,
      backgroundColor,
      textColor,
      borderColor,
      backgroundColorHover,
      textColorHover,
      borderColorHover,
      ...rest
    } = props;
    let parent = useParentInstance();
    let featuredProducts: FeaturedProductsLoaderData = parent.data.loaderData;
    let products = featuredProducts?.collectionByHandle?.products?.edges;

    return (
      <div
        ref={ref}
        {...rest}
        className={clsx(
          [
            "snap-x snap-mandatory",
            "overflow-x-scroll md:overflow-x-hidden hidden-scroll scroll-px-6",
            "grid w-full grid-flow-col md:grid-flow-row justify-start gap-2",
          ],
          variants({ gridSize, gap })
        )}
      >
        {products?.map((product, ind) => (
          <div className="relative">
            <Link
              key={product.node.id + ind}
              to={`/products/${product.node.handle}?variant=${product.node.id}`}
              className="relative w-[67vw]  md:w-auto group group/overlay "
            >
              {product.node?.media.nodes && (
                <div
                  className={clsx(
                    "overflow-hidden relative",
                    variants({ borderRadius })
                  )}
                  style={{
                    aspectRatio: getImageAspectRatio(
                      product.node?.featuredImage || {},
                      aspectRatio
                    ),
                  }}
                >
                  <Image
                    data={product.node?.featuredImage}
                    width={product.node?.featuredImage?.width || 600}
                    height={product.node?.featuredImage?.height || 400}
                    sizes="(max-width: 32em) 100vw, 45vw"
                    className={clsx([
                      "w-full h-full object-cover",
                      "transition-opacity duration-300 ease-in-out group-hover:opacity-0",
                    ])}
                  />
                  <Image
                    data={product.node?.media.nodes[1].previewImage}
                    width={
                      product.node?.media.nodes[1].previewImage?.width || 600
                    }
                    height={
                      product.node?.media.nodes[1].previewImage?.height || 400
                    }
                    sizes="(max-width: 32em) 100vw, 45vw"
                    className={clsx([
                      "w-full h-full object-cover",
                      "absolute top-0 left-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100",
                    ])}
                  />
                </div>
              )}
              {contentPosition === "over" && (
                <>
                  <Overlay
                    enableOverlay={enableOverlay}
                    overlayColor={overlayColor}
                    overlayColorHover={overlayColorHover}
                    overlayOpacity={overlayOpacity}
                    className={clsx("z-0", variants({ borderRadius }))}
                  />
                </>
              )}

              <div className={clsx(variants({ alignment, contentPosition }))}>
                <div
                  style={
                    { "--col-name-color": collectionNameColor } as CSSProperties
                  }
                  className={clsx(
                    contentPosition === "over"
                      ? "text-center space-y-4 xl:space-y-7 px-4 py-16 text-[var(--col-name-color)]"
                      : "py-4"
                  )}
                >
                  {contentPosition === "over" ? (
                    <div>
                      <span>{product.node?.title}</span>
                      <div className="flex gap-2 items-center justify-center">
                        <div className="text-red-600">
                          <span>
                            {product.node?.variants.nodes[0].price.amount}
                          </span>
                          <span>
                            {product.node?.variants.nodes[0].price.currencyCode}
                          </span>
                        </div>
                        <div className=" line-through">
                          <span>
                            {
                              product.node?.variants.nodes[0].compareAtPrice
                                ?.amount
                            }
                          </span>
                          <span>
                            {
                              product.node?.variants.nodes[0].compareAtPrice
                                ?.currencyCode
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span>{product.node?.title}</span>
                      <div className="flex gap-2">
                        <div className="text-red-600">
                          <span>
                            {product.node?.variants.nodes[0].price.amount}
                          </span>
                          <span>
                            {product.node?.variants.nodes[0].price.currencyCode}
                          </span>
                        </div>
                        <div className=" line-through">
                          <span>
                            {
                              product.node?.variants.nodes[0].compareAtPrice
                                ?.amount
                            }
                          </span>
                          <span>
                            {
                              product.node?.variants.nodes[0].compareAtPrice
                                ?.currencyCode
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
            <div className=" absolute top-1 left-1  ">
              {product.node?.tags.map((tag, tid) =>
                tag.toLocaleLowerCase() === "best seller" ? (
                  <span key={tid} className="mr-1 p-1  bg-red-600">
                    {tag}
                  </span>
                ) : tag.toLocaleLowerCase() === "new release" ? (
                  <span key={tid} className="mr-1 p-1 bg-orange-400">
                    {tag}
                  </span>
                ) : (
                  <span key={tid} className="mr-1 p-1 bg-slate-200">
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

export default ProductItems;

export let schema: HydrogenComponentSchema = {
  type: "featured-products-items",
  title: "Product items",
  inspector: [
    {
      group: "Product items",
      inputs: [
        {
          type: "toggle-group",
          name: "gridSize",
          label: "Grid size (desktop)",
          configs: {
            options: [
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
              { value: "6", label: "6" },
            ],
          },
          defaultValue: "5",
        },
        {
          type: "range",
          name: "gap",
          label: "Items gap",
          configs: {
            min: 8,
            max: 32,
            step: 4,
          },
          defaultValue: 16,
        },
      ],
    },
    {
      group: "Product card",
      inputs: [
        {
          type: "heading",
          label: "Image",
        },
        {
          type: "select",
          name: "aspectRatio",
          label: "Aspect ratio",
          defaultValue: "3/4",
          configs: {
            options: [
              { value: "adapt", label: "Adapt to image" },
              { value: "1/1", label: "1/1" },
              { value: "4/3", label: "4/3" },
              { value: "3/4", label: "3/4" },
              { value: "16/9", label: "16/9" },
            ],
          },
          helpText:
            'Learn more about image <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio" target="_blank" rel="noopener noreferrer">aspect ratio</a> property.',
        },
        {
          type: "range",
          label: "Border radius",
          name: "borderRadius",
          configs: {
            min: 0,
            max: 24,
            step: 2,
            unit: "px",
          },
          defaultValue: 0,
        },
        {
          type: "heading",
          label: "Content",
        },
        {
          type: "select",
          name: "contentPosition",
          label: "Content position",
          configs: {
            options: [
              { value: "over", label: "Over image" },
              { value: "below", label: "Below image" },
            ],
          },
          defaultValue: "over",
        },
        {
          type: "select",
          name: "alignment",
          label: "Vertical alignment",
          configs: {
            options: [
              { value: "top", label: "Top" },
              { value: "middle", label: "Middle" },
              { value: "bottom", label: "Bottom" },
            ],
          },
          defaultValue: "middle",
          condition: "contentPosition.eq.over",
        },
        {
          type: "color",
          name: "collectionNameColor",
          label: "Collection name color",
          defaultValue: "#fff",
          condition: "contentPosition.eq.over",
        },

        {
          type: "heading",
          label: "Overlay",
          condition: "contentPosition.eq.over",
        },
        ...overlayInputs.map((inp) => ({
          ...inp,
          condition: "contentPosition.eq.over",
        })),
      ],
    },
  ],
};
