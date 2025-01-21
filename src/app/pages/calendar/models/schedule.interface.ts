import { ITeacher } from "../../teachers/models/teacher.interface";

export interface ISchedule {
  id: string;
  date: string;
  schedule: string,
  teacher: ITeacher;
  student: string;
}
