# 🎨 Canvasly

> **Canvasly** is a full-stack, browser-based graphic design editor
> inspired by modern tools such as Canva. It combines a
> Fabric.js-powered visual editor with reusable templates, image search,
> uploads, AI image generation, AI background removal, authentication,
> autosaving projects, and Stripe-powered Pro subscriptions.

## 🚀 Live Demo

**Try Canvasly:** https://canvasly-ai-canva.vercel.app

The deployed application currently opens with authentication, where
users can sign in using email/password, Google, or GitHub.

------------------------------------------------------------------------

## ✨ What is Canvasly?

Canvasly is a complete visual design workspace that lets users create
and edit graphics directly in the browser.

Instead of building every design from scratch, users can:

-   Start with a blank canvas.
-   Choose from reusable templates.
-   Add and edit text.
-   Add shapes such as circles, rectangles, triangles, and diamonds.
-   Upload their own images.
-   Browse and insert images from Unsplash.
-   Draw directly on the canvas.
-   Customize colors, strokes, opacity, fonts, filters, and text
    formatting.
-   Generate images from natural-language prompts using AI.
-   Remove image backgrounds using AI.
-   Undo and redo edits.
-   Copy and paste canvas objects.
-   Change canvas dimensions and background.
-   Reorder objects using layer controls.
-   Export designs as PNG, JPG, SVG, or JSON.
-   Save projects and continue editing them later.
-   Duplicate or delete projects.
-   Upgrade to a Pro subscription through Stripe.

The result is a single application that combines **design editing +
asset management + AI tooling + cloud persistence + subscriptions**.

------------------------------------------------------------------------

## 🌐 Product Flow

``` text
                    ┌──────────────────────┐
                    │      Canvasly        │
                    │   Web Application    │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       Authentication      Dashboard          Editor
       NextAuth/Auth.js    Projects/Templates  Fabric.js
             │                 │                 │
             │                 ▼                 ▼
             │             PostgreSQL       Design Tools
             │                 │                 │
             │                 │        ┌────────┼────────┐
             │                 │        │        │        │
             ▼                 ▼        ▼        ▼        ▼
        Google/GitHub      Drizzle ORM  AI     Unsplash UploadThing
                                      Replicate
                                         │
                                         ▼
                                      Stripe
                                    Pro Billing
```

------------------------------------------------------------------------

# 🧩 Core Features

## 1. 🔐 Authentication

Canvasly supports multiple authentication methods through
**NextAuth/Auth.js**:

-   Email + password
-   Google OAuth
-   GitHub OAuth
-   JWT-based sessions
-   Drizzle Adapter for PostgreSQL persistence
-   Password hashing with `bcryptjs`

Authenticated users receive access to their own projects and editor
workspace.

### Authentication flow

``` text
User
 │
 ├── Email + Password ──► Credentials Provider
 │
 ├── Google ────────────► Google OAuth
 │
 └── GitHub ────────────► GitHub OAuth
                              │
                              ▼
                         NextAuth/Auth.js
                              │
                              ▼
                       JWT Session + User ID
```

------------------------------------------------------------------------

## 2. 🖼️ Fabric.js Visual Editor

The editor is built around **Fabric.js**, which provides the interactive
canvas layer.

Canvasly exposes a custom `Editor` abstraction around Fabric.js so UI
components can perform high-level operations without directly
manipulating the canvas everywhere.

### Supported canvas operations

-   Select objects
-   Add images
-   Add text
-   Add headings
-   Add subheadings
-   Add paragraphs
-   Add circles
-   Add rectangles
-   Add soft rectangles
-   Add triangles
-   Add inverse triangles
-   Add diamonds
-   Draw with a brush
-   Change fill color
-   Change stroke color
-   Change stroke width
-   Change stroke dash pattern
-   Change opacity
-   Change font family
-   Change font size
-   Bold / italic
-   Underline
-   Strikethrough
-   Text alignment
-   Image filters
-   Bring objects forward
-   Send objects backward
-   Delete objects
-   Copy / paste
-   Undo / redo
-   Zoom in / out
-   Auto zoom
-   Change canvas size
-   Change background

------------------------------------------------------------------------

