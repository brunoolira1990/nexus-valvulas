import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface VariantOption {
  value: string;
  label: string;
  description?: string;
}

interface VariantSelectorProps {
  label: string;
  value: string | null;
  options: VariantOption[];
  onChange: (value: string) => void;
  variant?: "select" | "radio";
  className?: string;
}

export function VariantSelector({
  label,
  value,
  options,
  onChange,
  variant = "select",
  className,
}: VariantSelectorProps) {
  if (options.length === 0) return null;

  const selectedOption = options.find((opt) => opt.value === value);

  if (variant === "radio") {
    return (
      <div className={cn("space-y-3", className)}>
        <Label className="text-base font-semibold">{label}</Label>
        <RadioGroup value={value || ""} onValueChange={onChange}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer",
                  value === option.value
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                )}
                onClick={() => onChange(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                <div className="flex-1">
                  <Label
                    htmlFor={option.value}
                    className="font-medium cursor-pointer block"
                  >
                    {option.label}
                  </Label>
                  {option.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
        {selectedOption?.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {selectedOption.description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={label} className="text-base font-semibold">
        {label}
      </Label>
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger id={label} className="w-full">
          <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col">
                <span>{option.label}</span>
                {option.description && (
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedOption?.description && (
        <p className="text-sm text-muted-foreground mt-1">
          {selectedOption.description}
        </p>
      )}
    </div>
  );
}
