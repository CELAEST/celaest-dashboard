import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useUIStore } from "@/stores/useUIStore";
import { products } from "@/features/marketplace/constants/products";

export const useMarketplaceLogic = () => {
  const { user } = useAuth();
  const { setNavbarSearchVisible, searchQuery } = useUIStore();

  // Local State
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Refs
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const productsGridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleProductSelect = useCallback(
    (product: (typeof products)[0]) => {
      if (!user) {
        setShowLoginModal(true);
      } else {
        setSelectedProduct(product);
      }
    },
    [user],
  );

  const handleScrollToCatalog = useCallback(() => {
    productsGridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  }, [searchQuery]);

  // Infinite Scroll Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !isLoadingMore &&
          visibleCount < filteredProducts.length
        ) {
          setIsLoadingMore(true);
          // Simulate network delay for natural feel
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 6, products.length));
            setIsLoadingMore(false);
          }, 800);
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [isLoadingMore, visibleCount, filteredProducts.length]);

  // Get visible products
  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount],
  );

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Sticky Search Logic - Move to Header when scrolled past
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNavbarSearchVisible(
          !entry.isIntersecting && entry.boundingClientRect.top < 0,
        );
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );

    if (searchContainerRef.current) {
      observer.observe(searchContainerRef.current);
    }

    return () => {
      observer.disconnect();
      setNavbarSearchVisible(false);
    };
  }, [setNavbarSearchVisible]);

  return {
    selectedProduct,
    setSelectedProduct,
    isLoading,
    showLoginModal,
    setShowLoginModal,
    detailProduct,
    setDetailProduct,
    isLoadingMore,
    visibleCount,
    searchContainerRef,
    productsGridRef,
    loadMoreRef,
    handleProductSelect,
    handleScrollToCatalog,
    filteredProducts,
    visibleProducts,
  };
};
