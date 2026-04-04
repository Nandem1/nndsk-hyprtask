export interface SleepConfigFormData {
  wakeupTime: string;
  desiredSleepHours: number;
  sleepReminders: boolean;
}

export const defaultValues: SleepConfigFormData = {
  wakeupTime: "07:00",
  desiredSleepHours: 7,
  sleepReminders: true,
};
