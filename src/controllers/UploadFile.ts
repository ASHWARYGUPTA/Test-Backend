// import express from "express";
// import bodyParser from "body-parser";
// import multer from "multer";
// import cors from "cors";
// import { parseString } from "xml2js";
// import getToken from "../middlewares/getToken";
// import validateJWT from "../middlewares/validateJWT";
// import verifyJWT from "../middlewares/verifyJWT";
// import AccountInfoModel from "../schema/AccountInfo";

// const router = express.Router();
// router.use(bodyParser.json());
// router.use(cors());
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.post(
//   "/",
//   upload.single("file"),
//   //@ts-ignore
//   async (req, res) => {
//     try {
//       console.log("Reached");
//       if (!req.file) {
//         return res.status(400).json({ message: "No file uploaded" });
//       }

//       const xmlData = req.file.buffer.toString(); // Convert Buffer to String

//       // Parse XML to JSON
//       console.log(req.body.id_decoded);
//       parseString(xmlData, { explicitArray: false }, async (err, result) => {
//         if (err) {
//           return res
//             .status(500)
//             .json({ message: "Error parsing XML", error: err });
//         }
//         const creditCardDetailsArray =
//           result.INProfileResponse.CAIS_Account.CAIS_Account_DETAILS;

//         //@ts-ignore
//         const detailsArray = creditCardDetailsArray.forEach((e) => {
//           console.log("\t\t\t");
//           console.log(e);
//           {
//             BankName: e.Subscriber_Name;
//             AccountNumber: e.Account_Number;
//             Addresses: e.CAIS_Holder_Address_Details
//               .First_Line_Of_Address_non_normalized +
//               " " +
//               e.CAIS_Holder_Address_Details
//                 .Second_Line_Of_Address_non_normalized +
//               " " +
//               e.CAIS_Holder_Address_Details
//                 .Third_Line_Of_Address_non_normalized +
//               " " +
//               e.CAIS_Holder_Address_Details.City_non_normalized;
//             AccountOverdue: e.Amount_Past_Due;
//             CurrentBalance: e.Current_Balance;
//             console.log(
//               ".................................................................................."
//             );
//           }
//         });
//         // console.log(detailsArray);
//         console.log(creditCardDetailsArray);
//         await AccountInfoModel.create({
//           Name:
//             result.INProfileResponse.Current_Application
//               .Current_Application_Details.First_Name +
//             " " +
//             result.INProfileResponse.Current_Application
//               .Current_Application_Details.Last_Name,
//           MobileNumber:
//             result.INProfileResponse.Current_Application
//               .Current_Application_Details.MobilePhoneNumber,
//           CreditScore: result.INProfileResponse.SCORE.BureauScore,
//           PanNumber:
//             result.INProfileResponse.CAIS_Account.CAIS_Account_DETAILS[0]
//               .CAIS_Holder_Details.Income_TAX_PAN,

//           // Account Details
//           NumberOfAccounts:
//             result.INProfileResponse.CAIS_Account.CAIS_Summary.Credit_Account
//               .CreditAccountTotal,
//           NumberOfActiveAccounts:
//             result.INProfileResponse.CAIS_Account.CAIS_Summary.Credit_Account
//               .CreditAccountActive,
//           NumberOfClosedAccount:
//             result.INProfileResponse.CAIS_Account.CAIS_Summary.Credit_Account
//               .CreditAccountClosed,
//           CurrentBalanceAmount:
//             result.INProfileResponse.CAIS_Account.CAIS_Summary
//               .Total_Outstanding_Balance.Outstanding_Balance_All,
//           SecuredAccountsAmount:
//             result.INProfileResponse.CAIS_Account.CAIS_Summary
//               .Total_Outstanding_Balance.Outstanding_Balance_Secured,
//           UnsecuredAccountsAmount:
//             result.INProfileResponse.CAIS_Account.CAIS_Summary
//               .Total_Outstanding_Balance.Outstanding_Balance_UnSecured,
//           Last7DaysCreditEnquiries:
//             result.INProfileResponse.CAPS.CAPS_Summary.CAPSLast7Days,

//           // Credit Cards Information
//           CreditCardsInfos: detailsArray,

//           // Reference to User
//           userId: req.body.id_decoded,
//         });

//         res.status(200).json({
//           message: "Data Sent Successfully",
//           value: true,
//         });
//       });
//     } catch (error) {
//       res.status(403).json({
//         message: "Unkown Error Occured",
//         value: false,
//         error,
//       });
//     }
//   }
// );

// export default router;
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import cors from "cors";
import { parseString } from "xml2js";
import getToken from "../middlewares/getToken";
import validateJWT from "../middlewares/validateJWT";
import verifyJWT from "../middlewares/verifyJWT";
import AccountInfoModel from "../schema/AccountInfo";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(bodyParser.json());
router.use(cookieParser());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/",
  upload.single("file"),
  getToken, // Custom middleware (executes first)
  validateJWT, // JWT validation middleware
  verifyJWT,
  //@ts-ignore
  async (req, res) => {
    try {
      //   console.log("Reached");
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const xmlData = req.file.buffer.toString(); // Convert Buffer to String
      //   console.log(req.body._id);

      parseString(xmlData, { explicitArray: false }, async (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error parsing XML", error: err });
        }

        try {
          const creditCardDetailsArray =
            result.INProfileResponse.CAIS_Account.CAIS_Account_DETAILS;

          //@ts-ignore
          const detailsArray = creditCardDetailsArray.map((e) => ({
            BankName: e.Subscriber_Name,
            AccountNumber: e.Account_Number,
            Addresses: `${e.CAIS_Holder_Address_Details.First_Line_Of_Address_non_normalized} ${e.CAIS_Holder_Address_Details.Second_Line_Of_Address_non_normalized} ${e.CAIS_Holder_Address_Details.Third_Line_Of_Address_non_normalized} ${e.CAIS_Holder_Address_Details.City_non_normalized}`,
            AccountOverdue: e.Amount_Past_Due,
            CurrentBalance: e.Current_Balance,
          }));

          //   console.log(detailsArray);

          await AccountInfoModel.create({
            Name: `${result.INProfileResponse.Current_Application.Current_Application_Details.Current_Applicant_Details.First_Name}  ${result.INProfileResponse.Current_Application.Current_Application_Details.Current_Applicant_Details.Last_Name}`,
            MobileNumber:
              result.INProfileResponse.Current_Application
                .Current_Application_Details.Current_Applicant_Details
                .MobilePhoneNumber,
            CreditScore: result.INProfileResponse.SCORE.BureauScore,
            PanNumber:
              result.INProfileResponse.CAIS_Account.CAIS_Account_DETAILS[0]
                .CAIS_Holder_Details.Income_TAX_PAN,

            // Account Details
            NumberOfAccounts:
              result.INProfileResponse.CAIS_Account.CAIS_Summary.Credit_Account
                .CreditAccountTotal,
            NumberOfActiveAccounts:
              result.INProfileResponse.CAIS_Account.CAIS_Summary.Credit_Account
                .CreditAccountActive,
            NumberOfClosedAccount:
              result.INProfileResponse.CAIS_Account.CAIS_Summary.Credit_Account
                .CreditAccountClosed,
            CurrentBalanceAmount:
              result.INProfileResponse.CAIS_Account.CAIS_Summary
                .Total_Outstanding_Balance.Outstanding_Balance_All,
            SecuredAccountsAmount:
              result.INProfileResponse.CAIS_Account.CAIS_Summary
                .Total_Outstanding_Balance.Outstanding_Balance_Secured,
            UnsecuredAccountsAmount:
              result.INProfileResponse.CAIS_Account.CAIS_Summary
                .Total_Outstanding_Balance.Outstanding_Balance_UnSecured,
            Last7DaysCreditEnquiries:
              result.INProfileResponse.CAPS.CAPS_Summary.CAPSLast7Days,

            // Credit Cards Information
            CreditCardsInfos: detailsArray,

            // Reference to User
            userId: req.body._id,
          });
          //   console.log(req.body._id);
          res.status(200).json({
            message: "Data Sent Successfully",
            value: true,
          });
        } catch (error) {
          res.status(500).json({ message: "Error processing data", error });
        }
      });
    } catch (error) {
      res.status(403).json({
        message: "Unknown Error Occurred",
        value: false,
        error,
      });
    }
  }
);

export default router;
