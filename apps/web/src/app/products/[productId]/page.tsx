interface ProductDetailsProps {
  params: {
    productId: string;
  };
}

export default function ProductDetails({ params }: ProductDetailsProps) {
  return (
    <>
      <div>ini produk {params.productId}</div>
    </>
  );
}
