export const FormInput = (props: any) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={props.htmlFor}
        className="block text-sm font-semibold text-gray-600 mb-1"
      >
        {props.label}
      </label>
      <input
        type={props.type}
        id={props.id}
        name={props.name}
        onChange={props.handleChange}
        onBlur={props.handleBlur}
        value={props.values}
        className="w-full border px-3 py-2 rounded"
      />
      {props.touched && props.errors ? (
        <div className="text-red-500 text-sm">{props.errors}</div>
      ) : null}
    </div>
  );
};
