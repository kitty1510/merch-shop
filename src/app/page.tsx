"use client";

import { useCallback } from "react";
import { Hero } from "@/components/sections/Hero";
import { Scrollytelling } from "@/components/sections/Scrollytelling";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Features } from "@/components/sections/Features";
import { TechSpecs } from "@/components/sections/TechSpecs";
import { Newsletter } from "@/components/sections/Newsletter";
import { ChatbotModal } from "@/components/ui/ChatbotModal";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { Header } from "@/components/layout/Header";
import { useCartStore } from "@/store/useCartStore";
import { useUserBehavior } from "@/hooks/useUserBehavior";
import { useToast } from "@/components/ui/Toast";

export default function Home() {
  const { setCartOpen } = useCartStore();
  const { toast } = useToast();

  // Behavior tracking with scroll milestone toasts
  const onMilestone = useCallback(
    (percent: number) => {
      const msgs: Record<number, string> = {
        25: "You're exploring! 🔍 Check out our products below.",
        50: "Halfway there! 🚀 Don't miss our Smart Ring collection.",
        75: "Almost at the end! ❤️ Subscribe for exclusive offers.",
        100: "Thanks for reading everything! 🎉 Ready to shop?",
      };
      if (msgs[percent]) {
        toast(msgs[percent], "info");
      }
    },
    [toast]
  );

  useUserBehavior(onMilestone);

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Scrollytelling />
        <ProductGrid />
        <Features />
        <TechSpecs />
        <Newsletter />
      </main>
      <CartDrawer />
      <ChatbotModal />
    </>
  );
}
