export async function analizarSentimiento(params: { texto: string }): Promise<{ sentimiento: 'Positivo' | 'Negativo' | 'Neutro' }> {
    // Placeholder para la integración real de IA
    const lower = params.texto.toLowerCase();
    if (lower.includes('triste') || lower.includes('mal') || lower.includes('depresión') || lower.includes('estrés') || lower.includes('ansiedad')) {
        return { sentimiento: 'Negativo' };
    }
    if (lower.includes('feliz') || lower.includes('bien') || lower.includes('excelente') || lower.includes('mejor')) {
        return { sentimiento: 'Positivo' };
    }
    return { sentimiento: 'Neutro' };
}
