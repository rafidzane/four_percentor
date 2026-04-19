'use client';

import React, { useState, useEffect } from 'react';
import { deepRetirementApi } from '@/lib/api';

interface RetirementInputError {
  field: string;
  message: string;
}

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState<number | ''>(30);
  const [retirementAge, setRetirementAge] = useState<number | ''>(65);
  const [liquidAssets, setLiquidAssets] = useState<number | ''>(50000);
  const [illiquidAssets, setIlliquidAssets] = useState<number | ''>(200000);
  const [monthlyContribution, setMonthlyContribution] = useState<number | ''>(1000);
  const [annualReturnRate, setAnnualReturnRate] = useState<number | ''>(7);
  const [socialSecurityAge, setSocialSecurityAge] = useState<number | ''>(67);
  const [expectedLifespan, setExpectedLifespan] = useState<number | ''>(90);
  
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
  const [inputErrors, setInputErrors] = useState<RetirementInputError[]>([]);

  useEffect(() => {
    calculateDeepRetirement();
  }, [currentAge, retirementAge, liquidAssets, illiquidAssets, monthlyContribution, annualReturnRate, socialSecurityAge, expectedLifespan]);

  const validateInputs = (): boolean => {
    const errors: RetirementInputError[] = [];
    
    // Convert to numbers for comparison
    const currentAgeNum = Number(currentAge);
    const retirementAgeNum = Number(retirementAge);
    const socialSecurityAgeNum = Number(socialSecurityAge);
    const expectedLifespanNum = Number(expectedLifespan);
    
    // Current Age validation
    if (currentAge === '' || currentAgeNum < 18 || currentAgeNum > 100) {
      errors.push({ field: 'Current Age', message: 'Must be between 18 and 100' });
    }
    
    // Retirement Age validation
    if (retirementAge === '' || retirementAgeNum <= currentAgeNum || retirementAgeNum > 100) {
      errors.push({ field: 'Retirement Age', message: `Must be greater than current age (${currentAge}) and less than or equal to 100` });
    }
    
    // Social Security Age validation
    if (socialSecurityAge === '' || socialSecurityAgeNum < 62 || socialSecurityAgeNum > 70) {
      errors.push({ field: 'Social Security Age', message: 'Must be between 62 and 70' });
    }
    
    // Expected Lifespan validation
    if (expectedLifespan === '' || expectedLifespanNum <= retirementAgeNum || expectedLifespanNum > 120) {
      errors.push({ field: 'Expected Lifespan', message: `Must be greater than retirement age (${retirementAge}) and less than or equal to 120` });
    }
    
    // Financial inputs must be non-negative
    if (liquidAssets !== '' && Number(liquidAssets) < 0) {
      errors.push({ field: 'Liquid Assets', message: 'Cannot be negative' });
    }
    if (illiquidAssets !== '' && Number(illiquidAssets) < 0) {
      errors.push({ field: 'Illiquid Assets', message: 'Cannot be negative' });
    }
    if (monthlyContribution !== '' && Number(monthlyContribution) < 0) {
      errors.push({ field: 'Monthly Contribution', message: 'Cannot be negative' });
    }
    
    // Return rate validation
    if (annualReturnRate === '' || Number(annualReturnRate) < 0 || Number(annualReturnRate) > 100) {
      errors.push({ field: 'Expected Annual Return (%)', message: 'Must be between 0% and 100%' });
    }
    
    setInputErrors(errors);
    return errors.length === 0;
  };

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
    if (!validateInputs()) {
      setError('Please fix the validation errors below');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {

      // Prepare data for API call - convert camelCase to snake_case
      const requestData = {
        current_age: Number(currentAge),
        retirement_age: Number(retirementAge),
        liquid_assets: Number(liquidAssets),
        illiquid_assets: Number(illiquidAssets),
        monthly_contribution: Number(monthlyContribution),
        annual_return_rate: Number(annualReturnRate) / 100,  // Convert percentage to decimal
        social_security_age: Number(socialSecurityAge),
        expected_lifespan: Number(expectedLifespan)
      };
      
      // Call the deep retirement API
      console.log("Request data:", requestData);
      const response = await deepRetirementApi.calculateDeepRetirement(requestData);
      
      setResults(response);
    } catch (err: any) {
      console.error('Error calculating deep retirement:', err, 'Response data:', err.response?.data);
      setError('Failed to calculate retirement projections. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: number | '',
    onChange: (val: number | '') => void,
    min?: number,
    max?: number,
    placeholder?: string,
    helperText?: string
  ) => {
    const error = inputErrors.find(e => e.field === label);
    
    return (
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
        <input
          type="number"
          value={value === '' ? '' : value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === '' ? '' : Number(val));
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            error 
              ? 'border-red-500 focus:ring-red-500 bg-red-50' 
              : 'focus:ring-blue-500'
          }`}
          min={min}
          max={max}
          placeholder={placeholder}
        />
        {error && (
          <p className="text-red-600 text-xs mt-1">{error.message}</p>
        )}
        {!error && helperText && (
          <p className="text-gray-500 text-xs mt-1">{helperText}</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Deep Retirement Calculator</h1>
      
      {error && !inputErrors.length && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {inputErrors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
          <h3 className="font-bold mb-2">Please fix the following errors:</h3>
          <ul className="list-disc list-inside">
            {inputErrors.map((err, idx) => (
              <li key={idx}>{err.field}: {err.message}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Inputs</h2>
          
          <div className="space-y-4">
            {renderInput(
              'Current Age',
              currentAge,
              setCurrentAge,
              18,
              100,
              'e.g. 30'
            )}
            
            {renderInput(
              'Retirement Age',
              retirementAge,
              setRetirementAge,
              Number(currentAge) + 1,
              100,
              'e.g. 65'
            )}
            
            {renderInput(
              'Liquid Assets',
              liquidAssets,
              setLiquidAssets,
              0,
              undefined,
              'e.g. 50000',
              'Savings, stocks, bonds, and other easily accessible funds'
            )}
            
            {renderInput(
              'Illiquid Assets',
              illiquidAssets,
              setIlliquidAssets,
              0,
              undefined,
              'e.g. 200000',
              'Real estate, private equity, and other non-easily-accessible assets'
            )}
            
            {renderInput(
              'Monthly Contribution',
              monthlyContribution,
              setMonthlyContribution,
              0,
              undefined,
              'e.g. 1000'
            )}
            
            {renderInput(
              'Expected Annual Return (%)',
              annualReturnRate,
              setAnnualReturnRate,
              0,
              100,
              'e.g. 7',
              'Average annual return you expect (as a percentage)'
            )}
            
            {renderInput(
              'Social Security Age',
              socialSecurityAge,
              setSocialSecurityAge,
              62,
              70,
              'e.g. 67'
            )}
            
            {renderInput(
              'Expected Lifespan',
              expectedLifespan,
              setExpectedLifespan,
              Number(retirementAge) + 1,
              120,
              'e.g. 90'
            )}
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
        disabled={loading || inputErrors.length > 0}
        className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : inputErrors.length > 0
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
