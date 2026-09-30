# Gerador de Certificados

Crie certificados personalizados a partir de arquivos CSV ou TXT. Exporte em PNG, PDF ou baixe um ZIP com todos os certificados. Seus arquivos permanecem no seu dispositivo.

[Abrir o aplicativo original](https://avikhagol.github.io/certificate-generator/) · [Assistir à demonstração](https://www.youtube.com/watch?v=e_CAPwU1Hbw)

## Primeiros passos

1. **Dados:** importe um arquivo CSV ou TXT.
2. **Área de edição:** escolha um fundo ou comece com um modelo em branco.
3. **Camadas:** adicione textos, imagens ou formas. Use variáveis como `{{name}}`.
4. **Prévia do registro:** confira alguns registros usando os botões de registro anterior e próximo registro.
5. **Exportação:** escolha **Baixar PNG**, **Baixar PDF** ou **Baixar todos (.zip)**.

Use **Ocultar dados** e **Ocultar camadas** para ampliar o espaço de edição. Os mesmos botões permitem exibir os painéis novamente.

## Selecionar e editar

| Ação | Como fazer |
| --- | --- |
| Selecionar um elemento | Clique nele na área de edição ou no painel Camadas |
| Adicionar ou remover um elemento da seleção | Shift + clique |
| Selecionar uma área | Arraste um retângulo a partir de um espaço vazio da área de edição |
| Adicionar uma área à seleção | Segure Shift e arraste a partir de um espaço vazio |
| Mover a seleção | Arraste um elemento selecionado ou use as setas do teclado |
| Mover mais rápido | Shift + setas move a seleção em passos de 10 px |
| Copiar / colar / duplicar | Ctrl C / Ctrl V / Ctrl D |
| Excluir os elementos selecionados | Delete ou Backspace |
| Limpar a seleção | Escape |

O retângulo de seleção inclui os elementos que ele toca. As cópias preservam suas posições relativas e a ordem das camadas.

**No Mac:** use Command no lugar de Ctrl. Ao digitar em campos de formulário, os atalhos nativos de edição de texto são preservados.

### Tamanho, rotação e ordem das camadas

- **Redimensionar:** arraste a alça do canto de um único elemento selecionado.
- **Manter a proporção:** segure Shift ou Ctrl + Shift ao redimensionar formas ou imagens dinâmicas.
- **Criar um quadrado ou círculo:** segure apenas Ctrl. Também funciona ao editar Largura ou Altura.
- **Girar:** arraste a alça circular. Segure Shift para ajustar em passos de 15°.
- **Reordenar:** use os botões ↑/↓ ou Ctrl + ↑/↓ para mover uma posição.
- **Mover para frente ou para o fundo:** Ctrl + Shift + ↑/↓. A primeira camada da lista fica na frente.

As camadas de imagens comuns sempre mantêm sua proporção. Para editar as propriedades de um elemento, selecione apenas ele.

### Zoom

Ctrl + rolagem ajusta o zoom ao redor do ponteiro. **Ajustar** ou Ctrl 0 exibe toda a área de edição. Quando a imagem estiver ampliada, use a rolagem ou arraste com o botão do meio do mouse para navegar.

## Preparar os dados

Os cabeçalhos do CSV viram variáveis:

```csv
name,course,date
Ana Silva,Formação em tecnologia,19 de setembro de 2026
João Santos,Formação em tecnologia,19 de setembro de 2026
```

Use `{{name}}`, `{{course}}` ou `{{date}}` em uma camada de texto. Qualquer nome de coluna funciona, incluindo cabeçalhos em português. O nome da variável deve corresponder ao cabeçalho do arquivo.

Para uma lista somente de nomes, use um arquivo TXT com **um nome por linha**. Os nomes ficam disponíveis na variável `{{name}}`.

## Imagens e fontes

- **Fundo:** PNG, JPEG ou WebP. A área de edição assume as dimensões da imagem.
- **Camadas de imagem:** logotipos, assinaturas, retratos e selos. Recorte ou substitua cada imagem de forma independente.
- **Fontes personalizadas:** escolha **+ Personalizada** ao lado de Fonte. São aceitos arquivos TTF, OTF, WOFF e WOFF2.
- **Formas:** retângulos, elipses, triângulos, losangos, polígonos, estrelas e linhas.

### Uma imagem diferente para cada registro

1. Adicione ao CSV uma coluna com o nome do arquivo de imagem, como `foto`.
2. Abra **Imagens dinâmicas** no painel Dados e vincule a pasta de imagens.
3. Adicione uma camada com **+ Dinâmica** e escolha essa coluna.
4. Consulte o **Relatório de correspondências** para identificar imagens ausentes.

Use **Cobrir** para preencher a moldura, **Conter** para mostrar a imagem inteira ou **Preencher** para esticá-la. Vincule outras pastas ou atualize as imagens conforme necessário.

**Ao reabrir um projeto, vincule essas pastas novamente.** Os arquivos de imagens dinâmicas não são incorporados ao projeto.

## Salvar seu trabalho

**Salvar projeto** baixa um arquivo `.certproj.json`. **Abrir projeto** restaura o desenho, os dados, as imagens, as fontes e a ordem das camadas.

O navegador também salva automaticamente quando há armazenamento disponível e oferece a recuperação do trabalho na próxima visita. Mantenha um projeto baixado como cópia de segurança.

## Exportar

| Qualidade | Escala | Uso |
| --- | --- | --- |
| Normal | 1× | Prévias rápidas |
| Alta | 2× | Uso geral |
| Muito alta | 3× | Maior nitidez e arquivos maiores |

A qualidade escolhida se aplica às exportações em PNG, PDF e ZIP. Para lotes grandes, divida os dados em arquivos menores se houver pouca memória disponível.

## Executar localmente

Não é necessário instalar dependências nem compilar o projeto. Abra `dist/index.html` ou sirva a pasta com um servidor local:

```bash
python3 -m http.server 4173 --directory dist
```

Depois, acesse `http://localhost:4173`.

Para usar o GitHub Pages, abra as configurações do repositório (**Settings → Pages**) e escolha **GitHub Actions** como origem da publicação. O fluxo de trabalho incluído publica a pasta `dist/` quando alterações são enviadas para a branch `main`.

## Licença

[MIT](LICENSE) · [Código-fonte original no GitHub](https://github.com/avikhagol/certificate-generator)

## Interface em português e edição segura

A interface está em português brasileiro, incluindo mensagens, ajuda, diálogos e
modelo de exemplo. As chaves dos dados e as variáveis dos projetos existentes são
preservadas: `{{name}}`, por exemplo, continua funcionando. Cabeçalhos em português,
como `nome` e `curso`, também funcionam com `{{nome}}` e `{{curso}}`.

- **Desfazer/refazer:** botões na barra superior, `Ctrl Z` e `Ctrl Shift Z` ou `Ctrl Y`
  (Command no Mac). Há até 50 alterações no histórico da sessão, incluindo camadas,
  imagens, recortes, dimensões, dados importados e abertura de projetos. Um arraste
  conta como uma alteração; a digitação contínua é agrupada. Dentro dos campos de
  texto, os atalhos nativos de edição são preservados. O histórico não é gravado no
  arquivo de projeto. Pastas vinculadas de imagens dinâmicas ficam fora do histórico.
- **Importação validada:** CSV com vírgula, ponto e vírgula ou tabulação, incluindo
  campos entre aspas, quebras de linha e BOM UTF-8. Cabeçalhos vazios/repetidos,
  aspas inválidas e linhas com quantidade incorreta de colunas são recusados,
  mantendo os dados anteriores. TXT aceita um nome por linha na variável `{{name}}`.
  O limite por arquivo de dados é 20 MB.
- **Validação antes da exportação:** o painel Dados informa quais variáveis estão
  ausentes ou vazias e os registros afetados. A exportação individual verifica o
  registro atual; a exportação em lote verifica todos. Corrija o arquivo de dados
  ou remova a variável do texto para exportar. O relatório existente de imagens
  dinâmicas continua disponível separadamente.
- **Estado do salvamento:** a barra superior informa alterações pendentes,
  salvamento em andamento, confirmação no navegador ou falha. Falta de espaço,
  armazenamento indisponível e projetos acima de 80 MB exibem um aviso para baixar
  uma cópia com **Salvar projeto**. Uma cópia encontrada ao abrir o aplicativo fica
  preservada até a decisão de recuperação. **Agora não** a preserva até a próxima
  alteração do projeto. O salvamento automático é verificado a cada quatro segundos.

### Verificação das alterações

Os testes de dados e histórico usam apenas Node.js:

```bash
node tests/data-validation.test.cjs
node tests/history.test.cjs
```

O teste de integração usa Python com Selenium, Chromium e chromedriver instalados
(`/usr/bin/chromium` e `/usr/bin/chromedriver`). Ele inicia um servidor local
temporário, verifica os fluxos de edição, importação, exportação, salvamento e
recuperação, simula falhas de armazenamento e confere o layout móvel:

```bash
python3 tests/browser_check.py
```
