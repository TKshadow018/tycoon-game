import { ListPlus } from "lucide-react";
import { useMemo, useState } from "react";

function InventorySection({
  inventoryItems,
  onSellItem,
  money,
  websites = [],
}) {
  const [showSold, setShowSold] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [freelanceFilter, setFreelanceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedWebsiteByItem, setSelectedWebsiteByItem] = useState({});

  const typeOptions = useMemo(
    () => [
      ...new Set(
        inventoryItems.map((item) => item.shootTypeKey).filter(Boolean),
      ),
    ],
    [inventoryItems],
  );

  const displayableInventoryItems = useMemo(
    () => inventoryItems.filter((item) => !item.uploadedWebsiteId),
    [inventoryItems],
  );

  const visibleItems = useMemo(() => {
    const nonWebsiteItems = displayableInventoryItems;

    const byVisibility = showSold
      ? nonWebsiteItems
      : nonWebsiteItems.filter((item) => !item.sold);

    const searchTerm = search.trim().toLowerCase();

    const filtered = byVisibility.filter((item) => {
      if (typeFilter !== "all" && item.shootTypeKey !== typeFilter) {
        return false;
      }

      if (statusFilter === "sold" && !item.sold) {
        return false;
      }
      if (statusFilter === "unsold" && item.sold) {
        return false;
      }

      if (freelanceFilter === "only" && !item.freelanceGig) {
        return false;
      }
      if (freelanceFilter === "none" && item.freelanceGig) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const searchable = [
        item.title,
        item.description,
        item.shootType,
        item.location?.name,
        item.freelanceGig?.companyName,
        item.models?.map((model) => model.name).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(searchTerm);
    });

    return [...filtered].sort((first, second) => {
      const firstTs =
        first.producedAtTs ||
        (first.producedAt ? Date.parse(first.producedAt) : 0);
      const secondTs =
        second.producedAtTs ||
        (second.producedAt ? Date.parse(second.producedAt) : 0);

      switch (sortBy) {
        case "date-asc":
          return firstTs - secondTs;
        case "grade-desc":
          return (second.grade || 0) - (first.grade || 0);
        case "grade-asc":
          return (first.grade || 0) - (second.grade || 0);
        case "gross-desc":
          return (second.grossRevenue || 0) - (first.grossRevenue || 0);
        case "gross-asc":
          return (first.grossRevenue || 0) - (second.grossRevenue || 0);
        case "net-desc":
          return (second.netProfit || 0) - (first.netProfit || 0);
        case "net-asc":
          return (first.netProfit || 0) - (second.netProfit || 0);
        case "title-asc":
          return first.title.localeCompare(second.title);
        case "title-desc":
          return second.title.localeCompare(first.title);
        default:
          return secondTs - firstTs;
      }
    });
  }, [
    displayableInventoryItems,
    freelanceFilter,
    search,
    showSold,
    sortBy,
    statusFilter,
    typeFilter,
  ]);

  return (
    <article className="pc-card">
      <div className="pc-card-head">
        <h2>
          <ListPlus size={16} /> Inventory
        </h2>
        <button
          type="button"
          className="pc-toggle-btn"
          onClick={() => setShowSold((current) => !current)}
        >
          {showSold ? "Hide Sold" : "Show Sold"}
        </button>
      </div>

      <div className="pc-inventory-toolbar">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search title, model, location, company..."
        />

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
        >
          <option value="all">All Types</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All Status</option>
          <option value="unsold">Unsold</option>
          <option value="sold">Sold</option>
        </select>

        <select
          value={freelanceFilter}
          onChange={(event) => setFreelanceFilter(event.target.value)}
        >
          <option value="all">All Projects</option>
          <option value="only">Freelance Only</option>
          <option value="none">Non-Freelance</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="date-desc">Sort: Newest</option>
          <option value="date-asc">Sort: Oldest</option>
          <option value="grade-desc">Sort: Grade High-Low</option>
          <option value="grade-asc">Sort: Grade Low-High</option>
          <option value="gross-desc">Sort: Gross High-Low</option>
          <option value="gross-asc">Sort: Gross Low-High</option>
          <option value="net-desc">Sort: Net High-Low</option>
          <option value="net-asc">Sort: Net Low-High</option>
          <option value="title-asc">Sort: Title A-Z</option>
          <option value="title-desc">Sort: Title Z-A</option>
        </select>
      </div>

      <p className="pc-muted">
        Showing {visibleItems.length} of {displayableInventoryItems.length} items.
      </p>

      <div className="pc-scroll-lg">
        {visibleItems.length === 0 && (
          <p className="pc-muted">No visible inventory items.</p>
        )}
        {visibleItems.map((item) => (
          <div key={item.id} className="pc-inventory-item">
            {item.coverImageUrl && (
              <div className="pc-inventory-cover-wrap">
                <img
                  src={item.coverImageUrl}
                  alt={`${item.title} cover`}
                  className="pc-inventory-cover"
                />
              </div>
            )}
            <div className="pc-inventory-item-content">
              <strong>{item.title}</strong>
              <p>
                Type: {item.shootType} · Day: {item.day} · Grade: {item.grade}
              </p>
              <p>
                Date:{" "}
                {item.producedAt
                  ? new Date(item.producedAt).toLocaleString()
                  : "N/A"}
              </p>
              <p>Description: {item.description}</p>
              <p>Models: {item.models.map((model) => model.name).join(", ")}</p>
              {item.models?.length > 0 && (
                <div className="pc-cast-strip">
                  {item.models.map((model) => (
                    <figure
                      key={`${item.id}-${model.id}`}
                      className="pc-cast-chip"
                      title={model.name}
                    >
                      <img src={model.imageUrl} alt={model.name} />
                      <figcaption>{model.name}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
              <p>
                Staff:{" "}
                {item.staff
                  .map((staff) => `${staff.category}:${staff.name}`)
                  .join(" | ")}
              </p>
              <p>
                Location: {item.location.name} · Service: {item.service.label} ·
                Dress: {item.dressPartner.name}
              </p>
              <p>
                Gross: {money(item.grossRevenue)} · Cost:{" "}
                {money(item.operatingCost)} · Net: {money(item.netProfit)}
              </p>
              {item.freelanceGig && (
                <p>
                  Freelance: {item.freelanceGig.companyName} · Bonus{" "}
                  {money(item.freelanceGig.payout)}
                </p>
              )}
              <p>
                Status:{" "}
                {item.sold
                  ? `Sold (${item.soldChannel}) on day ${item.soldDay}`
                  : "Unsold"}
              </p>
              {!item.sold && (
                <div className="pc-actions pc-actions-wrap">
                  {item.saleOffers?.company && (
                    <button
                      className="pc-sell-company"
                      onClick={() => onSellItem(item.id, "company")}
                    >
                      Sell To {item.saleOffers.company.name} = Offer{" "}
                      {money(item.saleOffers.company.offer)}
                    </button>
                  )}
                  {item.saleOffers?.individual && (
                    <button
                      className="pc-sell-individual"
                      onClick={() => onSellItem(item.id, "individual")}
                    >
                      Sell To {item.saleOffers.individual.name} = Offer{" "}
                      {money(item.saleOffers.individual.offer)}
                    </button>
                  )}
                  {item.saleOffers?.sponsor && item.freelanceGig && (
                    <button
                      className="pc-sell-sponsor"
                      onClick={() => onSellItem(item.id, "sponsor")}
                    >
                      Sell To {item.saleOffers.sponsor.name} = Offer{" "}
                      {money(item.saleOffers.sponsor.offer)}
                    </button>
                  )}
                  {websites.length > 0 && (
                    <>
                      <select
                        className="pc-website-select"
                        value={selectedWebsiteByItem[item.id] || websites[0].id}
                        onChange={(event) =>
                          setSelectedWebsiteByItem((current) => ({
                            ...current,
                            [item.id]: event.target.value,
                          }))
                        }
                      >
                        {websites.map((site) => (
                          <option key={site.id} value={site.id}>
                            {site.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="pc-sell-website"
                        onClick={() =>
                          onSellItem(item.id, "website", {
                            websiteId:
                              selectedWebsiteByItem[item.id] || websites[0].id,
                          })
                        }
                      >
                        Upload To Website (Free)
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default InventorySection;
