# Warning

ถ้าคุณต้องการช่วยเราในการแก้ไขบัค หรือ เพิ่มฟังก์ชั่น ได้โปรดส่งคำขอไปยังที่ [lottsanook-nodejs](../../../../quad-b/lottsanook-nodejs) สำหรับ NodeJS หรือ [lottsanook](../../../../quad-b/lottsanook) สำหรับ PHP

[![lottsanook-nodejs](https://img.shields.io/github/issues-pr-raw/Quad-B/lottsanook-nodejs?label=Pull%20request%20for%20helped&logo=github)](../../../../quad-b/lottsanook-nodejs) [![lottsanook](https://img.shields.io/github/issues-pr-raw/Quad-B/lottsanook?label=Pull%20request%20for%20helped&logo=github)](../../../../quad-b/lottsanook)

# Express.js on Netlify Example

[![Netlify
Status](https://api.netlify.com/api/v1/badges/9aaef7de-1e5d-4fda-bc39-faa10a68b35b/deploy-status)](https://app.netlify.com/sites/netlify-express/deploys)

[![Deploy to
Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/neverendingqs/netlify-express)

An example of how to host an Express.js app on Netlify using
[serverless-http](https://github.com/dougmoscrop/serverless-http). See
[express/server.js](express/server.js) for details, or check it out at
https://netlify-express.netlify.com/!

[index.html](index.html) simply loads html from the Express.js app using
`<object>`, and the app is hosted at `/.netlify/functions/server`. Examples of
how to access the Express.js endpoints:

```sh
curl https://netlify-express.netlify.com/.netlify/functions/server
curl https://netlify-express.netlify.com/.netlify/functions/server/another
curl --header "Content-Type: application/json" --request POST --data '{"json":"POST"}' https://netlify-express.netlify.com/.netlify/functions/server
```
