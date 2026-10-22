export function converterNumero(texto: string): number | null {
    const limpo = texto.trim().replace(',', '.');

    if (limpo === '') {
        return null;
    }

    const numero = Number(limpo);
    return Number.isNaN(numero) ? null : numero;
}

export function dataValida(texto: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
        return false;
    }

    const [ano, mes, dia] = texto.split('-').map(Number);
    const data = new Date(Date.UTC(ano, mes - 1, dia));

    return data.getUTCFullYear() === ano
        && data.getUTCMonth() === mes - 1
        && data.getUTCDate() === dia;
}
