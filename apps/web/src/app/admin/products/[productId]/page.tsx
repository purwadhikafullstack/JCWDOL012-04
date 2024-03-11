interface ProductDetailProps {
  params: {
    productId: string;
  };
}

export default function ProductDetails({ params }: ProductDetailProps) {
  return (
    <div>
      <div>product {params.productId}</div>
    </div>
  );
}
