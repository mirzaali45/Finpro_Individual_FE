import { useVerifyForm } from "./hooks/useVerifyForm";
import FormProgressSteps from "./FormProgressStep";
import AccountFormSection from "./AccountFormSection";
import BusinessFormSection from "./BusinessFormSection";
import ReviewFormSection from "./ReviewFormSection";

interface VerifyFormProps {
  token: string;
}

export default function VerifyForm({ token }: VerifyFormProps) {
  const {
    formData,
    isLoading,
    error,
    activeSection,
    handleChange,
    handleSubmit,
    handleNext,
    handleBack
  } = useVerifyForm(token);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Registration
          </h1>
          <p className="mt-2 text-gray-600">Please set up your account</p>
        </div>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white p-8 shadow-md rounded-lg">
          <form onSubmit={handleSubmit}>
            {/* Progress steps */}
            <FormProgressSteps activeSection={activeSection} />

            {/* Section 1: Account Information */}
            {activeSection === 1 && (
              <AccountFormSection 
                formData={formData} 
                handleChange={handleChange} 
                handleNext={handleNext}
              />
            )}

            {/* Section 2: Business Information */}
            {activeSection === 2 && (
              <BusinessFormSection 
                formData={formData} 
                handleChange={handleChange} 
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}

            {/* Section 3: Review Information */}
            {activeSection === 3 && (
              <ReviewFormSection 
                formData={formData} 
                isLoading={isLoading}
                handleBack={handleBack}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}