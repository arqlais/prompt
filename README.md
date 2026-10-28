# Prompt de Render · laís

Ferramenta do estúdio [lais3d.com.br](https://www.lais3d.com.br/): do print do SketchUp à fotografia.

- **gerar**: lê o print, organiza materiais e luz e escreve o prompt travado em português e inglês, ajustado para Magnific/Nano Banana, Gemini, ChatGPT, Flux ou qualquer IA.
- **ajustes e pós**: biblioteca de prompts prontos (pós, luz, humanização, fachadas, internas, representação, vídeo).
- **comparar**: print × render arrastando, lado a lado ou em tela cheia, com busca de diferenças e prompt de correção.

## Como está montado

| Parte | Onde fica | O que faz |
|---|---|---|
| `index.html` | este repositório | A página inteira, num arquivo só. Funciona aqui na Vercel, no portfólio e no claude.ai. |
| `api/claude.js` | Vercel | Guarda a chave da API da Anthropic e repassa os pedidos da página. |
| `/prompt/` | repositório `arqlais/portfolio` (GitHub Pages) | Cópia da página com as fontes do portfólio, gerada por `scripts/publicar_portfolio.py`. |

O GitHub Pages só serve páginas estáticas e não pode guardar a chave, por isso o servidor fica na Vercel (plano gratuito).

## Colocar no ar (uma vez)

1. Crie uma chave em <https://console.anthropic.com/> → API Keys.
2. Em <https://vercel.com/new>, importe o repositório `arqlais/prompt` (sem mudar nada no build).
3. Em *Settings → Environment Variables*, crie:
   - `ANTHROPIC_API_KEY`: a chave do passo 1.
   - `ACCESS_CODE`: um código de acesso para a ferramenta. Sem ele, qualquer pessoa com o link gasta os seus créditos.
   - (opcional) `ALLOWED_ORIGINS`: sites que podem usar o servidor. Padrão: `https://www.lais3d.com.br,https://lais3d.com.br`.
   - (opcional) `CLAUDE_MODEL`: padrão `claude-opus-5-5`.
4. Faça *Redeploy* e copie o endereço do projeto (ex.: `https://prompt-lais.vercel.app`).
5. No repositório do portfólio, em `_data/prompt.yml`, preencha `api_url: "https://SEU-PROJETO.vercel.app/api/claude"`.

Pronto: <https://www.lais3d.com.br/prompt/> pede o código de acesso uma vez por navegador e liga a IA.

## Atualizar a página do portfólio

Edite `index.html` aqui e rode:

```bash
python3 scripts/publicar_portfolio.py ../portfolio
```

Depois faça commit no repositório do portfólio.

## Custos

No Claude Opus 5.5 (US$ 4 por milhão de tokens de entrada e US$ 20 por milhão de saída), uma geração completa do prompt fica em torno de US$ 0,10 a 0,40, e a leitura do print ou a busca de diferenças, em alguns centavos. Dá para acompanhar e definir limites de gasto no console da Anthropic.
