[![Contributors](https://img.shields.io/opencollective/all/riffcc?style=flat-square)](https://opencollective.com/riffcc)

# Riff.CC on Ceramic (ComposeDB)

A proof-of-concept version of Riff.CC, implemented using Ceramic and ComposeDB. Funding provided via OpenCollective.

## Usage

* Setup and configure [ceramic-node](https://github.com/riffcc/ceramic-node)

* Install packages
```bash
yarn install
```

* Rename .env.local.example to env.local and fill variables

We strongly recommend using our node and the new admin server.

- `VITE_NODE_URL`=https://ftwc.xyz/ceramic
- `VITE_ADMIN_SERVER`=https://ftwc.xyz/api

```bash
VITE_NODE_URL=<YOUR_NODE_URL> # If you run a own local node <http://localhost:7007> , or an external node <http://<SERVER_PUBLIC_IP>:7007>
VITE_ADMIN_SERVER=<YOUR_ADMIN_SERVER_URL> # Run admin server in riffcc/eramic-node repository via yarn run admin:server
VITE_WEBSITE_ID=<TEST_WEBSITE_ID> # Generated in riffcc/eramic-node repository via yarn run generate:website
```

Run the application
```bash
yarn dev
```

## License
Made available under the MIT License.

## Credits
Authored by [@en0c-026](https://github.com/en0c-026), [@Zorlin](https://github.com/Zorlin)

## Sponsors
Thank you to our sponsors, who have generously provided funding for the development of the Riff.CC Project:

* [Money Every 3 Days](http://moneyevery3days.com/)