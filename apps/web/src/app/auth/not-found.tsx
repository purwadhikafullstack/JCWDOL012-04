import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col w-full h-screen items-center justify-center gap-3 p-6">
            <h1 className="text-2xl text-center">404 | This page could not be found.</h1>
            <Link className="bold text-purple-800" href="/">
                <button className="px-4 mt-6 text-purple-700">Go To Home Page</button>
            </Link>
        </div>
    )
}