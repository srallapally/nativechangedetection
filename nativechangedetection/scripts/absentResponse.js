// Script has access to the following variables:
// sourceObject
// targetObject
// existingTargetObject
// linkQualifier
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
logger.error("\nProcessing Account " + source[nameAttr]);
accountData = JSON.stringify(source);
try {
  //Check if account exists
  logger.error("Checking if " + source[nameAttr] + " exists in cache");
  var qry = openidm.query(
    "/managed/alpha_accounts",
    { _queryFilter: '/accountName eq "' + source[nameAttr] + '"' },
    ["_id", "rev", "accountId"]
  );
  var res = null;
  res = JSON.parse(qry);
  //logger.error("\nResult from query " + JSON.stringify(qry));
  var res0 = null;
  var rev = null;
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
    accountId: source[idAttr],
    accountName: source[nameAttr],
    accountData: accountData,
    lastReconData: accountData,
    createdOn: getFormattedDate(),
    lastReconOn: getFormattedDate(),
    isRogue: "no",
  };
  var result = openidm.create("/managed/alpha_accounts", null, accountObj);
  logger.error("\nCreated :" + result);
} else {
  // this is an odd state. Absent is triggered when account has not been linked
  // adding this to catch abnormal situations
  logger.error(" Account exists");
  try {
    var patchData = [
      { operation: "replace", field: "/accountId", value: source[idAttr] },
      { operation: "replace", field: "/lastReconData", value: accountData },
      {
        operation: "replace",
        field: "/lastReconOn",
        value: getFormattedDate(),
      },
    ];
    var patchResult = openidm.patch(
      "managed/alpha_accounts/" + id,
      rev,
      patchData
    );
  } catch (e1) {
    logger.error("Catching to run\n");
  }
}

("ASYNC");
