
export interface Task {
  id: string;
  label: string;
  completed: boolean;
}

export interface Session {
  id: string;
  title: string;
  duration: string;
  tasks: Task[];
  completed: boolean;
}

export interface DayProgress {
  dayNumber: number;
  sessions: Session[];
  dateString: string;
  mistakes: string;
}

export interface UserProgress {
  startDate: string;
  days: DayProgress[];
  points: number;
  streak: number;
  rank: string;
  lastVisitDate: string;
}

export enum UserRank {
  BEGINNER = 'Beginner',
  FOCUSED = 'Focused',
  CONSISTENT = 'Consistent',
  EXAM_READY = 'Exam Ready'
}
