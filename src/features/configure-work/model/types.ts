export interface WorkConfigFormData {
  startTime: string;
  endTime: string;
  breakDuration: number;
}

export const defaultValues: WorkConfigFormData = {
  startTime: "09:00",
  endTime: "18:00",
  breakDuration: 30,
};
