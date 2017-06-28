(
  export PKG=eslint-config-airbnb;
  npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
)
npm install babel-eslint --save-dev
echo "{
  \"parser\": \"babel-eslint\",
  \"env\": {
    \"browser\": true,
    \"node\": true,
    \"jest\": true,
  },
  \"extends\": \"airbnb\",
  \"rules\": {
    \"react/jsx-filename-extension\": [1, { \"extensions\": [\".js\", \".jsx\"] }],
    \"import/prefer-default-export\": \"off\",
    \"no-bitwise\": \"off\",
    \"react/prop-types\": \"off\",
    \"react/prefer-stateless-function\": \"off\",
  }
}" > ./.eslintrc
