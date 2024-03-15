export default function UnauthorizedPage(
    { redirectTo,
        ctaLabel
    }: {
        redirectTo?: string,
        ctaLabel?: string
    }
) {
    return (
        <main className="flex items-center justify-center h-screen ">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <h1 className="text-2xl text-center text-[var(--primaryColor)]">You are not authorized to view this page.</h1>
                <div className="flex flex-col gap-1 justify-center">
                    <button onClick={() => window.location.href = redirectTo ? redirectTo : '/'} className="text-blue-600">  {ctaLabel ? ctaLabel : "Go to Home"}</button>
                </div>
            </div>
        </main>
    )
}