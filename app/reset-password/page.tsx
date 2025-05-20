import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "./actions";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import paperclipLogo from "../../public/paperclip_logo_red.png";
import dashboardPreview from "../../public/dashboard-preview.png";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  return (
    <div className="min-h-screen w-full flex items-center bg-white">
      {/* Left Section - Login Form */}
      <div className="w-full px-[90px] py-[30px] bg-[#fff]">
        <div className="w-full space-y-8">
          {/* Logo */}
          <div className="flex justify-start">
            <Image
              src={paperclipLogo}
              alt="Paperclip Logo"
              width={150}
              height={50}
              className="filter-none"
            />
          </div>

          {/* Login Form */}
          <form className="!mt-[20px] lg:!mt-[40px]">
            {searchParams.error && (
              <div className="mb-4 text-red-500 text-sm">
                {searchParams.error}
              </div>
            )}

            {searchParams.success && (
              <div className="mb-4 text-green-500 text-sm">
                {searchParams.success}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-[14px] font-[500] text-[#474747] mb-[6px]"
              >
                Email*
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className={`h-12 mt-1 rounded-[12px] border-[#D5D7DA] text-[#474747] !bg-[#fff] focus:border-[#F71D3B] focus:outline-hidden placeholder:text-[#717680]
                }`}
                placeholder="Enter your work email"
              />
            </div>

            <Button
              className="w-full h-12 bg-gradient-to-l from-[#F52044] to-[#E24AD9] text-white font-[600] rounded-[12px] text-[16px] !mt-[20px] lg:!mt-[40px]"
              formAction={resetPassword}
            >
              Reset Password
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                >
                  <path
                    d="M1.5 8H15.5M15.5 8L8.5 1M15.5 8L8.5 15"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Button>
          </form>

          {/* Footer */}
          <div className="text-left text-[14px] text-[#535862] font-[400] !mt-[20px] ">
            © PaperClip Marketplace {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* Right Section - Dashboard Preview */}
      <div className="w-full bg-[#fff]  p-[16px]">
        <div className="relative w-full 2xl:w-[800px] h-full">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 to-red-100/30 rounded-3xl transform rotate-2"></div> */}
          <Image
            src={dashboardPreview}
            alt="Dashboard Preview"
            className="w-full h-full"
            priority
          />
        </div>
      </div>
    </div>
  );
}
