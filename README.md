# Prompt de Render · laís

Ferramenta do estúdio [lais3d.com.br](https://www.lais3d.com.br/): do print do SketchUp à fotografia. **Tudo gratuito.**

- **gerar**: lê o print, organiza materiais e luz e escreve o prompt travado em português e inglês, ajustado para Magnific/Nano Banana, Gemini, ChatGPT, Flux ou qualquer IA.
- **ajustes e pós**: biblioteca de prompts prontos (pós, luz, humanização, fachadas, internas, representação, vídeo).
- **comparar**: print × render arrastando, lado a lado ou em tela cheia, com busca de diferenças e prompt de correção.

## Onde usar

| Onde | Como a IA funciona |
|---|---|
| Artifact no claude.ai | Automático, pela sua conta do Claude. |
| www.lais3d.com.br/prompt/ | Modo gratuito: a página monta o pedido, você cola num chat de IA gratuito (Claude, Gemini ou ChatGPT) com o print e cola a resposta de volta. |

Não há servidor nem chave de API: é uma página só (`index.html`).

## Atualizar a página do portfólio

Edite `index.html` aqui e rode:

```bash
python3 scripts/publicar_portfolio.py ../portfolio
```

O script gera `portfolio/prompt/index.html` com as fontes do próprio site. Depois é só fazer commit no repositório do portfólio.
