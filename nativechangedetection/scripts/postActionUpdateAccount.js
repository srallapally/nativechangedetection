// postAction on Update Account

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
logger.error("\nIDM linked user:" + source["_id"]);
var accountData = null;

accountData = JSON.stringify(target);

try {
  var result = openidm.query(
    "/managed/alpha_accounts",
    { _queryFilter: '/accountName eq "' + target[nameAttr] + '"' },
    ["_id", "accountId"]
  );

  var json = JSON.parse(result);
  logger.error("\nResult from query " + result);
  var results = json.result[0];
  var id = null;
  id = results._id;
  if (id == null) {
    logger.error("Could not find account");
  } else {
    logger.error("\nAccount _id :" + results._id);
    var account_id = results._id;
    var patchData = [
      { operation: "replace", field: "/accountData", value: accountData },
      { operation: "replace", field: "/modifiedOn", value: getFormattedDate() },
    ];
    var patchResult = openidm.patch(
      "managed/alpha_accounts/" + account_id,
      null,
      patchData
    );
  }
} catch (e) {
  console.log("run to catch!", e);
}
