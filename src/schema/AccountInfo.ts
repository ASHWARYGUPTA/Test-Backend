import mongoose from "mongoose";

const CreditCardSchema = new mongoose.Schema({
  BankName: String,
  AccountNumber: String,
  Address: String,
  AccountOverdue: Number,
  CurrentBalance: Number,
});

const AccountInfoSchema = new mongoose.Schema({
  // Basic Info
  Name: String,
  MobileNumber: Number,
  CreditScore: Number,
  PanNumber: String,

  // Account Details
  NumberOfAccounts: Number,
  NumberOfActiveAccounts: Number,
  NumberOfClosedAccount: Number,
  CurrentBalanceAmount: Number,
  SecuredAccountsAmount: Number,
  UnsecuredAccountsAmount: Number,
  Last7DaysCreditEnquiries: Number,

  // Credit Cards Information
  CreditCardsInfos: [CreditCardSchema],

  // Reference to User
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const AccountInfoModel = mongoose.model(
  "AccountInfoDetails",
  AccountInfoSchema
);

export default AccountInfoModel;
