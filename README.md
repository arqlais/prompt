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

## Usar direto no Gemini (Gem)

Um Gem é um assistente do Gemini com instruções fixas. Com ele, você manda só o print e o texto, sem abrir a página.

1. Na página, aba **ajustes e pós** → card **Gem: seu gerador de prompts** → **copiar** (ou **baixar .txt**).
2. Em <https://gemini.google.com/gems/create>, dê um nome (ex.: "Prompt de Render laís") e cole o texto em **Instruções**. Se o campo não aceitar o texto inteiro, escreva só "Siga exatamente as instruções do arquivo anexado" e anexe o `.txt` em **Conhecimento**.
3. Salve. Para usar: abra o Gem, anexe o print e escreva os materiais do seu jeito. Comandos opcionais na mesma mensagem: `destino: chatgpt`, `cenário: Fim de tarde quente`, `luzes: 3000K`, `tamanho: 6000`, `vista: mar`.
4. A resposta vem com `===PT===` e `===EN===`. Se quiser os contadores de caracteres, cole a resposta na página (modo gratuito, passo 3).

Dica: no Gemini, use o modelo mais avançado disponível (Pro ou com raciocínio), que segue instruções longas com mais fidelidade.

## Atualizar a página do portfólio

Edite `index.html` aqui e rode:

```bash
python3 scripts/publicar_portfolio.py ../portfolio
```

O script gera `portfolio/prompt/index.html` com as fontes do próprio site. Depois é só fazer commit no repositório do portfólio.
