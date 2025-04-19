interface FormProgressStepsProps {
  activeSection: number;
}

export default function FormProgressSteps({
  activeSection,
}: FormProgressStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div
          className={`flex items-center ${
            activeSection >= 1 ? "text-primary" : "text-gray-400"
          }`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              activeSection >= 1
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <span className="ml-2 text-sm font-medium">Account</span>
        </div>
        <div
          className={`flex-1 border-t ${
            activeSection >= 2 ? "border-primary" : "border-gray-200"
          } mx-2`}
        ></div>
        <div
          className={`flex items-center ${
            activeSection >= 2 ? "text-primary" : "text-gray-400"
          }`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              activeSection >= 2
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <span className="ml-2 text-sm font-medium">Business</span>
        </div>
        <div
          className={`flex-1 border-t ${
            activeSection >= 3 ? "border-primary" : "border-gray-200"
          } mx-2`}
        ></div>
        <div
          className={`flex items-center ${
            activeSection >= 3 ? "text-primary" : "text-gray-400"
          }`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              activeSection >= 3
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
          <span className="ml-2 text-sm font-medium">Confirm</span>
        </div>
      </div>
    </div>
  );
}
