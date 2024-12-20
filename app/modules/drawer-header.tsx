import { Menu } from "@headlessui/react";
import { Link, useLocation, useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import type { SortParam } from "~/lib/filter";
import { getSortLink } from "~/lib/filter";
import {
  IconCaret,
  IconFourGrid,
  IconOneGrid,
  IconThreeGrid,
  IconTwoGrid,
} from "./icon";

type DrawerHeaderProps = {
  productNumber?: number;
  collections?: Array<{ handle: string; title: string }>;
  showSearchSort?: boolean;
  numberInRow?: number;
  onLayoutChange: (number: number) => void;
};

export function DrawerHeader({
  numberInRow,
  onLayoutChange,
  productNumber = 0,
  showSearchSort = false,
}: DrawerHeaderProps) {
  return (
    <div className="border-y border-line py-4 ">
      <div className="gap-4 md:gap-8 px-6 md:px-8 lg:px-12 flex w-full items-center justify-between">
        <div className="flex gap-2 flex-1 ">
          <div
            className={clsx(
              "border cursor-pointer hidden lg:block",
              numberInRow === 4 && " border-[#88847F]"
            )}
            onClick={() => onLayoutChange(4)}
            role="button"
          >
            <IconFourGrid className="w-12 h-12 text-[#88847F]" />
          </div>
          <div
            className={clsx(
              "border cursor-pointer hidden lg:block",
              numberInRow === 3 && " border-[#88847F]"
            )}
            onClick={() => onLayoutChange(3)}
            role="button"
          >
            <IconThreeGrid className="w-12 h-12 text-[#88847F]" />
          </div>
          <div
            className={clsx(
              "border cursor-pointer lg:hidden",
              numberInRow === 4 && "border-[#88847F]"
            )}
            onClick={() => onLayoutChange(4)}
            role="button"
          >
            <IconTwoGrid className="w-12 h-12 text-[#88847F]" />
          </div>
          <div
            className={clsx(
              "border cursor-pointer lg:hidden",
              numberInRow === 3 && "border-[#88847F]"
            )}
            onClick={() => onLayoutChange(3)}
            role="button"
          >
            <IconOneGrid className="w-12 h-12 text-[#88847F]" />
          </div>
        </div>

        <span className="flex-1 text-center uppercase text-3xl font-bold">
          {productNumber} Products
        </span>
        <div className="flex flex-1 justify-end">
          <SortMenu showSearchSort={showSearchSort} />
        </div>
      </div>
    </div>
  );
}

// const PRICE_RANGE_FILTER_DEBOUNCE = 500;

export function SortMenu({
  showSearchSort = false,
}: {
  showSearchSort?: boolean;
}) {
  const productShortItems: { label: string; key: SortParam }[] = [
    { label: "Featured", key: "featured" },
    {
      label: "Price: Low - High",
      key: "price-low-high",
    },
    {
      label: "Price: High - Low",
      key: "price-high-low",
    },
    {
      label: "Best Selling",
      key: "best-selling",
    },
    {
      label: "Newest",
      key: "newest",
    },
  ];

  const searchSortItems: { label: string; key: SortParam }[] = [
    {
      label: "Price: Low - High",
      key: "price-low-high",
    },
    {
      label: "Price: High - Low",
      key: "price-high-low",
    },
    {
      label: "Relevance",
      key: "relevance",
    },
  ];
  const items = showSearchSort ? searchSortItems : productShortItems;
  const [params] = useSearchParams();
  const location = useLocation();
  const activeItem =
    items.find((item) => item.key === params.get("sort")) || items[0];

  return (
    <Menu as="div" className="relative z-10">
      <Menu.Button className="flex items-center gap-1.5 rounded border px-4 py-3 h-[50px]">
        <span className="font-medium text-sm">Sort by</span>
        <IconCaret />
      </Menu.Button>
      <Menu.Items
        as="nav"
        className="absolute right-0 top-14 flex  h-fit w-56 flex-col gap-2 rounded border bg-background p-5"
      >
        {items.map((item) => (
          <Menu.Item key={item.label}>
            {() => (
              <Link to={getSortLink(item.key, params, location)}>
                <p
                  className={`block text-base hover:font-bold ${
                    activeItem?.key === item.key ? "font-bold" : "font-normal"
                  }`}
                >
                  {item.label}
                </p>
              </Link>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
