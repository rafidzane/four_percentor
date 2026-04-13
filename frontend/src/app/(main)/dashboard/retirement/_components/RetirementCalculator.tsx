'use client';

import React, { useState, useEffect } from 'react';
import { deepRetirementApi } from '@/lib/api';

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [liquidAssets, setLiquidAssets] = useState<number>(50000);
  const [illiquidAssets, setIlliquidAssets] = useState<number>(200000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1000);
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(7);
  const [socialSecurityAge, setSocialSecurityAge] = useState<number>(67);
  const [expectedLifespan, setExpectedLifespan] = useState<number>(90);
  
  const [results, setResults] = useState<{
    yearsToRetirement: number;
    totalLiquidSavingsAtRetirement: number;
    totalNetWorthAtRetirement: number;
    monthlyIncomeAtRetirement: number;
    socialSecurityBenefit: number;
    withdrawalRate: number;
    projectedBalanceAtAge90: number;
    safeWithdrawalAmount: number;
    recommendedWithdrawalStrategy: string;
  } | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculateDeepRetirement();
  }, [currentAge, retirementAge, liquidAssets, illiquidAssets, monthlyContribution, annualReturnRate, socialSecurityAge, expectedLifespan]);

  const formatCurrency = (value: number): string => {
    if (!value && value !== 0) return 'N/A';
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } catch (e) {
      console.error('Currency formatting error:', e);
      return `$${value.toLocaleString()}`;
    }
  };

  const calculateDeepRetirement = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data for API call
      const requestData = {
        current_age: currentAge,
        retirement_age: retirementAge,
        liquid_assets: liquidAssets,
        illiquid_assets: illiquidAssets,
        monthly_contribution: monthlyContribution,
        annual_return_rate: annualReturnRate / 100,  // Convert percentage to decimal
        social_security_age: socialSecurityAge,
        expected_lifespan: expectedLifespan
      };
      
      // Call the deep retirement API
      const response = await deepRetirementApi.calculateDeepRetirement(requestData);
      
      setResults(response);
    } catch (err: any) {
      console.error('Error calculating deep retirement:', err);
      setError('Failed to calculate retirement projections. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Deep Retirement Calculator</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Inputs</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Current Age
              </label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="18"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Retirement Age
              </label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="50"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Liquid Assets
              </label>
              <input
                type="number"
                value={liquidAssets}
                onChange={(e) => setLiquidAssets(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Savings, stocks, bonds, and other easily accessible funds</p>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Illiquid Assets
              </label>
              <input
                type="number"
                value={illiquidAssets}
                onChange={(e) => setIlliquidAssets(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Real estate, private equity, and other non-easily-accessible assets</p>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Monthly Contribution
              </label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                value={annualReturnRate}
                onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Social Security Age
              </label>
              <input
                type="number"
                value={socialSecurityAge}
                onChange={(e) => setSocialSecurityAge(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="62"
                max="70"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Expected Lifespan
              </label>
              <input
                type="number"
                value={expectedLifespan}
                onChange={(e) => setExpectedLifespan(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="50"
                max="120"
              />
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Retirement Projections</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : results ? (
            <div className="space-y-4">
              {/* Total Net Worth at Retirement */}
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-gray-600 text-sm">Total Net Worth at Retirement</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(results.totalNetWorthAtRetirement)}</p>
              </div>
              
              {/* Total Liquid Savings */}
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm">Total Liquid Savings at Retirement</p>
                <p className="text-xl font-bold text-blue-700">{formatCurrency(results.totalLiquidSavingsAtRetirement)}</p>
              </div>
              
              {/* Monthly Income */}
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <p className="text-gray-600 text-sm">Monthly Income at Retirement</p>
                <p className="text-xl font-bold text-purple-700">{formatCurrency(results.monthlyIncomeAtRetirement)}</p>
              </div>
              
              {/* Social Security Benefit */}
              <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
                <p className="text-gray-600 text-sm">Social Security Benefit (Monthly)</p>
                <p className="text-xl font-bold text-teal-700">{formatCurrency(results.socialSecurityBenefit)}</p>
              </div>
              
              {/* Safe Withdrawal Amount */}
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <p className="text-gray-600 text-sm">Safe Annual Withdrawal (4% Rule)</p>
                <p className="text-xl font-bold text-orange-700">{formatCurrency(results.safeWithdrawalAmount)}</p>
              </div>
              
              {/* Projected Balance at 90 */}
              {results.projectedBalanceAtAge90 > 0 && (
                <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
                  <p className="text-gray-600 text-sm">Projected Balance at Age 90</p>
                  <p className="text-xl font-bold text-indigo-700">{formatCurrency(results.projectedBalanceAtAge90)}</p>
                </div>
              )}
              
              {/* Withdrawal Rate */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Withdrawal Rate</p>
                <p className="text-xl font-bold text-gray-800">{(results.withdrawalRate * 100).toFixed(2)}%</p>
              </div>
              
              {/* Years to Retirement */}
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <p className="text-gray-600 text-sm">Years Until Retirement</p>
                <p className="text-xl font-bold text-yellow-700">{results.yearsToRetirement} years</p>
              </div>
              
              {/* Recommended Strategy */}
              <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
                <p className="text-gray-600 text-sm font-semibold">Recommended Strategy</p>
                <p className="text-base text-pink-800 mt-1">{results.recommendedWithdrawalStrategy}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Enter your information to see projections</p>
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={calculateDeepRetirement}
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? 'Calculating...' : 'Calculate Retirement Plan'}
      </button>
    </div>
  );
};

export default RetirementCalculator;
