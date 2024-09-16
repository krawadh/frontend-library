import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mt-4">
          Oops! Page not found.
        </h2>
        <p className="text-gray-500 mt-2">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <div className="mt-6">
          <Link to="/">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white text-base">
              Go Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <img
        src="/logo.png" // Path to your logo from the public folder
        alt="Library Portal Logo"
        className="h-20 mt-10" // Adjust size as necessary
      />
    </div>
  );
};

export default PageNotFound;
