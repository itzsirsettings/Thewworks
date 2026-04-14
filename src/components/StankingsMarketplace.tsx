import MarketplaceReference from './store/MarketplaceReference';

interface StankingsMarketplaceProps {
  onCheckoutRequested: () => void;
}

const StankingsMarketplace = (props: StankingsMarketplaceProps) => {
  return <MarketplaceReference {...props} />;
};

export default StankingsMarketplace;
