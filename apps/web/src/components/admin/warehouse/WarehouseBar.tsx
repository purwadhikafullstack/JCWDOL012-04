export const WarehouseBar = () => {
  return (
    <div className="font-semibold pl-[20px] md:pl-[90px] pr-[20px] justify-between w-full bg-[var(--primaryColor)] flex items-center h-[55px] rounded-md mb-5 text-white">
      <div className="flex items-center space-x-[50px] md:space-x-[140px] xl:space-x-[190px]">
        <div>Name</div>
        <div>Stock</div>
      </div>
      <div className="flex items-center space-x-10">
        <div className="hidden xl:flex">Created Date</div>
        <div className="hidden lg:flex">Updated Date</div>
      </div>
    </div>
  );
};
