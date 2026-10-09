export type Category = { id: string; name: string };

export type FieldDefaults = {
  name?: string;
  categoryId?: string;
  subcategory?: string;
  price?: string;
  status?: string;
  sizes?: string;
  description?: string;
  featured?: boolean;
};

export default function ProductFields({
  categories,
  defaults = {},
}: {
  categories: Category[];
  defaults?: FieldDefaults;
}) {
  return (
    <>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required defaultValue={defaults.name} />
      </div>
      <div className="field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          required
          defaultValue={defaults.categoryId ?? ""}
        >
          <option value="" disabled>
            Choose a category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="subcategory">Type, for example Hoodies</label>
        <input
          id="subcategory"
          name="subcategory"
          defaultValue={defaults.subcategory}
        />
      </div>
      <div className="field">
        <label htmlFor="price">Price in naira</label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="1"
          defaultValue={defaults.price}
        />
        <span className="hint">Leave empty to show Message for price.</span>
      </div>
      <div className="field">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          defaultValue={defaults.status ?? "available"}
        >
          <option value="available">Available</option>
          <option value="sold_out">Sold out</option>
          <option value="ask">Ask us</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="sizes">Sizes</label>
        <input id="sizes" name="sizes" defaultValue={defaults.sizes} />
        <span className="hint">Separate with commas, for example S, M, L.</span>
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaults.description}
        />
      </div>
      <div className="checkRow">
        <input
          id="featured"
          name="featured"
          type="checkbox"
          defaultChecked={defaults.featured}
        />
        <label htmlFor="featured">Feature on the home page photo</label>
      </div>
    </>
  );
}