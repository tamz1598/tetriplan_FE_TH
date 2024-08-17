export interface Task {
    _id?: string;
    userID?: string;
    taskName: string;
    description: string;
    category: string;
    calendar: string;
    startTime: string;
    endTime: string;
    duration: number;
    completionStatus: boolean;
    label: string;
    priority: string;
    dateAdded?: string;
    __v: number;
}
  