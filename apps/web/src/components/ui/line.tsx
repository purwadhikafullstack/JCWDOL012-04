export default function LineWithText({ text }: { text: string }) {
    return (
        <div className="inline-flex items-center justify-center w-full bg-inherit">
            <hr className="w-full h-px my-8 bg-purple-300 border-1" />
            <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-inherit left-1/2">
                {text ? text : "or"}
            </span>
        </div>
    )
}
