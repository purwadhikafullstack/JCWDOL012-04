import Image from 'next/image';
import Link from 'next/link';

interface ProductCategory {
  id: number;
  name: string;
  description: string;
}

interface FilterSortProps {
  search: string;
  category: string;
  sort: string;
  productCategories: ProductCategory[];
  isOpenFil: boolean;
  isOpenSor: boolean;
  isOpenPri: boolean;
  isOpenCat: boolean;
  setIsOpenFil: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSor: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenPri: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenCat: React.Dispatch<React.SetStateAction<boolean>>;
  setProductCategories: React.Dispatch<React.SetStateAction<ProductCategory[]>>;
}

export const FilterSort: React.FC<FilterSortProps> = (props) => {
  return (
    <div id="filter-sort" className="flex items-center font-semibold">
      <div
        id="filter"
        className="flex items-center lg:space-x-2 cursor-pointer hover:bg-slate-200 px-[10px] py-[5px] lg:px-[15px] lg:py-[10px] duration-200 rounded-md"
        onClick={() => {
          props.setIsOpenFil(!props.isOpenFil);
          props.setIsOpenSor(false);
          props.setIsOpenPri(false);
          if (props.isOpenCat) {
            props.setIsOpenCat(false);
            props.setIsOpenFil(false);
          }
        }}
      >
        <div className="hidden lg:flex">Filter</div>
        <div className="relative w-[20px] h-[20px]">
          <Image
            src={'/images/icon/filter.png'}
            fill
            alt="filter"
            sizes="20px"
          />
        </div>
      </div>
      <div
        id="drop-filter"
        className={`${
          props.isOpenFil ? '' : 'hidden'
        } absolute flex flex-col font-normal border mt-[90px] right-[6px] lg:right-[105px] px-[20px] py-[10px] bg-[white] shadow-md rounded-md hover:bg-slate-200 cursor-pointer`}
        onClick={() => {
          props.setIsOpenFil(!props.isOpenFil);
          props.setIsOpenCat(!props.isOpenCat);
        }}
      >
        Category
      </div>
      <div
        id="drop-category"
        className={`${
          props.isOpenCat ? '' : 'hidden'
        } absolute flex flex-col font-normal border top-14 right-0 lg:right-[70px] bg-[white] shadow-md rounded-md`}
      >
        {props.productCategories.map((procat, index) => {
          return (
            <Link
              href={`?page=1&pagesize=15&search=${props.search}&category=${procat.name}`}
              key={index}
              className={`${
                procat.name === props.category
                  ? 'bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)] text-white cursor-pointer px-[20px] py-[5px]'
                  : 'hover:bg-slate-200 cursor-pointer px-[20px] py-[5px]'
              }`}
              onClick={() => {
                props.setIsOpenCat(false);
              }}
            >
              {procat.name}
            </Link>
          );
        })}
      </div>
      <div
        id="sort"
        className="flex items-center lg:space-x-2 cursor-pointer hover:bg-slate-200 px-[10px] py-[5px] lg:px-[15px] lg:py-[10px] duration-200 rounded-md"
        onClick={() => {
          props.setIsOpenSor(!props.isOpenSor);
          props.setIsOpenFil(false);
          props.setIsOpenCat(false);
          if (props.isOpenPri) {
            props.setIsOpenPri(false);
            props.setIsOpenSor(false);
          }
        }}
      >
        <div className="hidden lg:flex">Sort</div>
        <div className="relative w-[20px] h-[20px]">
          <Image src={'/images/icon/sort.png'} fill alt="sort" sizes="20px" />
        </div>
      </div>
      <div
        id="drop-sort"
        className={`${
          props.isOpenSor ? '' : 'hidden'
        } absolute flex flex-col font-normal border mt-[90px] right-0 lg:right-[18px] px-[28px] py-[10px] bg-[white] shadow-md rounded-md hover:bg-slate-200 cursor-pointer`}
        onClick={() => {
          props.setIsOpenSor(!props.isOpenSor);
          props.setIsOpenPri(!props.isOpenPri);
        }}
      >
        Price
      </div>
      <div
        id="drop-price"
        className={`${
          props.isOpenPri ? '' : 'hidden'
        } absolute flex flex-col font-normal border mt-[120px] right-[0px] bg-[white] shadow-md rounded-md`}
        onClick={() => {
          props.setIsOpenPri(false);
        }}
      >
        <Link
          href={`?page=1&pagesize=15&search=${props.search}&category=${props.category}&sort=asc`}
        >
          <div
            className={`${
              props.sort === 'asc'
                ? 'bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)] text-white cursor-pointer px-[20px] py-[5px]'
                : 'hover:bg-slate-200 cursor-pointer px-[20px] py-[5px]'
            }`}
          >
            Lowest Price
          </div>
        </Link>
        <Link
          href={`?page=1&pagesize=15&search=${props.search}&category=${props.category}&sort=desc`}
        >
          <div
            className={`${
              props.sort === 'desc'
                ? 'bg-[var(--primaryColor)] hover:bg-[var(--primaryColor)] text-white cursor-pointer px-[20px] py-[5px]'
                : 'hover:bg-slate-200 cursor-pointer px-[20px] py-[5px]'
            }`}
          >
            Highest Price
          </div>
        </Link>
      </div>
    </div>
  );
};
