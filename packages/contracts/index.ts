export type CollectionHandle =
  | "classic"
  | "toolwatches"
  | "collaborations"
  | "limited-edition"
  | "accessories";

export type DialTone = "black" | "white" | "gray" | "cream" | "panda";
export type BezelStyle = "dive" | "smooth" | "coin" | "cushion";
export type CaseFinish = "steel" | "black";
export type StrapStyle = "rubber" | "leather" | "bracelet" | "suede" | "tpu";
export type StrapTone = "black" | "gray" | "steel";
export type HandStyle = "syringe" | "pencil" | "broad";
export type IndexStyle = "baton" | "arabic" | "dot";

export type WatchVisual = {
  kind: "watch";
  dial: DialTone;
  bezel: BezelStyle;
  caseFinish: CaseFinish;
  strap: StrapStyle;
  strapTone: StrapTone;
  hands: HandStyle;
  indices: IndexStyle;
  subdials?: boolean;
  gmt?: boolean;
  date?: boolean;
};

export type StrapVisual = {
  kind: "strap";
  strap: StrapStyle;
  strapTone: StrapTone;
};

export type ProductVisual = WatchVisual | StrapVisual;

export type ProductView = "front" | "dial" | "caseback" | "profile" | "strap";

export type SpecGroup = {
  title: string;
  items: string[];
};

export type ProductAddOn = {
  id: string;
  label: string;
  priceDelta: number;
  note?: string;
};

export type Product = {
  id: string;
  slug: string;
  ref: string;
  name: string;
  subtitle: string;
  price: number;
  stock: number;
  currency: string;
  edition: number | null;
  editionLabel: string;
  collection: CollectionHandle;
  collectionLabel?: string;
  category: "watches" | "accessories";
  tags: string[];
  specLabel: string;
  condition: string;
  year: number;
  setLabel: string;
  shortDescription: string;
  description: string[];
  specs: SpecGroup[];
  views: ProductView[];
  images: string[];
  sourceImage?: string;
  addOns: ProductAddOn[];
  included: string[];
  isNew: boolean;
  featured?: boolean;
  soldOut?: boolean;
  releasedAt: string;
};

export type ArchiveItem = Product & {
  archiveLabel: "SOLD OUT" | "ARCHIVED";
  archiveYear: string;
};

export type Collection = {
  handle: CollectionHandle;
  title: string;
  description: string;
  statement: string;
  previewSlug: string;
  previewView: ProductView;
};

export type CollectionWithCount = Collection & {
  count: number;
};

export type ProductFacets = {
  collections: { handle: CollectionHandle; title: string; count: number }[];
  tags: { value: string; count: number }[];
};

export type ProductListResponse = {
  items: Product[];
  total: number;
  nextCursor: string | null;
  facets: ProductFacets;
};

export type ApiError = {
  error: string;
};

export type ContactRequest = {
  name: string;
  email: string;
  subject: string;
  message: string;
  reference?: string;
};

export type ContactResponse = {
  ok: true;
  messageId: string;
};


export type OrderLineInput = {
  slug: string;
  addOnId: string | null;
  quantity: number;
};

export type OrderRequest = {
  email: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  lines: OrderLineInput[];
};

export type OrderResponse = {
  ok: true;
  orderId: string;
  total: number;
  email: string;
};
