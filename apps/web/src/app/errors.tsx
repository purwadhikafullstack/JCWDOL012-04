// // pages/_error.js
// import React from 'react';

// export default function Errors(statusCode: number) {
//     const pageError = (status:number, message:string) => (
//         <div className = "flex items-center justify-center h-screen" >
//             <div className="text-center">
//                 <h1 className="text-4xl font-bold">{status}</h1>
//                 <p className="text-xl">{message}</p>
//             </div>
//         </div>
//     )

//     switch (statusCode) {
//         case 404:
//             return pageError(404, "This page could not be found");
//         case 500:
//             return pageError(500, "An error occurred on server");
//         default:
//             return pageError(statusCode, "An error occurred");
//     }
// }
import { NextApiResponse } from "next";
// pages/_error.js
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