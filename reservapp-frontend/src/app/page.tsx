'use client'
import { useAuth } from "@/hooks/useAuth";
import HeroSection from "@/components/layout/heroSection";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  return <HeroSection isAuthenticated={isAuthenticated} user={user} />;
}
