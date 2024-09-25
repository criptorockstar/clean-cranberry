import * as React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucidePlus, LucideMinus } from "lucide-react";
import { HiFingerPrint, HiAtSymbol, HiOutlineUser, HiOutlineSearch } from "react-icons/hi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  className?: string;
  numeric?: boolean;
  type?: string;
  username?: boolean;
  search?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, numeric = false, className, type = "text", username = false, search = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [numericValue, setNumericValue] = React.useState<number>(1);

    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    // Increment and Decrement Handlers for numeric input
    const increment = () => setNumericValue((prev) => prev + 1);
    const decrement = () => setNumericValue((prev) => (prev > 1 ? prev - 1 : prev));

    return (
      <div className="relative">
        {numeric ? (
          <div className="flex items-center">
            {/* Decrement Button */}
            <div
              onClick={decrement}
              className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              <LucideMinus className="w-4 h-4" />
            </div>

            {/* Numeric Input */}
            <ShadcnInput
              type="text"
              className={cn(
                "h-11 w-full text-center border-l-0 border-r-0 border border-black px-10",
                className
              )}
              value={numericValue}
              onChange={(e) => setNumericValue(Number(e.target.value))}
              ref={ref}
              {...props}
            />

            {/* Increment Button */}
            <div
              onClick={increment}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              <LucidePlus className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <>
            {/* Regular or Password Input */}
            <ShadcnInput
              type={type === "password" && !showPassword ? "password" : "text"}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground placeholder:select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                { 'pr-9': type === "password" || type === "email" || username || search },  // Padding derecho extra
                className,
              )}
              ref={ref}
              {...props}
            />

            {/* Toggle Password Visibility */}
            {type === "password" && (
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                style={{ top: "50%", transform: "translateY(-50%)" }}
                onClick={toggleShowPassword}
              >
                {!showPassword ? (
                  <HiFingerPrint className="text-muted-foreground" />
                ) : (
                  <HiFingerPrint className="text-muted-foreground text-purple-500" />
                )}
              </div>
            )}

            {/* Email */}
            {type === "email" && (
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <HiAtSymbol className="text-muted-foreground" />
              </div>
            )}

            {/* Username */}
            {username && (
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <HiOutlineUser className="text-muted-foreground" />
              </div>
            )}

            {/* Search */}
            {search && (
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <HiOutlineSearch className="text-muted-foreground" />
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
