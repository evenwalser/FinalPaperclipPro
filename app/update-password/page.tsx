"use client"; // This page must be a client component
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import paperclipLogo from "../../public/paperclip_logo_red.png";
import dashboardPreview from "../../public/dashboard-preview.png";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Check if password is strong enough (example: minimum length)
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    // Update password
    const { error } = await supabase.auth.updateUser({ password });

    setIsLoading(false);

    if (error) {
      alert("Error updating password: " + error.message);
      return;
    }

    alert("Password updated successfully!");
    router.push("/");
  };

  return (
    // <div className="flex justify-center items-center h-[-webkit-fill-available] absolute w-full">
    //   <form
    //     onSubmit={handleUpdatePassword}
    //     className="max-w-[600px] w-full p-6 rounded-xl border bg-card shadow"
    //   >
    //     <h1 className="text-2xl font-bold mb-6 text-center">Update Password</h1>

    //     <label className="mt-2 block" htmlFor="password">
    //       New Password:
    //     </label>
    //     <Input
    //       id="password"
    //       name="password"
    //       type="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       required
    //     />

    //     <label className="mt-2 block" htmlFor="confirmPassword">
    //       Confirm Password:
    //     </label>
    //     <Input
    //       id="confirmPassword"
    //       name="confirmPassword"
    //       type="password"
    //       value={confirmPassword}
    //       onChange={(e) => setConfirmPassword(e.target.value)}
    //       required
    //     />

    //     {errorMessage && (
    //       <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
    //     )}

    //     <Button
    //       type="submit"
    //       className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg mt-[20px]"
    //       disabled={isLoading}
    //     >
    //       {isLoading ? "Updating..." : "Update Password"}
    //     </Button>
    //   </form>
    // </div>

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
          <form
            className="!mt-[20px] lg:!mt-[40px]"
            onSubmit={handleUpdatePassword}
          >
            <div>
              <label
                htmlFor="password"
                className="block text-[14px] font-[500] text-[#474747] mb-[6px]"
              >
                New Password*
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className={`h-12 mt-1 rounded-[12px] border-[#D5D7DA] text-[#474747] !bg-[#fff] focus:border-[#F71D3B] focus:outline-hidden placeholder:text-[#717680]
                    }`}
                placeholder="Enter your new password"
              />
              {errorMessage && (
                <div className="mt-[6px]">
                  <p className="text-[#535862] text-[14px] font-[400]">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-[20px]">
              <label
                htmlFor="confirmPassword"
                className="block text-[14px] font-[500] text-[#474747] mb-[6px]"
              >
                Confirm Password*
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-12 mt-1 rounded-[12px] border-[#D5D7DA] text-[#474747] !bg-[#fff] focus:border-[#F71D3B] focus:outline-hidden placeholder:text-[#717680]
                    }`}
                placeholder="Re-enter your new password"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-l from-[#F52044] to-[#E24AD9] text-white font-[600] rounded-[12px] text-[16px] !mt-[20px] lg:!mt-[40px]"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
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
