import { Coins } from 'lucide-react';

interface CoinIconProps {
  className?: string;
  size?: number;
}

export function CoinIcon({ className = 'text-amber-500', size = 18 }: CoinIconProps) {
  return <Coins className={className} size={size} strokeWidth={2} aria-hidden />;
}

interface CoinAmountProps {
  amount: number | string;
  className?: string;
  iconClassName?: string;
  iconSize?: number;
  suffix?: string;
}

export function CoinAmount({
  amount,
  className = '',
  iconClassName,
  iconSize,
  suffix,
}: CoinAmountProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <CoinIcon className={iconClassName} size={iconSize} />
      <span>
        {amount}
        {suffix ? ` ${suffix}` : ''}
      </span>
    </span>
  );
}
