export interface WorkConfigFormData {
  startTime: string;
  endTime: string;
}

export const defaultValues: WorkConfigFormData = {
  startTime: "09:00",
  endTime: "18:00",
};
