/* CSV/TXT parsing and certificate preflight. No data leaves the browser. */
(() => {
  "use strict";

  function parseCsv(input) {
    const text = String(input).replace(/^\uFEFF/, "");
    // Count separators only outside quotes in the first logical row.
    const counts = new Map([[",", 0], [";", 0], ["\t", 0]]);
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        if (quoted && text[i + 1] === '"') i++;
        else quoted = !quoted;
      } else if (!quoted) {
        if (char === "\n" || char === "\r") break;
        if (counts.has(char)) counts.set(char, counts.get(char) + 1);
      }
    }
    const delimiter = [...counts].sort((a, b) => b[1] - a[1])[0][0];
    const rows = [];
    let row = [], value = "", mode = "start", line = 1, rowLine = 1;
    const fail = (message) => { throw new Error(`Linha ${line}: ${message}`); };
    const cell = () => { row.push(value.trim()); value = ""; mode = "start"; };
    const finishRow = () => {
      cell();
      if (row.some((entry) => entry !== "")) rows.push({ cells: row, line: rowLine });
      row = [];
    };
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (mode === "quoted") {
        if (char === '"') {
          if (text[i + 1] === '"') { value += '"'; i++; }
          else mode = "closed";
        } else {
          value += char;
          if (char === "\n" || (char === "\r" && text[i + 1] !== "\n")) line++;
        }
      } else if (char === delimiter) cell();
      else if (char === "\n" || char === "\r") {
        finishRow();
        if (char === "\r" && text[i + 1] === "\n") i++;
        line++; rowLine = line;
      } else if (char === '"') {
        if (mode !== "start" || value.trim()) fail("aspas em posição inválida.");
        value = ""; mode = "quoted";
      } else if (mode === "closed") {
        if (!/\s/.test(char)) fail("há texto após o fechamento das aspas.");
      } else {
        value += char;
        if (char.trim()) mode = "plain";
      }
    }
    if (mode === "quoted") fail("campo com aspas não fechadas.");
    finishRow();
    if (rows.length < 2) throw new Error("O CSV precisa de um cabeçalho e pelo menos um registro.");
    const headers = rows[0].cells;
    const seen = new Set();
    headers.forEach((header, index) => {
      if (!header) throw new Error(`Coluna ${index + 1}: o cabeçalho está vazio.`);
      if (/[{}]/.test(header)) throw new Error(`Cabeçalho “${header}”: remova as chaves { e }.`);
      const key = header.normalize("NFC").toLocaleLowerCase("pt-BR");
      if (seen.has(key)) throw new Error(`Cabeçalho repetido: “${header}”. Use nomes diferentes para as colunas.`);
      seen.add(key);
    });
    return rows.slice(1).map(({ cells, line: rowNumber }) => {
      if (cells.length !== headers.length) {
        throw new Error(`Linha ${rowNumber}: esperadas ${headers.length} colunas, mas foram encontradas ${cells.length}.`);
      }
      return Object.fromEntries(headers.map((header, index) => [header, cells[index]]));
    });
  }

  function parseTxt(text) {
    const names = String(text).replace(/^\uFEFF/, "").split(/\r\n|\n|\r/).map((line) => line.trim()).filter(Boolean);
    if (!names.length) throw new Error("O TXT precisa conter pelo menos um nome, com um nome por linha.");
    // Keep the established placeholder compatible with existing projects.
    return names.map((name) => ({ name }));
  }

  function validateRecords(records) {
    if (!Array.isArray(records) || !records.length) throw new Error("Informe pelo menos um registro de participante.");
    records.forEach((record, index) => {
      if (!record || typeof record !== "object" || Array.isArray(record) || !Object.keys(record).length) {
        throw new Error(`Registro ${index + 1}: os dados devem conter colunas e valores.`);
      }
      for (const [key, value] of Object.entries(record)) {
        if (!key.trim() || /[{}]/.test(key)) throw new Error(`Registro ${index + 1}: nome de coluna inválido.`);
        if (typeof value !== "string" && !(typeof value === "number" && Number.isFinite(value))) {
          throw new Error(`Registro ${index + 1}, coluna “${key}”: use texto ou número.`);
        }
      }
    });
  }

  function inspect(records, fields, offset = 0) {
    const keys = new Set();
    const issues = [];
    for (const field of fields) {
      const text = String(field.text);
      for (const match of text.matchAll(/{{\s*([^{}]+?)\s*}}/g)) keys.add(match[1]);
      if (/[{}]/.test(text.replace(/{{\s*([^{}]+?)\s*}}/g, ""))) {
        issues.push({ message: "Há uma variável malformada no texto. Use {{nome_da_coluna}}." });
      }
    }
    for (const key of keys) {
      const missing = [];
      records.forEach((record, index) => {
        if (!Object.hasOwn(record, key) || !String(record[key] ?? "").trim()) missing.push(index + offset + 1);
      });
      if (missing.length) {
        const examples = missing.slice(0, 8).join(", ") + (missing.length > 8 ? ", …" : "");
        issues.push({ key, count: missing.length, message: `“${key}” ausente ou vazio em ${missing.length} registro(s): ${examples}.` });
      }
    }
    return issues;
  }

  window.CertificateData = { parseCsv, parseTxt, validateRecords, inspect };
})();
