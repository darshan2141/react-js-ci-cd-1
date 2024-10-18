import React from 'react'
const App = () => {

  console.log('All env variables:', process.env);

  
  return (
    <div>
      App After one testing work changes change adasd
      <p>after change bucket policy like dev-community 16 oc 1:04 pm</p>
      <p>after change bucket policy like dev-community 18 oc 2:20 pm</p>
      <p>ENV test {process.env.REACT_APP_TEST}</p>
      <p>ENV test {process.env.REACT_APP_TEST2}</p>

      <p>add .env varible name in github 18 oc 4:55 pm</p>

    </div>

  )
}

export default App