export const initialAuthContextValue = {
    isLoading: true,
    user: {
        isAuthenticated: false,
        data: null
    },
    error: {
        status: null,
        message: null,
        code: null
    },
    setUser: () => { },
    verifyActivationToken: (token: string) => { },
    setPassword: (values: { password: string }, token?: string, redirectTo?: string) => { },
    logIn: (values: { email: string, password: string }) => { },
    logOut: () => { },
    registerWithEmail: (values: { email: string, firstName: string, lastName: string }) => { },
    changeName: (values: { firstName: string, lastName: string, password: string }) => { },
    changePassword: (values: { currentPassword: string, newPassword: string, retypeNewPassword: string }) => { },
    changeEmail: (values: { newEmail: string, password: string }) => { },
    validateChangeEmailRequest: (token: string) => { },
    updateEmail: (values: { password: string }, token: string) => { },
    updateProfilePicture: (values: { file: File }) => { },
    resetPassword: {
        initChangeRequest: (values: { email: string }) => { },
        verifyRequest: (token: string) => { },
        setNewPassword: (values: { newPassword: string }, token: string) => { }
    },
    clearError: () => { }
}