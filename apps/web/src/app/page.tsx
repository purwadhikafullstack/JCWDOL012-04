import ProductList from '@/components/products/ProductList';

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <ProductList searchParams={searchParams} />
    </>
  );
}
