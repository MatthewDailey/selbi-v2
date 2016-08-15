import firebase from 'firebase';

const basicServiceAccountConfig = {
  serviceAccount: {
    type: 'service_account',
    project_id: 'selbi-develop',
    private_key_id: '6d63cfa40b25e42176a962d038c1ea2edce6e5aa',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDM3Jrg8onIsRvW\nlC9pwduL3jCQMJryQnJGyWfGFNM52H40b7GLht48sJUM1JUFAErNeqxcAwnb5Frm\nTobUm4zvYukia1ZGvQe2HhLRWbno5LeQniutok9q3LUPLEkTVex6+2w4HdDMn88g\nTNZUXqwdH2Q5jag83EEPioxJGrJAeIvI8ZoZesyR6y6jwNIXc115M3evsnuGEAdt\nvI+k4o2Q5bM4HZQFvcVoMKaTK1ufKD6nMpSloHrwMKPfDPc9M40KysTbFzTbaP/R\npqncJ6XzfcPoVMa+hX3sZkJdU80p6oIe1dLX5uNLZVWrgdp+yL079Ixr3djkIZXa\nF2aJMJBrAgMBAAECggEBAIJjJnBl7iw+DWnVhxfYutOa523egcAPaoyDQ/le59G5\naRoWvPoBLRGTkkpIQ1CbjwCZQ3qMtImwHerXsBlBp8H1Qk0V5CPBzFatbWyxnxIM\nAImbIlGxLLrnHpY5qYkU9x6PR6Gv2GVkkYANZ5zrZMBkanX3I00ZIo+xrvgYdbtx\n2nAofz+508Jj+ysP6qBd7O/YNDkqaJm5V+Oaa4RxwgcPluR6wH2+vbCSqO7nCXr5\nc8/MhAeUTxZaMEUaIYA3C9GPXQDjD7BVxzU/XATaM1lJlg9dno44PGYrqsWss/Gs\nzxYcz3EpuZtti7lpwnqymYMxNZaY//dw+F2Bl+lSsQECgYEA6iE2oIqnhGDD9Gzf\nhwJcq7cjMRLvcPdQ5kFFoErq7eSnsldfyr7kxEjPUuHzaJELZ5NCSgMsqoxWp8JX\nsvQNNwBfeTiCyendcp175TZjxKoIetmVqytDCmMiZ/nXQRP4gCscCFHbXEPDXs97\nuqoYirfrEO0WP4DrHtUW3V+/z4MCgYEA3/+AKIs8CXecfWMZVDaFejEw81UvPmFe\nGdPgZ3QavRPtsNJ+H7x+GhGhZC4G/uy1JsHYA2qgD14APbZSouJiEHbbvXGtWzYN\nndRicCwPiiom7ZTDV8uuZyxSLx/hiHZezi8pA6/SHT1mm/wApoerp4f/UG/cxPwA\ndSnD0RLKPvkCgYEAwfiyYV9+WdYxgpeQuTHjxP/9T/L4HQdJJvp8zMhEysLdjIuG\n+Vod/eC0o14/YyqH4E/IY7ktkD6krGf+cGxxZlgQwUVoVhBDP2np84SUM6MLU3xg\n22cEK97l6m67P1dkUgtlNh9bNZ2Oh0Yuo/+4RXUKcwN5ozMTmH/CabWiHDECgYEA\ngrFytzU13Fg7qDUP7EC7dGYLJ47GN+FbpDopLnNhvnxILOlDyYSTFua+gdMRJeA6\nediUDrpBlXXFMjyUzpDDotOWtlwDR7qsCzCGFui+UGDzwZ8QssMWiQAlG3XAg3x9\nKFP/3DTTpVfT7KMGRiPWlbMV1nrOFujp43Jw3CXYdxECgYAj1TvBISiH0UHOoiXb\njQvEGc+NyGf+lFMFNAorYN/dIsNiLHyAxID1Z3K6q+896qjdfOQl2exddMpzMRRZ\nVoyDgcCAO9k+sJ0M5j+hBu6vOUgvqV1tvvKubdr5+vSFauFQ0gpTg3bzaIC2ADY6\nH3H1BF5RjwOV7TTR3r1IrUNVKw==\n-----END PRIVATE KEY-----\n',
    client_email: 'service-account@selbi-develop.iam.gserviceaccount.com',
    client_id: '114189312436974099103',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://accounts.google.com/o/oauth2/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/service-account%40selbi-develop.iam.gserviceaccount.com'
  },
  databaseURL: 'https://selbi-develop.firebaseio.com',
};

const serviceAccountApp = firebase.initializeApp(basicServiceAccountConfig, 'serviceUser');

let count = 0;

function createListing() {
  console.log('Creating...')
  serviceAccountApp
    .database()
    .ref('test')
    .push({c: count})
    .then(() => {
      count = count + 1;
      console.log(`created listing: ${count}`);
      setTimeout(createListing, 1000);
    })
    .catch(console.log);
}

createListing();

console.log('App can run.');
