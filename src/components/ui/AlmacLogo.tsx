import carbonmashLogo from '@/assets/carbonmash-logo-new.svg';

interface AlmacLogoProps {
  className?: string;
}

export const AlmacLogo = ({ className = "h-16" }: AlmacLogoProps) => {
  return (
    <img
      src={carbonmashLogo}
      alt="CarbonMash Logo"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};
