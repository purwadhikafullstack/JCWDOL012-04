import { Response } from "express";

export function resSuccess(res: Response, message: string, data: null | object | any[], code?: number) {
    return res.status(200).send({
        code,
        msg: message,
        data: data
    });
}

export function resCreated(res: Response, message: string, data: null | object | any[]) {
    return res.status(201).send({
        msg: message,
        data: data
    });
}

export function resBadRequest(res: Response, message: string, data: null | object | any[], code?: number) {
    return res.status(400).send({
        code,
        msg: message,
        data: data
    });
}

export function resUnauthorized(res: Response, message: string, data: null | object | any[], code?: number) {
    return res.status(401).send({
        code,
        msg: message,
        data: data
    });
}

export function resForbidden(res: Response, message: string, data: null | object | any[], code?: number) {
    return res.status(403).send({
        code,
        msg: message,
        data: data
    });
}

export function resNotFound(res: Response, message: string, data: null | object | any[]) {
    return res.status(404).send({
        msg: message,
        data: data
    });
}

export function resInternalServerError(res: Response, message: string, data: null | object | any[]) {
    return res.status(500).send({
        msg: message,
        data: data
    });
}