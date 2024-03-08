export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="w-full ">
                <div className="grid grid-cols-6 gap-0 max-w-screen-xl mx-auto">
                    {/* Sidebar */}
                    <div className="col-span-1 bg-purple-100 h-screen">
                        Sidebar
                    </div>
                    {/* Content */}
                    <div className="col-span-5 bg-purple-200">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}