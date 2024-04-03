'use client';
import { useState, useEffect } from 'react';
import { ProductsModel } from '@/model/ProductsModel';
import { ProductImagesModel } from '@/model/ProductImagesModel';
import CartApi from '@/api/cart.api.withAuth';
import ImagePlaceholder from '../image.placeholder';
import { debounce, set } from 'lodash';
import idr from '@/lib/idrCurrency';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUpdateCart } from '@/lib/cart.provider.update';
import { useAuth } from "@/lib/store/auth/auth.provider";

export default function CartAdd({ productId }: { productId: number }) {
  const updateCartContext = useUpdateCart();
  const [product, setProduct] = useState<ProductsModel>();
  const [stock, setStock] = useState<number>(-1);
  const [quantity, setQuantity] = useState<number>(1);
  const [isExceedQuantity, setIsExceedQuantity] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const auth = useAuth();
  const role = auth?.user?.data?.role;
  // const [imageLoadError, setImageLoadError] = useState(false);

  const cartApi = new CartApi();
  const debounceHandleQuantity = debounce(handleQuantity, 1000);

  useEffect(() => {
    cartApi
      .preAddToCart(productId)
      .then((response) => {
        setLoading(true);
        if (response.status) {
          setStatus(response.status);
          if (response.status === 200) {
            setProduct(response.product);
            setStock(response.stock);
            setLoading(false);
          }
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        setStatus(error.status);
        console.log(error);
      });
  }, [loading]);

  async function handleQuantity(event: React.ChangeEvent<HTMLInputElement>) {
    const qty = parseInt(event.target.value);
    // (qty < 1) ? setQuantity(1) : setQuantity(qty);
    setQuantity(qty);
  }

  useEffect(() => {
    if ((quantity > stock && stock >= 0) || quantity < 0) {
      setIsExceedQuantity(true);
    } else {
      setIsExceedQuantity(false);
    }
  }, [quantity]);

  async function handleAddToCart() {
    if (stock < 0) {
      toast.error('Failed to add to cart. Please try again later');
    } else {
      await cartApi
        .addToCart(productId, quantity)
        .then((response) => {
          setLoading(true);
          if (response.status) {
            setStatus(response.status);
            if (response.status === 200) {
              toast.success('Added to cart');
              setLoading(false);
              updateCartContext();
            }
          } else {
            console.log(response);
          }
        })
        .catch((error) => {
          toast.error(
            'Failed to add to cart. Please contact our customer service',
          );
          setStatus(error.status);
          console.log(error);
        });
    }
  }

  let basicInputBorder = 'border-2 border-[var(--primaryColor)]';
  let inputLimit = isExceedQuantity
    ? 'border-10 border-red-600'
    : basicInputBorder;

  const productImage: ProductImagesModel[] = product?.productImages ?? [];
  const primaryImagePath =
    productImage.length > 0 ? productImage[0]?.path : '/asdf';

  if (role == 'CUSTOMER') {
    return (
      <div className="m-5 p-5 border-2 border-[var(--primaryColor)] rounded-xl lg:max-w-[350px] lg:max-h-[250px] lg:min-h-fit">
        <ToastContainer />
        <div className="ml-5">
          <h1 className="text-2xl font-bold mb-5">Add to Cart</h1>
          {/* <div className='flex gap-2 items-center my-5'>
                    <ImagePlaceholder primaryImagePath={primaryImagePath} alt={product?.name ?? ""} />
                    <p className='font-medium'>{product?.name}</p>
                </div> */}
          <div className="flex gap-2 items-center mb-5">
            <input
              type="number"
              min={1}
              max={stock}
              defaultValue={quantity}
              key={quantity}
              onChange={(e) => {
                debounceHandleQuantity(e);
              }}
              className={`rounded-xl px-2 py-1 lg:max-w-20 border ${inputLimit}`}
            />
            <p className="font-medium">Stock: {stock}</p>
          </div>
          {isExceedQuantity && quantity > 0 && (
            <p className="text-red-500 ">Reached Stock Limit!</p>
          )}
          {isExceedQuantity && quantity < 0 && (
            <p className="text-red-500 ">Please Enter Valid Amount!</p>
          )}

          <div className="flex flex-col gap-2">
            {/* <div className='flex'>
                        <p className='font-medium mr-5'>Price:</p>
                        <p className='font-bold'>{idr(product?.price ?? 0)}</p>
                    </div> */}
            <div className="flex text-xl">
              <p className="font-medium mr-5">Total:</p>
              <p className="font-bold text-right ">
                {quantity > 0 && !isExceedQuantity
                  ? idr(product?.price ? product?.price * quantity : 0)
                  : '-'}
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button
              className={`bg-[var(--primaryColor)] hover:bg-[var(--primaryColor-dark)] text-white px-5 py-2 rounded-lg ${isExceedQuantity || stock === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                }`}
              disabled={isExceedQuantity || stock === 0}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (<></>);
  }
}
