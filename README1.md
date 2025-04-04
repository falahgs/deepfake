# Multi-Steps Preview

This example demonstrates how to use the [AI SDK](https://sdk.vercel.ai/docs) with [Next.js](https://nextjs.org/) and the `streamText` function to automatically handle multi-step generations.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-steps-reasoning&env=OPENAI_API_KEY&envDescription=OpenAI%20API%20Key%20Needed&envLink=https%3A%2F%2Fplatform.openai.com)

## How to use

Run [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel-labs/ai-sdk-preview-steps-reasoning ai-sdk-preview-steps-reasoning-example
```

```bash
yarn create next-app --example https://github.com/vercel-labs/ai-sdk-preview-steps-reasoning ai-sdk-preview-steps-reasoning-example
```

```bash
pnpm create next-app --example https://github.com/vercel-labs/ai-sdk-preview-steps-reasoning ai-sdk-preview-steps-reasoning-example
```

To run the example locally you need to:

1. Sign up for accounts with the AI providers you want to use (e.g., OpenAI, Anthropic).
2. Obtain API keys for each provider.
3. Set the required environment variables as shown in the `.env.example` file, but in a new file called `.env`.
4. `npm install` to install the required dependencies.
5. `npm run dev` to launch the development server.


## Learn More

To learn more about the AI SDK or Next.js take a look at the following resources:

- [AI SDK docs](https://sdk.vercel.ai/docs)
- [Vercel AI Playground](https://play.vercel.ai)
- [Next.js Documentation](https://nextjs.org/docs)
