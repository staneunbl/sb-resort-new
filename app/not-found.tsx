import React from "react";
import Link from "next/link";

export default function notfound() {
  return (
    <div className="flex h-screen w-screen flex-col justify-center items-center gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-9xl text-center text-cstm-secondary font-semibold">404</h1>
        <p className="text-center font-semibold text-cstm-secondary">Oh noo! we were unable to find that page</p>
      </div>
      <Link href="/" className="hover:underline hover:text-cstm-primary">Go to Landing Page</Link>
    </div>
  );
}
