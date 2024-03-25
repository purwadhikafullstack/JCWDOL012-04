import * as Yup from 'yup'

export const AddressValidationSchema = Yup.object({
    label: Yup.string()
        .min(2, 'Must be 2 characters or more')
        .required('Label is required'),
    address: Yup.string()
        .min(10, 'Must be 10 characters or more')
        .required('Address details are required'),
    isPrimaryAddress: Yup.boolean().required('Primary address is required'),
    cityId: Yup.number().required('City or district is required'),
    provinceId: Yup.string().required('Province is required'),
    latitude: Yup.string().required('Pinpoint is required'),
    longitude: Yup.string().required('Pinpoint is required')
})

export const AddressInitialValues = {
    label: '',
    address: '',
    isPrimaryAddress: false,
    provinceId: '',
    cityId: '',
    latitude: '',
    longitude: ''
}