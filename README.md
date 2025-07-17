# 🧪 Test Accounts
The website is deployed at: [https://family-tree-project-utno.onrender.com](https://family-tree-project-utno.onrender.com)

Use the following accounts to test the application (for demo purposes only):

| Email                | Password     |
|---------------------|--------------|
| hungvo210405@gmail.com| 123456       | 
| long@gmail.com  | 123456     |

Wait about 1 minute for the website to wake up and 1 more minute if you first login to the Website

## Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Deploy backend server at [BackendFamilyTree](https://github.com/baolongvncom/BackendFamilyTree)

Before running the project, create a `.env` file in the root directory and add the following environment variables:
```bash
# backend server
NUXT_PUBLIC_API_BASE=http://localhost:4000
```

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# 🧩 Features
Create, update, and delete family trees

Manage members and their relationships

Track achievements and causes of death

Upload images with Cloudinary

Uses MongoDB as the database

# 🛠 Dependencies
Express

Mongoose

Cloudinary

dotenv

uuid

cors
