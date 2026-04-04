"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";
import { SENTINEL_NONE, fromSentinel, toSentinel } from "@shared/lib/form";

interface SelectOption {
  value: string;
  label: string;
}

interface OptionalSelectFieldProps<TForm extends FieldValues> {
  name: Path<TForm>;
  control: Control<TForm>;
  label: string;
  placeholder: string;
  options: SelectOption[];
  triggerClassName?: string;
}

export function OptionalSelectField<TForm extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  options,
  triggerClassName,
}: OptionalSelectFieldProps<TForm>) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={toSentinel(field.value as string | undefined)}
            onValueChange={(value) => field.onChange(fromSentinel(value))}
          >
            <SelectTrigger className={cn("transition-colors hover:border-primary/50", triggerClassName)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={SENTINEL_NONE}>{placeholder}</SelectItem>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
