import * as Yup from 'yup'

export const userRegistrationValidationSchema = Yup.object({
    firstName: Yup.string()
        .min(2, 'Must be 2 characters at minimum')
        .max(30, 'Must be less than 30 characters')
        .required('Required'),
    lastName: Yup.string()
        .min(2, 'Must be 2 characters at minimum')
        .max(30, 'Must be less than 30 characters')
        .required('Required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
})

export const setPasswordValidationSchema = Yup.object({
    password: Yup.string()
        .min(6, 'Must be 6 characters at minimum')
        .max(30, 'Must be less than 30 characters')
        .required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
})