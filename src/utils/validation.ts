// src/utils/validation.ts
import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const registerSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  firstName: yup
    .string()
    .required('First name is required'),
  lastName: yup
    .string()
    .required('Last name is required'),
  role: yup
    .string()
    .oneOf(['CUSTOMER', 'EXPERT'], 'Invalid role selected')
    .required('Role is required'),
  company: yup
    .string()
    .when('role', {
      is: 'CUSTOMER',
      then: (schema) => schema.required('Company name is required'),
    }),
});

export const expertProfileSchema = yup.object({
  expertise: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one expertise area is required'),
  location: yup
    .string()
    .required('Location is required'),
  languages: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one language is required'),
  biography: yup
    .string()
    .min(100, 'Biography must be at least 100 characters')
    .required('Biography is required'),
  hourlyRate: yup
    .number()
    .min(0, 'Hourly rate must be positive')
    .required('Hourly rate is required'),
});

export const projectSchema = yup.object({
  title: yup
    .string()
    .min(5, 'Title must be at least 5 characters')
    .required('Title is required'),
  description: yup
    .string()
    .min(50, 'Description must be at least 50 characters')
    .required('Description is required'),
  type: yup
    .string()
    .oneOf(['CALL', 'REPORT'], 'Invalid project type')
    .required('Project type is required'),
  startDate: yup
    .date()
    .min(new Date(), 'Start date must be in the future')
    .required('Start date is required'),
  endDate: yup
    .date()
    .min(yup.ref('startDate'), 'End date must be after start date'),
  budget: yup
    .number()
    .min(0, 'Budget must be positive'),
});