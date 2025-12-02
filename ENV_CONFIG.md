# Configuração de Variáveis de Ambiente

Este documento descreve como configurar as variáveis de ambiente do frontend.

## Variáveis Disponíveis

### `REACT_APP_API_URL`

URL base da API do backend. Esta variável deve apontar para o endpoint da API.

**Valores de exemplo:**
- Produção: `https://api-backendtea.i5mfns.easypanel.host/api`
- Desenvolvimento local: `http://localhost:3000/api`

## Arquivos de Configuração

### `.env`
Arquivo principal de variáveis de ambiente. Contém as configurações padrão e é commitado no repositório.

### `.env.local`
Arquivo de configuração local (ignorado pelo git). Use este arquivo para sobrescrever variáveis durante o desenvolvimento local.

### `.env.example`
Arquivo de exemplo documentando todas as variáveis disponíveis.

## Como Configurar

### Para Desenvolvimento Local

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` com suas configurações locais:
   ```bash
   # Para usar API local
   REACT_APP_API_URL=http://localhost:3000/api
   
   # OU para usar API de produção
   REACT_APP_API_URL=https://api-backendtea.i5mfns.easypanel.host/api
   ```

3. Reinicie o servidor de desenvolvimento para aplicar as mudanças:
   ```bash
   npm start
   ```

### Para Produção

As variáveis de ambiente de produção devem ser configuradas na plataforma de deploy (Vercel, por exemplo).

#### Configurando no Vercel

1. Acesse o dashboard do projeto no Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione a variável:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://api-backendtea.i5mfns.easypanel.host/api`
   - **Environment**: Production (ou conforme necessário)
4. Faça um novo deploy para aplicar as mudanças

## Ordem de Precedência

As variáveis de ambiente seguem a seguinte ordem de precedência (da maior para a menor):

1. `.env.local` (maior precedência)
2. `.env.development`, `.env.test`, `.env.production` (dependendo do ambiente)
3. `.env` (menor precedência)

## Observações Importantes

- **Todas as variáveis de ambiente do React devem começar com `REACT_APP_`**
- As variáveis são incorporadas no build do aplicativo
- Mudanças nas variáveis de ambiente requerem reconstrução do aplicativo
- Nunca commite arquivos `.env.local` ou informações sensíveis no repositório

## Verificando as Configurações

Para verificar qual URL da API está sendo usada, você pode adicionar um log temporário:

```typescript
console.log('API URL:', process.env.REACT_APP_API_URL);
```

Ou verificar no código em `src/services/api.ts`.
