// Function to compare attributes and identify changes
function compareAttributes(attr1, attr2, attributesToMonitor) {
  var changes = {};

  for (var i = 0; i < attributesToMonitor.length; i++) {
    var key = attributesToMonitor[i];
    logger.error("### ROGUE SCANNER : Comparing:" + key + "\n");
    if (attr1.hasOwnProperty(key) && attr2.hasOwnProperty(key)) {
      logger.error(
        "### ROGUE SCANNER : Comparing Set1:" +
          JSON.stringify(attr1[key]) +
          "\n"
      );
      logger.error(
        "### ROGUE SCANNER : Comparing Set2:" +
          JSON.stringify(attr2[key]) +
          "\n"
      );
      if (JSON.stringify(attr1[key]) !== JSON.stringify(attr2[key])) {
        changes[key] = {
          oldValue: attr1[key],
          newValue: attr2[key],
        };
      }
    } else {
      logger.error("#### ROGUE SCANNER : Nothing to check\n");
    }
  }

  return changes;
}
function convertToArray(str) {
  return str.split(",");
}

run();

function run() {
  //var applicationId = null;
  //var attrToMonitor = null;
  //var action = null;
  var workflowToLaunch = null;
  var DEBUG = true;
  var lastKnownAccountData = null;
  var lastReconData = null;
  var accountId = null;
  var accountName = null;
  var attributesToMonitor = [];
  logger.error("############## ROGUE SCANNER ###############");
  logger.error("\nROGUE SCANNER: Application ID: " + applicationId);
  logger.error("\nROGUE SCANNER: action: " + action);
  logger.error("\nROGUE SCANNER: attr to monitor: " + attrToMonitor);

  if (!applicationId || !attrToMonitor || !action) {
    logger.error(
      " ROGUE SCANNER: Application Id, attributes to monitor and action are required attributes"
    );
    return;
  }

  if (action == "DEBUG") {
    DEBUG = true;
  } else if (action == "WORKFLOW") {
    // add a check to see if the workflow is a valid workflow
  }

  //try {
  // add a check for the application

  var qry = null;
  qry = openidm.query(
    "/managed/alpha_accounts",
    { _queryFilter: '/applicationId eq "' + applicationId + '"' },
    ["_id", "accountId", "accountName", "lastKnownAccountData", "lastReconData"]
  );
  var res = null;
  if (qry.result.length > 0) {
    for (var i = 0; i < qry.result.length; i++) {
      var account = qry.result[i];
      accountId = account.accountId;
      accountName = account.accountName;
      logger.error(
        "### ROGUE SCANNER: Working on Account Name: " + accountName
      );
      if (account.lastKnownAccountData) {
        lastKnownAccountData = JSON.parse(account.lastKnownAccountData);
        logger.error("\nAccount Data:" + account.lastKnownAccountData);
      }
      if (account.lastReconData) {
        lastReconData = JSON.parse(account.lastReconData);
        logger.error("\n Recon Data:" + account.lastReconData);
      }

      if (lastKnownAccountData && lastReconData) {
        attributesToMonitor = convertToArray(attrToMonitor);
        var deltaRows = compareAttributes(
          lastReconData,
          lastKnownAccountData,
          attributesToMonitor
        );
      }
      if (Object.keys(deltaRows).length > 0) {
        logger.error("Account ID: " + accountId);
        logger.error("Account Name: " + accountName);
        logger.error("Delta Rows:");
        for (var key in deltaRows) {
          if (deltaRows.hasOwnProperty(key)) {
            logger.error("- Attribute: " + key);
            logger.error(
              "  Old Value: " + JSON.stringify(deltaRows[key].oldValue)
            );
            logger.error(
              "  New Value: " + JSON.stringify(deltaRows[key].newValue)
            );
          }
        }
      } else {
        logger.error("No delta found for Account ID: " + accountId);
      }
    }
  } else {
    logger.error("No accounts found for Application ID: " + applicationId);
  }
  //} catch (e) {
  //  logger.error("Running to catch");
  //}
  logger.error("############## ROGUE SCANNER ###############");
}
