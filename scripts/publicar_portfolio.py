#!/usr/bin/env python3
"""Gera a cópia da ferramenta para o portfólio (www.lais3d.com.br/prompt/).

O original é o index.html deste repositório (funciona sozinho, no claude.ai e em qualquer hospedagem).
A cópia do portfólio usa as fontes que já estão no site.

Uso: python3 scripts/publicar_portfolio.py ../portfolio
"""
import pathlib
import re
import shutil
import sys

raiz = pathlib.Path(__file__).resolve().parent.parent
portfolio = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else raiz.parent / "portfolio").resolve()
html = (raiz / "index.html").read_text(encoding="utf-8")

if "{{" in html or "{%" in html:
    sys.exit("O index.html tem {{ ou {% e o Jekyll tentaria interpretar. Ajuste antes de publicar.")

fontes = """@font-face{font-family:"The Seasons";font-weight:300;font-style:normal;font-display:swap;src:url({{ '/assets/fonts/TheSeasonsLt.woff2' | relative_url }}) format("woff2")}
@font-face{font-family:"The Seasons";font-weight:300;font-style:italic;font-display:swap;src:url({{ '/assets/fonts/TheSeasonsLtIt.woff2' | relative_url }}) format("woff2")}
@font-face{font-family:"The Seasons";font-weight:400;font-style:italic;font-display:swap;src:url({{ '/assets/fonts/TheSeasonsIt.woff2' | relative_url }}) format("woff2")}
""" + "".join(
    f"@font-face{{font-family:\"Poppins\";font-weight:{w};font-style:normal;font-display:swap;src:url({{{{ '/assets/fonts/Poppins-{n}.woff2' | relative_url }}}}) format(\"woff2\")}}\n"
    for w, n in [(400, "Regular"), (500, "Medium"), (600, "SemiBold"), (700, "Bold"), (800, "ExtraBold")]
)

html, n = re.subn(r'(@font-face\{font-family:"The Seasons";[^\n]*\n)+', lambda m: fontes, html, count=1)
assert n == 1, "não achei as fontes embutidas"
html, n = re.subn(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?[^"]*">',
                  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap">', html)
assert n == 1, "não achei o link do Google Fonts"
html = html.replace('<meta charset="utf-8">',
                    '<meta charset="utf-8">\n<meta name="robots" content="noindex,nofollow">', 1)
cabecalho = ("---\n# Gerado automaticamente a partir de github.com/arqlais/prompt (scripts/publicar_portfolio.py).\n"
             "# Edite lá e publique de novo; mudanças feitas direto aqui se perdem.\n---\n")

destino = portfolio / "prompt" / "index.html"
destino.parent.mkdir(exist_ok=True)
destino.write_text(cabecalho + html, encoding="utf-8")
# Firebase (conta): cópia local do SDK, para não depender do gstatic
shutil.copytree(raiz / "vendor", destino.parent / "vendor", dirs_exist_ok=True)
# app no iPad: ícones e manifesto (lavi render)
shutil.copytree(raiz / "icons", destino.parent / "icons", dirs_exist_ok=True)
shutil.copy(raiz / "manifest.webmanifest", destino.parent / "manifest.webmanifest")
print(f"ok: {destino} ({len(html) // 1024} KB)")