## 3. 📝 Text Editing

Canvasly provides predefined text presets to make designing faster:

-   Textbox
-   Heading
-   Subheading
-   Paragraph

Text objects can be customized using:

-   Font family
-   Font size
-   Font weight
-   Italic
-   Underline
-   Strikethrough
-   Text alignment
-   Fill color
-   Opacity

The editor currently includes a curated list of common fonts such as
Arial, Helvetica, Verdana, Georgia, Times New Roman, Courier New,
Impact, and others.

------------------------------------------------------------------------

## 4. 🔷 Shapes

The editor supports multiple built-in shapes:

-   Circle
-   Rectangle
-   Soft rectangle
-   Triangle
-   Inverted triangle
-   Diamond

Every shape can be styled using fill, stroke, width, opacity, and layer
controls.

------------------------------------------------------------------------

## 5. 🖌️ Drawing Mode

Canvasly includes a freehand drawing mode.

Users can configure:

-   Brush width
-   Brush color

Drawing mode is implemented directly on the Fabric.js canvas.

------------------------------------------------------------------------

## 6. 🖼️ Image Library

Canvasly provides two ways to add images.

### Upload your own images

Uploads are handled using **UploadThing**.

The current image uploader accepts image files up to **4 MB**.

### Browse Unsplash images

Canvasly also retrieves random images from an Unsplash collection and
displays them in the editor.

Users can click an image to insert it into the canvas.

------------------------------------------------------------------------

## 7. 🤖 AI Image Generation

Canvasly includes an AI image-generation workflow.

Users enter a natural-language prompt, for example:

``` text
An astronaut riding a horse on Mars,
HD, dramatic lighting
```

The prompt is sent to the backend and processed through **Replicate**
using the Stable Diffusion 3 model.

The generated image is then automatically added to the canvas.

### AI flow

``` text
Prompt
  │
  ▼
React Query Mutation
  │
  ▼
Hono API
  │
  ▼
Replicate
  │
  ▼
Stable Diffusion 3
  │
  ▼
Generated Image URL
  │
  ▼
Fabric.js Canvas
```

AI image generation is protected by the application's Pro/paywall logic.

------------------------------------------------------------------------

## 8. ✂️ AI Background Removal

Canvasly can remove the background from a selected image.

The workflow is:

``` text
Selected Image
      │
      ▼
Remove Background
      │
      ▼
Hono API
      │
      ▼
Replicate / rembg
      │
      ▼
Transparent Image
      │
      ▼
Added Back To Canvas
```

The feature is available for image objects and is protected by the
Pro/paywall logic.

------------------------------------------------------------------------

## 9. 🎨 Image Filters

Canvasly includes a wide collection of image filters, including:

-   Polaroid
-   Sepia
-   Kodachrome
-   Contrast
-   Brightness
-   Greyscale
-   Brownie
-   Vintage
-   Technicolor
-   Pixelate
-   Invert
-   Blur
-   Sharpen
-   Emboss
-   Remove Color
-   Black & White
-   Vibrance
-   Blend Color
-   Hue Rotate
-   Resize
-   Saturation
-   Gamma

These filters are applied to Fabric.js image objects.

------------------------------------------------------------------------

## 10. 📚 Templates

Canvasly supports reusable design templates stored as projects.

The seed data currently includes:

-   Car Sale
-   Travel
-   Flash Sale
-   Coming Soon

Templates store their Fabric.js canvas state as JSON and can be loaded
into the editor.

Templates can also be marked as:

-   Free
-   Pro

This allows the application to support a freemium template system.

------------------------------------------------------------------------

## 11. 💾 Project Persistence

Every design is represented as a project in PostgreSQL.

A project stores:

``` text
Project
├── id
├── name
├── userId
├── json
├── width
├── height
├── thumbnailUrl
├── isTemplate
├── isPro
├── createdAt
└── updatedAt
```

The `json` field contains the serialized Fabric.js canvas state.

This approach allows the entire editor state to be saved and
reconstructed later.

------------------------------------------------------------------------

## 12. ↩️ Undo / Redo History

The editor maintains a history of canvas changes.

Users can:

