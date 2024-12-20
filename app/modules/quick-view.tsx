import { useFetcher } from "@remix-run/react";
import type { Jsonify } from "@remix-run/server-runtime/dist/jsonify";
import { Money, ShopPayButton } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import type { ProductData } from "~/lib/products";
import { getExcerpt } from "~/lib/utils";
import { ProductDetail } from "~/sections/product-information/product-detail";
import { AddToCartButton } from "./add-to-cart-button";
import { Button } from "./button";
import { Modal } from "./modal";
import { ProductMedia } from "./product-form/product-media";
import { Quantity } from "./product-form/quantity";
import { ProductVariants } from "./product-form/variants";
import { cn } from "~/lib/cn";
export function QuickView(props: { data: Jsonify<ProductData> }) {
  const { data } = props;

  let themeSettings = useThemeSettings();
  let swatches = themeSettings?.swatches || {
    configs: [],
    swatches: {
      imageSwatches: [],
      colorSwatches: [],
    },
  };
  let { product, variants: _variants, storeDomain, shop } = data || {};

  let [selectedVariant, setSelectedVariant] = useState<any>(
    product?.selectedVariant
  );

  let variants = _variants?.product?.variants;
  let [quantity, setQuantity] = useState<number>(1);
  let {
    addToCartText,
    soldOutText,
    unavailableText,
    showShippingPolicy,
    showRefundPolicy,
    hideUnavailableOptions,
    showThumbnails,
  } = themeSettings;
  let handleSelectedVariantChange = (variant: any) => {
    setSelectedVariant(variant);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (variants?.nodes?.length) {
      if (!selectedVariant) {
        setSelectedVariant(variants?.nodes?.[0]);
      } else if (selectedVariant?.id !== product?.selectedVariant?.id) {
        setSelectedVariant(product?.selectedVariant);
      }
    }
  }, [product?.id]);

  const { shippingPolicy, refundPolicy } = shop;
  // @ts-expect-error
  const { title, descriptionHtml } = product;
  let atcText = selectedVariant?.availableForSale
    ? addToCartText
    : selectedVariant?.quantityAvailable === -1
    ? unavailableText
    : soldOutText;
  return (
    <div className="p-10 rounded-md bg-background w-[80vw] max-w-[1200px]">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-12">
        <ProductMedia
          mediaLayout="slider"
          // @ts-expect-error
          media={product?.media.nodes}
          selectedVariant={selectedVariant}
          showThumbnails={showThumbnails}
        />
        <div className="flex flex-col justify-start space-y-5">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-medium tracking-tighter sm:text-5xl">
                {title}
              </h2>
            </div>
            <p className="text-xl md:text-2xl/relaxed lg:text-2xl/relaxed xl:text-3xl/relaxed flex gap-3">
              {selectedVariant ? (
                <Money
                  withoutTrailingZeros
                  data={selectedVariant.price}
                  as="span"
                />
              ) : null}
              {selectedVariant?.compareAtPrice && (
                <Money
                  withoutTrailingZeros
                  data={selectedVariant.compareAtPrice}
                  className={cn(
                    "text-label-sale opacity-50 line-through text-[var(--color-compare-price-text)]"
                  )}
                  as="span"
                />
              )}
            </p>
            <ProductVariants
              // @ts-expect-error
              product={product}
              // @ts-expect-error
              options={product?.options}
              // @ts-expect-error
              handle={product?.handle}
              selectedVariant={selectedVariant}
              onSelectedVariantChange={handleSelectedVariantChange}
              swatches={swatches}
              variants={variants}
              hideUnavailableOptions={hideUnavailableOptions}
            />
          </div>
          <Quantity value={quantity} onChange={setQuantity} />
          <AddToCartButton
            disabled={!selectedVariant?.availableForSale}
            lines={[
              {
                merchandiseId: selectedVariant?.id,
                quantity,
                selectedVariant,
              },
            ]}
            data-test="add-to-cart"
            className="w-full"
          >
            {atcText}
          </AddToCartButton>
          {selectedVariant?.availableForSale && (
            <ShopPayButton
              width="100%"
              variantIdsAndQuantities={[
                {
                  id: selectedVariant?.id,
                  quantity,
                },
              ]}
              storeDomain={storeDomain}
            />
          )}
          <p
            className="max-w-[600px] leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: descriptionHtml,
            }}
          />
          <div className="grid gap-4 py-4">
            {showShippingPolicy && shippingPolicy?.body && (
              <ProductDetail
                title="Shipping"
                content={getExcerpt(shippingPolicy.body)}
                learnMore={`/policies/${shippingPolicy.handle}`}
              />
            )}
            {showRefundPolicy && refundPolicy?.body && (
              <ProductDetail
                title="Returns"
                content={getExcerpt(refundPolicy.body)}
                learnMore={`/policies/${refundPolicy.handle}`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuickViewTrigger(props: { productHandle: string }) {
  let [quickAddOpen, setQuickAddOpen] = useState(false);
  const { productHandle } = props;
  let { load, data, state } = useFetcher<ProductData>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (quickAddOpen && !data && state !== "loading") {
      load(`/api/query/products?handle=${productHandle}`);
    }
  }, [quickAddOpen, data, load, state]);

  return (
    <>
      <div className=" absolute bottom-0 hidden lg:group-hover:block  w-full  bg-inherit ">
        <Button
          onClick={(e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickAddOpen(true);
          }}
          loading={state === "loading"}
          className="w-full uppercase"
        >
          Select options
        </Button>
      </div>
      {quickAddOpen && data && (
        <Modal cancelLink="" onClose={() => setQuickAddOpen(false)}>
          <QuickView data={data} />
        </Modal>
      )}
    </>
  );
}
