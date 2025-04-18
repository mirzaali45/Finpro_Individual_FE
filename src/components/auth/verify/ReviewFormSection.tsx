import { Button } from "@/components/ui/button";
import { VerifyAccountFormData } from "@/types";

interface ReviewFormSectionProps {
  formData: VerifyAccountFormData;
  isLoading: boolean;
  handleBack: () => void;
}

export default function ReviewFormSection({
  formData,
  isLoading,
  handleBack,
}: ReviewFormSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Review Information
        </h3>

        <div className="border rounded-md p-4 bg-gray-50">
          <h4 className="font-medium mb-2">Account Information</h4>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.username}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.firstName} {formData.lastName}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.phone || "-"}
              </dd>
            </div>
          </dl>
        </div>

        {(formData.companyName || formData.address) && (
          <div className="border rounded-md p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Business Information</h4>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              {formData.companyName && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Company Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.companyName}
                  </dd>
                </div>
              )}
              {formData.address && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.address}
                    {formData.city && `, ${formData.city}`}
                    {formData.state && `, ${formData.state}`}
                    {formData.postalCode && ` ${formData.postalCode}`}
                    {formData.country && `, ${formData.country}`}
                  </dd>
                </div>
              )}
              {formData.website && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.website}
                  </dd>
                </div>
              )}
              {formData.taxNumber && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Tax/VAT Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formData.taxNumber}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Complete Registration"}
        </Button>
      </div>
    </div>
  );
}
