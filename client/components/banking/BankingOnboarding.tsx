import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Shield,
  CreditCard,
  Building,
  Camera,
  Upload,
  Clock,
  AlertTriangle,
  Smartphone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BankingOnboardingProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function BankingOnboarding({
  onComplete,
  onCancel,
}: BankingOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    ssn: "",
    phoneNumber: "",
    email: "",

    // Address
    street: "",
    city: "",
    state: "",
    zipCode: "",

    // Employment
    employmentStatus: "",
    employer: "",
    annualIncome: "",

    // Bank Account
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "",

    // Verification
    idType: "",
    verificationMethod: "",
    phoneVerification: "",
  });

  const totalSteps = 7;

  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const devSkip = () => {
    // Auto-fill form with test data
    setFormData({
      firstName: "John",
      lastName: "Developer",
      dateOfBirth: "1990-01-01",
      ssn: "123-45-6789",
      phoneNumber: "(555) 123-4567",
      email: "developer@test.com",
      street: "123 Dev Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      employmentStatus: "employed",
      employer: "Tech Company",
      annualIncome: "100k-150k",
      bankName: "chase",
      routingNumber: "021000021",
      accountNumber: "1234567890",
      accountType: "checking",
      idType: "drivers-license",
      verificationMethod: "sms",
      phoneVerification: "123456",
    });
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Shield className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <p className="text-gray-600">
                We need some basic information to verify your identity and
                comply with banking regulations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateForm("firstName", e.target.value)}
                  placeholder="John"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateForm("lastName", e.target.value)}
                  placeholder="Smith"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateForm("dateOfBirth", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ssn">Social Security Number</Label>
                <Input
                  id="ssn"
                  value={formData.ssn}
                  onChange={(e) => updateForm("ssn", e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => updateForm("phoneNumber", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Building className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Address Information</h2>
              <p className="text-gray-600">
                Your current residential address for account verification.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => updateForm("street", e.target.value)}
                  placeholder="123 Main Street"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                    placeholder="New York"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateForm("state", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  >
                    <option value="">Select State</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="IL">Illinois</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="OH">Ohio</option>
                    <option value="GA">Georgia</option>
                    <option value="NC">North Carolina</option>
                    <option value="MI">Michigan</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => updateForm("zipCode", e.target.value)}
                    placeholder="10001"
                    maxLength={5}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <CreditCard className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Employment & Income</h2>
              <p className="text-gray-600">
                This helps us determine your account eligibility and limits.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <select
                  id="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={(e) =>
                    updateForm("employmentStatus", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                >
                  <option value="">Select Status</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <Label htmlFor="employer">Employer Name</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={(e) => updateForm("employer", e.target.value)}
                  placeholder="Company Name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="annualIncome">Annual Income</Label>
                <select
                  id="annualIncome"
                  value={formData.annualIncome}
                  onChange={(e) => updateForm("annualIncome", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                >
                  <option value="">Select Range</option>
                  <option value="under-25k">Under $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-75k">$50,000 - $75,000</option>
                  <option value="75k-100k">$75,000 - $100,000</option>
                  <option value="over-100k">Over $100,000</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Camera className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Identity Verification</h2>
              <p className="text-gray-600">
                Upload a government-issued ID to verify your identity.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="idType">ID Type</Label>
                <select
                  id="idType"
                  value={formData.idType}
                  onChange={(e) => updateForm("idType", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                >
                  <option value="">Select ID Type</option>
                  <option value="drivers-license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="state-id">State ID Card</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload Front of ID
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload Back of ID
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Secure Upload
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your documents are encrypted and securely stored. We'll
                        delete them after verification.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Phone Verification</h2>
              <p className="text-gray-600">
                We'll send a verification code to your phone number.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Phone Number</p>
                      <p className="text-sm text-gray-600">
                        {formData.phoneNumber || "(555) 123-4567"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button className="mb-4">Send Verification Code</Button>
                <p className="text-sm text-gray-600 mb-4">
                  We'll send a 6-digit code to your phone
                </p>
              </div>

              <div>
                <Label htmlFor="phoneVerification">
                  Enter Verification Code
                </Label>
                <Input
                  id="phoneVerification"
                  value={formData.phoneVerification}
                  onChange={(e) =>
                    updateForm("phoneVerification", e.target.value)
                  }
                  placeholder="123456"
                  maxLength={6}
                  className="mt-1 text-center text-2xl tracking-widest"
                />
              </div>

              <div className="text-center">
                <Button variant="ghost" size="sm">
                  Didn't receive a code? Resend
                </Button>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Building className="h-12 w-12 text-blue-600 mx-auto" />
              <h2 className="text-2xl font-bold">Link Bank Account</h2>
              <p className="text-gray-600">
                Connect your existing bank account for transfers and funding.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <select
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => updateForm("bankName", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                >
                  <option value="">Select Your Bank</option>
                  <option value="chase">Chase Bank</option>
                  <option value="bofa">Bank of America</option>
                  <option value="wells">Wells Fargo</option>
                  <option value="citi">Citibank</option>
                  <option value="us-bank">US Bank</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    value={formData.routingNumber}
                    onChange={(e) =>
                      updateForm("routingNumber", e.target.value)
                    }
                    placeholder="123456789"
                    maxLength={9}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      updateForm("accountNumber", e.target.value)
                    }
                    placeholder="1234567890"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <select
                  id="accountType"
                  value={formData.accountType}
                  onChange={(e) => updateForm("accountType", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                >
                  <option value="">Select Account Type</option>
                  <option value="checking">Checking Account</option>
                  <option value="savings">Savings Account</option>
                </select>
              </div>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Bank Verification
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        We'll make two small deposits (under $1) to verify your
                        account. This may take 1-2 business days.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h2 className="text-2xl font-bold">Account Setup Complete!</h2>
              <p className="text-gray-600">
                Your banking account is being processed. You'll receive an email
                confirmation shortly.
              </p>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-800 mb-3">
                  What's Next?
                </h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Identity verification (1-2 business days)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Bank account verification (1-2 business days)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Account activation email</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Start funding your investment account</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                onClick={onComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue to Dashboard
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Banking Account Setup</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-300"
            >
              <Clock className="h-3 w-3 mr-1" />
              Dev Mode
            </Badge>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          <Separator />

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="ghost"
              onClick={devSkip}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              disabled={currentStep === totalSteps}
            >
              Dev Skip Step
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={onComplete}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                Complete Setup
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
