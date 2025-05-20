"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import paperclipLogo from "../../public/paperclip_logo_red.png";
import dashboardPreview from "../../public/dashboard-preview.png";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { tab: "login" | "signup"; error?: string };
}) {
  const currentTab = searchParams.tab || "login";
  const isLogin = currentTab === "login";
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isLogin) {
      const confirmPassword = formData.get('confirmPassword') as string;
      const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

      if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
        setLoading(false);
        return;
      }
    } else {
      if (!isEmailValid || !isPasswordValid) {
        setLoading(false);
        return;
      }
    }

    if (isLogin) {
      await login(formData);
    } else {
      await signup(formData);
    }
    setLoading(false);
  }

  const handleNoSpace = (e: React.FormEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;
    if (inputElement.value.includes(" ")) {
      inputElement.value = inputElement.value.replace(/\s+/g, "");
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setValidationErrors(prev => ({ ...prev, email: 'Email is required' }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setValidationErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setValidationErrors(prev => ({ ...prev, password: 'Password is required' }));
      return false;
    }
    if (password.length < 6) {
      setValidationErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return false;
    }
    // if (!/[A-Z]/.test(password)) {
    //   setValidationErrors(prev => ({ ...prev, password: 'Password must contain at least one uppercase letter' }));
    //   return false;
    // }
    if (!/[0-9]/.test(password)) {
      setValidationErrors(prev => ({ ...prev, password: 'Password must contain at least one number' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your password' }));
      return false;
    }
    if (password !== confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value.replace(/\s+/g, "");
    e.target.value = email;
    validateEmail(email);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value.replace(/\s+/g, "");
    e.target.value = password;
    validatePassword(password);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value.replace(/\s+/g, "");
    e.target.value = confirmPassword;
    const password = (document.getElementById('password') as HTMLInputElement)?.value;
    validateConfirmPassword(password, confirmPassword);
  };

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function handleAppleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="min-h-screen w-full flex">
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

          {/* Welcome Text */}
          <div className="text-left !mt-[20px] sm:!mt-[60px] lg:!mt-[120px]">
            <h2 className="text-3xl font-[600] text-[#181D27] mb-[12px]">Welcome Back</h2>
            <p className="text-[14px] text-[#535862]">
              Enter the details below to access the dashboard
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-[12px] !mt-[20px] lg:!mt-[40px]">
            <Button
              variant="outline"
              className="w-full h-12 text-[16px] font-[600] border border-[#D5D7DA] rounded-[12px] text-[#414651] hover:text-[#414651] shadow-sm"
              onClick={handleGoogleSignIn}
            >
              <svg
                className="w-[24px] h-[24px] mr-2"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
              </svg>
              {isLogin ? "Log in with Google" : "Sign in with Google"}
            </Button>

            {/* <Button
              variant="outline"
              className="w-full h-12 text-[16px] font-[600] border border-[#D5D7DA] rounded-[12px] text-[#414651] hover:text-[#414651] shadow-sm"
              onClick={handleAppleSignIn}
            >
              <svg
                className="w-[24px] h-[24px] mr-2"
                viewBox="0 0 22 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.499 0C14.2195 0.0885 12.724 0.9075 11.8525 1.974C11.0575 2.9415 10.4035 4.3785 10.6585 5.775C12.0565 5.8185 13.501 4.98 14.338 3.8955C15.121 2.886 15.7135 1.458 15.499 0Z"
                  fill="black"
                />
                <path
                  d="M20.5553 8.05192C19.3268 6.51143 17.6003 5.61743 15.9698 5.61743C13.8174 5.61743 12.9069 6.64793 11.4114 6.64793C9.86938 6.64793 8.69789 5.62043 6.8364 5.62043C5.00791 5.62043 3.06092 6.73792 1.82643 8.64891C0.0909416 11.3399 0.38794 16.3994 3.20042 20.7088C4.20692 22.2508 5.55091 23.9848 7.3089 23.9998C8.87339 24.0148 9.31439 22.9963 11.4339 22.9858C13.5534 22.9738 13.9554 24.0133 15.5169 23.9968C17.2763 23.9833 18.6938 22.0618 19.7003 20.5198C20.4218 19.4144 20.6903 18.8579 21.2498 17.6099C17.1803 16.0604 16.5278 10.2734 20.5553 8.05192Z"
                  fill="black"
                />
              </svg>
              {isLogin ? "Log in with Apple" : "Sign in with Apple"}
            </Button> */}
          </div>

          {/* Divider */}
          <div className="relative !mt-[20px] lg:!mt-[40px]">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Error Message */}
          {searchParams.error && (
            <div className="text-[#ed2338] font-[500] text-[14px]">
              {searchParams.error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="!mt-[20px] lg:!mt-[40px]">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-[14px] font-[500] text-[#474747] mb-[6px]">
                  Full Name*
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  className="h-12 mt-1 rounded-[12px] text-[#474747] border-[#D5D7DA] !bg-[#fff] placeholder:text-[#717680] focus:border-[#F71D3B] focus:outline-hidden"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className={!isLogin ? "!mt-[14px]" : ""}>
              <label htmlFor="email" className="block text-[14px] font-[500] text-[#474747] mb-[6px]">
                Email*
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                className={`h-12 mt-1 rounded-[12px] border-[#D5D7DA] text-[#474747] !bg-[#fff] focus:border-[#F71D3B] focus:outline-hidden placeholder:text-[#717680] ${validationErrors.email ? 'border-red-500' : ''
                  }`}
                placeholder="Enter your work email"
                onChange={handleEmailChange}
              />
              {validationErrors.email && (
                <div className="mt-[6px]">
                  <p className="text-[#535862] text-[14px] font-[400]">{validationErrors.email}</p>
                </div>
              )}
            </div>

            <div className="!mt-[14px] relative">
              <label htmlFor="password" className="block text-[14px] font-[500] text-[#474747] mb-[6px]">
                Password*
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`h-12 mt-1 rounded-[12px] border-[#D5D7DA] text-[#474747] !bg-[#fff] pr-10 focus:border-[#F71D3B] focus:outline-hidden placeholder:text-[#717680] ${validationErrors.password ? 'border-red-500' : ''
                    }`}
                  placeholder="Enter your password"
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-[#A4A7AE]" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-[#A4A7AE]" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <div className="mt-[6px]">
                  <p className="text-[#535862] text-[14px] font-[400]">{validationErrors.password}</p>
                </div>
              )}
            </div>
            {!isLogin && (
              <div className="!mt-[14px] relative">
                <label htmlFor="confirmPassword" className="block text-[14px] font-[500] text-[#474747] mb-[6px]">
                  Confirm Password*
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className={`h-12 mt-1 rounded-[12px] text-[#474747] border-[#D5D7DA] !bg-[#fff] pr-10 focus:border-[#F71D3B] focus:outline-hidden placeholder:text-[#717680] ${validationErrors.confirmPassword ? 'border-red-500' : ''
                      }`}
                    placeholder="Confirm your password"
                    onChange={handleConfirmPasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-[#A4A7AE]" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-[#A4A7AE]" />

                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <div className="mt-[6px]">
                    <p className="text-[#535862] text-[14px] font-[400]">{validationErrors.confirmPassword}</p>
                  </div>
                )}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-end !mt-[6px]">
                <Link
                  href="/reset-password"
                  className="text-[14px] text-[#535862] underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-l from-[#F52044] to-[#E24AD9] text-white font-[600] rounded-[12px] text-[16px] !mt-[20px] lg:!mt-[40px]"
              disabled={loading}
            >
              {loading ? "Processing..." : (isLogin ? "Log in" : "Sign up")}
              {!loading && (
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                    <path d="M1.5 8H15.5M15.5 8L8.5 1M15.5 8L8.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </Button>
          </form>

          {/* Sign Up/Login Link */}
          <div className="text-center text-sm !mt-[12px]">
            {isLogin ? (
              <>
                <span className="text-gray-600 text-[14px] text-[#535862] font-[400]">{`Don't`} have a PaperClip Retail account? </span>
                <Link href="?tab=signup" className="text-[#F71D3B] font-[600] text-[14px]">
                  Create Now
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-600 text-[14px] text-[#535862] font-[400]">Already have an account? </span>
                <Link href="?tab=login" className="text-[#F71D3B] font-[600] text-[14px]">
                  Log in
                </Link>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="text-left text-[14px] text-[#535862] font-[400] !mt-[20px] lg:!mt-[120px]">
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
            width={1200}
            height={800}
            className="w-full h-[928px]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
