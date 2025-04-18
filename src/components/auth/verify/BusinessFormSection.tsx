import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VerifyAccountFormData } from "@/types";

interface BusinessFormSectionProps {
  formData: VerifyAccountFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
  handleBack: () => void;
}

export default function BusinessFormSection({
  formData,
  handleChange,
  handleNext,
  handleBack,
}: BusinessFormSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-gray-700"
        >
          Company Name
        </label>
        <Input
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State/Province
          </label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700"
          >
            Postal Code
          </label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="website"
          className="block text-sm font-medium text-gray-700"
        >
          Website
        </label>
        <Input
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div>
        <label
          htmlFor="taxNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Tax/VAT Number
        </label>
        <Input
          id="taxNumber"
          name="taxNumber"
          value={formData.taxNumber}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
