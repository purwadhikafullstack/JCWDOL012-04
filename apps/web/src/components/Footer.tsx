"use client"

import Link from "next/link";
import Image from "next/image";
import { PiInstagramLogoLight, PiTiktokLogoLight, PiPhoneLight, PiEnvelopeLight, PiWhatsappLogoLight } from "react-icons/pi";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export const Footer = (
  {
    hideLogo = false,
    hideFollowUs = false,
    hideContactUs = false
  }: {
    hideLogo?: boolean;
    hideFollowUs?: boolean;
    hideContactUs?: boolean;

  }) => {

  const path = usePathname();

  if (path.includes("/admin")) return null;

  return (
    <main className="flex pt-4 w-full items-center justify-center border-t-[1px] text-xs">
      <div className="flex flex-col gap-5 justify-between w-full px-6 py-6 md:flex-row md:max-w-screen-xl	">
        <div className={clsx("flex flex-col gap-2", { "hidden": hideLogo })}>
          <Image src="/images/palugada-icon.png" alt="Palugada Logo" width={150} height={200} />
          <h1 className="text-xl mt-1 ">We've got all your needs.</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-11">
          <div className={clsx("flex flex-col gap-2", { "hidden": hideFollowUs })}>
            <h1 className="text-lg">Follow Us</h1>
            <div className="flex gap-3">
              <Link href="https://www.instagram.com">
                <PiInstagramLogoLight size={24} />
              </Link>
              <Link href="/https://www.tiktok.com">
                <PiTiktokLogoLight size={24} />
              </Link>
            </div>
          </div>
          <div className={clsx("flex flex-col gap-2", { "hidden": hideContactUs })}>
            <h1 className="text-lg ">Contact Us</h1>
            <div className="flex gap-2">
              <PiPhoneLight size={24} />
              <p>+62 21 123-456</p>
            </div>
            <div className="flex gap-2">
              <PiWhatsappLogoLight size={24} />
              <p>+62 812-3456-7890</p>
            </div>
            <div className="flex gap-2">
              <PiEnvelopeLight size={24} />
              <p>contact@palugada.com</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
};
