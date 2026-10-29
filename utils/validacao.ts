export function converterNumero(texto: string): number | null {
    const limpo = texto.trim().replace(',', '.');

    if (!/^-?\d+(\.\d+)?$/.test(limpo)) {
        return null;
    }

    return Number(limpo);
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

export function dataLocalISO(data: Date = new Date()): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}

export function emailValido(texto: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto.trim());
}
