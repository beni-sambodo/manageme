/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Lessons {
  _id: string;
  group: string;
  startTime: string;
  endTime: string;
  teacher: Teacher;
  branch: string;
  room: string;
  materials: string[];
  notes: string;
}
export interface User {
  id: string;
  _id: string;
  age?: number;
  avatar: Photo | null;
  email: Email;
  balance: string;
  selected_role: role;
  phone: string;
  name: string;
  username: string;
  roles: role[];
  school: string;
  group: string;
  __v: number;
}

export interface Photo {
  _id: string;
  location: string;
}
export interface Email {
  email: string;
  verifired: boolean;
}

export interface Teacher {
  avatar: any;
  user: user;
  name: string;
  username: string;
  _id: string;
  instagram: string;
  students: string[];
  rate: number;
}
interface user {
  phone: string;
  surname: any;
  avatar: any;
  _id: string;
  name: string;
  username: string;
}
export interface newStudent {
  createdAt: any;
  course: any;
  name: string;
  _id: string;
  user: user;
  surname: string;
  username: string;
  password: string;
  group: IGRoup;
  location: string;
  referal: string;
  comment: string;
  phone: string;
  status: string;
}

export interface Student {
  fullName: string;
  visitDate: string;
  timeIn: string;
  timeOut: string;
  bioData: BioData;
  payment: boolean;
}
export interface BioData {
  birthDate: string;
  email: string;
  center: string;
  courseInterest: string;
  contactDetails: ContactDetails;
}
export interface ContactDetails {
  parentContact: string;
  emailAddress: string;
  homeAddress: string;
  preferredName: string;
  comment: string;
  suggestedBy: string;
}
export interface Login {
  message: string;
  success: boolean;
  data: User;
  token: string;
}
export interface Us {
  username: string;
  password: string;
}
export interface CreateS {
  name: string;
  description: string;
  slogan: string;
  type: string;
  country: string;

  region: string;
  subscription_type: string;
  contact: string;
  rate: number;
  documents: any;
  images: any;
}

// Define an interface for the company object
export interface School {
  _id: string; // Unique identifier for the company
  name: string; // Name of the company
  description: string; // Description of the company
  slogan: string; // Slogan of the company
  ceo: string; // CEO ID
  images: Photo[] | string[]; // List of image IDs
  type: string; // Type of company, e.g., "MAIN"
  status: string; // Current status, e.g., "NEW"
  country: string; // Country where the company is located
  region: string; // Region within the country
  subscription_type: string;
  contact: string; // Contact email address
  documents: Photo[]; // Object containing related documents
  __v: number; // Version key
}

export interface role {
  school: School;
  role: string;
  _id: string;
  permissions: string[];
}

export interface registerU {
  username: string;
  password: string;
  name: string;
}
export interface Role {
  _id: string;
  name: string;
  role: string;
  description: string;
  permissions: string[];
  school: string;
}
export interface IRoom {
  _id: string;
  name: string;
  school: string;
  description: string;
  number: number;
  location: string;
}

export interface IPaymentUser {
  _id: string;
  user: User;
  group: string;
  payment: IPayment[];
  course: {
    _id: string;
    name: string;
    price: number | string;
    duration: number;
  };
  __v: 0;
}

export interface IPayment {
  _id: string;
  month: {
    _id: string;
    date: string;
  };
  mpv: number;
  mfp: number;
  debt: number;
  status: string;
  __v: number;
}

export interface Transaction {
  _id: string;
  user: User;
  school: string;
  sum: number;
  type: string;
  for: string;
  group: IGRoup;
  auto: boolean;
  admin: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IGRoup {
  _id: string;
  startDate: string;
  endDate: string;
  name: string;
  day_pattern: string[];
  paymentRecived: boolean;
  status: string;
  startTime: string;
  endTime: string;
  room: IRoom;
  course: ICourse;
  dates: string[];
  days: IAttandance[];
  students: newStudent[];
  teachers: Teacher[];
  level: string;
  space: number;
}

export interface IAttandance {
  _id: string;
  attendance: string | null;
  date: string;
}
export interface ICategory {
  _id: string;
  name: string;
}

export interface ICourse {
  _id: string;
  name: string;
  category: ICategory;
  image: {
    _id: string;
    key: string;
    location: string;
  };
  school: School;
  price: number;
  type: string[];
  teachers: IEmploye[];
  duration: number;
  isPublic: boolean;
  time: string;
  __v: number;
}

export interface FullData {
  user: User;
  attendances: { count: number; items: IAttandance[] };
  student: Student[];
}

export interface IPositions {
  _id: string;
  name: string;
  key: string;
  role: string;
  description: string;
  permissions: string[];
  type: string;
}
export interface IEmploye {
  _id: string;
  status: string;
  user: user;
  positions: position[];
}
export interface position {
  salary: number;
  salary_type: string;
  position: IPositions;
}
export interface AddEmployePosition extends Omit<position, 'position'> {
  position: string;
}
export interface ICourseC {
  _id: string;
  name: string;
  school: School;
  __v: 0;
}
