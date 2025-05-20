'use client';

interface PageProps {
  invitation: { email: string; token: string };
}

import { Input } from "@/components/ui/input";
import { signup } from "./SignupFormAction"; // Ensure this is properly defined for handling the form submission.
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import paperclipLogo from "../public/paperclip_logo_red.png"


export default function SignupForm({
  invitation,
}: {
  invitation: { email: string; token: string };
}) {
  const isSignup = true; // this flag ensures it's a signup form

  return (
    <div className="flex justify-center items-center h-[-webkit-fill-available] absolute w-full flex-col">
      <div className="p-6">
        <Image
          src={paperclipLogo}
          alt="Paperclip Logo"
          width={200}
          height={67}
          className="filter-none"
        />
      </div>
      <form className="max-w-[600px] w-full p-6 rounded-xl border bg-card shadow">
        {/* Name Input */}
        <label className="mt-2 block" htmlFor="email">
          Name:
        </label>
        <Input
          id="name"
          name="name"
          type="name"
          required
        />

        {/* Pre-fill email from the invitation */}
        <label className="mt-2 block" htmlFor="email">
          Email (Invited):
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={invitation.email}
          required
          disabled
        />

        {/* Password */}
        <label className="mt-2 block" htmlFor="password">
          Password:
        </label>
        <Input id="password" name="password" type="password" required />

        {/* Confirm Password */}
        <label className="mt-2 block" htmlFor="confirmPassword">
          Confirm Password:
        </label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />

        <Button
          formAction={signup}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg w-full mt-[20px]"
        >
          Sign up
        </Button>

        <div className="mt-4 text-center">
          <Link
            href="/reset-password"
            className="text-sm text-muted-foreground hover:text-primary text-[#0093ff]"
          >
            Forgot your password?
          </Link>
        </div>
      </form>
    </div>
  );
}