-   Undo previous changes
-   Redo reverted changes
-   Check whether undo/redo is available

This is implemented through dedicated editor hooks and integrated with
Fabric.js canvas events.

------------------------------------------------------------------------

## 13. 📤 Export Designs

Canvasly can export designs in several formats:

  Format   Purpose
  -------- ------------------------------------
  PNG      High-quality raster export
  JPG      Compressed raster export
  SVG      Vector export
  JSON     Save/reload Fabric.js editor state

The JSON export is especially useful for preserving the editable design
structure rather than exporting only a flattened image.

------------------------------------------------------------------------

## 14. 💳 Pro Subscriptions

Canvasly integrates **Stripe** for subscription billing.

The application supports:

-   Stripe Checkout
-   Subscription creation
-   Stripe Billing Portal
-   Subscription status checks
-   Stripe webhook processing
-   Subscription renewal/update handling
-   Subscription cancellation handling
-   Pro feature gating

### Subscription flow

``` text
User
 │
 ▼
Upgrade to Pro
 │
 ▼
Stripe Checkout
 │
 ▼
Successful Payment
 │
 ▼
Stripe Webhook
 │
 ▼
Canvasly API
 │
 ▼
PostgreSQL
 │
 ▼
Subscription Active
 │
 ▼
Pro Features Unlocked
```

The application uses Stripe webhooks to keep subscription state
synchronized with the database.

------------------------------------------------------------------------

# 🏗️ Technology Stack

## Frontend

-   **Next.js 16**
-   **React 19**
-   **TypeScript**
-   **Tailwind CSS 4**
-   **Fabric.js 7**
-   **TanStack React Query**
-   **Zustand**
-   **Radix UI**
-   **Lucide React**
-   **React Icons**
-   **Sonner**

## Backend

-   **Next.js API routes**
-   **Hono**
-   **Zod**
-   **Drizzle ORM**
-   **Neon Serverless PostgreSQL**
-   **NextAuth/Auth.js**

## AI

-   **Replicate**
-   **Stable Diffusion 3**
-   **rembg**

## External Services

-   **Unsplash** --- stock image discovery
-   **UploadThing** --- image uploads
-   **Stripe** --- subscriptions and billing
-   **Google OAuth**
-   **GitHub OAuth**

## Deployment

-   **Vercel**

------------------------------------------------------------------------

# 📁 Project Structure

``` text
Canvasly/
│
├── public/
│   ├── car_sale.json
│   ├── car_sale.png
│   ├── coming_soon.json
│   ├── coming_soon.png
│   ├── flash_sale.json
│   ├── flash_sale.png
│   ├── travel.json
│   ├── travel.png
│   └── ...
│
├── src/
│   │
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   │
│   │   ├── (dashboard)/
│   │   │
│   │   ├── editor/
│   │   │   └── [projectId]/
│   │   │
│   │   ├── api/
│   │   │   ├── [[...route]]/
│   │   │   │   ├── ai.ts
│   │   │   │   ├── images.ts
│   │   │   │   ├── projects.ts
│   │   │   │   ├── subscriptions.ts
│   │   │   │   ├── users.ts
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   ├── auth/
│   │   │   └── uploadthing/
│   │   │
│   │   └── globals.css
│   │
│   ├── components/
│   │   └── ui/
│   │
│   ├── db/
│   │   ├── drizzle.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   │
│   ├── features/
│   │   ├── ai/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── editor/
│   │   ├── images/
│   │   ├── projects/
│   │   └── subscriptions/
│   │
│   ├── lib/
│   │   ├── hono.ts
│   │   ├── replicate.ts
│   │   ├── stripe.ts
│   │   ├── unsplash.ts
│   │   ├── uploadthing.ts
│   │   └── utils.ts
│   │
│   ├── auth.ts
│   ├── auth.config.ts
│   ├── proxy.ts
│   └── types/
│
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── bun.lock
├── tsconfig.json
└── README.md
```

------------------------------------------------------------------------

# 🧠 Architecture

Canvasly follows a feature-oriented architecture.

Instead of placing all business logic into generic folders,
functionality is grouped by domain:

