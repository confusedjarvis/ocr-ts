import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';

export default function TextOutput({ text, isProcessing, progress }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Extracted Text</h2>
        {text && !isProcessing && text !== 'Processing...' && (
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Text
              </>
            )}
          </Button>
        )}
      </div>

      <div
        className={`min-h-[300px] p-4 bg-gray-50 rounded-lg transition-opacity duration-200
          ${isProcessing ? 'opacity-50' : ''}`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="text-sm text-gray-600">Processing: {progress}%</div>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {text || 'No text extracted yet'}
          </pre>
        )}
      </div>
    </div>
  );
}