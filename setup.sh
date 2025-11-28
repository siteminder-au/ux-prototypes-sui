#!/bin/bash

echo "🚀 Setting up SUI Web Components prototyping environment..."
echo ""

# Install dependencies for web-components build
echo "📦 Installing web-components-build dependencies..."
cd web-components-build
npm install

echo ""
echo "🔨 Building Web Components..."
npm run build

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Starting local server..."
echo "Server will be available at: http://localhost:3000"
echo "Prototype URL: http://localhost:3000/prototypes/example-prototype"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npx serve . -p 3000
