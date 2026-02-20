import React, { useState, useEffect } from 'react';
import FinancingBanner from '../components/FinancingBanner';
import Hero from '../components/Hero';
import Partners from '../components/Partners';
import LookingFor from '../components/LookingFor';
import ProductShowcase from '../components/ProductShowcase';
import ElectricSkateboards from '../components/ElectricSkateboards';
import BoostedRev from '../components/BoostedRev';
import ProductModels from '../components/ProductModels';
import Videos from '../components/Videos';
import Accessories from '../components/Accessories';
import Features from '../components/Features';
import ProductModal from '../components/ProductModal';
import boardsData from '../data/boards.json';
import accessoriesData from '../data/accessories.json';
import videosData from '../data/videos.json';

const HomePage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showcaseCards, setShowcaseCards] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    // Load showcase cards
    setShowcaseCards([
      {
        id: boardsData[3]?.id || 4,
        title: "Shop Boosted Boards",
        status: "In Stock",
        image: "/images/Rectangle(12).png",
        className: "boards-card",
        price: 999,
        description: "High-performance electric skateboards for commuting and fun.",
      },
      {
        id: 10,
        title: "Shop Boosted Revs",
        status: "In Stock",
        image: "/images/Rectangle(11).png",
        className: "revs-card",
        price: 1599,
        description: "Revolutionary electric scooter for urban commuting.",
      },
    ]);

    // Load models
    setModels(boardsData.slice(0, 3));
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const electricSkateboards = {
    background: "/images/Rectangle(13).png",
    subtitle: "High-performance",
    title: "Electric Skateboards",
    description:
      "Cruising campus, going to work or getting through that long list of errands has never been easier or more fun.",
    buttonText: "Shop Now",
  };

  const boostedRev = {
    title: "Boosted Rev",
    description:
      "There's never been an electric scooter quite like this. Speed past traffic at 24 mph. Go up to 22 miles on a single charge. You'll get there in no time at all. Stop and go with the roll of your thumb. Its intuitive design means there's almost no learning curve.",
    buttonText: "Shop Now",
    images: {
      top: "/images/Rectangle(16).png",
      bottom: "/images/Rectangle(15).png",
    },
  };

  const lookingFor = {
    title: "Looking for Boosted Boards, or Boosted Revs?",
    description:
      "Boosted USA acquired all of the remaining inventory directly from Boosted. This means we have the electric skateboards and scooter you all love and have been looking for. Get your hands on these highly sought after products while supplies last.",
  };

  return (
    <>
      <FinancingBanner text="Financing option available at checkout." />
      <Hero
        title="Welcome to Boosted USA"
        subtitle="The Holy Grail of Electric Skateboards and One REVolutionary Scooter"
        buttons={[
          { label: "BOOSTED REVS", path: "/catalog/scooters", tooltip: "View Boosted Rev scooters" },
          { label: "BOOSTED BOARDS", path: "/catalog/boards", tooltip: "View Boosted boards" },
        ]}
        background="/images/Rectangle(1).png"
      />
      <Partners />
      <LookingFor content={lookingFor} />
      <ProductShowcase cards={showcaseCards} onCardClick={handleProductClick} />
      <ElectricSkateboards data={electricSkateboards} />
      <BoostedRev data={boostedRev} />
      <ProductModels models={models} onModelClick={handleProductClick} />
      <Videos videos={videosData} />
      <Accessories items={accessoriesData.slice(0, 7)} />
      <Features />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default HomePage;

