# claude-cdn

Assets estáticos e públicos servidos via jsDelivr para widgets do chat.

## Regras

- Tudo aqui é público. Só entra código de interface genérico e imagens sem identificação.
- Nunca entram hashes, tokens, credenciais, nomes ligados a fotos, dados de clientes ou conteúdo do Second Brain. Isso vai por configuração, a partir da skill privada.
- Uma pasta por projeto. Pasta `shared/` para o que for comum.
- Versão fixada pelo hash completo do commit (imutável no jsDelivr). As skills apontam sempre para um hash, nunca para `main`. Tags `<projeto>-vX.Y.Z` são opcionais.
- Nada de arquivos pesados.

## URL

`https://cdn.jsdelivr.net/gh/Team-Wecopy/claude-cdn@<hash-do-commit>/<projeto>/<arquivo>`

## Projetos

- `login-sessao/`: tela de login. `login.js` (minificado, servido) e `login.src.js` (fonte). Configuração em `window.LG = {users: {id: {name, img, perfil, c, p}}, active: [...]}` antes do script.

## Versões

- `login-sessao` v1.0.0: `ec98893e87ad8d05352584f0c52437807b237ec5`
