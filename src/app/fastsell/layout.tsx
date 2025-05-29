"use client";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CartProvider } from "@/contexts/CartContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
 const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      router.push('/');
    }
  }, [router]);

    return (
        <CartProvider>
            <SearchProvider>
                <Header />
                {/* <Banner /> */}
                {children}
                <Footer />
            </SearchProvider>
        </CartProvider>
    );
}