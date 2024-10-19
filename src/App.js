import React from 'react'
const App = () => {

  console.log('All env variables:', process.env);


  return (
    <div>
      App After one testing work changes change adasd
      <p>after change bucket policy like dev-community 16 oc 1:04 pm</p>
      <p>after change bucket policy like dev-community 18 oc 2:20 pm</p>
      <p>ENV test : {process.env.REACT_APP_TEST}</p>
      <p>ENV test : {process.env.REACT_APP_TEST2}</p>
      <p>add .env varible name in github 18 oc 4:55 pm</p>
      <p>REACT_APP_GOOGLE_CLIENT_ID : {process.env.REACT_APP_GOOGLE_CLIENT_ID}</p>
      <p>REACT_APP_S3_BUCKET_NAME_FOR_MEDIA : {process.env.REACT_APP_S3_BUCKET_NAME_FOR_MEDIA}</p>
      <p>REACT_APP_AWS_REGION : {process.env.REACT_APP_AWS_REGION}</p>
      <p>aws env</p>
      <p>REACT_APP_S3_BUCKET_NAME : {process.env.REACT_APP_S3_BUCKET_NAME}</p>
      <p>Common</p>
      <p>REACT_APP_AWS_SECRET_ACCESS_KEY : {process.env.REACT_APP_AWS_SECRET_ACCESS_KEY}</p>
      <p>REACT_APP_AWS_ACCESS_KEY_ID : {process.env.REACT_APP_AWS_ACCESS_KEY_ID}</p>
    </div>
  )
}

export default App