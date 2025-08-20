// Onboarding Schema Configuration
// This file defines the structure and flow of the user onboarding process

export type QuestionType = 
  | 'multi-select' 
  | 'single-select' 
  | 'scale' 
  | 'text' 
  | 'number' 
  | 'boolean'
  | 'investment-allocation';

export interface OnboardingQuestion {
  id: string;
  type: QuestionType;
  title: string;
  subtitle?: string;
  description?: string;
  required: boolean;
  options?: Array<{
    value: string;
    label: string;
    description?: string;
    icon?: string;
    color?: string;
  }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  conditional?: {
    dependsOn: string;
    showWhen: string | string[];
  };
  meta?: {
    category: string;
    priority: 'high' | 'medium' | 'low';
    version: string;
  };
}

export interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  progress: number;
  questions: OnboardingQuestion[];
  skipAllowed?: boolean;
}

// Main Onboarding Schema
export const ONBOARDING_SCHEMA: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Swipr.ai',
    subtitle: 'Let\'s personalize your investment experience',
    icon: 'Sparkles',
    progress: 10,
    questions: [
      {
        id: 'user_type',
        type: 'single-select',
        title: 'What best describes you?',
        subtitle: 'This helps us tailor your experience',
        required: true,
        options: [
          { 
            value: 'beginner', 
            label: 'New to investing', 
            description: 'Just getting started with stocks and trading',
            icon: 'GraduationCap',
            color: 'blue'
          },
          { 
            value: 'intermediate', 
            label: 'Some experience', 
            description: 'Have traded before but want to improve',
            icon: 'TrendingUp',
            color: 'green'
          },
          { 
            value: 'advanced', 
            label: 'Experienced investor', 
            description: 'Actively manage my own portfolio',
            icon: 'Target',
            color: 'purple'
          }
        ],
        meta: { category: 'profile', priority: 'high', version: '1.0' }
      },
      {
        id: 'investment_timeline',
        type: 'single-select',
        title: 'What\'s your primary investment timeline?',
        required: true,
        options: [
          { value: 'short', label: 'Short-term (< 1 year)', description: 'Quick gains and active trading' },
          { value: 'medium', label: 'Medium-term (1-5 years)', description: 'Building wealth gradually' },
          { value: 'long', label: 'Long-term (5+ years)', description: 'Retirement and major life goals' }
        ],
        meta: { category: 'goals', priority: 'high', version: '1.0' }
      }
    ]
  },
  {
    id: 'interests',
    title: 'Investment Interests',
    subtitle: 'Tell us what sectors and themes interest you',
    icon: 'Target',
    progress: 30,
    questions: [
      {
        id: 'sector_interests',
        type: 'multi-select',
        title: 'Which sectors interest you most?',
        subtitle: 'Select all that apply',
        description: 'We\'ll prioritize news and analysis from these sectors',
        required: true,
        validation: { min: 1, max: 8, message: 'Please select 1-8 sectors' },
        options: [
          { value: 'technology', label: 'Technology', icon: 'Laptop', color: 'blue' },
          { value: 'healthcare', label: 'Healthcare', icon: 'Heart', color: 'red' },
          { value: 'financial', label: 'Financial Services', icon: 'Building', color: 'green' },
          { value: 'energy', label: 'Energy', icon: 'Zap', color: 'yellow' },
          { value: 'consumer', label: 'Consumer Goods', icon: 'ShoppingCart', color: 'purple' },
          { value: 'industrial', label: 'Industrial', icon: 'Factory', color: 'gray' },
          { value: 'real-estate', label: 'Real Estate', icon: 'Home', color: 'orange' },
          { value: 'materials', label: 'Materials', icon: 'Package', color: 'brown' },
          { value: 'utilities', label: 'Utilities', icon: 'Power', color: 'teal' },
          { value: 'telecommunications', label: 'Telecommunications', icon: 'Phone', color: 'indigo' }
        ],
        meta: { category: 'preferences', priority: 'high', version: '1.0' }
      },
      {
        id: 'investment_themes',
        type: 'multi-select',
        title: 'Any specific investment themes?',
        subtitle: 'Optional - helps us find relevant opportunities',
        required: false,
        options: [
          { value: 'ai', label: 'Artificial Intelligence', icon: 'Brain', color: 'purple' },
          { value: 'esg', label: 'ESG/Sustainable', icon: 'Leaf', color: 'green' },
          { value: 'crypto', label: 'Cryptocurrency/Blockchain', icon: 'Bitcoin', color: 'orange' },
          { value: 'genomics', label: 'Genomics/Biotech', icon: 'Dna', color: 'red' },
          { value: 'ev', label: 'Electric Vehicles', icon: 'Car', color: 'blue' },
          { value: 'space', label: 'Space Technology', icon: 'Rocket', color: 'indigo' },
          { value: 'fintech', label: 'Fintech', icon: 'CreditCard', color: 'emerald' },
          { value: 'cloud', label: 'Cloud Computing', icon: 'Cloud', color: 'sky' }
        ],
        meta: { category: 'preferences', priority: 'medium', version: '1.0' }
      }
    ]
  },
  {
    id: 'goals',
    title: 'Investment Goals',
    subtitle: 'What are you hoping to achieve?',
    icon: 'Goal',
    progress: 50,
    questions: [
      {
        id: 'primary_goal',
        type: 'single-select',
        title: 'What\'s your primary investment goal?',
        required: true,
        options: [
          { 
            value: 'wealth-building', 
            label: 'Wealth Building', 
            description: 'Growing my money over time',
            icon: 'TrendingUp'
          },
          { 
            value: 'retirement', 
            label: 'Retirement Planning', 
            description: 'Saving for my future retirement',
            icon: 'Piggy Bank'
          },
          { 
            value: 'income', 
            label: 'Generate Income', 
            description: 'Regular dividends and cash flow',
            icon: 'DollarSign'
          },
          { 
            value: 'major-purchase', 
            label: 'Major Purchase', 
            description: 'House, car, or other big expenses',
            icon: 'Home'
          },
          { 
            value: 'learning', 
            label: 'Learning & Experience', 
            description: 'Understanding how markets work',
            icon: 'Book'
          }
        ],
        meta: { category: 'goals', priority: 'high', version: '1.0' }
      },
      {
        id: 'target_return',
        type: 'single-select',
        title: 'What annual return are you targeting?',
        subtitle: 'Be realistic - higher returns come with higher risk',
        required: true,
        options: [
          { value: 'conservative', label: '5-8% (Conservative)', description: 'Lower risk, steady growth' },
          { value: 'moderate', label: '8-12% (Moderate)', description: 'Balanced risk and return' },
          { value: 'aggressive', label: '12-20% (Aggressive)', description: 'Higher risk, higher potential' },
          { value: 'speculative', label: '20%+ (Speculative)', description: 'Very high risk, maximum potential' }
        ],
        meta: { category: 'goals', priority: 'high', version: '1.0' }
      },
      {
        id: 'investment_amount',
        type: 'single-select',
        title: 'How much are you planning to invest initially?',
        subtitle: 'This helps us recommend appropriate strategies',
        required: true,
        options: [
          { value: 'small', label: 'Under $1,000', description: 'Starting small and learning' },
          { value: 'medium', label: '$1,000 - $10,000', description: 'Building a foundation' },
          { value: 'large', label: '$10,000 - $50,000', description: 'Serious portfolio building' },
          { value: 'substantial', label: '$50,000+', description: 'Major investment commitment' }
        ],
        meta: { category: 'goals', priority: 'medium', version: '1.0' }
      }
    ]
  },
  {
    id: 'risk-profile',
    title: 'Risk Assessment',
    subtitle: 'Understanding your risk tolerance',
    icon: 'Shield',
    progress: 70,
    questions: [
      {
        id: 'risk_tolerance',
        type: 'scale',
        title: 'How comfortable are you with investment risk?',
        subtitle: 'Scale from 1 (very conservative) to 10 (very aggressive)',
        description: 'Higher risk can mean higher returns, but also higher potential losses',
        required: true,
        validation: { min: 1, max: 10 },
        meta: { category: 'risk', priority: 'high', version: '1.0' }
      },
      {
        id: 'loss_comfort',
        type: 'single-select',
        title: 'If your portfolio dropped 20% in a month, you would:',
        required: true,
        options: [
          { value: 'panic-sell', label: 'Sell everything immediately', description: 'Very low risk tolerance' },
          { value: 'worry-hold', label: 'Worry but hold your positions', description: 'Low risk tolerance' },
          { value: 'stay-calm', label: 'Stay calm and wait it out', description: 'Moderate risk tolerance' },
          { value: 'buy-more', label: 'Buy more at lower prices', description: 'High risk tolerance' }
        ],
        meta: { category: 'risk', priority: 'high', version: '1.0' }
      },
      {
        id: 'volatility_comfort',
        type: 'single-select',
        title: 'How do you feel about daily portfolio fluctuations?',
        required: true,
        options: [
          { value: 'hate', label: 'I hate seeing red numbers', description: 'Prefer stable investments' },
          { value: 'nervous', label: 'Makes me nervous but I can handle it', description: 'Some volatility OK' },
          { value: 'neutral', label: 'Part of investing, doesn\'t bother me', description: 'Comfortable with normal volatility' },
          { value: 'exciting', label: 'I find it exciting and motivating', description: 'High volatility tolerance' }
        ],
        meta: { category: 'risk', priority: 'medium', version: '1.0' }
      }
    ]
  },
  {
    id: 'ai-preferences',
    title: 'AI Assistant Preferences',
    subtitle: 'How would you like our AI to help you?',
    icon: 'Bot',
    progress: 85,
    questions: [
      {
        id: 'ai_involvement',
        type: 'single-select',
        title: 'How involved should our AI be in your investment decisions?',
        required: true,
        options: [
          { 
            value: 'minimal', 
            label: 'Minimal - Just provide data', 
            description: 'I want to make all decisions myself',
            icon: 'User'
          },
          { 
            value: 'advisory', 
            label: 'Advisory - Suggest and explain', 
            description: 'Help me understand but let me decide',
            icon: 'MessageCircle'
          },
          { 
            value: 'guided', 
            label: 'Guided - Active recommendations', 
            description: 'Give me specific advice and reasoning',
            icon: 'Navigation'
          },
          { 
            value: 'managed', 
            label: 'Managed - Handle routine decisions', 
            description: 'Automate simple decisions, ask for complex ones',
            icon: 'Settings'
          }
        ],
        meta: { category: 'ai', priority: 'high', version: '1.0' }
      },
      {
        id: 'notification_preferences',
        type: 'multi-select',
        title: 'When should we notify you?',
        subtitle: 'Select all that apply',
        required: true,
        options: [
          { value: 'major-moves', label: 'Major market movements (+/- 5%)', icon: 'TrendingUp' },
          { value: 'earnings', label: 'Earnings announcements', icon: 'Calendar' },
          { value: 'news', label: 'Breaking news affecting your stocks', icon: 'Newspaper' },
          { value: 'opportunities', label: 'New investment opportunities', icon: 'Star' },
          { value: 'portfolio-alerts', label: 'Portfolio rebalancing suggestions', icon: 'BarChart' },
          { value: 'weekly-summary', label: 'Weekly performance summary', icon: 'FileText' }
        ],
        meta: { category: 'ai', priority: 'medium', version: '1.0' }
      },
      {
        id: 'research_depth',
        type: 'single-select',
        title: 'How much detail do you want in research reports?',
        required: true,
        options: [
          { value: 'summary', label: 'Quick summaries only', description: 'Key points in 2-3 sentences' },
          { value: 'balanced', label: 'Balanced overview', description: 'Important details with context' },
          { value: 'detailed', label: 'Comprehensive analysis', description: 'Full breakdown with data and charts' },
          { value: 'custom', label: 'Let me choose each time', description: 'Flexible based on situation' }
        ],
        meta: { category: 'ai', priority: 'medium', version: '1.0' }
      }
    ]
  },
  {
    id: 'final',
    title: 'All Set!',
    subtitle: 'Review your preferences and get started',
    icon: 'CheckCircle',
    progress: 100,
    questions: [
      {
        id: 'marketing_consent',
        type: 'boolean',
        title: 'Keep me updated with market insights and product updates',
        subtitle: 'You can change this anytime in settings',
        required: false,
        meta: { category: 'consent', priority: 'low', version: '1.0' }
      },
      {
        id: 'data_sharing',
        type: 'single-select',
        title: 'Help improve our recommendations by sharing anonymous usage data?',
        required: true,
        options: [
          { value: 'yes', label: 'Yes, help improve the platform', description: 'Anonymous data only' },
          { value: 'no', label: 'No, keep my data private', description: 'No data sharing' }
        ],
        meta: { category: 'consent', priority: 'medium', version: '1.0' }
      }
    ]
  }
];