``` text
features/
├── ai/
├── auth/
├── dashboard/
├── editor/
├── images/
├── projects/
└── subscriptions/
```

Each feature can contain its own:

-   Components
-   Hooks
-   API clients
-   State
-   Utilities

This keeps the application easier to scale as more editor capabilities
are added.

------------------------------------------------------------------------

# 🔌 API Architecture

Canvasly uses **Hono** as a lightweight backend routing layer.

The API is mounted under:

``` text
/api
```

Routes are composed in:

``` text
src/app/api/[[...route]]/route.ts
```

## Project APIs

### Get templates

``` http
GET /api/projects/templates?page=1&limit=10
```

Returns paginated templates.

### Create project

``` http
POST /api/projects
```

Creates a new user project.

### Get project

``` http
GET /api/projects/:id
```

Returns a project owned by the authenticated user.

### Update project

``` http
PATCH /api/projects/:id
```

Updates project metadata and/or canvas state.

### Get user projects

``` http
GET /api/projects?page=1&limit=10
```

Returns the authenticated user's projects.

### Duplicate project

``` http
POST /api/projects/:id/duplicate
```

Creates a copy of an existing project.

### Delete project

``` http
DELETE /api/projects/:id
```

Deletes an owned project.

------------------------------------------------------------------------

# 🤖 AI APIs

## Generate image

``` http
POST /api/ai/generate-image
```

Request:

``` json
{
  "prompt": "A futuristic city at sunset"
}
```

Response:

``` json
{
  "data": "generated-image-url"
}
```

## Remove background

``` http
POST /api/ai/remove-bg
```

Request:

``` json
{
  "image": "image-url"
}
```

Response:

``` json
{
  "data": "processed-image-url"
}
```

Both AI endpoints require authentication.

------------------------------------------------------------------------

# 🖼️ Image API

``` http
GET /api/images
```

Fetches a collection of random Unsplash images for the editor.

------------------------------------------------------------------------

# 💳 Subscription APIs

### Get current subscription

``` http
GET /api/subscriptions/current
```

### Create Stripe checkout session

``` http
POST /api/subscriptions/checkout
```

### Open Stripe billing portal

``` http
POST /api/subscriptions/billing
```

### Stripe webhook

``` http
POST /api/subscriptions/webhook
```

The webhook handles important subscription lifecycle events including:

-   `checkout.session.completed`
-   `customer.subscription.updated`
-   `customer.subscription.deleted`

------------------------------------------------------------------------

# 🗄️ Database

Canvasly uses **PostgreSQL** through **Neon** and **Drizzle ORM**.

## Database entities

### User

Stores:

-   User ID
-   Name
-   Email
-   Password hash
-   Profile image
-   Email verification information

### Account

Stores OAuth provider account information.

### Session

Stores authentication sessions.

### Verification Token

Stores verification tokens.

### Authenticator

Stores WebAuthn/passkey-related authenticator records supported by the
Auth.js adapter.

### Project

Stores:

-   Design name
-   Owner
-   Fabric.js JSON
-   Canvas dimensions
-   Thumbnail
-   Template status
-   Pro status
-   Creation/update timestamps

### Subscription

Stores:

-   Stripe subscription ID
-   Stripe customer ID
-   Stripe price ID
-   Subscription status
-   Current billing period end
-   User relationship
-   Timestamps

------------------------------------------------------------------------

# 🧬 Database Relationships

``` text
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Projects      Subscriptions
 │
 └── Fabric.js JSON
```

Deleting a user cascades to their related projects and subscriptions
where configured by the database schema.

------------------------------------------------------------------------

# ⚙️ Local Development Setup

## Prerequisites

Install:

-   Node.js 20+
-   Bun 1.3+
-   PostgreSQL-compatible database
-   Accounts/API keys for the external services you want to enable

Bun is the package manager used by this project.

------------------------------------------------------------------------

## 1. Clone the repository

``` bash
git clone https://github.com/rohits2404/Canvasly.git
cd Canvasly
```

------------------------------------------------------------------------

## 2. Install dependencies

``` bash
bun install
```

------------------------------------------------------------------------

## 3. Configure environment variables

Create a `.env` file in the project root.

