import React, { useState, useMemo } from 'react';

// Explicit list of discount percentages from the requirement
// 45, then 50 through 74
const PRESET_DISCOUNTS = [
  45,
  50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
  70, 71, 72, 73, 74
];

const Calculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<'discount' | 'gst' | null>(null);

  // Derived calculations
  const numericAmount = parseFloat(amount);
  const numericDiscount = parseFloat(discount);

  const isValid = !isNaN(numericAmount) && !isNaN(numericDiscount);

  const discountedPrice = useMemo(() => {
    if (!isValid) return 0;
    const discountValue = numericAmount * (numericDiscount / 100);
    return numericAmount - discountValue;
  }, [numericAmount, numericDiscount, isValid]);

  const priceWithGST = useMemo(() => {
    return discountedPrice * 1.18;
  }, [discountedPrice]);

  const handlePresetClick = (val: number) => {
    setDiscount(val.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimals
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setAmount(val);
    }
  };

  const handleCustomDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setDiscount(val);
    }
  };

  const handleCopy = (text: string, type: 'discount' | 'gst') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyFeedback(type);
    setTimeout(() => setCopyFeedback(null), 1500);
  };

  const handleShare = async () => {
    if (!isValid) return;

    const shareData = {
      title: 'Discount Result',
      text: `Price: ${formatNumber(discountedPrice)} | GST Price: ${formatNumber(priceWithGST)} (Amt: ${amount}, Disc: ${discount}%)`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for desktop/unsupported browsers: Copy to clipboard
      const textToCopy = `${shareData.text} ${shareData.url}`;
      navigator.clipboard.writeText(textToCopy);
      alert('Result copied to clipboard!');
    }
  };

  // Formatting helpers
  const formatNumber = (num: number) => {
    // Format to 2 decimals if needed, otherwise integer
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      {/* Optional Top Bar */}
      <div className="bg-violet-600 p-3 text-white text-center sm:hidden">
        <h1 className="text-lg font-bold uppercase">Discount Calculator</h1>
      </div>

      <div className="p-6 space-y-6">
        
        {/* First Box: Amount Input */}
        <div>
          <input
            type="text"
            inputMode="decimal"
            className="block w-full rounded-lg border-gray-300 px-4 py-4 text-xl sm:text-2xl font-semibold text-gray-900 focus:border-violet-500 focus:ring-violet-500 placeholder:text-gray-400 bg-gray-50 border shadow-sm"
            placeholder="Enter the Amount ₹"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>

        {/* Small Heading Percentage(%) {txt , Bold, Color = Violet} */}
        <div>
          <h2 className="text-violet-600 font-bold text-sm mb-3">
            Percentage(%)
          </h2>
          
          {/* six column grid */}
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {PRESET_DISCOUNTS.map((pct) => (
              <button
                key={pct}
                onClick={() => handlePresetClick(pct)}
                className={`
                  py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-150
                  border shadow-sm
                  ${
                    parseFloat(discount) === pct
                      ? 'bg-violet-600 text-white border-violet-600 transform scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                  }
                `}
              >
                {pct}%
              </button>
            ))}

            {/* Custom Discount Input occupying remaining space (4 columns) */}
            {/* Placed here to ensure it sits on the same row as the last items (73, 74) */}
            <div className="col-span-4">
              <input
                type="text"
                inputMode="decimal"
                className="block w-full h-full rounded-lg border-slate-200 px-3 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-900 focus:border-violet-500 focus:ring-violet-500 bg-gray-50 border shadow-sm placeholder:text-gray-400"
                placeholder="Custom discount Percent"
                value={discount}
                onChange={handleCustomDiscountChange}
              />
            </div>
          </div>
        </div>

        {/* Result Box */}
        {isValid && amount !== '' && (
          <div className="space-y-4 mt-8">
            <div className="flex gap-4">
              
              {/* Result is Entry amount minus chosen discount percent.. 
                  occupy 3/4th space */}
              <div 
                onClick={() => handleCopy(formatNumber(discountedPrice), 'discount')}
                className="basis-3/4 flex flex-col justify-center items-center bg-red-50 rounded-xl border border-red-100 p-4 cursor-pointer hover:bg-red-100 transition-colors relative group"
                title="Click to copy"
              >
                <div className="text-5xl sm:text-6xl font-bold text-red-600 tracking-tight leading-none">
                  {formatNumber(discountedPrice)}
                </div>
                <div className={`absolute bottom-1 text-xs font-semibold text-red-400 transition-opacity duration-200 ${copyFeedback === 'discount' ? 'opacity-100' : 'opacity-0'}`}>
                  Copied!
                </div>
              </div>

              {/* "with GST" .. occupy remaining space
                  green in color, italized, bold */}
              <div 
                onClick={() => handleCopy(formatNumber(priceWithGST), 'gst')}
                className="basis-1/4 flex flex-col justify-center items-center bg-green-50 rounded-xl border border-green-100 p-2 text-center cursor-pointer hover:bg-green-100 transition-colors"
                title="Click to copy"
              >
                <span className="text-sm sm:text-base text-green-600 font-bold italic mb-1 leading-tight">
                  {copyFeedback === 'gst' ? 'Copied!' : 'with GST'}
                </span>
                <div className="text-xl sm:text-2xl font-bold italic text-green-600 leading-tight break-all">
                  {formatNumber(priceWithGST)}
                </div>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 active:bg-slate-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share Result
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Calculator;