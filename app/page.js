'use client';
import { useState } from 'react';
import Tesseract from 'tesseract.js';
import ImageUpload from './components/ImageUpload';
import TextOutput from './components/TextOutput';
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

export default function Home() {
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const processImage = async (source) => {
    try {
      setError('');
      setIsProcessing(true);
      setExtractedText('Processing...');
      setProgress(0);

      console.log('Starting OCR process with source:', source);

      const result = await Tesseract.recognize(
        source,
        'eng',
        {
          logger: data => {
            console.log('OCR Progress:', data); // Log progress updates
            if (data.status === 'recognizing text') {
              setProgress(parseInt(data.progress * 100));
            }
          }
        }
      );

      console.log('OCR Result:', result);
      setExtractedText(result.data.text || 'No text found in image');
    } catch (error) {
      console.error('OCR Error:', error);
      setError('Failed to process image. Please try again.');
      setExtractedText('');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleImageProcess = async (imageFile) => {
    if (imageFile instanceof File) {
      const imageUrl = URL.createObjectURL(imageFile); // Convert file to URL
      await processImage(imageUrl);
    }
  };

  const handleUrlProcess = async (e) => {
    e.preventDefault();
    if (!imageUrl) return;

    try {
      setIsProcessing(true);
      setError('');
      await processImage(imageUrl);
    } catch (error) {
      console.error('URL Processing Error:', error);
      setError('Failed to load image. Please try a different URL or upload an image directly.');
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Image to Text Converter
        </h1>

        <div className="mb-8">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
              <TabsTrigger value="url">Image URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-4">
              <ImageUpload
                onImageSelect={handleImageProcess}
                isProcessing={isProcessing}
                progress={progress}
              />
            </TabsContent>

            <TabsContent value="url" className="mt-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleUrlProcess} className="space-y-4">
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      For best results, use direct image URLs ending in .jpg, .png, etc.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isProcessing || !imageUrl}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      'Process Image URL'
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <TextOutput
          text={extractedText}
          isProcessing={isProcessing}
          progress={progress}
        />
      </div>
    </main>
  );
}