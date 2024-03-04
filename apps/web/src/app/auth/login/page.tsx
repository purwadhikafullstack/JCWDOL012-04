import LoginForm from "@/components/login-form";

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-[var(--primaryColor)] p-3 md:h-36 text-white justify-end ">
                    <h1 className="text-2xl text-right">Palugada <br />Store</h1>
                </div>
                <LoginForm />
            </div>
        </main>
    )
}