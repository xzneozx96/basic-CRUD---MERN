import { Moment } from "moment";

export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  phone_number: string;
  date_of_birth: Moment;
}
