import * as Yup from 'yup'

export const changeNameValidationSchema = Yup.object({
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