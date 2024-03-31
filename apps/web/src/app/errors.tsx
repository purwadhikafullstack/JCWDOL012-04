
function Errors({ statusCode, message }: { readonly statusCode: number, readonly message: string }) {
    return (
        <div className="flex items-center justify-center h-screen" >
            <div className="text-center">
                <h1 className="text-4xl font-bold">{statusCode}</h1>
                <p className="text-xl">{message}</p>
            </div>
        </div>
    );
}

export default Errors;