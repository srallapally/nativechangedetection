//Create Account postAction

function getFormattedDate() {
  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth() + 1; // Month is zero-indexed, so we add 1
  var year = today.getFullYear();
  var hours = today.getHours();
  var minutes = today.getMinutes();
  var seconds = today.getSeconds();

  // Format the date and time as desired, e.g., "YYYY-MM-DD HH:mm:ss"
  var formattedDateTime =
    year +
    "-" +
    (month < 10 ? "0" : "") +
    month +
    "-" +
    (day < 10 ? "0" : "") +
    day +
    " " +
    (hours < 10 ? "0" : "") +
    hours +
    ":" +
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds;

  return formattedDateTime;
}
// CHANGE ME FOR EVERY TARGET APP
var nameAttr = "userPrincipalName";
var idAttr = "_id";
var applicationId = "42fe1863-e876-4cbd-96bb-f8becd9d6c08";
//////////////////////////////////////////////////

var accountData = null;
var id = null;
accountData = JSON.stringify(target);
logger.error("Checking if " + target[nameAttr] + " exists");
try {
  //Check if account exists
  var qry = openidm.query(
    "/managed/alpha_accounts",
    { _queryFilter: '/accountName eq "' + target[nameAttr] + '"' },
    ["_id", "accountId"]
  );
  var res = null;
  res = JSON.parse(qry);
  logger.error("\nResult from query " + JSON.stringify(qry));
  var res0 = null;
  res0 = res.result[0];
  if (res0 == null) {
    logger.error("Null response");
  } else {
    id = res0._id;
    logger.error("\nAccount _id :" + id);
  }
} catch (e) {
  logger.error("Running to catch");
}
if (id == null) {
  var accountObj = {
    applicationId: applicationId,
    accountId: target["id"],
    accountName: target[nameAttr],
    owner: "managed/alpha_user/" + source["_id"],
    accountData: accountData,
    createdOn: getFormattedDate(),
    isRogue: "no",
  };
  var result = openidm.create("/managed/alpha_accounts", null, accountObj);
  logger.error("\nCreated :" + result);
} else {
  logger.error("Found an existing account");
}
