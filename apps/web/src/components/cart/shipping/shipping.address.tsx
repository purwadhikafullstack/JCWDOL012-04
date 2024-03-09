'use client'
import LocationIcon from "@/components/location.icon";
import { useState, useEffect } from "react";
import { UserCitiesModel } from "@/model/UserCitiesModel";
import TransactionApi from "@/api/transaction.user.api";

//butuh users beserta userCities yang berkaitan
export default function ShippingAddress() {
    const [address, setAddress] = useState([] as UserCitiesModel[]);
    const transactionApi = new TransactionApi();
    useEffect(() => {
        transactionApi.getAddress().then((response) => {
            setAddress(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    const primaryAddress = address.find((address) => address.isPrimaryAddress === true)?? address[0];
    return (
        <div className="flex flex-col p-8 lg:p-[24px] gap-[16px] bg-white rounded-xl lg:mb-[16px]">
            <h1 className="m-0 font-extrabold text-gray-500">Shipping Address</h1>
            <div className="flex gap-[4px]">
                <LocationIcon />
                <p>user name</p>
            </div>
            <p>{primaryAddress.address}</p>
            <button className="flex text-sm font-semibold box-border border-2 border-gray-500 hover:border-[var(--lightPurple)] text-gray-500 hover:text-[var(--lightPurple)] rounded-xl py-[4px] px-[16px] max-w-fit">Change Address</button>
        </div>
    )
}