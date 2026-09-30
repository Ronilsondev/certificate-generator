<div align="center">

# 🎓 Gerador de Certificados

### Seu design. Seus dados. Certificados em poucos cliques.

Crie certificados personalizados em lote, direto no navegador.<br>
Importe sua lista, monte o layout e exporte em **PNG, PDF ou ZIP**.

![Interface em português](https://img.shields.io/badge/Idioma-PT--BR-8B5CF6?style=for-the-badge)
![Exportação](https://img.shields.io/badge/Exporta-PNG%20%7C%20PDF%20%7C%20ZIP-06B6D4?style=for-the-badge)
![Dados locais](https://img.shields.io/badge/Dados-No%20seu%20dispositivo-10B981?style=for-the-badge)
[![Licença MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-F59E0B?style=for-the-badge)](LICENSE)

**[🌐 Aplicativo original](https://avikhagol.github.io/certificate-generator/)** · **[▶️ Demonstração](https://www.youtube.com/watch?v=e_CAPwU1Hbw)** · **[💻 Código original](https://github.com/avikhagol/certificate-generator)**

</div>

---

> ✨ **Da lista de participantes ao certificado pronto.** Um editor visual com camadas, variáveis, imagens dinâmicas e exportação em lote — com seus arquivos permanecendo no seu dispositivo.

## 🧭 Explore

[Recursos](#recursos) · [Primeiros passos](#primeiros-passos) · [Dados e variáveis](#dados) · [Editor](#editor) · [Imagens e fontes](#imagens) · [Salvamento](#salvamento) · [Exportação](#exportacao) · [Execução local](#execucao) · [Testes](#testes)

<a id="recursos"></a>

## ✨ O que você pode fazer

| | Recurso | Na prática |
| :---: | --- | --- |
| 🎨 | **Editor visual** | Monte o certificado com textos, imagens, formas e camadas. |
| 🧩 | **Variáveis personalizadas** | Transforme colunas do CSV em informações de cada certificado. |
| 📋 | **Importação de dados** | Use CSV ou uma lista de nomes em TXT. |
| 🖼️ | **Imagens dinâmicas** | Exiba uma foto ou imagem diferente para cada registro. |
| 🔤 | **Fontes personalizadas** | Importe fontes para combinar com a identidade do evento. |
| ↩️ | **Desfazer e refazer** | Edite com um histórico de até 50 alterações na sessão. |
| 💾 | **Projetos reutilizáveis** | Salve o trabalho e retome a edição depois. |
| 📦 | **Exportação em lote** | Baixe certificados em PNG, PDF ou todos em um ZIP. |
| ✅ | **Validação de dados** | Identifique variáveis ausentes ou vazias antes de exportar. |
| 🇧🇷 | **Interface em português** | Mensagens, ajuda, diálogos e modelo de exemplo em PT-BR. |

<a id="primeiros-passos"></a>

## 🚀 Do zero ao primeiro certificado

1. **Importe os dados** — carregue um arquivo CSV ou TXT no painel **Dados**.
2. **Prepare o layout** — escolha uma imagem de fundo ou comece com um modelo em branco.
3. **Personalize as camadas** — adicione textos, imagens e formas. Insira variáveis como `{{name}}`.
4. **Confira a prévia** — navegue entre os registros com os botões de anterior e próximo.
5. **Exporte** — escolha **Baixar PNG**, **Baixar PDF** ou **Baixar todos (.zip)**.

> [!TIP]
> Precisa de mais espaço? Use **Ocultar dados** e **Ocultar camadas**. Os mesmos botões permitem exibir os painéis novamente.

<a id="dados"></a>

## 🧩 Seus dados viram variáveis

### CSV: um registro por linha

Os cabeçalhos do arquivo definem as variáveis disponíveis no editor:

```csv
nome,curso,data
Ana Silva,Formação em tecnologia,19 de setembro de 2026
João Santos,Formação em tecnologia,19 de setembro de 2026
```

Em uma camada de texto, escreva:

```text
Certificamos que {{nome}} participou de {{curso}}, em {{data}}.
```

O nome da variável deve corresponder exatamente ao cabeçalho. Cabeçalhos em português funcionam normalmente, e variáveis de projetos existentes, como `{{name}}`, continuam disponíveis quando correspondem aos dados.

### TXT: só os nomes, sem complicação

Use **um nome por linha**:

```text
Ana Silva
João Santos
Maria Oliveira
```

Nesse formato, os nomes ficam disponíveis na variável **`{{name}}`**.

### Importação com validação

| Aceito | Comportamento |
| --- | --- |
| Vírgula, ponto e vírgula ou tabulação | Separadores de colunas no CSV |
| Campos entre aspas e quebras de linha | Leitura de campos estruturados |
| BOM UTF-8 | Reconhecimento na importação |
| Arquivos de até **20 MB** | Limite por arquivo de dados |

Cabeçalhos vazios ou repetidos, aspas inválidas e linhas com quantidade incorreta de colunas são recusados. **Os dados anteriores são preservados se a importação falhar.**

<a id="editor"></a>

## 🎨 Um editor para ajustar cada detalhe

### Seleção e movimento

| Ação | Como fazer |
| --- | --- |
| Selecionar um elemento | Clique no elemento ou no painel **Camadas** |
| Adicionar ou remover da seleção | `Shift` + clique |
| Selecionar uma área | Arraste um retângulo a partir de um espaço vazio |
| Adicionar uma área à seleção | `Shift` + arraste a partir de um espaço vazio |
| Mover a seleção | Arraste um elemento selecionado ou use as setas |
| Mover em passos de 10 px | `Shift` + setas |
| Copiar / colar / duplicar | `Ctrl + C` / `Ctrl + V` / `Ctrl + D` |
| Excluir | `Delete` ou `Backspace` |
| Limpar a seleção | `Escape` |

O retângulo de seleção inclui os elementos que ele toca. As cópias preservam as posições relativas e a ordem das camadas.

### Tamanho, rotação e camadas

| Ação | Como fazer |
| --- | --- |
| Redimensionar | Arraste a alça do canto de um único elemento selecionado |
| Manter a proporção de formas ou imagens dinâmicas | Segure `Shift` ou `Ctrl + Shift` ao redimensionar |
| Criar um quadrado ou círculo | Segure apenas `Ctrl`; também funciona ao editar **Largura** ou **Altura** |
| Girar | Arraste a alça circular |
| Girar em passos de 15° | Segure `Shift` durante a rotação |
| Subir ou descer uma camada | Botões **↑/↓** ou `Ctrl + ↑/↓` |
| Trazer para frente ou enviar para o fundo | `Ctrl + Shift + ↑/↓` |

A primeira camada da lista fica na frente. Imagens comuns sempre mantêm a proporção. Para editar as propriedades de um elemento, selecione apenas ele.

### Zoom e navegação

- **Ampliar ou reduzir:** `Ctrl` + rolagem, com o zoom centrado no ponteiro.
- **Exibir toda a área:** botão **Ajustar** ou `Ctrl + 0`.
- **Navegar com zoom:** use a rolagem ou arraste com o botão do meio do mouse.

### Desfazer e refazer

Use os botões da barra superior ou os atalhos:

| Ação | Atalho |
| --- | --- |
| Desfazer | `Ctrl + Z` |
| Refazer | `Ctrl + Shift + Z` ou `Ctrl + Y` |

O histórico mantém até **50 alterações por sessão**, incluindo camadas, imagens, recortes, dimensões, dados importados e abertura de projetos. Cada arraste conta como uma alteração; a digitação contínua é agrupada.

> [!NOTE]
> **No Mac, use Command no lugar de Ctrl.** Dentro de campos de formulário, os atalhos nativos de edição de texto são preservados. O histórico não é salvo no arquivo de projeto e não inclui as pastas vinculadas de imagens dinâmicas.

<a id="imagens"></a>

## 🖼️ Imagens, fontes e formas

| Elemento | Opções |
| --- | --- |
| **Fundo** | PNG, JPEG ou WebP. A área de edição assume as dimensões da imagem. |
| **Camadas de imagem** | Logotipos, assinaturas, retratos e selos, com recorte e substituição independentes. |
| **Fontes personalizadas** | TTF, OTF, WOFF e WOFF2, pelo botão **+ Personalizada** ao lado de **Fonte**. |
| **Formas** | Retângulos, elipses, triângulos, losangos, polígonos, estrelas e linhas. |

### Uma imagem diferente para cada pessoa

1. Adicione ao CSV uma coluna, como `foto`, com o nome do arquivo de cada imagem.
2. No painel **Dados**, abra **Imagens dinâmicas** e vincule a pasta de imagens.
3. Crie uma camada com **+ Dinâmica** e selecione a coluna correspondente.
4. Confira o **Relatório de correspondências** para identificar imagens ausentes.

| Ajuste | Resultado |
| --- | --- |
| **Cobrir** | Preenche a moldura |
| **Conter** | Mostra a imagem inteira |
| **Preencher** | Estica a imagem para ocupar a moldura |

Você pode vincular outras pastas ou atualizar as imagens conforme necessário.

> [!IMPORTANT]
> Ao reabrir um projeto, **vincule novamente as pastas de imagens dinâmicas**. Esses arquivos não são incorporados ao projeto.

<a id="salvamento"></a>

## 💾 Salve agora. Continue depois.

**Salvar projeto** baixa um arquivo `.certproj.json`. Use **Abrir projeto** para restaurar o desenho, os dados, as imagens incorporadas, as fontes e a ordem das camadas.

O navegador também salva automaticamente quando há armazenamento disponível e oferece a recuperação do trabalho na próxima visita. **Mantenha um projeto baixado como cópia de segurança.**

<details>
<summary><strong>🔎 Como funciona o salvamento automático</strong></summary>

- O salvamento automático é verificado a cada **quatro segundos**.
- A barra superior informa alterações pendentes, salvamento em andamento, confirmação no navegador ou falha.
- Falta de espaço, armazenamento indisponível e projetos acima de **80 MB** exibem um aviso para baixar uma cópia com **Salvar projeto**.
- Uma cópia encontrada ao abrir o aplicativo fica preservada até a decisão de recuperação.
- **Agora não** preserva essa cópia até a próxima alteração do projeto.

</details>

<a id="exportacao"></a>

## 📦 Pronto para compartilhar

Exporte o certificado em **PNG** ou **PDF**, ou baixe todos os certificados em um **ZIP**.

| Qualidade | Escala | Quando usar |
| --- | :---: | --- |
| **Normal** | 1× | Prévias rápidas |
| **Alta** | 2× | Uso geral |
| **Muito alta** | 3× | Maior nitidez, com arquivos maiores |

A qualidade selecionada se aplica às exportações em PNG, PDF e ZIP. Para lotes grandes em dispositivos com pouca memória, divida os dados em arquivos menores.

### Confira os dados antes de exportar

O painel **Dados** informa variáveis ausentes ou vazias e os registros afetados:

- **Exportação individual:** verifica o registro atual.
- **Exportação em lote:** verifica todos os registros.

Corrija o arquivo de dados ou remova a variável do texto para exportar. O relatório de imagens dinâmicas permanece disponível separadamente.

<a id="execucao"></a>

## 💻 Execute localmente

**Sem instalar dependências ou compilar para usar o aplicativo.** Abra `dist/index.html` no navegador ou, com Python instalado, sirva a pasta localmente:

```bash
python3 -m http.server 4173 --directory dist
```

Depois, acesse **[localhost:4173](http://localhost:4173)**.

### Publicação no GitHub Pages

1. Abra **Settings → Pages** no repositório.
2. Selecione **GitHub Actions** como origem da publicação.
3. Envie as alterações para a branch `main`.

O fluxo de trabalho incluído publica a pasta `dist/`.

<a id="testes"></a>

## 🧪 Verificação das alterações

### Dados e histórico

Os testes abaixo usam apenas **Node.js**:

```bash
node tests/data-validation.test.cjs
node tests/history.test.cjs
```

### Integração no navegador

O teste de integração requer **Python, Selenium, Chromium e chromedriver**, com os executáveis em `/usr/bin/chromium` e `/usr/bin/chromedriver`:

```bash
python3 tests/browser_check.py
```

Ele inicia um servidor local temporário, verifica edição, importação, exportação, salvamento e recuperação, simula falhas de armazenamento e confere o layout móvel.

## 📄 Licença e créditos

Distribuído sob a licença **[MIT](LICENSE)**.

Projeto baseado no **[Certificate Generator](https://github.com/avikhagol/certificate-generator)**, de **avikhagol**. Os links de aplicativo e demonstração no início deste README apontam para o projeto original.

---

<div align="center">

**🎓 Menos trabalho repetitivo. Mais tempo para celebrar conquistas.**

</div>
