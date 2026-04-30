import { LockKeyhole, MessageCircleMore } from 'lucide-react';
import BrandLogo from './BrandLogo';
import MarketplaceReference from './store/MarketplaceReference';
import { buildWhatsAppUrl, WHATSAPP_DISPLAY_NUMBER } from '@/lib/whatsapp';

interface ThewworksICTMarketplaceProps {
  onCheckoutRequested: () => void;
}

const ThewworksICTMarketplace = (props: ThewworksICTMarketplaceProps) => {
  const storeWhatsAppUrl = buildWhatsAppUrl(
    'Hello, I would like to place a print order from Thewworks ICT & Prints.',
  );

  return (
    <div className="relative min-h-screen bg-white">
      <div className="pointer-events-none select-none opacity-45 blur-[2px]">
        <MarketplaceReference {...props} />
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050505]/55 px-5 py-12 backdrop-blur-md">
        <div className="w-full max-w-xl rounded-[28px] border border-white/12 bg-[#111111]/92 p-8 text-center text-white shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
          <BrandLogo
            className="mb-6 justify-center"
            markClassName="h-16 w-28"
            textClassName="text-xl"
            textTone="light"
          />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[#25D366]">
            <LockKeyhole size={28} />
          </div>
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-white/60">
            Thewworks Marketplace
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
            Online Store Opening soon....
          </h1>
          <p className="mt-4 text-base leading-7 text-white/78 sm:text-lg">
            Kindly reach us on Whatsapp to get all your work done
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={storeWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-[#111111] transition hover:brightness-110"
            >
              <MessageCircleMore size={18} />
              Chat on WhatsApp
            </a>
            <span className="text-sm font-medium text-white/70">
              {WHATSAPP_DISPLAY_NUMBER}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThewworksICTMarketplace;
