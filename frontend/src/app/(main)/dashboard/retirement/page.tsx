"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RetirementPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/retirement/two-person");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to two-person retirement calculator...</p>
    </div>
  );
}
