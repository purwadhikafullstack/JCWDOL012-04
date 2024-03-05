import ProductList from '@/components/products/ProductList';

export default function Products({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <ProductList searchParams={searchParams} />;
}
