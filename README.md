**Summary**

This project describes a customization developed to provide the following capabilities
* an account repository that contains accounts, linked or otherwise, across all onboarded applications
* actionable rogue account/ rogue change detection
  
**Problem Statement**

* Customer wants to detect un-sanctioned changes in user accounts in applications as part of target reconciliation (or inbound sync). The changes can be in one or more single or multi-valued attributes, which may or may not be entitlements.
* Once the changes are detected, they want the ability to take action which includes but is not limited to sending an email, creating an incident or other actions.
* They want the ability to accept the changes or reject the changes and overwrite the data in the target application based on their business criteria

**Expectations**

* There exists a way to get a list of accounts, orphan or otherwise, with account data
* There exists a way to detect changes in account attributes, regardless of whether they are entitlements or not
* There exists a way to take action on accounts that have unsanctioned changes

![Solution details\(./nativechangedetection/x.md)
