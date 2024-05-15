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

var id = null;
var rev = null;
var lastKnownAccountData = null;
var sourceData = null;
var accountData = null;
var account = null;
logger.error("\nProcessing Account " + source._id);
logger.error("\nProcessing Account Name " + source[nameAttr]);
logger.error("\nIDM linked user:" + target._id);

sourceData = JSON.stringify(source);

// check if account exists
logger.error("Checking if " + source[nameAttr] + " exists");
var result = openidm.query(
  "/managed/alpha_accounts",
  {
    _queryFilter:
      '/applicationId eq "' +
      applicationId +
      '" and /accountName eq "' +
      source[nameAttr] +
      '"',
  },
  ["_id", "_rev", "accountId", "accountData"]
);
logger.error("results of query " + result);
var obj = JSON.parse(result);
// could not find an existing account
if (!obj.result && obj.result.length == 0) {
  // this shouldn't happen because CONFIRMED is triggered for linked accounts
  logger.error("\nError with :" + source[nameAttr]);
  logger.error("\nWill create rogue account");
  try {
    var accountObj = {
      applicationId: applicationId,
      accountId: source["id"],
      accountName: source[nameAttr],
      owner: "managed/alpha_user/" + target._id,
      createdOn: getFormattedDate(),
      lastReconOn: getFormattedDate(),
      accountData: sourceData,
      lastReconData: sourceData,
      isRogue: "yes",
    };
    var result = openidm.create("/managed/alpha_accounts", null, accountObj);
    logger.error("\nCreated :" + result);
  } catch (e) {
    console.log("onUpdate run to catch!", e);
  }
} else {
  account = obj.result[0];
  lastKnownAccountData = account.accountData;
  id = account._id;
  rev = account.rev;
  try {
    var patchData = [
      {
        operation: "replace",
        field: "/owner",
        value: "managed/alpha_user/" + target._id,
      },
      {
        operation: "replace",
        field: "/lastKnownAccountData",
        value: lastKnownAccountData,
      },
      { operation: "replace", field: "/lastReconData", value: sourceData },
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
    console.log("onUpdate I am running to catch", e1);
  }
}
