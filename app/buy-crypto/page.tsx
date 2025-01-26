import { CryptoOnramp } from "@/components/crypto/CryptoOnramp";

export default function BuyCryptoPage() {
  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8">Buy Crypto</h1>
      <CryptoOnramp />
    </div>
  );
}