``` env
DATABASE_URL=

AUTH_SECRET=

AUTH_GOOGLE_CLIENT_ID=
AUTH_GOOGLE_CLIENT_SECRET=

AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=

REPLICATE_API_TOKEN=

STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

### Environment variable reference

  Variable                            Purpose
  ----------------------------------- -----------------------------------------------
  `DATABASE_URL`                      Neon/PostgreSQL connection string
  `AUTH_SECRET`                       Auth.js secret used to secure sessions/tokens
  `AUTH_GOOGLE_CLIENT_ID`             Google OAuth client ID
  `AUTH_GOOGLE_CLIENT_SECRET`         Google OAuth client secret
  `AUTH_GITHUB_ID`                    GitHub OAuth client ID
  `AUTH_GITHUB_SECRET`                GitHub OAuth client secret
  `NEXT_PUBLIC_APP_URL`               Public application URL
  `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`   Unsplash API access key
  `REPLICATE_API_TOKEN`               Replicate API token
  `STRIPE_SECRET_KEY`                 Stripe server-side secret key
  `STRIPE_PRICE_ID`                   Stripe subscription price ID
  `STRIPE_WEBHOOK_SECRET`             Stripe webhook signing secret

> **Important:** Never commit `.env`, API keys, OAuth secrets, Stripe
> secrets, or Replicate tokens to Git.

------------------------------------------------------------------------

# 🗃️ Database Setup

Canvasly uses Drizzle ORM with PostgreSQL.

The schema is located at:

``` text
src/db/schema.ts
```

The Drizzle configuration is located at:

``` text
drizzle.config.ts
```

Generate migrations when the schema changes:

``` bash
bunx drizzle-kit generate
```

Push the schema directly to the configured database during development:

``` bash
bunx drizzle-kit push
```

------------------------------------------------------------------------

# 🌱 Seed Templates

The repository includes four starter templates:

``` text
Car Sale
Travel
Flash Sale
Coming Soon
```

Seed them into the database with:

``` bash
bun run db:seed
```

The seed script loads the corresponding Fabric.js JSON files from
`public/`.

------------------------------------------------------------------------

# ▶️ Run Locally

Start the development server:

``` bash
bun run dev
```

Then open:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# 🏭 Production Build

Build the application:

``` bash
bun run build
```

Start the production server:

``` bash
bun run start
```

Run linting:

``` bash
bun run lint
```

------------------------------------------------------------------------

# 🔑 OAuth Configuration

## Google

Create a Google OAuth application and configure the callback URL for
your environment.

For local development, the callback follows the NextAuth route:

``` text
http://localhost:3000/api/auth/callback/google
```

For production, replace the domain with your deployed Canvasly URL.

Set:

``` env
AUTH_GOOGLE_CLIENT_ID=
AUTH_GOOGLE_CLIENT_SECRET=
```

## GitHub

Create a GitHub OAuth application and configure:

``` text
http://localhost:3000/api/auth/callback/github
```

Set:

``` env
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

------------------------------------------------------------------------

# 💰 Stripe Setup

Create a Stripe Product and recurring Price.

Then configure:

``` env
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
```

For local webhook development, forward Stripe events to:

``` text
/api/subscriptions/webhook
```

Set the resulting webhook signing secret:

``` env
STRIPE_WEBHOOK_SECRET=
```

### Recommended webhook events

``` text
checkout.session.completed
customer.subscription.updated
customer.subscription.deleted
```

For production, configure the webhook endpoint using your deployed
domain.

------------------------------------------------------------------------

# 🤖 Replicate Setup

Canvasly uses Replicate for two AI capabilities:

### AI image generation

``` text
stability-ai/stable-diffusion-3
```

### Background removal

``` text
cjwbw/rembg
```

Add your token:

``` env
REPLICATE_API_TOKEN=your_token
```

Because AI calls happen server-side, the Replicate token should never be
exposed to the browser.

------------------------------------------------------------------------

# 🖼️ Unsplash Setup

Create an Unsplash API application and obtain an access key.

Configure:

``` env
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key
```

The application uses this key to retrieve images for the editor's image
library.

------------------------------------------------------------------------

# 📤 UploadThing Setup

