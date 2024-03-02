import Image from 'next/image';

export const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="relative w-[200px] h-[200px]">
        <Image src={'/images/icon/not-found.svg'} fill alt="notfound" />
      </div>
      <div className="text-center">
        Looks like your search did not match any products
      </div>
    </div>
  );
};
