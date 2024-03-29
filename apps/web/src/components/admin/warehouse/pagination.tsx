import Link from 'next/link';
import Image from 'next/image';

export const Pagination = (props: any) => {
  return (
    <div
      id="pagination"
      className="flex items-center mx-auto mt-10 border border-slate-300 rounded"
    >
      <Link
        href={`?page=${Number(props.page) - 1}&pageSize=15`}
        className={`${
          Number(props.page) < 2 ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <div className="px-[8px] cursor-pointer hover:opacity-70">
          <div className="relative w-[15px] h-[15px]">
            <Image src={'/images/icon/left-arrow.png'} fill alt="left" />
          </div>
        </div>
      </Link>
      <div className="bg-white text-black border-r border-l w-[30px] text-center pointer-events-none">
        {props.page}
      </div>
      <Link
        href={`?page=${Number(props.page) + 1}&pageSize=15`}
        className={`${
          props.hasNextPage ? '' : 'opacity-50 pointer-events-none'
        }`}
      >
        <div className="px-[8px] cursor-pointer hover:opacity-70">
          <div className="relative w-[15px] h-[15px]">
            <Image src={'/images/icon/right-arrow.png'} fill alt="left" />
          </div>
        </div>
      </Link>
    </div>
  );
};
