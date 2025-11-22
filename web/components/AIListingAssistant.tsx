/**
 * AI Listing Assistant Modal
 * Helps users generate compelling listings using AI
 */

'use client';

import React, { useState } from 'react';
import CyberButton from './CyberButton';
import { Category } from '../app/types';

interface AIListingAssistantProps {
  onClose: () => void;
  onUseGenerated: (data: any) => void;
}

export default function AIListingAssistant({ onClose, onUseGenerated }: AIListingAssistantProps) {
  const [step, setStep] = useState(1);
  const [itemType, setItemType] = useState('');
  const [category, setCategory] = useState<Category>(Category.MISC);
  const [keyDetails, setKeyDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!itemType.trim()) {
      setError('Please describe what you\'re selling');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        item_type: itemType,
        category: category,
        key_details: keyDetails || '',
      });

      const response = await fetch(`/api/listings/generate-listing?${params.toString()}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'AI generation failed' }));
        throw new Error(
          typeof errorData.detail === 'string'
            ? errorData.detail
            : 'AI generation service unavailable. Please check AWS Bedrock configuration.'
        );
      }

      const data = await response.json();
      setGeneratedData(data);
      setStep(2);
    } catch (err: any) {
      console.error('AI generation error:', err);
      setError(err.message || 'Failed to generate listing. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseGenerated = () => {
    onUseGenerated({
      title: generatedData.generated_title,
      description: generatedData.generated_description,
      price: generatedData.suggested_price,
      condition: generatedData.suggested_condition,
      location: generatedData.suggested_location,
      category: category,
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 clip-corner-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-cyber-cyan/30">
          <div>
            <h2 className="text-3xl font-heading font-bold text-cyber-cyan flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI LISTING ASSISTANT
            </h2>
            <p className="text-sm text-gray-500 font-cyber mt-2">
              Let AI help you create a compelling listing
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-cyber-pink transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Item Type */}
            <div>
              <label className="block text-sm font-cyber text-gray-400 mb-2">
                WHAT ARE YOU SELLING? *
              </label>
              <input
                type="text"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                placeholder="e.g., Gaming Laptop, Motorcycle, Apartment..."
                className="terminal-input w-full"
                autoFocus
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-cyber text-gray-400 mb-2">
                CATEGORY *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="cyber-select"
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Key Details */}
            <div>
              <label className="block text-sm font-cyber text-gray-400 mb-2">
                KEY DETAILS (OPTIONAL)
              </label>
              <textarea
                value={keyDetails}
                onChange={(e) => setKeyDetails(e.target.value)}
                placeholder="Add any specific details... condition, features, why you're selling, etc."
                className="cyber-input min-h-[100px] resize-y"
                maxLength={500}
              />
              <p className="text-xs text-gray-600 mt-2 font-cyber">
                {keyDetails.length}/500 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-cyber-alert/20 border border-cyber-alert text-cyber-alert clip-corner-sm">
                <p className="font-cyber font-bold">⚠ {error}</p>
              </div>
            )}

            {/* Generate Button */}
            <div className="flex gap-4">
              <CyberButton
                variant="cyan"
                onClick={handleGenerate}
                disabled={isGenerating}
                fullWidth
              >
                <div className="flex items-center justify-center gap-2">
                  {isGenerating ? (
                    <>
                      <div className="loading-spinner w-5 h-5"></div>
                      <span>GENERATING...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>GENERATE WITH AI</span>
                    </>
                  )}
                </div>
              </CyberButton>
              <CyberButton
                variant="alert"
                onClick={onClose}
                disabled={isGenerating}
              >
                CANCEL
              </CyberButton>
            </div>

            {/* Info */}
            <div className="p-4 bg-cyber-dark/60 border border-cyber-cyan/20 clip-corner-sm">
              <p className="text-xs text-gray-500 font-cyber">
                ℹ Our AI will create a cyberpunk-themed listing with a catchy title,
                detailed description, and price suggestion based on your input.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Review Generated */}
        {step === 2 && generatedData && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="p-4 bg-cyber-green/20 border border-cyber-green text-cyber-green clip-corner-sm">
              <p className="font-cyber font-bold">✓ LISTING GENERATED SUCCESSFULLY</p>
            </div>

            {/* Generated Title */}
            <div>
              <label className="block text-sm font-cyber text-gray-400 mb-2">
                GENERATED TITLE
              </label>
              <div className="p-4 bg-cyber-dark/80 border border-cyber-cyan/30 clip-corner-sm">
                <p className="text-lg font-heading text-white">
                  {generatedData.generated_title}
                </p>
              </div>
            </div>

            {/* Generated Description */}
            <div>
              <label className="block text-sm font-cyber text-gray-400 mb-2">
                GENERATED DESCRIPTION
              </label>
              <div className="p-4 bg-cyber-dark/80 border border-cyber-cyan/30 clip-corner-sm max-h-60 overflow-y-auto">
                <p className="text-sm text-gray-300 font-cyber leading-relaxed whitespace-pre-wrap">
                  {generatedData.generated_description}
                </p>
              </div>
            </div>

            {/* Suggestions */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-cyber text-gray-500 mb-1">
                  SUGGESTED PRICE
                </label>
                <div className="p-3 bg-cyber-dark/80 border border-cyber-cyan/30 clip-corner-sm">
                  <p className="text-xl font-heading text-cyber-cyan">
                    {generatedData.suggested_price} ED
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-cyber text-gray-500 mb-1">
                  CONDITION
                </label>
                <div className="p-3 bg-cyber-dark/80 border border-cyber-cyan/30 clip-corner-sm">
                  <p className="text-sm font-cyber text-gray-300">
                    {generatedData.suggested_condition}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-cyber text-gray-500 mb-1">
                  LOCATION
                </label>
                <div className="p-3 bg-cyber-dark/80 border border-cyber-cyan/30 clip-corner-sm">
                  <p className="text-sm font-cyber text-gray-300">
                    {generatedData.suggested_location}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <CyberButton
                variant="cyan"
                onClick={handleUseGenerated}
                fullWidth
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>USE THIS LISTING</span>
                </div>
              </CyberButton>
              <CyberButton
                variant="pink"
                onClick={() => setStep(1)}
              >
                REGENERATE
              </CyberButton>
              <CyberButton
                variant="alert"
                onClick={onClose}
              >
                CANCEL
              </CyberButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
