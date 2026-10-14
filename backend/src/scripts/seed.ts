import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Drop 03 of VULT LABEL. `stock` is the number of units left across all sizes;
 * `shape` and `color` drive the drawn placeholder on the storefront until real
 * product photos exist.
 */
const DROP_03 = [
  {
    title: "Vault Hoodie",
    handle: "vault-hoodie",
    category: "Tops",
    price: 128,
    stock: 37,
    run: 120,
    sizes: ["S", "M", "L", "XL"],
    shape: "hoodie",
    color: "#2b2f35",
    description: "450 GSM brushed fleece, boxy fit.",
  },
  {
    title: "Lot Tee",
    handle: "lot-tee",
    category: "Tops",
    price: 54,
    stock: 82,
    run: 150,
    sizes: ["S", "M", "L", "XL", "XXL"],
    shape: "tee",
    color: "#e9e4d8",
    description: "280 GSM jersey, dropped shoulder.",
  },
  {
    title: "Night Shift Tee",
    handle: "night-shift-tee",
    category: "Tops",
    price: 58,
    stock: 9,
    run: 80,
    sizes: ["S", "M", "L", "XL"],
    shape: "tee",
    color: "#5a1f24",
    description: "280 GSM jersey with back print.",
  },
  {
    title: "Deposit Cargo",
    handle: "deposit-cargo",
    category: "Bottoms",
    price: 142,
    stock: 24,
    run: 60,
    sizes: ["28", "30", "32", "34", "36"],
    shape: "cargo",
    color: "#5b5f4a",
    description: "12 oz ripstop, relaxed taper.",
  },
  {
    title: "Steel Work Jacket",
    handle: "steel-work-jacket",
    category: "Outerwear",
    price: 210,
    stock: 14,
    run: 40,
    sizes: ["S", "M", "L", "XL"],
    shape: "jacket",
    color: "#7e868d",
    description: "14 oz canvas with quilted lining.",
  },
  {
    title: "Keyholder Cap",
    handle: "keyholder-cap",
    category: "Accessories",
    price: 42,
    stock: 51,
    run: 90,
    sizes: ["OS"],
    shape: "cap",
    color: "#131518",
    description: "Washed twill with a brass clasp.",
  },
  {
    title: "Lockbox Tote",
    handle: "lockbox-tote",
    category: "Accessories",
    price: 36,
    stock: 66,
    run: 100,
    sizes: ["OS"],
    shape: "tote",
    color: "#d8cfba",
    description: "16 oz canvas with an interior pocket.",
  },
  {
    title: "Combination Hoodie",
    handle: "combination-hoodie",
    category: "Tops",
    price: 134,
    stock: 0,
    run: 60,
    sizes: ["S", "M", "L", "XL"],
    shape: "hoodie",
    color: "#c9a24a",
    description: "450 GSM brushed fleece with dial embroidery.",
  },
]

/** Spread `total` units across sizes, giving the remainder to the middle sizes first. */
function splitStock(total: number, sizes: string[]) {
  const base = Math.floor(total / sizes.length)
  let extra = total % sizes.length
  const order = sizes
    .map((_, i) => i)
    .sort(
      (a, b) =>
        Math.abs(a - (sizes.length - 1) / 2) -
        Math.abs(b - (sizes.length - 1) / 2)
    )
  const counts = sizes.map(() => base)
  for (const i of order) {
    if (extra-- <= 0) {
      break
    }
    counts[i]++
  }
  return Object.fromEntries(sizes.map((s, i) => [s, counts[i]]))
}

export default async function seedVultStore({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const storeModule = container.resolve(Modules.STORE)

  const { data: existing } = await query.graph({
    entity: "product",
    fields: ["id"],
    filters: { handle: DROP_03.map((p) => p.handle) },
  })
  if (existing.length) {
    logger.info("VULT products already exist. Nothing to seed.")
    return
  }

  logger.info("Setting up the store and sales channel...")
  const [store] = await storeModule.listStores()
  let [salesChannel] = await salesChannelModule.listSalesChannels({
    name: "VULT Web Store",
  })
  if (!salesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "VULT Web Store" }] },
    })
    salesChannel = result[0]
  }
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "VULT LABEL",
        supported_currencies: [{ currency_code: "usd", is_default: true }],
        default_sales_channel_id: salesChannel.id,
      },
    },
  })

  logger.info("Creating the United States region...")
  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "United States",
          currency_code: "usd",
          countries: ["us"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })
  const region = regions[0]
  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "us", provider_id: "tp_system" }],
  })

  logger.info("Creating the warehouse and shipping...")
  const { result: locations } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "VULT Warehouse",
          address: { city: "Los Angeles", country_code: "US", address_1: "" },
        },
      ],
    },
  })
  const location = locations[0]
  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  let [shippingProfile] = await fulfillmentModule.listShippingProfiles({
    type: "default",
  })
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
    })
    shippingProfile = result[0]
  }

  const fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
    name: "VULT Warehouse shipping",
    type: "shipping",
    service_zones: [
      {
        name: "United States",
        geo_zones: [{ country_code: "us", type: "country" }],
      },
    ],
  })
  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ships in 3-5 business days.",
          code: "standard",
        },
        prices: [
          { currency_code: "usd", amount: 8, rules: [] },
          // Free shipping once the bag reaches $150
          {
            currency_code: "usd",
            amount: 0,
            rules: [{ attribute: "item_total", operator: "gte", value: 150 }],
          },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: location.id, add: [salesChannel.id] },
  })

  logger.info("Creating the storefront's publishable API key...")
  const { result: apiKeys } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        { title: "VULT storefront", type: "publishable", created_by: "" },
      ],
    },
  })
  const publishableKey = apiKeys[0]
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableKey.id, add: [salesChannel.id] },
  })

  logger.info("Creating Drop 03 products...")
  const categoryNames = [...new Set(DROP_03.map((p) => p.category))]
  const { result: categories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: categoryNames.map((name) => ({
        name,
        is_active: true,
      })),
    },
  })
  const categoryId = (name: string) =>
    categories.find((c) => c.name === name)!.id

  await createProductsWorkflow(container).run({
    input: {
      products: DROP_03.map((p, position) => ({
        title: p.title,
        handle: p.handle,
        description: p.description,
        status: ProductStatus.PUBLISHED,
        category_ids: [categoryId(p.category)],
        shipping_profile_id: shippingProfile.id,
        metadata: {
          shape: p.shape,
          color: p.color,
          run: p.run,
          drop: "03",
          position,
        },
        options: [{ title: "Size", values: p.sizes }],
        variants: p.sizes.map((size) => ({
          title: size,
          sku: `${p.handle}-${size}`.toUpperCase(),
          options: { Size: size },
          manage_inventory: true,
          prices: [{ amount: p.price, currency_code: "usd" }],
        })),
        sales_channels: [{ id: salesChannel.id }],
      })),
    },
  })

  logger.info("Stocking the warehouse...")
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })
  const stockBySku: Record<string, number> = {}
  for (const p of DROP_03) {
    const split = splitStock(p.stock, p.sizes)
    for (const size of p.sizes) {
      stockBySku[`${p.handle}-${size}`.toUpperCase()] = split[size]
    }
  }
  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems
        .filter((item) => item.sku && item.sku in stockBySku)
        .map((item) => ({
          location_id: location.id,
          inventory_item_id: item.id,
          stocked_quantity: stockBySku[item.sku!],
        })),
    },
  })

  logger.info(`Region: ${region.name} (${region.id})`)
  logger.info(`Publishable key: ${publishableKey.token}`)
  logger.info("VULT LABEL store is ready.")
}
