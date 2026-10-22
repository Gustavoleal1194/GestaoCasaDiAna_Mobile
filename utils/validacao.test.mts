import assert from 'node:assert/strict';
import { test } from 'node:test';
import { converterNumero, dataValida } from './validacao.ts';

test('converterNumero aceita ponto e vírgula', () => {
    assert.equal(converterNumero('2,5'), 2.5);
    assert.equal(converterNumero('2.5'), 2.5);
    assert.equal(converterNumero(' 10 '), 10);
});

test('converterNumero rejeita vazio e lixo', () => {
    for (const texto of ['', '  ', 'abc', '1.2.3', '2,5kg', 'Infinity', '1e3', '0x10']) {
        assert.equal(converterNumero(texto), null, `"${texto}" deveria ser rejeitado`);
    }
});

test('dataValida aceita AAAA-MM-DD real', () => {
    assert.ok(dataValida('2026-10-22'));
    assert.ok(dataValida('2024-02-29'));
});

test('dataValida rejeita formato e dia inexistente', () => {
    for (const texto of ['22/10/2026', '2026-2-1', '2026-02-30', '2025-02-29', '']) {
        assert.equal(dataValida(texto), false, `"${texto}" deveria ser rejeitado`);
    }
});
