import ShippingAddress from "@/components/cart/shipping/shipping.address";
import ShippingProducts from "@/components/cart/shipping/shipping.products";
import ShippingSummary from "@/components/cart/shipping/shipping.summary";

export default function Shipment() {
    return (
        <div className="bg-gray-200">
            <div className="m-auto px-[20px] pt-[24px] pb-[80px] lg:min-h[200px] lg:min-w-[1024px] lg:max-w-[1240px]">
                <h1 className="text-2xl leading-relaxed font-extrabold mb-[24px]">Shipment</h1>
                <div className="relative flex items-start gap-[24px] box-border text-sm">
                    <div className="lg:w-[calc(100%-384px)] box-border">
                        <ShippingAddress />
                        <ShippingProducts />
                    </div>
                    <ShippingSummary />
                </div>
            </div>
        </div>
    )
}