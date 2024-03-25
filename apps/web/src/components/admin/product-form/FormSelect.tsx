export const FormSelect = (props: any) => {
  return (
    <div className="mb-4">
      <label
        htmlFor="productCategoryId"
        className="block text-sm font-semibold text-gray-600 mb-1"
      >
        Product Category
      </label>
      <select
        id="productCategoryId"
        name="productCategoryId"
        onChange={props.handleChange}
        onBlur={props.handleBlur}
        value={props.values}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="" disabled>
          Select a category
        </option>
        {props.productCategories.map((category: any) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {props.touched && props.errors ? (
        <div className="text-red-500 text-sm">{props.errors}</div>
      ) : null}
    </div>
  );
};