The application includes an UploadThing file router:

``` text
src/app/api/uploadthing/core.ts
```

The configured uploader:

``` text
imageUploader
```

allows authenticated users to upload images up to:

``` text
4 MB
```

The returned file URL is then inserted into the Fabric.js canvas.

------------------------------------------------------------------------

# 🧪 Development Scripts

  Command                       Description
  ----------------------------- ------------------------------
  `bun install`                 Install dependencies
  `bun run dev`                 Start development server
  `bun run build`               Create production build
  `bun run start`               Start production server
  `bun run lint`                Run ESLint
  `bun run db:seed`             Seed template projects
  `bunx drizzle-kit generate`   Generate database migrations
  `bunx drizzle-kit push`       Push schema to database

------------------------------------------------------------------------

# 🧱 Important Architectural Decisions

## Why Fabric.js?

Fabric.js provides the core primitives required for a browser-based
design editor:

-   Object manipulation
-   Text rendering
-   Image objects
-   Shapes
-   Transformations
-   Canvas serialization
-   SVG export
-   Object selection
-   Drawing mode

Instead of rebuilding these primitives manually, Canvasly wraps
Fabric.js in its own editor abstraction.

------------------------------------------------------------------------

## Why store Fabric.js JSON?

A design is not just an exported image.

It consists of:

``` text
Text
Images
Shapes
Positions
Dimensions
Colors
Fonts
Filters
Layers
Canvas settings
```

Saving the Fabric.js JSON allows Canvasly to restore the editable state
of a project.

That means a user can close the editor, return later, and continue
modifying individual objects.

------------------------------------------------------------------------

## Why Hono?

Hono provides a small and strongly typed API layer.

The project uses:

``` text
Hono
   +
Zod
   +
Drizzle
```

This creates a clean separation between:

``` text
React UI
   ↓
React Query
   ↓
Hono API
   ↓
Database / External Services
```

The Hono client is also typed from the server route definition.

------------------------------------------------------------------------

# 🔒 Security Considerations

Canvasly includes several security mechanisms:

-   Authenticated API routes
-   User/project ownership checks
-   Password hashing using bcrypt
-   JWT-based sessions
-   OAuth authentication
-   Zod request validation
-   Stripe webhook signature verification
-   Server-side storage of sensitive API credentials
-   Authenticated UploadThing middleware
-   Pro feature gating

Project endpoints verify that the requested project belongs to the
authenticated user before allowing access, modification, duplication, or
deletion.

------------------------------------------------------------------------

# 📈 Scalability Considerations

The current architecture provides a strong foundation for expanding
Canvasly.

Potential future improvements include:

-   Real-time collaborative editing
-   Team workspaces
-   Comments and design reviews
-   More advanced templates
-   Template categories
-   Brand kits
-   Custom font uploads
-   More AI generation models
-   AI text generation
-   AI design suggestions
-   Background removal history
-   Version history
-   Autosave conflict resolution
-   Image optimization/CDN strategy
-   Project search
-   Advanced permissions
-   Organization billing
-   Usage-based AI credits
-   Rate limiting
-   Analytics
-   Automated testing
-   End-to-end tests
-   Error monitoring

------------------------------------------------------------------------

# 🗺️ Suggested Future Roadmap

### Phase 1 --- Editor Foundation

-   [x] Fabric.js canvas
-   [x] Text
-   [x] Shapes
-   [x] Images
-   [x] Drawing
-   [x] Filters
-   [x] Undo/redo
-   [x] Export

### Phase 2 --- Cloud Workspace

-   [x] Authentication
-   [x] Project persistence
-   [x] Templates
-   [x] Project duplication
-   [x] Project deletion

### Phase 3 --- AI

-   [x] AI image generation
-   [x] AI background removal

### Phase 4 --- Monetization

-   [x] Stripe Checkout
-   [x] Pro subscription state
-   [x] Billing portal
-   [x] Stripe webhooks
-   [x] Pro feature gating

### Phase 5 --- Future

-   [ ] Collaboration
-   [ ] Teams
-   [ ] Brand kits
-   [ ] Design version history
-   [ ] AI copywriting
-   [ ] Advanced AI editing
-   [ ] More template categories
-   [ ] Usage analytics
-   [ ] Automated test suite

