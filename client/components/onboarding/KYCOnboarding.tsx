import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Upload,
  Camera,
  Shield,
  DollarSign,
  Target,
  Clock,
  User,
  X,
  FileText,
  Building,
  AlertTriangle,
  Info,
} from "lucide-react";

interface KYCData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  phoneNumber: string;
  email: string;

  // Address Information
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;

  // Employment Information
  employmentStatus: string;
  employer: string;
  jobTitle: string;
  annualIncome: string;
  netWorth: string;
  liquidNetWorth: string;

  // Investment Profile
  riskTolerance: "conservative" | "moderate" | "aggressive" | "";
  investmentGoal: "growth" | "income" | "balanced" | "retirement" | "";
  timeHorizon: "short" | "medium" | "long" | "";
  experience: "beginner" | "intermediate" | "advanced" | "";

  // Investment Amounts
  initialAmount: number;
  monthlyContribution: number;

  // Documents
  photoIdUploaded: boolean;

  // Agreements
  termsAccepted: boolean;
  privacyAccepted: boolean;
  disclosuresAccepted: boolean;
}

interface KYCOnboardingProps {
  onComplete: (data: KYCData) => void;
  onSkip: () => void;
}

export function KYCOnboarding({ onComplete, onSkip }: KYCOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<KYCData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    ssn: "",
    phoneNumber: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    employmentStatus: "",
    employer: "",
    jobTitle: "",
    annualIncome: "",
    netWorth: "",
    liquidNetWorth: "",
    riskTolerance: "",
    investmentGoal: "",
    timeHorizon: "",
    experience: "",
    initialAmount: 1000,
    monthlyContribution: 100,
    photoIdUploaded: false,
    termsAccepted: false,
    privacyAccepted: false,
    disclosuresAccepted: false,
  });

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (field: keyof KYCData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipWithDefaults = () => {
    const defaultData: KYCData = {
      ...data,
      firstName: "John",
      lastName: "Developer",
      dateOfBirth: "1990-01-01",
      ssn: "123-45-6789",
      phoneNumber: "(555) 123-4567",
      email: "dev@example.com",
      streetAddress: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      employmentStatus: "employed",
      employer: "Tech Company",
      jobTitle: "Software Engineer",
      annualIncome: "100k-150k",
      netWorth: "100k-250k",
      liquidNetWorth: "50k-100k",
      riskTolerance: "moderate",
      investmentGoal: "growth",
      timeHorizon: "long",
      experience: "intermediate",
      photoIdUploaded: true,
      termsAccepted: true,
      privacyAccepted: true,
      disclosuresAccepted: true,
    };
    onComplete(defaultData);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.firstName && data.lastName && data.dateOfBirth && data.ssn;
      case 2:
        return data.streetAddress && data.city && data.state && data.zipCode;
      case 3:
        return data.phoneNumber && data.email;
      case 4:
        return data.employmentStatus && data.annualIncome;
      case 5:
        return data.photoIdUploaded;
      case 6:
        return data.riskTolerance && data.investmentGoal && data.timeHorizon;
      case 7:
        return true; // Investment amounts have defaults
      case 8:
        return (
          data.termsAccepted && data.privacyAccepted && data.disclosuresAccepted
        );
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Let's get to know you</h2>
              <p className="text-muted-foreground">
                We need some basic information to set up your account
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={data.firstName}
                    onChange={(e) => updateData("firstName", e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={data.lastName}
                    onChange={(e) => updateData("lastName", e.target.value)}
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={data.dateOfBirth}
                  onChange={(e) => updateData("dateOfBirth", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You must be 18 or older to open an account
                </p>
              </div>

              <div>
                <Label htmlFor="ssn">Social Security Number *</Label>
                <Input
                  id="ssn"
                  value={data.ssn}
                  onChange={(e) => updateData("ssn", e.target.value)}
                  placeholder="123-45-6789"
                  maxLength={11}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Required by law for tax reporting and identity verification
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">What's your address?</h2>
              <p className="text-muted-foreground">
                We need your current residential address
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="streetAddress">Street Address *</Label>
                <Input
                  id="streetAddress"
                  value={data.streetAddress}
                  onChange={(e) => updateData("streetAddress", e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => updateData("city", e.target.value)}
                    placeholder="San Francisco"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={data.state}
                    onValueChange={(value) => updateData("state", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="PA">Pennsylvania</SelectItem>
                      <SelectItem value="OH">Ohio</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      <SelectItem value="NC">North Carolina</SelectItem>
                      <SelectItem value="MI">Michigan</SelectItem>
                      <SelectItem value="NJ">New Jersey</SelectItem>
                      <SelectItem value="VA">Virginia</SelectItem>
                      <SelectItem value="TN">Tennessee</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="IN">Indiana</SelectItem>
                      <SelectItem value="MO">Missouri</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                      <SelectItem value="WI">Wisconsin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={data.zipCode}
                  onChange={(e) => updateData("zipCode", e.target.value)}
                  placeholder="94102"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Contact information</h2>
              <p className="text-muted-foreground">
                How can we reach you with important updates?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={data.phoneNumber}
                  onChange={(e) => updateData("phoneNumber", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => updateData("email", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Employment & Income</h2>
              <p className="text-muted-foreground">
                This helps us understand your financial situation
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select
                  value={data.employmentStatus}
                  onValueChange={(value) =>
                    updateData("employmentStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {data.employmentStatus === "employed" && (
                <>
                  <div>
                    <Label htmlFor="employer">Employer</Label>
                    <Input
                      id="employer"
                      value={data.employer}
                      onChange={(e) => updateData("employer", e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={data.jobTitle}
                      onChange={(e) => updateData("jobTitle", e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="annualIncome">Annual Income *</Label>
                <Select
                  value={data.annualIncome}
                  onValueChange={(value) => updateData("annualIncome", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-25k">Under $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                    <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                    <SelectItem value="100k-150k">
                      $100,000 - $150,000
                    </SelectItem>
                    <SelectItem value="150k-250k">
                      $150,000 - $250,000
                    </SelectItem>
                    <SelectItem value="over-250k">Over $250,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="netWorth">Net Worth</Label>
                <Select
                  value={data.netWorth}
                  onValueChange={(value) => updateData("netWorth", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select net worth range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-50k">Under $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="100k-250k">
                      $100,000 - $250,000
                    </SelectItem>
                    <SelectItem value="250k-500k">
                      $250,000 - $500,000
                    </SelectItem>
                    <SelectItem value="500k-1m">
                      $500,000 - $1,000,000
                    </SelectItem>
                    <SelectItem value="over-1m">Over $1,000,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="liquidNetWorth">Liquid Net Worth</Label>
                <Select
                  value={data.liquidNetWorth}
                  onValueChange={(value) => updateData("liquidNetWorth", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select liquid net worth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-25k">Under $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="100k-250k">
                      $100,000 - $250,000
                    </SelectItem>
                    <SelectItem value="over-250k">Over $250,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Verify your identity</h2>
              <p className="text-muted-foreground">
                Upload a photo of your government-issued ID
              </p>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {data.photoIdUploaded ? (
                  <div className="text-green-600">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                    <p className="font-semibold">ID Successfully Uploaded</p>
                    <p className="text-sm text-muted-foreground">
                      We'll verify your identity within 1-2 business days
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="font-semibold mb-2">Upload Photo ID</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Driver's license, passport, or state ID
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => updateData("photoIdUploaded", true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 mb-1">
                      Why do we need this?
                    </p>
                    <p className="text-blue-800">
                      Federal law requires us to verify your identity before you
                      can start trading. Your information is encrypted and
                      secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Investment profile</h2>
              <p className="text-muted-foreground">
                Help us understand your investment goals and risk tolerance
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold">
                  Risk Tolerance *
                </Label>
                <RadioGroup
                  value={data.riskTolerance}
                  onValueChange={(value) => updateData("riskTolerance", value)}
                  className="mt-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="conservative" id="conservative" />
                    <Label
                      htmlFor="conservative"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Conservative</div>
                      <div className="text-sm text-muted-foreground">
                        Minimize risk, accept lower potential returns
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                      <div className="font-medium">Moderate</div>
                      <div className="text-sm text-muted-foreground">
                        Balance risk and return for steady growth
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="aggressive" id="aggressive" />
                    <Label
                      htmlFor="aggressive"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Aggressive</div>
                      <div className="text-sm text-muted-foreground">
                        Pursue maximum growth, accept high volatility
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold">
                  Investment Goal *
                </Label>
                <RadioGroup
                  value={data.investmentGoal}
                  onValueChange={(value) => updateData("investmentGoal", value)}
                  className="mt-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="growth" id="goal-growth" />
                    <Label
                      htmlFor="goal-growth"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Growth</div>
                      <div className="text-sm text-muted-foreground">
                        Build wealth over time
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="income" id="goal-income" />
                    <Label
                      htmlFor="goal-income"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Income</div>
                      <div className="text-sm text-muted-foreground">
                        Generate regular income
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="retirement" id="goal-retirement" />
                    <Label
                      htmlFor="goal-retirement"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Retirement</div>
                      <div className="text-sm text-muted-foreground">
                        Save for retirement
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold">
                  Time Horizon *
                </Label>
                <RadioGroup
                  value={data.timeHorizon}
                  onValueChange={(value) => updateData("timeHorizon", value)}
                  className="mt-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="short" id="time-short" />
                    <Label
                      htmlFor="time-short"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Short-term (1-3 years)</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="medium" id="time-medium" />
                    <Label
                      htmlFor="time-medium"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">
                        Medium-term (3-10 years)
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="long" id="time-long" />
                    <Label
                      htmlFor="time-long"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Long-term (10+ years)</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Investment amounts</h2>
              <p className="text-muted-foreground">
                How much would you like to start with?
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="initial">Initial Investment</Label>
                <div className="mt-2">
                  <Slider
                    value={[data.initialAmount]}
                    onValueChange={(value) =>
                      updateData("initialAmount", value[0])
                    }
                    max={10000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                  <div className="text-center mt-2 font-semibold">
                    ${data.initialAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="monthly">Monthly Contribution (Optional)</Label>
                <div className="mt-2">
                  <Slider
                    value={[data.monthlyContribution]}
                    onValueChange={(value) =>
                      updateData("monthlyContribution", value[0])
                    }
                    max={1000}
                    min={0}
                    step={25}
                    className="w-full"
                  />
                  <div className="text-center mt-2 font-semibold">
                    {data.monthlyContribution === 0
                      ? "No monthly contribution"
                      : `$${data.monthlyContribution}/month`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Terms & Agreements</h2>
              <p className="text-muted-foreground">
                Please review and accept our terms to complete setup
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="terms"
                  checked={data.termsAccepted}
                  onCheckedChange={(checked) =>
                    updateData("termsAccepted", checked)
                  }
                />
                <Label
                  htmlFor="terms"
                  className="flex-1 cursor-pointer text-sm"
                >
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 underline">
                    User Agreement
                  </a>
                  *
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="privacy"
                  checked={data.privacyAccepted}
                  onCheckedChange={(checked) =>
                    updateData("privacyAccepted", checked)
                  }
                />
                <Label
                  htmlFor="privacy"
                  className="flex-1 cursor-pointer text-sm"
                >
                  I acknowledge the{" "}
                  <a href="#" className="text-blue-600 underline">
                    Privacy Policy
                  </a>{" "}
                  and consent to data processing *
                </Label>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="disclosures"
                  checked={data.disclosuresAccepted}
                  onCheckedChange={(checked) =>
                    updateData("disclosuresAccepted", checked)
                  }
                />
                <Label
                  htmlFor="disclosures"
                  className="flex-1 cursor-pointer text-sm"
                >
                  I have read and understand the{" "}
                  <a href="#" className="text-blue-600 underline">
                    Risk Disclosures
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 underline">
                    FINRA BrokerCheck
                  </a>{" "}
                  information *
                </Label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-900 mb-1">
                      Important Notice
                    </p>
                    <p className="text-yellow-800">
                      Investing involves risk, including potential loss of
                      principal. Past performance does not guarantee future
                      results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkip}
            className="absolute right-0 top-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle>Account Setup</CardTitle>
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          <div className="text-center">
            <Button
              variant="link"
              onClick={skipWithDefaults}
              className="text-sm"
            >
              Skip with Default Data (Development Mode)
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button onClick={nextStep} disabled={!canProceed()}>
              {currentStep === totalSteps ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
