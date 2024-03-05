import UserRegistrationForm from "@/components/auth/user-registration-form"

export default function UserRegistrationPage() {

    return (
        <main className="flex items-center justify-center my-16 md:my-0 md:h-screen ">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <UserRegistrationForm />
            </div>
        </main>
    )
}