------------------------------------------------------------------------

# 🧑‍💻 Code Organization Philosophy

The project intentionally separates responsibilities:

``` text
UI Components
      │
      ▼
Feature Hooks / React Query
      │
      ▼
Typed Hono Client
      │
      ▼
Hono API
      │
 ┌────┼───────────────┐
 ▼    ▼               ▼
DB   Replicate     Stripe
 │      │              │
 ▼      ▼              ▼
Neon   AI Models    Billing
```

This structure makes it easier to replace or extend individual services
without rewriting the entire application.

------------------------------------------------------------------------

# 🐛 Troubleshooting

## Application opens but authentication fails

Check:

``` env
AUTH_SECRET=
```

and verify that your OAuth credentials match the current domain.

------------------------------------------------------------------------

## Database errors

Check:

``` env
DATABASE_URL=
```

Then test the database schema with:

``` bash
bunx drizzle-kit push
```

------------------------------------------------------------------------

## Templates are missing

Run:

``` bash
bun run db:seed
```

Make sure the database user has permission to insert template projects.

------------------------------------------------------------------------

## AI generation does not work

Verify:

``` env
REPLICATE_API_TOKEN=
```

Also make sure the Replicate account has access to the required model.

------------------------------------------------------------------------

## Unsplash images are not loading

Verify:

``` env
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=
```

and make sure the key is valid.

------------------------------------------------------------------------

## Stripe subscription does not activate

Check all three:

``` env
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

Then verify that Stripe is successfully delivering webhook events to:

``` text
/api/subscriptions/webhook
```

------------------------------------------------------------------------

# 📸 Screens / User Experience

The application is organized around three major experiences:

### Authentication

``` text
Sign In
   │
   ├── Email + Password
   ├── Google
   └── GitHub
```

### Dashboard

``` text
Dashboard
├── Projects
├── Templates
├── Create Design
└── Subscription
```

### Editor

``` text
Editor
├── Select
├── Text
├── Shapes
├── Images
├── Draw
├── AI
├── Remove Background
├── Filters
├── Colors
├── Typography
├── Layers
├── Undo / Redo
└── Export
```

------------------------------------------------------------------------

# 📦 Main Dependencies

Some of the most important packages in the project are:

``` text
next
react
fabric
next-auth
drizzle-orm
@neondatabase/serverless
hono
zod
@tanstack/react-query
stripe
replicate
unsplash-js
uploadthing
zustand
tailwindcss
radix-ui
lucide-react
```

------------------------------------------------------------------------

# 🌟 Why This Project Is Interesting

Canvasly is more than a simple CRUD application.

It combines several challenging engineering domains in one product:

1.  **Interactive graphics programming** through Fabric.js.
2.  **State management** for complex editor interactions.
3.  **Persistent design serialization** using Fabric.js JSON.
4.  **Authentication and authorization** using Auth.js.
5.  **Type-safe API development** with Hono and Zod.
6.  **Relational data modeling** using Drizzle ORM and PostgreSQL.
7.  **AI integration** using Replicate.
8.  **File upload infrastructure** using UploadThing.
9.  **Third-party image search** using Unsplash.
10. **Subscription infrastructure** using Stripe.
11. **Webhook-driven backend synchronization**.
12. **Production deployment** through Vercel.

That combination makes Canvasly a solid example of a modern full-stack
TypeScript application.

------------------------------------------------------------------------

# 📄 License

This project does not currently declare a license in its package
metadata.

If you intend to publish the repository publicly, add an explicit
`LICENSE` file and update this section accordingly.

------------------------------------------------------------------------

# 👨‍💻 Author

Built as a full-stack AI-powered design editor project with modern
TypeScript technologies.

**Live Application:** https://canvasly-ai-canva.vercel.app

------------------------------------------------------------------------

## ⭐ If you like Canvasly

Consider:

-   ⭐ Starring the repository
-   🍴 Forking the project
-   🐛 Opening issues
-   💡 Suggesting new editor features
-   🚀 Building your own templates and extensions

> **Canvasly --- Design anything, faster.**
