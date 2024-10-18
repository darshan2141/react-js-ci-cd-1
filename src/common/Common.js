//Server URL
// export const BASE_URL = "https://fieldr-indoor-dev.herokuapp.com";
// export const BASE_URL = "http://localhost:5000";
export const BASE_URL = "https://web-backend-yctr.onrender.com"; // render
// export const BASE_URL = "https://fieldr-indoor-prod.herokuapp.com";

//Web URL
// export const WEB_BASE_URL = "https://dev-community.fieldr.lk"
// export const WEB_BASE_URL = "https://community.fieldr.lk"
export const WEB_BASE_URL = "http://localhost:3000";
const AWS = require("aws-sdk");
const axios = require("axios").default;

export function sendHttpRequest(
  method,
  url,
  params = null,
  data = null,
  contentType = "application/json",
  handleErrors = true
) {
  url = params ? url + "?" + constructUrlWithParams(params) : url;
  var request = axios({ method: method, headers: { "Content-Type": contentType }, url: url, data: data });
  if (handleErrors) {
    request.then((data) => {
      if (data.status === 0) {
        alert("Error");
      }
    });
  }
  return request;
}

function constructUrlWithParams(params) {
  var esc = encodeURIComponent;
  var query = Object.keys(params)
    .map((k) => esc(k) + "=" + esc(params[k]))
    .join("&");
  return query;
}

export function isEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function isContactNo(contactNo) {
  const re =
    /^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;
  return re.test(contactNo);
}

export function isInputValid(params) {
  var isValid = false;
  if (params === undefined || params === null || params === "") {
    isValid = true;
  }
  return isValid;
}

export function isInputEmptyString(params) {
  var isValid = false;
  if (params === "") {
    isValid = true;
  }
  return isValid;
}

export function checkIfUserLoggedIn(history) {
  let userToken = localStorage.getItem("loggedInUserToken");
  if (userToken === "" || userToken == null) {
    history.push("/403");
  }
}

export function searchPlayer(searchingKeyWord, allPlayers) {
  searchingKeyWord = searchingKeyWord.toLowerCase();

  return allPlayers.filter(player =>
    player.email?.toLowerCase().includes(searchingKeyWord) ||
    player.contactNo?.toLowerCase().includes(searchingKeyWord) ||
    player.firstName?.toLowerCase().includes(searchingKeyWord) ||
    player.lastName?.toLowerCase().includes(searchingKeyWord)
  )
}

export function uploadToS3(file, type) {
  const fileName = type === "payment" ?
    "payments/" + Date.now().toString() + "." + file.name.split(".").pop()
    :
    Date.now().toString() + "." + file.name.split(".").pop();

  const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME;
  const REGION = process.env.REACT_APP_AWS_REGION;

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  });

  const s3 = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const params = {
    Bucket: S3_BUCKET,
    Key: fileName.toString(),
    Body: file,
  };

  return s3.putObject(params).promise().then(() => {
    return `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;
  }).catch((err) => {
    throw new Error(err);
  });
}
