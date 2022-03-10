export interface Tarjetas {
    "tarjetas":Array<{
        "idUsuario": number,
        "id": number,
        "nombreTitular":string,
        "nombreTarjeta": string,
        "numeroTarjeta": string,
        "expiracion": string,      
        "cvv": string,
        "pin": string
        "nota": string,
    }>,
    "Mensaje":string
}
