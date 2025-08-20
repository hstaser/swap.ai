import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  Goal,
  Shield,
  Bot,
  User,
  TrendingUp,
  GraduationCap,
  Heart,
  Building,
  Zap,
  ShoppingCart,
  Factory,
  Home,
  Package,
  Power,
  Phone,
  Brain,
  Leaf,
  Bitcoin,
  Dna,
  Car,
  Rocket,
  CreditCard,
  Cloud,
  DollarSign,
  Book,
  Calendar,
  Newspaper,
  Star,
  BarChart,
  FileText,
  MessageCircle,
  Navigation,
  Settings,
  Laptop,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ONBOARDING_SCHEMA, type OnboardingStep, type OnboardingQuestion, validateAnswer } from '@/data/onboarding-schema';

// Icon mapping for dynamic icon rendering
const ICONS = {
  CheckCircle, Sparkles, Target, Goal, Shield, Bot, User, TrendingUp, GraduationCap,
  Heart, Building, Zap, ShoppingCart, Factory, Home, Package, Power, Phone,
  Brain, Leaf, Bitcoin, Dna, Car, Rocket, CreditCard, Cloud, DollarSign, Book,
  Calendar, Newspaper, Star, BarChart, FileText, MessageCircle, Navigation,
  Settings, Laptop
};

interface OnboardingFlowProps {
  onComplete: (data: Record<string, any>) => void;
  onSkip: () => void;
  className?: string;
}

export function OnboardingFlow({ onComplete, onSkip, className }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = ONBOARDING_SCHEMA;
  const step = steps[currentStep];

  // Handle answer changes
  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Clear error when user provides answer
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  // Validate current step
  const validateStep = (): boolean => {
    const stepErrors: Record<string, string> = {};
    let isValid = true;

    step.questions.forEach(question => {
      const answer = answers[question.id];

      if (!validateAnswer(question, answer)) {
        isValid = false;
        stepErrors[question.id] = question.validation?.message || 'This field is required';
      }
    });

    setErrors(stepErrors);
    return isValid;
  };

  // Navigation handlers
  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      // Submit to backend API
      await submitOnboardingData(answers);
      onComplete(answers);
    } catch (error) {
      console.error('Failed to submit onboarding data:', error);
      // Handle error (could show toast or error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit data to backend
  const submitOnboardingData = async (data: Record<string, any>) => {
    try {
      // Submit to backend API
      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit onboarding data');
      }

      const result = await response.json();

      // Store result locally for immediate access
      localStorage.setItem('onboarding_data', JSON.stringify({
        ...data,
        completedAt: new Date().toISOString(),
        version: '1.0',
        insights: result.insights,
        personalization: result.personalization
      }));

      return result;
    } catch (error) {
      console.error('Failed to submit onboarding data:', error);

      // Fallback to localStorage if API fails
      localStorage.setItem('onboarding_data', JSON.stringify({
        ...data,
        completedAt: new Date().toISOString(),
        version: '1.0',
        fallback: true
      }));

      throw error;
    }
  };

  // Render question based on type
  const renderQuestion = (question: OnboardingQuestion) => {
    const answer = answers[question.id];
    const error = errors[question.id];

    switch (question.type) {
      case 'single-select':
        return (
          <div className="space-y-3">
            {question.options?.map(option => {
              const IconComponent = option.icon ? ICONS[option.icon as keyof typeof ICONS] : null;
              return (
                <Card
                  key={option.value}
                  className={cn(
                    'cursor-pointer transition-all border-2',
                    answer === option.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => handleAnswerChange(question.id, option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {IconComponent && (
                        <div className={cn(
                          'p-2 rounded-lg',
                          answer === option.value ? 'bg-blue-100' : 'bg-gray-100'
                        )}>
                          <IconComponent className={cn(
                            'h-5 w-5',
                            answer === option.value ? 'text-blue-600' : 'text-gray-600'
                          )} />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {option.description}
                          </div>
                        )}
                      </div>
                      {answer === option.value && (
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );

      case 'multi-select':
        const selectedAnswers = answer || [];
        return (
          <div className="space-y-3">
            {question.options?.map(option => {
              const isSelected = selectedAnswers.includes(option.value);
              const IconComponent = option.icon ? ICONS[option.icon as keyof typeof ICONS] : null;

              return (
                <Card
                  key={option.value}
                  className={cn(
                    'cursor-pointer transition-all border-2',
                    isSelected
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => {
                    const newAnswers = isSelected
                      ? selectedAnswers.filter((a: string) => a !== option.value)
                      : [...selectedAnswers, option.value];
                    handleAnswerChange(question.id, newAnswers);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {IconComponent && (
                        <div className={cn(
                          'p-2 rounded-lg',
                          isSelected ? 'bg-blue-100' : 'bg-gray-100'
                        )}>
                          <IconComponent className={cn(
                            'h-5 w-5',
                            isSelected ? 'text-blue-600' : 'text-gray-600'
                          )} />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {option.description}
                          </div>
                        )}
                      </div>
                      {isSelected ? (
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-gray-300 rounded flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );

      case 'scale':
        const scaleValue = answer || question.validation?.min || 1;
        const min = question.validation?.min || 1;
        const max = question.validation?.max || 10;

        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{scaleValue}</div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Conservative ({min})</span>
                <span>Aggressive ({max})</span>
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="range"
                min={min}
                max={max}
                value={scaleValue}
                onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: max - min + 1 }, (_, i) => {
                  const value = min + i;
                  return (
                    <button
                      key={value}
                      onClick={() => handleAnswerChange(question.id, value)}
                      className={cn(
                        'h-8 text-xs rounded transition-colors',
                        value === scaleValue
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <Textarea
            placeholder={question.description}
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full"
            rows={3}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={question.description}
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
            className="w-full"
            min={question.validation?.min}
            max={question.validation?.max}
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleAnswerChange(question.id, !answer)}
              className={cn(
                'w-6 h-6 rounded border-2 flex items-center justify-center transition-colors',
                answer
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              {answer && <CheckCircle className="h-4 w-4 text-white" />}
            </button>
            <span className="text-sm text-gray-700">{question.title}</span>
          </div>
        );

      default:
        return <div>Unsupported question type: {question.type}</div>;
    }
  };

  const StepIcon = step.icon ? ICONS[step.icon as keyof typeof ICONS] : Sparkles;

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4', className)}>
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <StepIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{step.title}</h1>
          <p className="text-lg text-gray-600">{step.subtitle}</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-600">{step.progress}% Complete</span>
          </div>
          <Progress value={step.progress} className="h-2" />
        </div>

        {/* Questions */}
        <Card className="mb-8">
          <CardContent className="p-6 space-y-6">
            {step.questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {question.title}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  {question.subtitle && (
                    <p className="text-sm text-gray-600 mt-1">{question.subtitle}</p>
                  )}
                  {question.description && (
                    <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                  )}
                </div>

                {renderQuestion(question)}

                {errors[question.id] && (
                  <p className="text-sm text-red-600">{errors[question.id]}</p>
                )}

                {index < step.questions.length - 1 && (
                  <hr className="border-gray-200" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            )}

            {step.skipAllowed && (
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-gray-500 hover:text-gray-700"
              >
                Skip for now
              </Button>
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              'Saving...'
            ) : currentStep === steps.length - 1 ? (
              'Complete Setup'
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Skip all option */}
        <div className="text-center mt-6">
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Skip onboarding entirely
          </button>
        </div>
      </div>
    </div>
  );
}
