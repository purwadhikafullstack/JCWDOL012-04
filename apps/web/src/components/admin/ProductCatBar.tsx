import Link from 'next/link';
import Image from 'next/image';

export const ProductCatBar = ({
  page,
  pageSize,
  sort,
  hasNextPage,
}: {
  page: string;
  pageSize: string;
  sort: string;
  hasNextPage: boolean;
}) => {
  return (
    <div
      id="product-categories-bar"
      className="sticky top-0 md:top-[-32px] z-10 bg-gradient-to-r from-violet-500 to-fuchsia-500 font-semibold text-white mt-[30px] mx-auto h-[60px] flex items-center justify-between space-x-10 shadow-md w-[320px] md:w-[500px] lg:w-[670px] xl:w-[1000px] 2xl:w-[1120px] rounded-md px-[30px]"
    >
      <div className="flex items-center">
        <div className="w-[50px] md:w-[140px] lg:w-[200px]">Category</div>
        <div className="hidden md:flex lg:w-[200px] xl:w-[400px] truncate">
          Description
        </div>
      </div>
      <div className="flex items-center space-x-[27px]">
        <div className="hidden xl:flex">Products</div>
        <Link href={`?sort=${sort === 'asc' ? 'desc' : 'asc'}`}>
          <div className="relative w-[27px] h-[24px]">
            <Image src={'/images/icon/alphabetical.png'} fill alt="sort" />
          </div>
        </Link>
        <div
          id="pagination"
          className="flex items-center border border-slate-300 rounded"
        >
          <Link
            href={`?page=${Number(page) - 1}&pageSize=${pageSize}&sort=${sort}`}
            className={`${
              Number(page) < 2 ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <div className="px-[8px] cursor-pointer hover:opacity-70">
              <div className="relative w-[15px] h-[15px]">
                <Image src={'/images/icon/left-arrow.png'} fill alt="left" />
              </div>
            </div>
          </Link>
          <div className="bg-white text-black border-r border-l w-[30px] text-center pointer-events-none">
            {page}
          </div>
          <Link
            href={`?page=${Number(page) + 1}&pageSize=${pageSize}&sort=${sort}`}
            className={`${hasNextPage ? '' : 'opacity-50 pointer-events-none'}`}
          >
            <div className="px-[8px] cursor-pointer hover:opacity-70">
              <div className="relative w-[15px] h-[15px]">
                <Image src={'/images/icon/right-arrow.png'} fill alt="left" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
