export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="w-full min-h-[92vh]">
            <div className="max-w-screen-xl mx-auto">
                {children}
            </div>
        </main>
    )
}