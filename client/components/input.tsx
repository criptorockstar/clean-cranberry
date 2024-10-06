"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideMinus, LucidePlus } from "lucide-react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { HiFingerPrint, HiAtSymbol, HiOutlineUser } from "react-icons/hi";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  numeric?: boolean;
  username?: boolean;
  type?: string;
  className?: string;
  search?: boolean;
  onIncrease?: () => void;
  onDecrease?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { error, numeric = false, className, type = "text", username = false, search = false, value, onChange, onIncrease, onDecrease, ...props },
    ref
  ) => {
    const [numericValue, setNumericValue] = React.useState<number>(Number(value) || 1);
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    React.useEffect(() => {
      setNumericValue(Number(value));
    }, [value]);

    const increment = () => {
      const newValue = numericValue + 1;
      setNumericValue(newValue);
      if (onChange) {
        const syntheticEvent = { target: { value: String(newValue) } } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
      if (onIncrease) onIncrease(); // Llama a la función de incremento
    };

    const decrement = () => {
      if (numericValue > 1) {
        const newValue = numericValue - 1;
        setNumericValue(newValue);
        if (onChange) {
          const syntheticEvent = { target: { value: String(newValue) } } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
        if (onDecrease) onDecrease();
      }
    };

    return (
      <div className="relative">
        {numeric ? (
          <div className="flex items-center">
            {/* Botón para decrementar */}
            <div
              onClick={decrement}
              className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              <LucideMinus className="w-4 h-4" />
            </div>

            {/* Input numérico */}
            <ShadcnInput
              type="text"
              className={cn("h-11 w-full text-center border-l-0 border-r-0 border border-black px-10", className)}
              value={numericValue}
              onChange={(e) => {
                setNumericValue(Number(e.target.value));
                if (onChange) onChange(e); // Propagación del cambio manual
              }}
              ref={ref}
              {...props}
            />

            {/* Botón para incrementar */}
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
            {/* Input regular o de contraseña */}
            <ShadcnInput
              type={type === "password" && !showPassword ? "password" : "text"}
              className={cn(
                "block w-full h-11 border border-black px-3",
                username ? "" : "",
                search ? "pl-10" : "",
                error ? "border-red-500" : "",
                className
              )}
              value={value}
              onChange={onChange}
              ref={ref}
              {...props}
            />

            {/* Icono para cambiar visibilidad de la contraseña */}
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

            {/* Icono para email */}
            {type === "email" && (
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <HiAtSymbol className="text-muted-foreground" />
              </div>
            )}

            {/* Icono para username */}
            {username && (
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                <HiOutlineUser className="text-muted-foreground" />
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