// Validation functions
export const validateAnswer = (question: OnboardingQuestion, answer: any): boolean => {
  if (question.required && (!answer || answer.length === 0)) {
    return false;
  }

  if (question.validation) {
    const { min, max, pattern } = question.validation;
    
    if (min !== undefined && answer < min) return false;
    if (max !== undefined && answer > max) return false;
    if (pattern && typeof answer === 'string' && !new RegExp(pattern).test(answer)) return false;
    
    if (question.type === 'multi-select') {
      if (min !== undefined && answer.length < min) return false;
      if (max !== undefined && answer.length > max) return false;
    }
  }

  return true;
};

// Default values for testing/development
export const DEFAULT_ANSWERS = {
  user_type: 'intermediate',
  investment_timeline: 'medium',
  sector_interests: ['technology', 'healthcare', 'financial'],
  investment_themes: ['ai', 'esg'],
  primary_goal: 'wealth-building',
  target_return: 'moderate',
  investment_amount: 'medium',
  risk_tolerance: 6,
  loss_comfort: 'stay-calm',
  volatility_comfort: 'neutral',
  ai_involvement: 'advisory',
  notification_preferences: ['major-moves', 'earnings', 'opportunities'],
  research_depth: 'balanced',
  marketing_consent: true,
  data_sharing: 'yes'
};
