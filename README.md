# claude-cdn

Assets estáticos e públicos servidos via jsDelivr para widgets do chat.

## Regras

- Tudo aqui é público. Só entra código de interface genérico e imagens sem identificação.
- Nunca entram hashes, tokens, credenciais, nomes ligados a fotos, dados de clientes ou conteúdo do Second Brain. Isso vai por configuração, a partir da skill privada.
- Uma pasta por projeto. Pasta `shared/` para o que for comum.
- Versão por tag com prefixo do projeto: `<projeto>-vX.Y.Z`. As skills apontam sempre para a tag, nunca para `main`.
- Nada de arquivos pesados.

## URL

`https://cdn.jsdelivr.net/gh/Team-Wecopy/claude-cdn@<tag>/<projeto>/<arquivo>`

## Projetos

- `login-sessao/`: tela de login. `login.js` (minificado, servido) e `login.src.js` (fonte). Configuração em `window.LG = {users: {id: {name, img, perfil, c, p}}, active: [...]}` antes do script.
